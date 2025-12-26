// src/pages/investments/components/TransactionsTable.tsx
import { Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell } from "flowbite-react";
import type { TransactionDto } from "../../../models/transaction";

type Props = {
  transactions: TransactionDto[];
  isLoading: boolean;
};

export default function TransactionsTable({ transactions, isLoading }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Transaction history
      </h3>
      {isLoading ? (
        <div>Loading transactions...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Transaction type</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Transaction date</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {transactions.map((t) => (
                <TableRow key={t.transactionId}>
                  <TableCell>{t.transactionType}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                  <TableCell>{t.transactionDate}</TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>No transactions found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}