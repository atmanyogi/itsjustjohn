import { NextRequest, NextResponse } from "next/server";
import getStripe from "../../../lib/stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const stripe = getStripe();

  try {
    const body = await req.json();
    const { pi, secret, email } = body;

    if (!pi || !secret || !email) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Validate & Sanitize Email against Script Injection
    const emailStr = String(email).trim().toLowerCase();
    
    // Strict pattern matching to exclude HTML tags, scripts, and odd characters
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(emailStr) || emailStr.length > 254 || emailStr.includes("<") || emailStr.includes(">")) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Retrieve Payment Intent to verify authenticity with client_secret
    const paymentIntent = await stripe.paymentIntents.retrieve(pi);

    if (paymentIntent.client_secret !== secret) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 403 });
    }

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Update receipt_email to trigger Stripe automatic emailing
    await stripe.paymentIntents.update(pi, {
      receipt_email: emailStr,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error submitting receipt email to Stripe:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
