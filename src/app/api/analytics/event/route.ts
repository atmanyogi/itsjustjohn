import { NextRequest, NextResponse } from "next/server";
import { supabase, fallbackDB, isDatabaseConfigured } from "@/app/lib/db";
import Stripe from "stripe";

// Lazily initialize Stripe client to support mock environments and server build phases
let stripe: Stripe | null = null;
function getStripeClient() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_mock_stripe_key_placeholder", {
      apiVersion: "2025-01-27" as any,
    });
  }
  return stripe;
}

const ALLOWED_EVENTS = [
  "page_view",
  "music_track_started",
  "music_completed",
  "cart_item_added",
  "cart_item_removed",
  "checkout_started",
  "purchase_completed",
];

export async function POST(req: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    // [P1 FIX] Return 503 Service Unavailable if production db client is missing in runtime
    if (isProduction && !isDatabaseConfigured) {
      return NextResponse.json(
        { error: "Service Temporarily Unavailable: Target database is unconfigured" },
        { status: 503 }
      );
    }

    const bodyStr = await req.text();
    if (bodyStr.length > 10 * 1024) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const payload = JSON.parse(bodyStr);
    const { eventName, sessionId, pagePath, referrer, productId, trackId, orderId, properties } = payload;
    
    let valueCents: number | null = null;
    let currency: string | null = null;

    // Validate Event Name
    if (!eventName || !ALLOWED_EVENTS.includes(eventName)) {
      return NextResponse.json({ error: "Invalid or unsupported event name" }, { status: 400 });
    }

    // Validate Session ID
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session identity required" }, { status: 400 });
    }

    const sanitizedPath = (pagePath || "").substring(0, 2048);
    const sanitizedReferrer = (referrer || "").substring(0, 2048);
    const sanitizedProd = productId ? String(productId).substring(0, 255) : undefined;
    const sanitizedTrack = trackId ? String(trackId).substring(0, 255) : undefined;
    const sanitizedOrder = orderId ? String(orderId).substring(0, 255) : undefined;

    // STRIPE PURCHASE VERIFICATION & SERVER-SIDE VALUE/CURRENCY EXTRACTION (Zero Client Trust)
    if (eventName === "purchase_completed") {
      if (!sanitizedOrder) {
        return NextResponse.json({ error: "Purchase event requires a transaction order ID" }, { status: 400 });
      }

      try {
        const client = getStripeClient();
        const paymentIntent = await client.paymentIntents.retrieve(sanitizedOrder);
        if (paymentIntent.status !== "succeeded") {
          return NextResponse.json({ error: "Payment verification checks did not pass" }, { status: 400 });
        }
        
        valueCents = paymentIntent.amount;
        currency = paymentIntent.currency;
      } catch (stripeError: any) {
        console.error("Stripe verify error in backend:", stripeError.message);
        return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
      }

      // Check unique constraint to prevent duplicates inside database (Idempotence)
      if (supabase) {
        const { data: existingOrder, error: checkError } = await supabase
          .from("analytics_events")
          .select("id")
          .eq("event_name", "purchase_completed")
          .eq("order_id", sanitizedOrder)
          .maybeSingle();

        if (checkError) {
          console.error("Database querying failure during check:", checkError.message);
        }

        if (existingOrder) {
          return NextResponse.json({ message: "Duplicate transaction skipped", success: true });
        }
      }
    }

    // Construct persistent DB row
    const eventRow = {
      event_name: eventName,
      occurred_at: new Date().toISOString(),
      session_id: sessionId,
      page_path: sanitizedPath,
      referrer: sanitizedReferrer,
      product_id: sanitizedProd,
      track_id: sanitizedTrack,
      order_id: sanitizedOrder,
      value_cents: valueCents,
      properties: {
        ...(properties && typeof properties === "object" ? properties : {}),
        ...(currency ? { stripe_currency: currency } : {}),
        attribution_status: eventName === "purchase_completed" ? "provisional" : "direct",
      },
    };

    if (supabase) {
      const { error: dbError } = await supabase.from("analytics_events").insert(eventRow);
      if (dbError) {
        console.error("Supabase Database Query Failure Details:", dbError.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    } else {
      fallbackDB.insertEvent({
        id: Math.random().toString(36).substring(2),
        eventName: eventRow.event_name,
        occurredAt: eventRow.occurred_at,
        sessionId: eventRow.session_id,
        pagePath: eventRow.page_path,
        referrer: eventRow.referrer,
        productId: eventRow.product_id,
        trackId: eventRow.track_id,
        orderId: eventRow.order_id,
        valueCents: eventRow.value_cents || undefined,
        properties: eventRow.properties,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payload route error exception caught:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const stripeInstanceTrackerPlaceholder = getStripeClient; // Exported reference helper
