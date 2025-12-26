// src/pages/investments/InvestmentDetailPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import AddTransactionModal from "./components/AddTransactionModal";
import type { InvestmentDetailDto } from "../../models/investment";
import type { TransactionDto } from "../../models/transaction";
import type { PerformancePointDto } from "../../models/performance";
import TransactionsTable from "./components/TransactionsTable";
import InvestmentInfoCard from "./components/InvestmentInfoCard";
import HighChartsPerformanceChart from "./components/HighChartsPerformanceChart";

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {investment && (
          <InvestmentInfoCard
            investment={investment}
            onAddTransaction={() => setIsAddOpen(true)}
          />
        )}
        <HighChartsPerformanceChart data={performance ?? []} isLoading={perfLoading} />
      </div>

      <TransactionsTable transactions={transactions ?? []} isLoading={txLoading} />

      {investment && (
        <AddTransactionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          investment={investment}
        />
      )}
    </div>
  );
}
