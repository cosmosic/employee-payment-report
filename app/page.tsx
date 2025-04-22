"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold text-center">Employee Report Dashboards</h1>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/dashboard/outstanding-report")}>
          Outstanding Report
        </Button>
        <Button onClick={() => router.push("/dashboard/payment-report")}>
          Payment Report
        </Button>
      </div>
    </div>
  );
}
