import { Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell } from "flowbite-react";
import type { AllTransactionListItemDto } from "../../../models/transaction";

type Props = {
  transactions: AllTransactionListItemDto[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export default function TransactionTable({
  transactions,
  isLoading,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {isLoading ? (
        <div>Loading transactions...</div>
      ) : (
        <>
          <Table>
            <TableHead>
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
                  <TableCell colSpan={4}>No transactions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded ${
                  p === page ? "bg-brand-600 text-white" : "bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}