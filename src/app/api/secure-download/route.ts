import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getStripe from "../../lib/stripe";
import fs from "fs";
import path from "path";
import catalog from "../../data/music_catalog.json"; // Direct import



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pi = searchParams.get("pi");
  const secret = searchParams.get("secret");
  const itemId = searchParams.get("item");
  const format = searchParams.get("format"); // 'mp3', 'wav', 'mp3_zip', 'wav_zip'

  if (!pi || !secret || !itemId || !format) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const stripe = getStripe();

  try {
    // 1. Verify Payment
    const paymentIntent = await stripe.paymentIntents.retrieve(pi);

    if (paymentIntent.client_secret !== secret) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 403 });
    }

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 403 });
    }

    // 2. Verify Item Ownership
    const purchasedItemIds = (paymentIntent.metadata.itemIds || "").split(",");
    if (!purchasedItemIds.includes(itemId)) {
      return NextResponse.json({ error: "Item not purchased" }, { status: 403 });
    }

    // 3. Lookup File Path
    // Check tracks
    let item: any = catalog.tracks.find((t: any) => t.id === itemId);
    // Check albums if not found
    if (!item) {
      item = catalog.albums.find((a: any) => a.id === itemId);
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found in catalog" }, { status: 404 });
    }

    const filePathRelative = item.files?.[format];

    if (!filePathRelative) {
        return NextResponse.json({ error: `Format ${format} not available for this item` }, { status: 404 });
    }

    // 4. Serve File
    // Clean path to prevent traversal attacks
    const safePath = path.normalize(filePathRelative).replace(/^(\.\.(\/|\\|$))+/, '');
    
    // Construct absolute path (assuming private_assets is at project root)
    const absolutePath = path.join(process.cwd(), safePath);

    // Verify file exists
    if (!fs.existsSync(absolutePath)) {
       console.error(`File missing at: ${absolutePath}`);
       return NextResponse.json({ error: "File not found on server" }, { status: 500 });
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const filename = path.basename(absolutePath);

    // Determine mime type
    let contentType = "application/octet-stream";
    if (filename.toLowerCase().endsWith(".m4a")) {
      contentType = "audio/mp4";
    } else if (filename.toLowerCase().endsWith(".mp3") || format.includes("mp3")) {
      contentType = "audio/mpeg";
    } else if (filename.toLowerCase().endsWith(".wav") || format.includes("wav")) {
      contentType = "audio/wav";
    } else if (filename.toLowerCase().endsWith(".zip") || format.includes("zip")) {
      contentType = "application/zip";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
