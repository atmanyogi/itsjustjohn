import { NextRequest, NextResponse } from 'next/server';

let modalOpen = false;

export async function POST(request: NextRequest) {
  try {
    await request.json(); // consume body, even if unused
    // You can process the webhook payload here if needed
    // For now, just set modalOpen to true to trigger modal open

    modalOpen = true;

    return NextResponse.json({ success: true, message: 'Modal open triggered' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message: 'Error processing webhook', error: message }, { status: 500 });
  }
}

export async function GET() {
  // Return current modal open state
  return NextResponse.json({ modalOpen });
}
