import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

const LEADS_COLLECTION = "asb_leads";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid lead id." }, { status: 400 });
  }

  const db = await getMongoDb();
  const result = await db.collection(LEADS_COLLECTION).deleteOne({ _id: new ObjectId(id) });

  if (!result.deletedCount) {
    return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
