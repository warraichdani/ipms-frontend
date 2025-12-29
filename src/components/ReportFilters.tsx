import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import InvestmentTypeSelector from "./InvestmentTypeSelector";
import { useInvestmentTypeOptions } from "../hooks/useConfigurations";

export default function ReportFilters({
  filters,
  setFilters,
  activeReport,
}: {
  filters: any;
  setFilters: (f: any) => void;
  activeReport: string;
}) {
  const investmentTypes = useInvestmentTypeOptions();
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
        investmentTypes={investmentTypes}
      />

      <div className="flex gap-2">
        <Button className="bg-brand-600 hover:bg-brand-700 text-white">Apply Filters</Button>
        <Button className="bg-black hover:bg-gray-900 text-white">Reset</Button>

        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend"}
        >
          Export PDF
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend"}
        >
          Export CSV
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          disabled={activeReport === "MonthlyPerformanceTrend"}
        >
          Export JSON
        </Button>

      </div>
    </div>
  );
}