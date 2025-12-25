// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";


export default function MainLayout() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="p-8">
        <div className="mx-auto max-w-7xl">
        <Outlet />
        </div>
      </main>
    </div>
  );
}