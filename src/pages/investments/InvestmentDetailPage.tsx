// src/pages/investments/InvestmentDetailPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import AddTransactionModal from "./components/AddTransactionModal";
import TransactionsTable from "./components/TransactionsTable";
import InvestmentInfoCard from "./components/InvestmentInfoCard";
import HighChartsPerformanceChart from "./components/HighChartsPerformanceChart";
import { toast } from "react-toastify";
import { EditInvestmentModal } from "./EditInvestmentModal";
import { useInvestmentTransactions } from "../../hooks/useInvestmentTransactions";
import { useInvestmentDetail } from "../../hooks/useInvestmentDetail";
import { usePerformance } from "../../hooks/usePerformance";

/**
 * Main Page
 */
export default function InvestmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const investmentId = id ?? "";
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();


  const { data: investment, isLoading: invLoading } = useInvestmentDetail(investmentId);
  const { data: transactions, isLoading: txLoading } = useInvestmentTransactions(investmentId);
  const { data: performance, isLoading: perfLoading } = usePerformance(investmentId);

    const deleteMutation = useMutation({
        mutationFn: async () => {
        await apiClient.delete(`/investments/${investmentId}`); // soft delete endpoint
        },
        onSuccess: () => {
        toast.success("Investment deleted");
        navigate("/investments"); // ✅ route back to list
        },
        onError: () => toast.error("Failed to delete investment"),
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {investment && (
          <InvestmentInfoCard
            investment={investment}
            onAddTransaction={() => setIsAddOpen(true)}
            onEditInvestment={() => setIsEditOpen(true)}
            onDeleteInvestment={() => {
              if (confirm("Are you sure you want to delete this investment?")) {
                deleteMutation.mutate();
              }
            }}
          />
        )}
        <HighChartsPerformanceChart data={performance ?? []} isLoading={perfLoading} />
      </div>

      <TransactionsTable transactions={transactions ?? []} isLoading={txLoading} />

      {investment && (
        <>
          <AddTransactionModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            investment={investment}
          />
          <EditInvestmentModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            investmentId={investment.investmentId}
          />
        </>
      )}
    </div>
  );
}
