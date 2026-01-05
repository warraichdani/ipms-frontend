// src/pages/dashboard/UserDashboard.tsx
import PortfolioSummaryCard from "../../components/PortfolioSummaryCard";
import TransactionTable from "../transactions/components/TransactionTable";
import { useAllTransactions } from "../../hooks/useAllTransactions";
import AssetAllocationChart from "../../components/AssetAllocationChart";
import { usePortfolioPerformance } from "../../hooks/usePortfolioPerformance";
import HighChartsPerformanceChart from "../investments/components/HighChartsPerformanceChart";
import { useAllocation } from "../../hooks/useAllocation";


export default function UserDashboard() {
  const { data, isLoading } = useAllTransactions({
    page: 1,
    pageSize: 10,
  });

  
  const { data: perfData, isLoading: perfLoading } = usePortfolioPerformance();
  const { data: assetData, isLoading: isAssetLoading } = useAllocation();

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-7 gap-6">
        {/* Left side: Portfolio Summary */}
        <div className="col-span-3 h-[300px]">
          <PortfolioSummaryCard />
        </div>

        {/* Right side: Recent Transactions */}
        <div className="col-span-4 h-[285px]">
          <TransactionTable
            transactions={data?.items ?? []}
            isLoading={isLoading}
            page={1}
            pageSize={10}
            totalCount={data?.totalCount ?? 0}
            onPageChange={() => {}}
            hidePaging={true}
            title="Recent Transactions"
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-6">
         <div className="col-span-3 h-[300px]"><AssetAllocationChart assetData={assetData} isAssetLoading={isAssetLoading} /></div>
        <div className="col-span-4 h-[300px]">
            <HighChartsPerformanceChart data={perfData ?? []} isLoading={perfLoading} />
        </div>
      </div>
    </div>
  );
}