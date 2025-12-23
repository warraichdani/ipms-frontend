// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import { Card } from "flowbite-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50">
      <Card className="w-full max-w-md shadow-lg">
        <Outlet />
      </Card>
    </div>
  );
}