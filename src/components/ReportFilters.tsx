import { Button, Label, TextInput } from "flowbite-react";
import InvestmentTypeSelector from "./InvestmentTypeSelector";
import apiClient from "../lib/apiClient";
import { useState } from "react";

export default function ReportFilters({
  filters,
  setFilters,
  activeReport,
}: {
  filters: any;
  setFilters: (f: any) => void;
  activeReport: string;
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const validDateRange =
    fromDate && toDate && new Date(fromDate) <= new Date(toDate);

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedTypes([]);
    setFilters({});
  };

  // ✅ Export handler
  const handleExport = async (format: "csv" | "pdf" | "json") => {
    try {
      const response = await apiClient.post(
        "/api/reports/performance-summary/export?format=" + format,
        {
          from: fromDate,
          to: toDate,
          investmentTypes: selectedTypes,
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 30,
          exportAll: true,
        },
        { responseType: "blob" } // important for file download
      );

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Use filename from Content-Disposition if available
      const disposition = response.headers["content-disposition"];
      let fileName = `performance-summary.${format}`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
      }
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="flex items-center justify-end gap-4 border-b pb-3 mb-4">
      {/* Date Range */}
      <div className="flex gap-2 items-center">
        <Label htmlFor="fromDate">From</Label>
        <TextInput
          id="fromDate"
          type="date"
          value={fromDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <Label htmlFor="toDate">To</Label>
        <TextInput
          id="toDate"
          type="date"
          value={toDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* Investment Types */}
      <InvestmentTypeSelector
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        investmentTypes={filters.investmentTypes ?? []}
      />

      {/* Apply / Reset */}
      <Button
        className="bg-brand-600 hover:bg-brand-700 text-white"
        disabled={!validDateRange}
        onClick={() => setFilters({ fromDate, toDate, types: selectedTypes })}
      >
        Apply Filters
      </Button>
      <Button
        className="bg-black hover:bg-gray-900 text-white"
        onClick={resetFilters}
      >
        Reset
      </Button>

      {/* Export Buttons */}
      <div className="flex gap-2">
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