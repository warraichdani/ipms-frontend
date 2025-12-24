import { Dropdown, DropdownItem } from "flowbite-react";
import { useAuth } from "../hooks/useAuth";
import { Avatar } from "./Avatar";

export const UserMenu = () => {
    const { logout } = useAuth();

    return (
        <Dropdown
            inline
            placement="bottom-end"
            label={
                <Avatar />
            }
        >
            
            <DropdownItem
                disabled
                className="cursor-default text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {"Profile"}
            </DropdownItem>

            {/* Divider */}
            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            {/* Logout */}
            <DropdownItem
                onClick={logout}
                className="text-red-600 dark:text-red-400"
            >
                {"Logout"}
            </DropdownItem>
        </Dropdown>
    );
};