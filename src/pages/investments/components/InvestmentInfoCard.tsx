// src/pages/investments/components/InvestmentInfoCard.tsx
import { Button } from "flowbite-react";
import type { InvestmentDetailDto } from "../../../models/investment";

type Props = {
  investment: InvestmentDetailDto;
  onAddTransaction: () => void;
};

export default function InvestmentInfoCard({ investment, onAddTransaction }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-700">{investment.investmentName}</h2>
          <span
            className={
              "px-3 py-1 rounded text-sm " +
              (investment.status === "Active"
                ? "bg-green-100 text-green-700"
                : investment.status === "Sold"
                ? "bg-gray-100 text-gray-700"
                : "bg-yellow-100 text-yellow-700")
            }
          >
            {investment.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="rounded border p-3">
            <div className="text-xs text-gray-500">Type</div>
            <div className="font-semibold">{investment.investmentType}</div>
          </div>

          <div className="rounded border p-3">
            <div className="text-xs text-gray-500">Current value</div>
            <div className="font-semibold text-blue-700">{investment.currentValue}</div>
          </div>

          <div className="rounded border p-3">
            <div className="text-xs text-gray-500">Gain/Loss %</div>
            <div
              className={
                "font-semibold " +
                (investment.gainLossPercent >= 0 ? "text-green-700" : "text-red-700")
              }
            >
              {investment.gainLossPercent}%
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={onAddTransaction}
          >
            + Add transaction
          </Button>
        </div>
      </div>
    </div>
  );
}