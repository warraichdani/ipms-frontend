import { Button, Label, TextInput } from "flowbite-react";
import InvestmentTypeSelector from "./InvestmentTypeSelector";
import apiClient from "../lib/apiClient";
import type { PerformanceSummaryFilters } from "../hooks/usePerformanceSummaryReport";

export default function ReportFilters({
  filters,
  setFilters,
  activeReport,
}: {
  filters: PerformanceSummaryFilters;
  setFilters: (f: PerformanceSummaryFilters) => void;
  activeReport: string;
}) {
  const validDateRange = filters.from && filters.to && new Date(filters.from) <= new Date(filters.to);

  const resetFilters = () => {
    setFilters({ ...filters, from: "", to: "", investmentTypes: [], page: 1, pageSize: 30 });
  };

  const handleApply = () => {
    if (validDateRange) {
      setFilters({ ...filters, page: 1 }); // reset to first page when applying
    }
  };

  const handleExport = async (format: "csv" | "pdf" | "json") => {
    try {
      const response = await apiClient.post(
        "/reports/performance-summary/export?format=" + format,
        { ...filters, exportAll: true },
        { responseType: "blob" }
      );
      // download logic...
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="flex items-center justify-end gap-4 border-b pb-3 mb-4">
      {/* Date Range */}
      <TextInput
        type="date"
        value={filters.from}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setFilters({ ...filters, from: e.target.value })}
      />
      <TextInput
        type="date"
        value={filters.to}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setFilters({ ...filters, to: e.target.value })}
      />

      {/* Investment Types */}
      <InvestmentTypeSelector
        selectedTypes={filters.investmentTypes ?? []}
        setSelectedTypes={(types) => setFilters({ ...filters, investmentTypes: types })}
      />


      {/* Apply / Reset */}
      <Button className="bg-brand-600 hover:bg-brand-700 text-white" disabled={!validDateRange} onClick={handleApply}>
        Apply Filters
      </Button>
      <Button className="bg-black hover:bg-gray-900 text-white" onClick={resetFilters}>
        Reset
      </Button>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => handleExport("pdf")} disabled={activeReport === "MonthlyPerformanceTrend"}>
          Export PDF
        </Button>
        <Button onClick={() => handleExport("csv")} disabled={activeReport === "MonthlyPerformanceTrend"}>
          Export CSV
        </Button>
        <Button onClick={() => handleExport("json")} disabled={activeReport === "MonthlyPerformanceTrend"}>
          Export JSON
        </Button>
      </div>
    </div>
  );
}
