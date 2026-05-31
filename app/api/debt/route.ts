import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Debt from "@/lib/models/Debts";

export async function GET() {
  await connectDB();
  const debts = await Debt.find({});
  return NextResponse.json(debts);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const newDebt = await Debt.create(body);
  return NextResponse.json(newDebt, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Debt.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}

export async function PATCH(req: Request) {
  await connectDB();
  const { id, status } = await req.json();
  const updated = await Debt.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return NextResponse.json(updated);
}
export async function PUT(req: Request) {
  await connectDB();
  const { id, title, description, priority, status } = await req.json();
  const updated = await Debt.findByIdAndUpdate(
    id,
    { title, description, priority, status },
    { new: true }
  );
  return NextResponse.json(updated);
}