import { Spinner, Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell, Button } from "flowbite-react";
import { useYoYAllocation } from "../../hooks/useYoYAllocation";
import apiClient from "../../lib/apiClient";

export default function YearOverYearComparisonReport() {
  const { data, isLoading } = useYoYAllocation();

  // Group data by year
  const years = Array.from(new Set(data?.map((r) => r.year) ?? [])).sort();
  const investmentTypes = Array.from(new Set(data?.map((r) => r.investmentType) ?? []));

  const getPercent = (year: number, type: string) => {
    const row = data?.find((r) => r.year === year && r.investmentType === type);
    return row ? `${row.allocationPercent.toFixed(2)}%` : "-";
  };

  const handleExport = async (format: "csv" | "pdf" | "json") => {
    try {
      const response = await apiClient.post(
        `/reports/yoy-allocation/export?format=${format}`,
        {},
        { responseType: "blob" }
      );
      // download logic...
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-700 mb-4">Year Over Year Comparison</h2>

      <div className="flex justify-end gap-2 mb-4">
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          onClick={() => handleExport("pdf")}
        >
          Export PDF
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          onClick={() => handleExport("csv")}
        >
          Export CSV
        </Button>
        <Button
          className="border border-brand-600 text-brand-600 hover:bg-brand-50 hover:text-brand-700"
          onClick={() => handleExport("json")}
        >
          Export JSON
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Year</TableHeadCell>
                {investmentTypes.map((type) => (
                  <TableHeadCell key={type}>{type}</TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {years.map((year) => (
                <TableRow key={year}>
                  <TableCell>{year}</TableCell>
                  {investmentTypes.map((type) => (
                    <TableCell key={type}>{getPercent(year, type)}</TableCell>
                  ))}
                </TableRow>
              ))}
              {years.length === 0 && (
                <TableRow>
                  <TableCell colSpan={investmentTypes.length + 1} className="text-center py-4 text-gray-500">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}