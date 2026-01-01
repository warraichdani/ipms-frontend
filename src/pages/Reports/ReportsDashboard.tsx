import { useState } from "react";
import ReportFilters from "../../components/ReportFilters";
import ReportSelector from "../../components/ReportSelector";
import ReportContent from "../../components/ReportContent";
import type { ReportsFiltersRequest } from "../../models/common/types";
import apiClient from "../../lib/apiClient";

export default function ReportsDashboard() {
    const [filters, setFilters] = useState<ReportsFiltersRequest>({
        from: "",
        to: "",
        investmentTypes: [],
        page: 1,
        pageSize: 30,
        exportAll: false,
    });

    const [activeReport, setActiveReport] = useState("PerformanceSummaryReport");
    const validDateRange = filters.from && filters.to && new Date(filters.from) <= new Date(filters.to);

    const handleYoYExport  = async (format: "csv" | "pdf" | "json") => {
        try {
          const response = await apiClient.post(
            `/reports/yoy-allocation/export?format=${format}`,
            {...filters, exportAll: true},
            { responseType: "blob" }
          );
          exportfile(response, format);
        } catch (err) {
          console.error("Export failed", err);
        }
      };

const handlePerformanceExport  = async (format: "csv" | "pdf" | "json") => {
    if (!validDateRange) {
      alert("Please select a valid date range before exporting.");
      return;
    }
    try {
      const response = await apiClient.post(

        `/reports/performance-summary/export?format=${format}`,
        {
          from: filters.from,
          to: filters.to,
          investmentTypes: filters.investmentTypes,
          exportAll: true,
        },
        { responseType: "blob" }
      );
      exportfile(response, format);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const handleTopPerformingExport = async (format: "csv" | "pdf" | "json") => {
    const response = await apiClient.post(
      `/reports/top-performing-investments/export?format=${format}`,
      {...filters, exportAll: true},
      { responseType: "blob" }
    );
    exportfile(response, format);
  };

  const handleTransactionExport = async (format: "csv" | "pdf" | "json") => {
    const response = await apiClient.post(
      `/reports/transactions/export?format=${format}`,
      {...filters, exportAll: true},
      { responseType: "blob" }
    );
    exportfile(response, format);
  };


const exportfile =(response: any, format: "csv" | "pdf" | "json") =>
{
    const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `performance-summary${new Date().toISOString().slice(0, 10)}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
}

  const exportHandler =
    activeReport === "PerformanceSummaryReport"
      ? handlePerformanceExport
      : activeReport === "YearOverYearComparison"
      ? handleYoYExport
      : activeReport === "TopPerformingInvestments"
      ? handleTopPerformingExport
      : activeReport === "TransactionHistoryReport"
      ? handleTransactionExport
      : undefined;

    return (
        <div className="flex flex-col w-full h-full bg-gray-50">
            {/* Top Filter Bar */}
            <div className="border-b border-gray-300 bg-white px-6 py-3">
                <ReportFilters
                    filters={filters}
                    setFilters={setFilters}
                    activeReport={activeReport}
                    onExport={exportHandler}
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left-side Report Selector */}
                <div className="w-64 border-r border-gray-300 bg-white">
                    <ReportSelector
                        activeReport={activeReport}
                        setActiveReport={setActiveReport}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 pl-8 overflow-y-auto bg-white">
                    <ReportContent activeReport={activeReport} filters={filters} />
                </div>
            </div>

        </div>
    );
}