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
import { useTransactionHistory } from "../../hooks/useTransactionHistory";

export default function TransactionHistoryReport({ filters }: { filters: ReportsFiltersRequest }) {
  const { data, isLoading, page, setPage, pageSize } = useTransactionHistory(filters);
  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / pageSize));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-brand-700 mb-4">
        Transaction History
      </h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Table>
              <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                <TableRow>
                  <TableHeadCell>Date</TableHeadCell>
                  <TableHeadCell>Investment</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Units</TableHeadCell>
                  <TableHeadCell>Unit Price</TableHeadCell>
                  <TableHeadCell>Amount</TableHeadCell>
                  <TableHeadCell>Total Value</TableHeadCell>
                  <TableHeadCell>Gain/Loss</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {data?.items.map((t) => (
                  <TableRow key={t.transactionId}>
                    <TableCell>{t.transactionDate}</TableCell>
                    <TableCell>{t.investmentName}</TableCell>
                    <TableCell>{t.investmentStatus}</TableCell>
                    <TableCell>{t.transactionType}</TableCell>
                    <TableCell>{t.units.toLocaleString()}</TableCell>
                    <TableCell>{t.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>{t.amount.toLocaleString()}</TableCell>
                    <TableCell>{t.totalInvestmentValueAtDate.toLocaleString()}</TableCell>
                    <TableCell
                      className={t.gainLossAtDate >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      {t.gainLossAtDate.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!data || data.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} showIcons />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}