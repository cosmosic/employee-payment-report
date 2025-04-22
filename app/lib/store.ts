import { create } from "zustand";

export interface Collection {
  amount: number;
  date: string;
}

export interface Deposit {
  amount: number;
  date: string;
}

export interface Employee {
  id: number;
  name: string;
  location: string;
  collections: Collection[];
  deposits: Deposit[];
}

interface EmployeeStore {
  employees: Employee[];
  fetchEmployees: () => Promise<void>;
  initializeEmployees: (initial: Employee[]) => void;
  addCollection: (id: number, amount: number, date: string) => void;
  addDeposit: (id: number, amount: number, date: string) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],

  fetchEmployees: async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    set({ employees: data });
  },

  initializeEmployees: (initial) => set({ employees: initial }),

  addCollection: (id, amount, date) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              collections: [...emp.collections, { amount, date }],
            }
          : emp
      ),
    })),

  addDeposit: (id, amount, date) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              deposits: [...emp.deposits, { amount, date }],
            }
          : emp
      ),
    })),
}));
