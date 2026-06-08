import { NextResponse } from "next/server";
import { setVisceralFatLevel } from "@/lib/flexRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await setVisceralFatLevel(payload));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save visceral fat level" }, { status: 400 });
  }
}
