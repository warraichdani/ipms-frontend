import { useState } from "react";
import ReportFilters from "../../components/ReportFilters";
import ReportSelector from "../../components/ReportSelector";
import ReportContent from "../../components/ReportContent";

export default function ReportsDashboard() {
  const [filters, setFilters] = useState({});
  const [activeReport, setActiveReport] = useState("PerformanceSummaryReport");

  return (
    <div className="flex flex-col h-full">
      {/* Top Filter Bar */}
      <ReportFilters filters={filters} setFilters={setFilters} activeReport={activeReport} />

      <div className="flex flex-1">
        {/* Left-side Report Selector */}
        <ReportSelector activeReport={activeReport} setActiveReport={setActiveReport} />

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <ReportContent activeReport={activeReport} filters={filters} />
        </div>
      </div>
    </div>
  );
}