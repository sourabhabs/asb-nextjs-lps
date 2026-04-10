import { NextRequest, NextResponse } from "next/server";
import {
  fetchAdminLeads,
  LeadAdminDoc,
  normalizeAdminFilters,
  toLeadCsvRows,
} from "@/lib/asb-admin-leads";

export async function GET(req: NextRequest) {
  const filters = normalizeAdminFilters(
    Object.fromEntries(req.nextUrl.searchParams.entries())
  );
  const leads = await fetchAdminLeads(filters, 5000);
  const csv = toLeadCsvRows(leads as LeadAdminDoc[]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asb-leads-${Date.now()}.csv"`,
    },
  });
}
