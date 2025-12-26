// src/pages/investments/InvestmentDetailPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import AddTransactionModal from "./components/AddTransactionModal";

/**
 * Models
 */
type InvestmentDetailDto = {
    investmentId: string;
    investmentName: string;
    investmentType: string;
    currentValue: number;
    gainLossPercent: number;
    status: string;
    totalUnits?: number;
    UnitPrice?: number;
    Broker?: string;
    Notes?: string;
};

type TransactionDto = {
    transactionId: string;
    investmentId: string;
    transactionType: "Buy" | "Sell" | "Update";
    amount: number;
    unitPrice?: number;
    transactionDate: string; // ISO date
    totalUnitsAfter?: number;
    costBasisAfter?: number;
    marketValueAfter?: number;
};

type PerformancePointDto = {
    date: string; // map from DateOnly (yyyy-MM-dd) to string
    marketValue: number;
};

type Option = { label: string; value: string };

/**
 * Hooks
 */
function useInvestmentDetail(investmentId: string) {
    return useQuery({
        queryKey: ["investment-detail", investmentId],
        queryFn: async () => {
            const { data } = await apiClient.get<InvestmentDetailDto>(`/investments/${investmentId}`);
            return data;
        },
        enabled: !!investmentId,
    });
}

function useTransactions(investmentId: string) {
  return useQuery({
    queryKey: ["investment-transactions", investmentId],
    queryFn: async () => {
      const response = await apiClient.get(`/investments/${investmentId}/transactions`);
      const txs = response.data.items; // ✅ unwrap Items
      return (txs ?? []).slice().sort((a: TransactionDto, b: TransactionDto) =>
        a.transactionDate < b.transactionDate ? 1 : -1
      );
    },
    enabled: !!investmentId,
  });
}

function usePerformance(investmentId: string) {
    return useQuery({
        queryKey: ["investment-performance", investmentId],
        queryFn: async () => {
            const { data } = await apiClient.get<PerformancePointDto[]>(`/investments/${investmentId}/performance`);
            return data ?? [];
        },
        enabled: !!investmentId,
    });
}

/**
 * Simple inline SVG line chart for performance (no external libs)
 */
function PerformanceChart({ points }: { points: PerformancePointDto[] }) {
    const width = 600;
    const height = 220;
    const padding = 30;

    const parsed = useMemo(() => {
        if (!points?.length) return [];
        return points
            .slice()
            .sort((a, b) => (a.date < b.date ? -1 : 1))
            .map(p => ({ x: new Date(p.date).getTime(), y: p.marketValue }));
    }, [points]);

    if (!parsed.length) {
        return <div className="text-gray-500 text-sm">No performance data available.</div>;
    }

    const xs = parsed.map(p => p.x);
    const ys = parsed.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const xScale = (x: number) => padding + ((x - minX) / (maxX - minX || 1)) * (width - 2 * padding);
    const yScale = (y: number) => height - padding - ((y - minY) / (maxY - minY || 1)) * (height - 2 * padding);

    const pathD = parsed.map((p, idx) => `${idx === 0 ? "M" : "L"} ${xScale(p.x)} ${yScale(p.y)}`).join(" ");

    return (
        <svg width={width} height={height} className="bg-white rounded-md shadow">
            {/* axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />
            {/* path */}
            <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={2} />
            {/* points */}
            {parsed.map((p, i) => (
                <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={3} fill="#2563eb" />
            ))}
        </svg>
    );
}
/**
 * Main Page
 */
export default function InvestmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const investmentId = id ?? "";
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data: investment, isLoading: invLoading } = useInvestmentDetail(investmentId);
    const { data: transactions, isLoading: txLoading } = useTransactions(investmentId);
    const { data: performance, isLoading: perfLoading } = usePerformance(investmentId);

    // Determine current units from investment detail if provided, else derive from transactions
    const currentUnits = useMemo(() => {
        if (investment?.totalUnits != null) return Number(investment.totalUnits);
        // derive crude total units (Buy adds, Sell subtracts). UpdatePrice doesn't change units.
        const total = (transactions ?? []).reduce((acc: number, t: TransactionDto) => {
            if (t.transactionType === "Buy") return acc + Number(t.amount || 0);
            if (t.transactionType === "Sell") return Math.max(0, acc - Number(t.amount || 0));
            return acc;
        }, 0);
        return total;
    }, [investment, transactions]);

    return (
        <div className="space-y-6">
            {/* Top row: Info card and Performance chart side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Investment Information Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {invLoading ? (
                        <div>Loading investment...</div>
                    ) : investment ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-brand-700">{investment.investmentName}</h2>
                                <span
                                    className={
                                        "px-3 py-1 rounded text-sm " +
                                        (investment.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : investment.status === "Sold"
                                                ? "bg-gray-100 text-gray-700"
                                                : "bg-yellow-100 text-yellow-700")
                                    }
                                >
                                    {investment.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="rounded border p-3">
                                    <div className="text-xs text-gray-500">Type</div>
                                    <div className="font-semibold">{investment.investmentType}</div>
                                </div>

                                <div className="rounded border p-3">
                                    <div className="text-xs text-gray-500">Current value</div>
                                    <div className="font-semibold text-blue-700">
                                        {/* {investment.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} */}
                                        {investment.currentValue}
                                    </div>
                                </div>

                                <div className="rounded border p-3">
                                    <div className="text-xs text-gray-500">Gain/Loss %</div>
                                    <div
                                        className={
                                            "font-semibold " +
                                            (investment.gainLossPercent >= 0 ? "text-green-700" : "text-red-700")
                                        }
                                    >
                                        {investment.gainLossPercent}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="bg-brand-600 hover:bg-brand-700 text-white"
                                    onClick={() => setIsAddOpen(true)}
                                >
                                    + Add transaction
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>No investment found.</div>
                    )}
                </div>

                {/* Performance Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                        Performance
                    </h3>
                    {perfLoading ? (
                        <div>Loading performance...</div>
                    ) : (
                        <PerformanceChart points={(performance ?? []).map(p => ({ date: p.date, marketValue: Number(p.marketValue) }))} />
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Transaction history
                </h3>
                {txLoading ? (
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
                                {(transactions ?? []).map((t: TransactionDto) => (
                                    <TableRow key={t.transactionId}>
                                        <TableCell>{t.transactionType}</TableCell>
                                        <TableCell>{t.amount}</TableCell>
                                        <TableCell>{t.transactionDate}</TableCell>
                                    </TableRow>
                                ))}
                                {(transactions ?? []).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>No transactions found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Add Transaction Modal */}
            {investment && (
                <AddTransactionModal
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    investmentId={investment.investmentId}
                    investmentName={investment.investmentName}
                    currentUnits={currentUnits}
                />
            )}
        </div>
    );
}