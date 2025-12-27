import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { Can } from "../../components/Can";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Can role="Admin" fallback={null}>
        <AdminDashboard />
      </Can>

      <Can role="User" fallback={null}>
        <UserDashboard />
      </Can>
    </div>
  );
}