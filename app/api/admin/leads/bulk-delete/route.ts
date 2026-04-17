import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

const LEADS_COLLECTION = "asb_leads";

export async function DELETE(req: NextRequest) {
  let ids: string[] = [];
  try {
    const body = await req.json();
    ids = Array.isArray(body.ids) ? body.ids : [];
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const validIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  if (!validIds.length) {
    return NextResponse.json({ success: false, message: "No valid IDs provided." }, { status: 400 });
  }

  const db = await getMongoDb();
  const result = await db.collection(LEADS_COLLECTION).deleteMany({ _id: { $in: validIds } });

  return NextResponse.json({ success: true, deleted: result.deletedCount });
}
