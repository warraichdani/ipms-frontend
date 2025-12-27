import InvestmentDropdown from "../../../components/InvestmentDropdown";

type Props = {
  investmentId: string | null;
  onInvestmentChange: (id: string | null) => void;
  transactionType: string | null;
  onTransactionTypeChange: (type: string | null) => void;
};

export default function TransactionFilters({
  investmentId,
  onInvestmentChange,
  transactionType,
  onTransactionTypeChange,
}: Props) {
  return (
    <div className="flex gap-4 items-center">
      <InvestmentDropdown
        selectedId={investmentId}
        onChange={onInvestmentChange}
      />

      <select
        value={transactionType ?? ""}
        onChange={(e) => onTransactionTypeChange(e.target.value || null)}
        className="border rounded px-3 py-2"
      >
        <option value="">All Types</option>
        {/* These options should come from cached config endpoint */}
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
        <option value="UpdatePrice">Update Price</option>
      </select>
    </div>
  );
}