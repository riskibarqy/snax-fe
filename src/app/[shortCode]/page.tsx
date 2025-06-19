// app/[shortCode]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  try {
    const response = await fetch(`${process.env.API_URL}/urls/${shortCode}`, { cache: 'no-store' });

    if (!response.ok) {
      return new NextResponse('URL not found', { status: 404 });
    }

    const data = await response.json();

    if (typeof data.url !== 'string') {
      return new NextResponse('Invalid URL format', { status: 500 });
    }

    return NextResponse.redirect(data.url);
  } catch {
    return new NextResponse('Error processing redirect', { status: 500 });
  }
}
