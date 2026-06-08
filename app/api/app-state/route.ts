import { NextResponse } from "next/server";
import { getAppState } from "@/lib/flexRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getAppState());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load app state" }, { status: 500 });
  }
}
