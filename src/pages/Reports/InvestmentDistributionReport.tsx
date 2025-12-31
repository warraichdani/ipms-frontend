
import { Spinner } from "flowbite-react";
import type { ReportsFiltersRequest } from "../../models/common/types";
import { useInvestmentDistribution } from "../../hooks/useInvestmentDistribution";
import AssetAllocationChart from "../../components/AssetAllocationChart";

export default function InvestmentDistributionReport({
  filters,
}: {
  filters: ReportsFiltersRequest;
}) {
  const { data, isLoading } = useInvestmentDistribution(filters);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-700 mb-4">
        Investment Distribution
      </h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <AssetAllocationChart assetData={data} isAssetLoading={isLoading} />
        )}
      </div>
    </div>
  );
}