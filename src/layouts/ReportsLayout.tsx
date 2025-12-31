// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";

export default function ReportsLayout() {
  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-900">
      {/* Global header */}
      <MainHeader />

      {/* Filters bar will render inside Outlet (ReportsDashboard places ReportFilters here) */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}