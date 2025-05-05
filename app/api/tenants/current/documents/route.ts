import { NextRequest, NextResponse } from "next/server";

import { getRagieClientAndPartition } from "@/lib/server/ragie";
import { requireAdminContextFromRequest } from "@/lib/server/utils";

export async function GET(request: NextRequest) {
  const { tenant } = await requireAdminContextFromRequest(request);
  const { client, partition } = await getRagieClientAndPartition(tenant.id);
  try {
    const res = await client.documents.list({
      partition: partition || "",
    });

    return NextResponse.json({ documents: res.result.documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
