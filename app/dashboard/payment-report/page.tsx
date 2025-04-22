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

  const processEmployeeData = () => {
    const rows: RowData[] = [];

    employees.forEach((emp) => {
      // Sort collections and deposits by date
      const collections = [...emp.collections].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const deposits = [...emp.deposits].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let depositIndex = 0;
      let remainingFromPrevious = 0;

      collections.forEach((col) => {
        let remaining = col.amount + remainingFromPrevious;
        remainingFromPrevious = 0;

        // Create initial row for the collection
        const initialRow: RowData = {
          location: emp.location,
          empId: emp.id,
          name: emp.name,
          collectionAmount: col.amount,
          collectionDate: col.date,
          depositAmount: "",
          depositDate: "",
          difference: col.amount,
        };

        rows.push(initialRow);

        // Apply deposits to this collection
        while (remaining > 0 && depositIndex < deposits.length) {
          const dep = deposits[depositIndex];
          const appliedAmount = Math.min(dep.amount, remaining);

          const depositRow: RowData = {
            location: emp.location,
            empId: emp.id,
            name: emp.name,
            collectionAmount: "",
            collectionDate: "",
            depositAmount: appliedAmount,
            depositDate: dep.date,
            difference: remaining - appliedAmount,
          };

          rows.push(depositRow);

          remaining -= appliedAmount;
          dep.amount -= appliedAmount;

          if (dep.amount === 0) {
            depositIndex++;
          }
        }

        if (remaining > 0) {
          remainingFromPrevious = remaining;
        }
      });

      // Handle any remaining deposits that weren't applied to any collection
      while (depositIndex < deposits.length) {
        const dep = deposits[depositIndex];
        const depositRow: RowData = {
          location: emp.location,
          empId: emp.id,
          name: emp.name,
          collectionAmount: "",
          collectionDate: "",
          depositAmount: dep.amount,
          depositDate: dep.date,
          difference: -dep.amount,
        };

        rows.push(depositRow);
        depositIndex++;
      }
    });

    return rows;
  };

  const rows = processEmployeeData();

  // Calculate summary values
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
    { 
      header: "Collections (MM)", 
      accessorKey: "collectionAmount",
      cell: (value) => value === "" ? "" : `₹${Number(value).toLocaleString()}`
    },
    { header: "Date", accessorKey: "collectionDate" },
    { 
      header: "Cash Deposit", 
      accessorKey: "depositAmount",
      cell: (value) => value === "" ? "" : `₹${Number(value).toLocaleString()}`
    },
    { header: "Deposit Date", accessorKey: "depositDate" },
    { 
      header: "Difference", 
      accessorKey: "difference",
      cell: (value) => {
        const numValue = Number(value);
        if (isNaN(numValue)) return "";
        return `₹${Math.abs(numValue).toLocaleString()} ${numValue >= 0 ? "" : "(over)"}`;
      }
    },
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