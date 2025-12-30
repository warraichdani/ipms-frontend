import PerformanceSummaryReport from "../pages/Reports/PerformanceSummaryReport";

export default function ReportContent({ activeReport, filters }: { activeReport: string; filters: any }) {
  switch (activeReport) {
    case "PerformanceSummaryReport":
      return <PerformanceSummaryReport filters={filters} />;
    case "InvestmentDistributionReport":
      return <div>Report coming soon</div>;
    case "TransactionHistoryReport":
      return <div>Report coming soon</div>;
    case "MonthlyPerformanceTrend":
      return <div>Report coming soon</div>;
    case "YearOverYearComparison":
      return <div>Report coming soon</div>;
    case "TopPerformingInvestments":
      return <div>Report coming soon</div>;
    default:
      return <div>Select a report</div>;
  }
}