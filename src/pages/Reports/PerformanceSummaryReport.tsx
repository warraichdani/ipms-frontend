import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Spinner, Pagination } from "flowbite-react";
import { usePerformanceSummaryReport, type ReportsFiltersRequest } from "../../hooks/usePerformanceSummaryReport";

export default function PerformanceSummaryReport({ filters }: { filters: ReportsFiltersRequest }) {
  const { data, isLoading, page, setPage, pageSize } = usePerformanceSummaryReport(filters);

  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / pageSize));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-700 mb-4">Performance Summary Report</h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Total Value</TableHeadCell>
                <TableHeadCell>Gain/Loss</TableHeadCell>
                <TableHeadCell>% Gain/Loss</TableHeadCell>
                <TableHeadCell>Active Investments</TableHeadCell>
                <TableHeadCell>Best Performer</TableHeadCell>
                <TableHeadCell>Best %</TableHeadCell>
                <TableHeadCell>Worst Performer</TableHeadCell>
                <TableHeadCell>Worst %</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data?.items.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.totalCurrentValue.toLocaleString()}</TableCell>
                  <TableCell>{row.totalGainLoss.toLocaleString()}</TableCell>
                  <TableCell>{row.totalGainLossPercent.toFixed(2)}%</TableCell>
                  <TableCell>{row.activeInvestmentsCount}</TableCell>
                  <TableCell>{row.bestPerformerName ?? "-"}</TableCell>
                  <TableCell>{row.bestPerformerGainPercent?.toFixed(2) ?? "-"}%</TableCell>
                  <TableCell>{row.worstPerformerName ?? "-"}</TableCell>
                  <TableCell>{row.worstPerformerGainPercent?.toFixed(2) ?? "-"}%</TableCell>
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} showIcons />
        </div>
      )}
    </div>
  );
}