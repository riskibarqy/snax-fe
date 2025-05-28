import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import * as z from "zod";

const shortenSchema = z.object({
  url: z.string().url(),
  customCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url: originalUrl, customCode } = shortenSchema.parse(body);

    // Generate a short code or use custom code
    const shortCode = customCode || nanoid(8);

    // Check if custom code is already taken
    if (customCode) {
      const checkResponse = await fetch(`${process.env.API_URL}/urls/${shortCode}`);
      if (checkResponse.ok) {
        return NextResponse.json(
          { error: "Custom code already taken" },
          { status: 400 }
        );
      }
    }

    // Create new URL
    const createResponse = await fetch(`${process.env.API_URL}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
      },
      body: JSON.stringify({
        url: originalUrl,
        customCode: shortCode,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      return NextResponse.json(
        { error: error.message || "Failed to create URL" },
        { status: createResponse.status }
      );
    }

    const data = await createResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error shortening URL:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
} 