import {
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableCell,
  Spinner,
  Pagination,
} from "flowbite-react";
import type { ReportsFiltersRequest } from "../../models/common/types";
import { useTopPerformingInvestments } from "../../hooks/useTopPerformingInvestments";

export default function TopPerformingInvestmentsReport({
  filters,
}: {
  filters: ReportsFiltersRequest;
}) {
  const { data, isLoading, page, setPage, pageSize } = useTopPerformingInvestments(filters);

  const totalPages = data ? Math.ceil(data.totalCount / filters.pageSize) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-700 mb-4">
        Top Performing Investments
      </h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Units Held</TableHeadCell>
                  <TableHeadCell>Cost Basis</TableHeadCell>
                  <TableHeadCell>Current Value</TableHeadCell>
                  <TableHeadCell>Gain/Loss</TableHeadCell>
                  <TableHeadCell>Gain/Loss %</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {data?.items.map((row) => (
                  <TableRow key={row.investmentId}>
                    <TableCell>{row.investmentName}</TableCell>
                    <TableCell>{row.investmentType}</TableCell>
                    <TableCell>{row.unitsHeld.toLocaleString()}</TableCell>
                    <TableCell>{row.costBasis.toLocaleString()}</TableCell>
                    <TableCell>{row.currentValue.toLocaleString()}</TableCell>
                    <TableCell
                      className={row.gainLoss >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      {row.gainLoss.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={row.gainLossPercent >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      {row.gainLossPercent.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
                {(!data || data.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}