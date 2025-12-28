// src/components/SystemStatisticsCard.tsx
import { Card, Spinner } from "flowbite-react";
import { useSystemStatistics } from "../hooks/useSystemStatistics";

export default function SystemStatisticsCard() {
  const { data, isLoading } = useSystemStatistics();

  if (isLoading) {
    return (
      <Card className="h-[250px] flex items-center justify-center">
        <Spinner size="lg" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="h-[250px] flex items-center justify-center">
        <p className="text-gray-500">No statistics available</p>
      </Card>
    );
  }

  return (
    <Card className="h-[250px] rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-brand-700 mb-4">System Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-lg font-semibold">{data.totalUsers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Portfolios</p>
          <p className="text-lg font-semibold">{data.totalPortfolios}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Investments Value</p>
          <p className="text-lg font-semibold">
            {data.totalInvestmentsCurrentValue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Today's Transactions</p>
          <p className="text-lg font-semibold">{data.todaysTransactionsCount}</p>
        </div>
      </div>
    </Card>
  );
}