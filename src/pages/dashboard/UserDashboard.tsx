import PortfolioSummaryCard from "../../components/PortfolioSummaryCard";

export default function UserDashboard() {
  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-7 gap-6">
        {/* Portfolio Summary Card covers 3/7 width */}
        <PortfolioSummaryCard />

        {/* Other dashboard widgets can take col-span-4 */}
        <div className="col-span-4">
          {/* Other dashboard content */}
        </div>
      </div>
    </div>
  );
}
