// src/app/api/revalidate/route.ts
// ISR hook (if needed) - On-demand revalidation
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // Example: Revalidate based on a tag or path from the request body
  // For security, you'd want to protect this endpoint, e.g., with a secret token.
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_TOKEN) { // Ensure REVALIDATION_TOKEN is in your .env
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const body = await request.json();
  const { tag, path } = body;

  if (tag) {
    revalidateTag(tag, 'default');
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  return NextResponse.json({
    revalidated: false,
    message: 'Missing tag or path to revalidate',
    now: Date.now(),
  }, { status: 400 });
}
