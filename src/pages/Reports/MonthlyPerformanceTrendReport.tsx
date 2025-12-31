import { useMonthlyPerformanceTrend } from "../../hooks/useMonthlyPerformanceTrend";
import type { ReportsFiltersRequest } from "../../models/common/types";
import HighChartsPerformanceChart from "../investments/components/HighChartsPerformanceChart";
import { Spinner } from "flowbite-react";

export default function MonthlyPerformanceTrendReport({
  filters,
}: {
  filters: ReportsFiltersRequest;
}) {
  const { data, isLoading } = useMonthlyPerformanceTrend(filters);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-700 mb-4">
        Monthly Performance Trend
      </h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <HighChartsPerformanceChart
            data={data ?? []}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}


