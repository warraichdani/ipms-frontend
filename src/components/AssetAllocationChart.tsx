// src/components/AssetAllocationChart.tsx
import { Card, Spinner } from "flowbite-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAllocation } from "../hooks/useAllocation";
import { useInvestmentTypeOptions } from "../hooks/useConfigurations";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetAllocationChart() {
  const { data, isLoading } = useAllocation();
  const investmentTypes = useInvestmentTypeOptions(); 
  // investmentTypes: [{ value: "Equity", label: "Equity" }, ...]

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <h2 className="text-xl font-bold text-brand-700 mb-4">Asset Allocation</h2>
        <p className="text-gray-500">No allocation data available</p>
      </Card>
    );
  }

  // Map InvestmentType to labels from config
  const labels = data.map((d) => {
    const match = investmentTypes.find((opt) => opt.value === d.investmentType);
    return match ? match.label : d.investmentType;
  });

  const values = data.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#3b82f6", // blue
          "#10b981", // green
          "#f59e0b", // amber
          "#ef4444", // red
          "#6366f1", // indigo
          "#14b8a6", // teal
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <Card className="h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-brand-700 mb-4">Asset Allocation</h2>
      <Doughnut data={chartData} options={options} />
    </Card>
  );
}