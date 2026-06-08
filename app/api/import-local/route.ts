import { NextResponse } from "next/server";
import { importLocalData } from "@/lib/flexRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await importLocalData(payload));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to import local data" }, { status: 400 });
  }
}
