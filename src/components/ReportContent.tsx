import InvestmentDistributionReport from "../pages/Reports/InvestmentDistributionReport";
import MonthlyPerformanceTrendReport from "../pages/Reports/MonthlyPerformanceTrendReport";
import PerformanceSummaryReport from "../pages/Reports/PerformanceSummaryReport";
import TopPerformingInvestmentsReport from "../pages/Reports/TopPerformingInvestmentsReport";
import YearOverYearComparisonReport from "../pages/Reports/YearOverYearComparisonReport";

export default function ReportContent({ activeReport, filters }: { activeReport: string; filters: any }) {
  switch (activeReport) {
    case "PerformanceSummaryReport":
      return <PerformanceSummaryReport filters={filters} />;
    case "InvestmentDistributionReport":
      return <InvestmentDistributionReport filters={filters}/>;
    case "TransactionHistoryReport":
      return <div>Report coming soon</div>;
    case "MonthlyPerformanceTrend":
      return <MonthlyPerformanceTrendReport filters={filters} />;
    case "YearOverYearComparison":
      return <YearOverYearComparisonReport />;
    case "TopPerformingInvestments":
      return <TopPerformingInvestmentsReport filters={filters} />;
    default:
      return <div>Select a report</div>;
  }
}