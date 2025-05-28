import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Props {
  params: {
    urlId: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { urlId } = params;

    // Fetch URL analytics
    const response = await fetch(`${process.env.API_URL}/urls/${urlId}/analytics`, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to fetch analytics" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
} 