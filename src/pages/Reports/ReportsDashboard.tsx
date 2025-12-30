import { useState } from "react";
import type { PerformanceSummaryFilters } from "../../hooks/usePerformanceSummaryReport";
import ReportFilters from "../../components/ReportFilters";
import ReportSelector from "../../components/ReportSelector";
import ReportContent from "../../components/ReportContent";

export default function ReportsDashboard() {
  const [filters, setFilters] = useState<PerformanceSummaryFilters>({
    from: "",
    to: "",
    investmentTypes: [],
    page: 1,
    pageSize: 30,
  });

  const [activeReport, setActiveReport] = useState("PerformanceSummaryReport");

  return (
    <div className="flex flex-col h-full">
      <ReportFilters filters={filters} setFilters={setFilters} activeReport={activeReport} />

      <div className="flex flex-1">
        <ReportSelector activeReport={activeReport} setActiveReport={setActiveReport} />
        <div className="flex-1 p-6">
          <ReportContent activeReport={activeReport} filters={filters} />
        </div>
      </div>
    </div>
  );
}