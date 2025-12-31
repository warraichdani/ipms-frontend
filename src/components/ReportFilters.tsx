import { Button, TextInput } from "flowbite-react";
import InvestmentTypeSelector from "./InvestmentTypeSelector";
import apiClient from "../lib/apiClient";
import { useState } from "react";
import type { ReportsFiltersRequest } from "../models/common/types";

type ReportFiltersProps = {
  filters: ReportsFiltersRequest;
  setFilters: (f: ReportsFiltersRequest) => void;
  activeReport: string;
  onExport?: (format: "csv" | "pdf" | "json") => void; // ✅ optional callback
};

export default function ReportFilters({
  filters,
  setFilters,
  activeReport,
  onExport
}: {
  filters: ReportsFiltersRequest;
  setFilters: (f: ReportsFiltersRequest) => void;
  activeReport: string;
  onExport?: (format: "csv" | "pdf" | "json") => void;
}) {
  const [fromDate, setFromDate] = useState(filters.from);
  const [toDate, setToDate] = useState(filters.to);
  const [selectedTypes, setSelectedTypes] = useState(filters.investmentTypes ?? []);

  const validDateRange = fromDate && toDate && new Date(fromDate) <= new Date(toDate);

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedTypes([]);
    setFilters({ ...filters, from: "", to: "", investmentTypes: [], page: 1, pageSize: 30 });
  };

  const handleApply = () => {
    if (validDateRange) {
      setFilters({
        ...filters,
        from: fromDate,
        to: toDate,
        investmentTypes: selectedTypes,
        page: 1,
        exportAll: false,
      });
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
      </div>

      <div className="flex gap-2">
        {activeReport === "YearOverYearComparison" ? null :
          <TextInput type="date" value={fromDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setFromDate(e.target.value)} />}
        {activeReport === "YearOverYearComparison" ? null :
          <TextInput type="date" value={toDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setToDate(e.target.value)} />}


        {
          activeReport === "InvestmentDistributionReport" || activeReport === "MonthlyPerformanceTrend" || activeReport === "YearOverYearComparison" ? null : <InvestmentTypeSelector selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
        }
        {activeReport === "YearOverYearComparison" ? null : <Button className="bg-brand-600 hover:bg-brand-700 text-white" disabled={!validDateRange} onClick={handleApply}>
          Load Report
        </Button>}
        {activeReport === "YearOverYearComparison" ? null :
        <Button className="bg-black hover:bg-gray-900 text-white" onClick={resetFilters}>
          Reset
        </Button>}

        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend" || activeReport === "InvestmentDistributionReport"}
          onClick={() => onExport?.("pdf")}
        >
          Export PDF
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend" || activeReport === "InvestmentDistributionReport"}
          onClick={() => onExport?.("csv")}
        >
          Export CSV
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend" || activeReport === "InvestmentDistributionReport"}
          onClick={() => onExport?.("json")}
        >
          Export JSON
        </Button>
      </div>

    </div>
  );
}

