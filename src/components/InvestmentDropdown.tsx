import { useState } from "react";
import { useInvestments, type InvestmentListItemDto } from "../hooks/useInvestments";

type Props = {
  selectedId: string | null;
  onChange: (id: string | null) => void;
};

export default function InvestmentDropdown({ selectedId, onChange }: Props) {
  const [search, setSearch] = useState<string | null>(null);

  // ✅ Pass filter object with search + pagination
  const { data, isLoading } = useInvestments({
    search,
    page: 1,
    pageSize: 20, // limit results for dropdown
  });

  const investments: InvestmentListItemDto[] = data?.items ?? [];

  return (
    <div className="flex flex-col gap-2">
      {/* Search box */}
      <input
        type="text"
        placeholder="Search investments..."
        value={search ?? ""}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2"
      />

      {/* Dropdown */}
      <select
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="border rounded px-3 py-2"
      >
        <option value="">All Investments</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : (
          investments.map((inv) => (
            <option key={inv.investmentId} value={inv.investmentId}>
              {inv.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}