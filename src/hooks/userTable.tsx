// src/components/UserTable.tsx
import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Button,
    TextInput,
    Modal,
    ModalBody,
    ModalHeader
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useUsers, type UserDto } from "../hooks/useUsers";
import apiClient from "../lib/apiClient";
import { toast } from "react-toastify";

type Props = {
    height?: string; // e.g. "h-[400px]"
    scroll?: boolean;
};

export default function UserTable({ height = "h-[400px]", scroll = true }: Props) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading } = useUsers(search, page, pageSize);

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [users, setUsers] = useState<UserDto[]>([]);
    useEffect(() => {
        if (data?.items) {
            setUsers(data.items);
        }
    }, [data]);

    const handleDeactivate = async (userId: string) => {
        try {
            await apiClient.put(`/users/${userId}/toggle-active`);
            setUsers((prev) =>
                prev.map((u) =>
                    u.userId === userId ? { ...u, isActive: !u.isActive } : u
                )
            );

            toast.success("User status updated");
        } catch {
            toast.error("Failed to deactivate user");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await apiClient.delete(`/users/${userId}/soft-delete`);
            toast.success("User deleted");
        } catch {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col ${height}`}>
            {/* Search */}
            <div className="p-4 flex justify-between items-center">
                <TextInput
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                />
            </div>

            {/* Table */}
            <div className={`flex-1 ${scroll ? "overflow-y-auto" : ""}`}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <Table>
                        <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                            <TableRow>
                                <TableHeadCell>Email</TableHeadCell>
                                <TableHeadCell>First Name</TableHeadCell>
                                <TableHeadCell>Last Name</TableHeadCell>
                                <TableHeadCell>Active</TableHeadCell>
                                <TableHeadCell>Actions</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {data?.items.map((u) => (
                                <TableRow
                                    key={u.userId}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedUser(u)} // ✅ row click opens modal
                                >
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.firstName}</TableCell>
                                    <TableCell>{u.lastName ?? "-"}</TableCell>
                                    <TableCell>
                                        {/* ✅ Stop propagation so row click doesn’t fire */}
                                        <input
                                            type="checkbox"
                                            checked={u.isActive}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleDeactivate(u.userId)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* ✅ Stop propagation + red delete button */}
                                        <Button
                                            color="failure" // Flowbite red
                                            size="xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(u.userId);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data?.items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 p-3 border-t">
                {Array.from({ length: Math.ceil((data?.totalCount ?? 0) / pageSize) }, (_, i) => i + 1).map(
                    (p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded ${p === page ? "bg-brand-600 text-white" : "bg-gray-200 dark:bg-gray-600"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            {/* User Details Modal (stub for now) */}
            <Modal show={!!selectedUser} onClose={() => setSelectedUser(null)}>
                <ModalHeader>User Details</ModalHeader>
                <ModalBody>
                    <p>Email: {selectedUser?.email}</p>
                    <p>Name: {selectedUser?.firstName} {selectedUser?.lastName}</p>
                    <p>Active: {selectedUser?.isActive ? "Yes" : "No"}</p>
                    {/* Later: replace with full user detail view */}
                </ModalBody>
            </Modal>
        </div>
    );
}