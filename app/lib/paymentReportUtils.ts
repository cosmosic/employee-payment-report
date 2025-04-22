import { Employee } from "./store";

export interface PaymentRow {
  id: number;
  name: string;
  collectionAmount: number;
  collectionDate: string;
  depositAmount: number;
  depositDate: string;
  difference: number;
}

export function generatePaymentRows(employee: Employee): PaymentRow[] {
  const collections = [...employee.collections].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const deposits = [...employee.deposits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const rows: PaymentRow[] = [];
  const remainingCollections = collections.map(c => ({ ...c }));

  let collectionIndex = 0;

  for (const deposit of deposits) {
    let remainingDeposit = deposit.amount;

    while (remainingDeposit > 0 && collectionIndex < remainingCollections.length) {
      const coll = remainingCollections[collectionIndex];

      const applyAmount = Math.min(remainingDeposit, coll.amount);
      remainingDeposit -= applyAmount;
      coll.amount -= applyAmount;

      rows.push({
        id: employee.id,
        name: employee.name,
        collectionAmount: applyAmount,
        collectionDate: coll.date,
        depositAmount: applyAmount,
        depositDate: deposit.date,
        difference: 0,
      });

      if (coll.amount === 0) collectionIndex++;
    }

    // If deposit left over and no collection to map it to
    if (remainingDeposit > 0) {
      rows.push({
        id: employee.id,
        name: employee.name,
        collectionAmount: 0,
        collectionDate: "-",
        depositAmount: remainingDeposit,
        depositDate: deposit.date,
        difference: -remainingDeposit,
      });
    }
  }

  // Add leftover unpaid collections (no matching deposit)
  for (; collectionIndex < remainingCollections.length; collectionIndex++) {
    const coll = remainingCollections[collectionIndex];
    if (coll.amount > 0) {
      rows.push({
        id: employee.id,
        name: employee.name,
        collectionAmount: coll.amount,
        collectionDate: coll.date,
        depositAmount: 0,
        depositDate: "-",
        difference: coll.amount,
      });
    }
  }

  return rows;
}
