import { TextInput, Select, Button } from "flowbite-react";
import InvestmentDropdown from "../../../components/InvestmentDropdown";

type Props = {
  investmentId: string | null;
  onInvestmentChange: (id: string | null) => void;
  transactionType: string | null;
  onTransactionTypeChange: (type: string | null) => void;
  transactionName: string | null;
  onTransactionNameChange: (name: string | null) => void;
  fromDate: string | null;
  onFromDateChange: (date: string | null) => void;
  toDate: string | null;
  onToDateChange: (date: string | null) => void;
  onAddTransaction: () => void;
};

export default function TransactionFilters({
  investmentId,
  onInvestmentChange,
  transactionType,
  onTransactionTypeChange,
  transactionName,
  onTransactionNameChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onAddTransaction,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      {/* Left side: filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Transaction name filter */}
        <TextInput
          placeholder="Filter by transaction name..."
          value={transactionName ?? ""}
          onChange={(e) => onTransactionNameChange(e.target.value || null)}
          className="w-64"
        />

        {/* Investment dropdown */}
        <InvestmentDropdown
          selectedId={investmentId}
          onChange={onInvestmentChange}
        />

        {/* Transaction type dropdown */}
        <Select
          value={transactionType ?? ""}
          onChange={(e) => onTransactionTypeChange(e.target.value || null)}
          className="w-48"
        >
          <option value="">All Types</option>
          {/* These options should come from cached config endpoint */}
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
          <option value="UpdatePrice">Update Price</option>
        </Select>

        {/* Date range filters */}
        <TextInput
          type="date"
          value={fromDate ?? ""}
          onChange={(e) => onFromDateChange(e.target.value || null)}
        />
        <TextInput
          type="date"
          value={toDate ?? ""}
          onChange={(e) => onToDateChange(e.target.value || null)}
        />
      </div>

      {/* Right side: Add Transaction button */}
      <Button
        className="bg-brand-600 hover:bg-brand-700 text-white"
        onClick={onAddTransaction}
      >
        + Add Transaction
      </Button>
    </div>
  );
}