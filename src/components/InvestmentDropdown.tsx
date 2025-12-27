import { Select, Spinner } from "flowbite-react";
import { useInvestments, type InvestmentListItemDto } from "../hooks/useInvestments";

type Props = {
    selectedId: string | null;
    onChange: (id: string | null) => void;
    onSelectInvestment?: (investment: InvestmentListItemDto | null) => void; // ✅ new
};

export default function InvestmentDropdown({ selectedId, onChange, onSelectInvestment }: Props) {
    const { data, isLoading } = useInvestments({
        page: 1,
        pageSize: 50,
    });

    const investments: InvestmentListItemDto[] = data?.items ?? [];

    const handleChange = (id: string | null) => {
        onChange(id);
        if (onSelectInvestment) {
            const selected = investments.find((inv) => inv.investmentId === id) ?? null;
            onSelectInvestment(selected);
        }
    };

    return (
        <Select
            value={selectedId ?? ""}
            onChange={(e) => handleChange(e.target.value || null)}
        >
            <option value="">All Investments</option>
            {isLoading ? (
                <option disabled>
                    <Spinner size="sm" className="mr-2" /> Loading...
                </option>
            ) : (
                investments.map((inv) => (
                    <option key={inv.investmentId} value={inv.investmentId}>
                        {inv.name}
                    </option>
                ))
            )}
        </Select>
    );
}