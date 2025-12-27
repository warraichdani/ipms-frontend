// src/pages/dashboard/UserDashboard.tsx
import PortfolioSummaryCard from "../../components/PortfolioSummaryCard";
import TransactionTable from "../transactions/components/TransactionTable";
import { useAllTransactions } from "../../hooks/useAllTransactions";
import PerformanceChart from "../investments/components/PerformanceChart";
import AssetAllocationChart from "../../components/AssetAllocationChart";
import { usePortfolioPerformance } from "../../hooks/usePortfolioPerformance";


export default function UserDashboard() {
  const { data, isLoading } = useAllTransactions({
    page: 1,
    pageSize: 10,
  });

  const { data: perfData, isLoading: perfLoading } = usePortfolioPerformance();
  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-7 gap-6">
        {/* Left side: Portfolio Summary */}
        <div className="col-span-3 h-[300px]">
          <PortfolioSummaryCard />
        </div>

        {/* Right side: Recent Transactions */}
        <div className="col-span-4 h-[280px]">
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
         <div className="col-span-3 h-[300px]"><AssetAllocationChart /></div>
        <div className="col-span-4 h-[300px]">
            <PerformanceChart points={perfData ?? []} isLoading={perfLoading} />
        </div>
      </div>
    </div>
  );
}