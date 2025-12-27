// src/components/PortfolioSummaryCard.tsx
import { Card, Spinner } from "flowbite-react";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

export default function PortfolioSummaryCard() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <div className="flex justify-center items-center h-32">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="col-span-3">
        <p className="text-gray-500">No summary available</p>
      </Card>
    );
  }

  return (
    <Card className="col-span-3 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-brand-700 mb-4">Portfolio Summary</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Current Value</p>
          <p className="text-lg font-semibold">{data.totalCurrentValue.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Gain/Loss</p>
          <p
            className={`text-lg font-semibold ${
              data.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.totalGainLoss.toLocaleString()} ({data.totalGainLossPercent}%)
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Active Investments</p>
          <p className="text-lg font-semibold">{data.activeInvestmentsCount}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Best Performer</p>
          <p className="text-lg font-semibold">
            {data.bestPerformerName ?? "N/A"}{" "}
            {data.bestPerformerGainPercent != null && (
              <span className="text-green-600">({data.bestPerformerGainPercent}%)</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Worst Performer</p>
          <p className="text-lg font-semibold">
            {data.worstPerformerName ?? "N/A"}{" "}
            {data.worstPerformerGainPercent != null && (
              <span className="text-red-600">({data.worstPerformerGainPercent}%)</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}