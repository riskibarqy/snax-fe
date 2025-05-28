import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dns from "dns/promises";

interface Props {
  params: {
    domainId: string;
  };
}

export async function POST(request: Request, { params }: Props) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domainId } = params;

    // Fetch domain
    const domainResponse = await fetch(`${process.env.API_URL}/domains/${domainId}`, {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    });

    if (!domainResponse.ok) {
      const error = await domainResponse.json();
      return NextResponse.json(
        { error: error.message || "Domain not found" },
        { status: domainResponse.status }
      );
    }

    const domain = await domainResponse.json();

    // Verify domain ownership by checking DNS records
    try {
      const records = await dns.resolveTxt(domain.domain);
      const verificationRecord = records.flat().find(record => 
        record.includes(`snax-verify=${domainId}`)
      );

      if (!verificationRecord) {
        return NextResponse.json({
          error: "DNS verification record not found",
          required: `snax-verify=${domainId}`,
        }, { status: 400 });
      }

      // Update domain verification status
      const verifyResponse = await fetch(`${process.env.API_URL}/domains/${domainId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        return NextResponse.json(
          { error: error.message || "Failed to verify domain" },
          { status: verifyResponse.status }
        );
      }

      return NextResponse.json({ success: true });
    } catch (dnsError) {
      console.error("DNS verification error:", dnsError);
      return NextResponse.json({
        error: "Failed to verify domain",
        details: "Could not fetch DNS records",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying domain:", error);
    return NextResponse.json(
      { error: "Failed to verify domain" },
      { status: 500 }
    );
  }
} 