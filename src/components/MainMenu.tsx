// src/components/MainMenu.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Can } from "./Can";

type MenuItem = {
  key: string;
  path: string;
  role: string;       // ✅ role instead of claim
  children?: MenuItem[];
};

const menuItems: MenuItem[] = [
  { key: "Dashboard", path: "/", role: "Admin" },
  { key: "Users", path: "/users", role: "Admin" },
  { key: "Portfolio", path: "/portfolio", role: "User" },
  { key: "Reports", path: "/reports", role: "User" },
  { key: "Investments", path: "/investments", role: "User" },
  { key: "Transactions", path: "/transactions", role: "User" },
];

export const MainMenu = () => {
  return (
    <nav className="flex items-center gap-6 rtl:flex-row-reverse">
      <Can role="Admin">
        <NavLink to="/" className="nav-link">Dashboard</NavLink>
        <NavLink to="/users" className="nav-link">Users</NavLink>
      </Can>

      <Can role="User">
        <NavLink to="/" className="nav-link">Dashboard</NavLink>
        {/* <NavLink to="/reports" className="nav-link">Reports</NavLink> */}
        <NavLink to="/investments" className="nav-link">Investments</NavLink>
        <NavLink to="/transactions" className="nav-link">Transactions</NavLink>
      </Can>
    </nav>
  );
};
