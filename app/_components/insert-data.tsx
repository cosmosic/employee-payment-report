"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "../lib/store";

export interface Employee extends Record<string, unknown> {
  id: number;
  name: string;
  location: string;
  collections: { amount: number; date: string }[];
  deposits: { amount: number; date: string }[];
}


export function InsertEmployeeDataModal() {
  const [open, setOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [location, setLocation] = useState("");
  const [collectionAmount, setCollectionAmount] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDate, setDepositDate] = useState("");
  const { fetchEmployees } = useEmployeeStore();

  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data: Employee[]) => {
        if (Array.isArray(data)) {
          setEmployees(
            data.map((emp) => ({
              id: emp.id,
              name: emp.name,
              location: emp.location,
              collections: emp.collections ?? [],
              deposits: emp.deposits ?? [],
            }))
          );
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, []);
  
  

  const handleSubmit = async () => {
    if (
      !employeeName.trim() ||
      !location.trim() ||
      !collectionAmount ||
      !collectionDate ||
      !depositAmount ||
      !depositDate
    ) {
      return alert("Please fill all fields");
    }

    // 1. Check if employee exists
    let employee = employees.find(
      (e) => e.name.toLowerCase() === employeeName.toLowerCase()
    );

    // 2. If not, create new employee
    if (!employee) {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: employeeName, location }),
      });
      employee = await res.json();
    }

    // 3. Insert MM + Deposit entries
    if (!employee) {
      alert("Employee creation failed.");
      return;
    }
    
    // Now it's safe to use employee.id
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: employee.id,
        collection: { amount: Number(collectionAmount), date: collectionDate },
        deposit: { amount: Number(depositAmount), date: depositDate },
      }),
    });
    

    // 4. Refresh data and reset
    await fetchEmployees();
    setOpen(false);
    setEmployeeName("");
    setLocation("");
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
        <DialogTitle>Insert Employee Data</DialogTitle>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Employee Name</Label>
            <Input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="e.g. Ravi"
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Jaipur"
            />
          </div>

          <div className="space-y-2">
            <Label>MM Collection Amount</Label>
            <Input
              type="number"
              value={collectionAmount}
              onChange={(e) => setCollectionAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <Input
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Deposit Amount</Label>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <Input
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSubmit} className="w-full">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
