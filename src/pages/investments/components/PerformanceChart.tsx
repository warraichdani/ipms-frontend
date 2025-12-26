// src/pages/investments/components/PerformanceChart.tsx
import type { PerformancePointDto } from "../../../models/performance";

type Props = {
  points: PerformancePointDto[];
  isLoading: boolean;
};


export default function PerformanceChart({ points, isLoading }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Performance
      </h3>
      {isLoading ? (
        <div>Loading performance...</div>
      ) : (
        <div>
          {/* Replace with your chart implementation */}
          {points.length === 0 ? (
            <div>No performance data available.</div>
          ) : (
            <ul>
              {points.map((p, i) => (
                <li key={i}>
                  {p.date}: {p.marketValue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}