import { Button } from "flowbite-react";

const reports = [
  "PerformanceSummaryReport",
  "InvestmentDistributionReport",
  "TransactionHistoryReport",
  "MonthlyPerformanceTrend",
  "YearOverYearComparison",
  "TopPerformingInvestments"
];

export default function ReportSelector({ activeReport, setActiveReport }: { activeReport: string; setActiveReport: (r: string) => void; }) {
  return (
    <div className="flex flex-col gap-2 w-64 border-r pr-4">
      {reports.map((r) => (
        <Button
          key={r}
          color={activeReport === r ? "info" : "gray"}
          onClick={() => setActiveReport(r)}
        >
          {r.replace(/([A-Z])/g, " $1").trim()}
        </Button>
      ))}
    </div>
  );
}