import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const employees = await prisma.employee.findMany({
        include: {
          collections: true,
          deposits: true,
        },
      });
  
      console.log("Employees fetched:", employees); 
      return NextResponse.json(employees);
    } catch (err) {
      console.error(" Error fetching employees:", err); 
      return NextResponse.json(
        { error: "Failed to fetch employees" },
        { status: 500 }
      );
    }
  }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location } = body;

    if (!name || !location) {
      return NextResponse.json({ error: "Missing name or location" }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: { name, location },
    });

    return NextResponse.json(employee);
  } catch (err) {
    console.error("POST /api/employees failed:", err);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
