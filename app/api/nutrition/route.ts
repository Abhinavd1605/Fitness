import { NextResponse } from "next/server";
import { addNutritionLog, deleteNutritionLog } from "@/lib/flexRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await addNutritionLog(payload));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save protein log" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json(await deleteNutritionLog(payload));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete protein log" }, { status: 400 });
  }
}
