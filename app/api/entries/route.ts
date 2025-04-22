import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, collection, deposit } = body;

    if (!employeeId) {
      return NextResponse.json({ error: "Missing employeeId" }, { status: 400 });
    }

    const operations = [];

    if (collection?.amount && collection?.date) {
      operations.push(
        prisma.collection.create({
          data: {
            amount: Number(collection.amount),
            date: collection.date,
            employeeId,
          },
        })
      );
    }

    if (deposit?.amount && deposit?.date) {
      operations.push(
        prisma.deposit.create({
          data: {
            amount: Number(deposit.amount),
            date: deposit.date,
            employeeId,
          },
        })
      );
    }

    if (operations.length === 0) {
      return NextResponse.json(
        { error: "No valid collection or deposit data provided" },
        { status: 400 }
      );
    }

    await Promise.all(operations);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/entries failed:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
