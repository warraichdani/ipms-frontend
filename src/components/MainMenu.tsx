// src/components/MainMenu.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
  { key: "Reports", path: "/reports", role: "Manager" },
];

export const MainMenu = () => {
  const { roles } = useAuth();

  // ✅ Filter menu items by user roles
  const filteredMenu = menuItems.filter((item) => roles.includes(item.role));

  return (
    <nav className="flex items-center gap-6 rtl:flex-row-reverse">
      {filteredMenu.map((item) => (
        <NavLink
          key={item.key}
          to={item.path}
          className={({ isActive }) =>
            `
            text-sm font-medium transition-colors
            ${
              isActive
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-700 dark:text-gray-300"
            }
            hover:text-brand-600 dark:hover:text-brand-400
          `
          }
        >
          {item.key}
        </NavLink>
      ))}
    </nav>
  );
};