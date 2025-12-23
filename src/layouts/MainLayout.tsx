// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
// import { MainMenu } from "../components/MainMenu";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow">
        {/* <MainMenu /> */}
      </aside>
      <main className="flex-1">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}