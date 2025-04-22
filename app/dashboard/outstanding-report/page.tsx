"use client";

import { useEmployeeStore } from "@/app/lib/store";
import { useEffect } from "react";
import DataGridShadcn, { SimpleColumnDef } from "@/app/_components/table";
import { SummaryCard } from "@/app/_components/summary_card";
import { InsertEmployeeDataModal } from "@/app/_components/insert-data";

// Define compatible row type
interface RowData extends Record<string, unknown> {
  id: number;
  name: string;
  location: string;
  collections: { amount: number; date: string }[];
  deposits: { amount: number; date: string }[];
}

export default function OutstandingReportPage() {
  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const columns: SimpleColumnDef<RowData>[] = [
    { header: "Employee Name", accessorKey: "name" },
    { header: "Location", accessorKey: "location" },
    {
      header: "Net Collection",
      cell: (_, row) => row.collections.reduce((sum, c) => sum + c.amount, 0),
    },
    {
      header: "Deposited Till Date",
      cell: (_, row) => row.deposits.reduce((sum, d) => sum + d.amount, 0),
    },
    {
      header: "Last Transaction",
      cell: (_, row) => {
        const lastDeposit = row.deposits.at(-1)?.date;
        const lastCollection = row.collections.at(-1)?.date;
        return lastDeposit || lastCollection || "-";
      },
    },
    {
      header: "Difference",
      cell: (_, row) => {
        const totalCol = row.collections.reduce((sum, c) => sum + c.amount, 0);
        const totalDep = row.deposits.reduce((sum, d) => sum + d.amount, 0);
        return totalCol - totalDep;
      },
    },
  ];

  const totalCollection = employees.reduce(
    (sum, e) => sum + e.collections.reduce((s, c) => s + c.amount, 0),
    0
  );
  const totalDeposit = employees.reduce(
    (sum, e) => sum + e.deposits.reduce((s, d) => s + d.amount, 0),
    0
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Collection (MM)" value={`₹${totalCollection}`} color="primary" />
        <SummaryCard title="Total Deposit Amount" value={`₹${totalDeposit}`} color="success" />
        <SummaryCard title="Difference Amount" value={`₹${totalCollection - totalDeposit}`} color="danger" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Outstanding Report Dashboard</h2>
        <InsertEmployeeDataModal />
      </div>

      <DataGridShadcn<RowData> data={employees as RowData[]} columns={columns} />

    </div>
  );
}
