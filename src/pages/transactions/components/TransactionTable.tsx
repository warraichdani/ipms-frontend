import { Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell, Spinner } from "flowbite-react";
import type { AllTransactionListItemDto } from "../../../models/transaction";

type Props = {
  transactions: AllTransactionListItemDto[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  hidePaging?: boolean;
  title?: string; 
};

export default function TransactionTable({
  transactions,
  isLoading,
  page,
  pageSize,
  totalCount,
  onPageChange,
  hidePaging = false,
  title = "" 
}: Props) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full p-6">
      {/* ✅ Title */}
      {title && <h2 className="text-xl font-bold text-brand-700 mb-4">{title}</h2>}

      {/* ✅ Table wrapper with scroll + sticky header */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
              <TableRow>
                <TableHeadCell>Investment</TableHeadCell>
                <TableHeadCell>Type</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {transactions.map((t) => (
                <TableRow key={t.transactionId}>
                  <TableCell>{t.investmentName}</TableCell>
                  <TableCell>{t.transactionType}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                  <TableCell>{t.date}</TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ✅ Paging controls (optional) */}
      {!hidePaging && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 border-t pt-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded ${
                p === page ? "bg-brand-600 text-white" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}