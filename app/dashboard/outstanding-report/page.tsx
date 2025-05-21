"use client";

import { useEmployeeStore } from "@/app/lib/store";
import { useEffect, useState } from "react";
import DataGridShadcn, { SimpleColumnDef } from "@/app/_components/table";
import { SummaryCard } from "@/app/_components/summary_card";
import { InsertEmployeeDataModal } from "@/app/_components/insert-data";
import { Loader2 } from "lucide-react";

interface RowData extends Record<string, unknown> {
  id: number;
  name: string;
  location: string;
  collections: { amount: number; date: string }[];
  deposits: { amount: number; date: string }[];
}

export default function OutstandingReportPage() {
  const { employees, fetchEmployees } = useEmployeeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchEmployees();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchEmployees]);

  const columns: SimpleColumnDef<RowData>[] = [
    { header: "Employee Name", accessorKey: "name" },
    { header: "Location", accessorKey: "location" },
    {
      header: "Net Collection",
      cell: (_, row) =>
        Array.isArray(row.collections)
          ? `₹${row.collections.reduce((sum, c) => sum + (c?.amount || 0), 0).toLocaleString()}`
          : "-",
    },
    {
      header: "Deposited Till Date",
      cell: (_, row) =>
        Array.isArray(row.deposits)
          ? `₹${row.deposits.reduce((sum, d) => sum + (d?.amount || 0), 0).toLocaleString()}`
          : "-",
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
        const totalCol = row.collections.reduce((sum, c) => sum + (c?.amount || 0), 0);
        const totalDep = row.deposits.reduce((sum, d) => sum + (d?.amount || 0), 0);
        const diff = totalCol - totalDep;
        return `₹${Math.abs(diff).toLocaleString()} ${diff >= 0 ? "" : "(over)"}`;
      },
    },
  ];

  const totalCollection = Array.isArray(employees)
    ? employees.reduce(
        (sum, e) =>
          sum + (Array.isArray(e.collections) ? e.collections.reduce((s, c) => s + (c?.amount || 0), 0) : 0),
        0
      )
    : 0;

  const totalDeposit = Array.isArray(employees)
    ? employees.reduce(
        (sum, e) =>
          sum + (Array.isArray(e.deposits) ? e.deposits.reduce((s, d) => s + (d?.amount || 0), 0) : 0),
        0
      )
    : 0;

  const safeData: RowData[] = Array.isArray(employees)
    ? employees.map((e) => ({
        id: e.id,
        name: e.name,
        location: e.location,
        collections: Array.isArray(e.collections) ? e.collections : [],
        deposits: Array.isArray(e.deposits) ? e.deposits : [],
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard 
          title="Total Collection (MM)" 
          value={`₹${totalCollection.toLocaleString()}`} 
          color="primary" 
        />
        <SummaryCard 
          title="Total Deposit Amount" 
          value={`₹${totalDeposit.toLocaleString()}`} 
          color="success" 
        />
        <SummaryCard 
          title="Difference Amount" 
          value={`₹${(totalCollection - totalDeposit).toLocaleString()}`} 
          color={totalCollection - totalDeposit >= 0 ? "danger" : "success"} 
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Outstanding Report Dashboard</h2>
        <InsertEmployeeDataModal />
      </div>

      <DataGridShadcn<RowData> data={safeData} columns={columns} />
    </div>
  );
}