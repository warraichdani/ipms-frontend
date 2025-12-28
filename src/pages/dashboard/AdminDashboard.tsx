import UserTable from "../../hooks/userTable";
import SystemStatisticsCard from "../../components/SystemStatisticsCard";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-8 gap-6">
        {/* Left side: System Statistics Card (3/8 width) */}
        <div className="col-span-3">
          <SystemStatisticsCard />
        </div>

        {/* Right side: Table (5/8 width) */}
        <div className="col-span-5">
          <UserTable height="h-[400px]" scroll={true} />
        </div>
      </div>
    </div>
  );
}