"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useEmployeeStore } from "../lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Employee extends Record<string, unknown> {
  id: number;
  name: string;
  location: string;
  collections: { amount: number; date: string }[];
  deposits: { amount: number; date: string }[];
}

export function InsertEmployeeDataModal() {
  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [collectionAmount, setCollectionAmount] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDate, setDepositDate] = useState("");
  const { employees, fetchEmployees } = useEmployeeStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmployeeId) {
      return alert("Please select an employee");
    }

    if ((!collectionAmount || !collectionDate) && (!depositAmount || !depositDate)) {
      return alert("Please enter at least collection or deposit information");
    }

    try {
      setLoading(true);

      if (collectionAmount && collectionDate) {
        await fetch("/api/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: selectedEmployeeId,
            amount: Number(collectionAmount),
            date: collectionDate,
          }),
        });
      }

      if (depositAmount && depositDate) {
        await fetch("/api/deposits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: selectedEmployeeId,
            amount: Number(depositAmount),
            date: depositDate,
          }),
        });
      }

      // Refresh data and reset form
      await fetchEmployees();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedEmployeeId("");
    setCollectionAmount("");
    setCollectionDate("");
    setDepositAmount("");
    setDepositDate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Insert Employee Data</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Employee Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Employee</Label>
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name} ({employee.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>MM Collection</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={collectionAmount}
                onChange={(e) => setCollectionAmount(e.target.value)}
                placeholder="Amount"
              />
              <Input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deposit</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount"
              />
              <Input
                type="date"
                value={depositDate}
                onChange={(e) => setDepositDate(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}