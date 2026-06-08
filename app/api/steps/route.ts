import { NextResponse } from "next/server";
import { setSteps } from "@/lib/flexRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await setSteps(payload));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save steps" }, { status: 400 });
  }
}
