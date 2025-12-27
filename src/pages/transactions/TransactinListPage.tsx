import { useState } from "react";
import TransactionFilters from "./components/TransactionFilters";
import TransactionTable from "./components/TransactionTable";
import { useAllTransactions } from "../../hooks/useAllTransactions";

export default function TransactionListPage() {
  const [page, setPage] = useState(1);
  const [investmentId, setInvestmentId] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);

  const { data, isLoading } = useAllTransactions({
    page,
    pageSize: 20,
    investmentId,
    transactionType,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-700">Transactions</h1>

      <TransactionFilters
        investmentId={investmentId}
        onInvestmentChange={setInvestmentId}
        transactionType={transactionType}
        onTransactionTypeChange={setTransactionType}
      />

      <TransactionTable
        transactions={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pageSize={data?.pageSize ?? 10}
        totalCount={data?.totalCount ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}