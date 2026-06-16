import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getStripe from "../../../lib/stripe";
import musicCatalog from "../../../data/music_catalog.json";
import { GEAR_CATALOG } from "../../../data/gear_catalog";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const stripe = getStripe();

  try {
    const body = await req.json();
    const { items } = body; // items should be CartItem[]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    let calculatedTotal = 0;
    let hasPhysicalGoods = false;
    const itemIds: string[] = [];
    const summaryParts: string[] = [];

    // Server-side validation of price
    for (const item of items) {
      if (!item.id || !item.price || !item.quantity) {
        throw new Error(`Invalid item structure: ${JSON.stringify(item)}`);
      }

      // 1. Find product in catalogs
      let catalogItem: any = musicCatalog.tracks.find((t: any) => t.id === item.id);
      if (!catalogItem) {
        catalogItem = musicCatalog.albums.find((a: any) => a.id === item.id);
      }
      if (!catalogItem) {
        catalogItem = GEAR_CATALOG.find((g: any) => g.id === item.id);
        if (catalogItem) {
          hasPhysicalGoods = true; // It's gear
        }
      }

      if (!catalogItem) {
        console.error(`Item not found in catalog: ${item.id}`);
        // Optional: Fail or skip. Failing is safer.
        throw new Error(`Item ${item.id} not found in catalog.`);
      }

      // 2. Validate Price (Donation Logic)
      // User can pay MORE than base price, but not LESS.
      const basePrice = catalogItem.price;
      const clientPrice = Number(item.price);

      if (clientPrice < basePrice) {
        console.error(`Price mismatch for ${item.id}. Base: ${basePrice}, Client: ${clientPrice}`);
        throw new Error(`Invalid price for ${item.title}. Minimum is $${basePrice}.`);
      }

      // 3. Accumulate
      calculatedTotal += clientPrice * item.quantity;
      itemIds.push(item.id);
      
      const desc = `${item.title} (x${item.quantity})`;
      summaryParts.push(desc);
    }

    // Amount in cents
    const amountInCents = Math.round(calculatedTotal * 100);

    if (amountInCents < 50) { // Stripe minimum is usually $0.50
        throw new Error("Total amount must be at least $0.50");
    }

    // Create concise metadata summary
    // Truncate to meet Stripe limits (500 chars)
    const orderSummary = summaryParts.join(', ').substring(0, 500);
    const itemIdsStr = itemIds.join(',').substring(0, 500);

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountInCents,
      currency: "usd",
      metadata: {
        orderSummary: orderSummary,
        itemIds: itemIdsStr, 
        hasPhysicalGoods: hasPhysicalGoods ? "true" : "false"
      },
      automatic_payment_methods: { enabled: true },
    };

    // Add shipping address collection if physical goods are present
    if (hasPhysicalGoods) {
      paymentIntentParams.shipping = {
        name: 'Sentient Customer', 
        address: {
          line1: '123 Main St', 
        }
      };
    }

    const intent = await stripe.paymentIntents.create(paymentIntentParams);

    return NextResponse.json({ 
      clientSecret: intent.client_secret,
      requiresShipping: hasPhysicalGoods 
    });

  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    let errorMessage = "Internal server error";
    if (error instanceof SyntaxError) {
        errorMessage = "Invalid request body";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    } else if (error.message) {
        errorMessage = error.message; // Return our custom validation errors
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
