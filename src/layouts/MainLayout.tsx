// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";


export default function MainLayout() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}