import { NextRequest, NextResponse } from "next/server";
import { submitPmaxLeadQuestionnaire } from "@/lib/asb-lead-flow";

export async function POST(req: NextRequest) {
  try {
    const {
      leadDocId,
      completedClass12,
      class12Score,
      englishComfort,
      higherEducationPlanning,
    } = await req.json();

    if (!leadDocId || !completedClass12 || !class12Score || !englishComfort || !higherEducationPlanning) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await submitPmaxLeadQuestionnaire(leadDocId, {
      completedClass12,
      class12Score,
      englishComfort,
      higherEducationPlanning,
    });

    return NextResponse.json({ success: true, message: "Questionnaire submitted successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit questionnaire";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
