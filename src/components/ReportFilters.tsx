import { Button, TextInput } from "flowbite-react";
import InvestmentTypeSelector from "./InvestmentTypeSelector";
import apiClient from "../lib/apiClient";
import type { ReportsFiltersRequest } from "../hooks/usePerformanceSummaryReport";
import { useState } from "react";

export default function ReportFilters({
  filters,
  setFilters,
  activeReport,
}: {
  filters: ReportsFiltersRequest;
  setFilters: (f: ReportsFiltersRequest) => void;
  activeReport: string;
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

  const handleExport = async (format: "csv" | "pdf" | "json") => {
    if (!validDateRange) {
      alert("Please select a valid date range before exporting.");
      return;
    }
    try {
      const response = await apiClient.post(

        `/reports/performance-summary/export?format=${format}`,
        {
          from: fromDate,
          to: toDate,
          investmentTypes: selectedTypes,
          page: 1,
          pageSize: 30,
          exportAll: true,
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `performance-summary${new Date().toISOString().slice(0, 10)}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
      </div>

      <div className="flex gap-2">

        <TextInput type="date" value={fromDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setFromDate(e.target.value)} />
        <TextInput type="date" value={toDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setToDate(e.target.value)} />

        <InvestmentTypeSelector selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />

        <Button className="bg-brand-600 hover:bg-brand-700 text-white" disabled={!validDateRange} onClick={handleApply}>
          Load Report
        </Button>
        <Button className="bg-black hover:bg-gray-900 text-white" onClick={resetFilters}>
          Reset
        </Button>

        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend"}
          onClick={() => handleExport("pdf")}
        >
          Export PDF
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend"}
          onClick={() => handleExport("csv")}
        >
          Export CSV
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend"}
          onClick={() => handleExport("json")}
        >
          Export JSON
        </Button>
      </div>

    </div>
  );
}

