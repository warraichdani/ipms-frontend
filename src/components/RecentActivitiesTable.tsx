// src/components/RecentActivitiesTable.tsx
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "flowbite-react";
import { useRecentActivities } from "../hooks/useRecentActivities";

export default function RecentActivitiesTable() {
  const { data, isLoading } = useRecentActivities();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-[400px] flex flex-col">
      <h2 className="text-xl font-bold text-brand-700 mb-4">Recent Activities</h2>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
              <TableRow>
                <TableHeadCell>User ID</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
                <TableHeadCell>Summary</TableHeadCell>
                <TableHeadCell>Occurred At</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {data?.slice(0, 10).map((a, idx) => (
                <TableRow key={idx}>
                  <TableCell>{a.userId ?? "-"}</TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell className="whitespace-pre-wrap break-words max-w-2xl">
                    {a.summary ?? "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(a.occurredAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {(!data || data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No recent activities found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}