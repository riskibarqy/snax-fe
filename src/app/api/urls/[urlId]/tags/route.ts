import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as z from "zod";

interface Props {
  params: {
    urlId: string;
  };
}

const addTagSchema = z.object({
  tag: z.string().min(1).max(50),
});

export async function GET(request: Request, { params }: Props) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { urlId } = params;

    // Fetch URL tags
    const response = await fetch(`${process.env.API_URL}/urls/${urlId}/tags`, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to fetch tags" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: Props) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { urlId } = params;
    const body = await request.json();
    const { tag: tagName } = addTagSchema.parse(body);

    // Add tag to URL
    const response = await fetch(`${process.env.API_URL}/urls/${urlId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
      },
      body: JSON.stringify({ tag: tagName }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to add tag" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding tag:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to add tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { urlId } = params;
    const url = new URL(request.url);
    const tagName = url.searchParams.get("tag");

    if (!tagName) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Remove tag from URL
    const response = await fetch(`${process.env.API_URL}/urls/${urlId}/tags/${tagName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to remove tag" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing tag:", error);
    return NextResponse.json(
      { error: "Failed to remove tag" },
      { status: 500 }
    );
  }
} 