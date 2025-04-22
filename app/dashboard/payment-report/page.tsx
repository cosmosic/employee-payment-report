"use client";

import { useEffect } from "react";
import { useEmployeeStore } from "@/app/lib/store";
import DataGridShadcn, { SimpleColumnDef } from "@/app/_components/table";
import { SummaryCard } from "@/app/_components/summary_card";

interface RowData extends Record<string, unknown> {
  location: string;
  empId: number;
  name: string;
  collectionAmount: number | string;
  collectionDate: string;
  depositAmount: number | string;
  depositDate: string;
  difference: number | string;
}


export default function PaymentReportPage() {
  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const rows: RowData[] = [];

  employees.forEach((emp) => {
    const collections = [...emp.collections].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const deposits = [...emp.deposits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let depositIndex = 0;

    for (let i = 0; i < collections.length; i++) {
      const col = collections[i];
      let remaining = col.amount;
      const depositRows: RowData[] = [];

      while (remaining > 0 && depositIndex < deposits.length) {
        const dep = deposits[depositIndex];
        const usedAmount = Math.min(dep.amount, remaining);

        depositRows.push({
          location: emp.location,
          empId: emp.id,
          name: emp.name,
          collectionAmount: depositRows.length === 0 ? col.amount : "",
          collectionDate: depositRows.length === 0 ? col.date : "",
          depositAmount: usedAmount,
          depositDate: dep.date,
          difference: "", // placeholder
        });

        remaining -= usedAmount;
        dep.amount -= usedAmount;

        if (dep.amount === 0) {
          depositIndex++;
        }
      }

      if (depositRows.length > 0) {
        depositRows[depositRows.length - 1].difference = remaining > 0 ? remaining : 0;
        rows.push(...depositRows);
      } else {
        rows.push({
          location: emp.location,
          empId: emp.id,
          name: emp.name,
          collectionAmount: col.amount,
          collectionDate: col.date,
          depositAmount: 0,
          depositDate: "-",
          difference: col.amount,
        });
      }
    }
  });

  const totalCollection = employees.reduce(
    (sum, emp) => sum + emp.collections.reduce((s, c) => s + c.amount, 0),
    0
  );
  const totalDeposit = employees.reduce(
    (sum, emp) => sum + emp.deposits.reduce((s, d) => s + d.amount, 0),
    0
  );
  const overallDiff = totalCollection - totalDeposit;

  const columns: SimpleColumnDef<RowData>[] = [
    { header: "Location", accessorKey: "location" },
    { header: "Employee ID", accessorKey: "empId" },
    { header: "Employee Name", accessorKey: "name" },
    { header: "Collection Amount", accessorKey: "collectionAmount" },
    { header: "Collection Date", accessorKey: "collectionDate" },
    { header: "Deposit Amount", accessorKey: "depositAmount" },
    { header: "Deposit Date", accessorKey: "depositDate" },
    { header: "Difference", accessorKey: "difference" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Collection (MM)" value={`₹${totalCollection.toLocaleString()}`} color="primary" />
        <SummaryCard title="Total Deposit Amount" value={`₹${totalDeposit.toLocaleString()}`} color="success" />
        <SummaryCard title="Difference Amount" value={`₹${overallDiff.toLocaleString()}`} color="danger" />
      </div>

      <h2 className="text-xl font-semibold mb-4">Employee Payment Report</h2>
      <DataGridShadcn data={rows} columns={columns} />
    </div>
  );
}
