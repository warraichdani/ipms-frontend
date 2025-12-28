// src/pages/admin/AdminDashboard.tsx
import SystemStatisticsCard from "../../components/SystemStatisticsCard";
import RecentActivitiesTable from "../../components/RecentActivitiesTable";
import UserTable from "../../components/userTable";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {/* Top row: statistics + user table */}
      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-3">
          <SystemStatisticsCard />
        </div>
        <div className="col-span-5">
          <UserTable height="h-[400px]" scroll={true} />
        </div>
      </div>

      {/* Bottom row: recent activities */}
      <RecentActivitiesTable />
    </div>
  );
}