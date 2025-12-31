import { useState } from "react";
import type { ReportsFiltersRequest } from "../../hooks/usePerformanceSummaryReport";
import ReportFilters from "../../components/ReportFilters";
import ReportSelector from "../../components/ReportSelector";
import ReportContent from "../../components/ReportContent";

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

    return (
        <div className="flex flex-col w-full h-full bg-gray-50">
            {/* Top Filter Bar */}
            <div className="border-b border-gray-300 bg-white px-6 py-3">
                <ReportFilters
                    filters={filters}
                    setFilters={setFilters}
                    activeReport={activeReport}
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