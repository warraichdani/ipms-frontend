// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";
import { Card } from "flowbite-react";
import AuthHeader from "../components/AuthHeader";

export default function AuthLayout() {
  return (
    
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex justify-center items-center p-4"> 
        <Card className="w-full max-w-md shadow-lg">
        <Outlet />
      </Card>
      </main>
    </div>
  );
}