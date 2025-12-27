import { useState } from "react";
import TransactionFilters from "./components/TransactionFilters";
import TransactionTable from "./components/TransactionTable";
import { useAllTransactions } from "../../hooks/useAllTransactions";
import AddTransactionModal from "../investments/components/AddTransactionModal";

export default function TransactionListPage() {
  const [page, setPage] = useState(1);
  const [investmentId, setInvestmentId] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [transactionName, setTransactionName] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading } = useAllTransactions({
    page,
    pageSize: 10,
    investmentId,
    transactionType,
    // ✅ pass transactionName filter to backend if supported
    investmentName: transactionName,
    from: fromDate,
    to: toDate,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-700">Transactions</h1>

      <TransactionFilters
        investmentId={investmentId}
        onInvestmentChange={setInvestmentId}
        transactionType={transactionType}
        onTransactionTypeChange={setTransactionType}
        transactionName={transactionName}
        onTransactionNameChange={setTransactionName}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        onAddTransaction={() => setIsAddOpen(true)}
      />

      <TransactionTable
        transactions={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pageSize={data?.pageSize ?? 10}
        totalCount={data?.totalCount ?? 0}
        onPageChange={setPage}
      />

      {/* Add Transaction Modal */}
      {isAddOpen && (
        <AddTransactionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          // ✅ later we’ll update this to consume InvestmentDropdown selection
          investment= { undefined} 
        />
      )}
    </div>
  );
}