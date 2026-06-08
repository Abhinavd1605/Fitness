import { NextResponse } from "next/server";
import { toggleWorkoutCompletion } from "@/lib/flexRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await toggleWorkoutCompletion(payload));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to toggle workout" }, { status: 400 });
  }
}
