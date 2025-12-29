export default function ReportContent({ activeReport }: { activeReport: string }) {
  switch (activeReport) {
    case "PerformanceSummaryReport":
      return <div>Report coming soon</div>;
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