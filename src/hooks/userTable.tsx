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
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    height?: string; // e.g. "h-[400px]"
    scroll?: boolean;
};

export default function UserTable({ height = "h-[300px]", scroll = true }: Props) {
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
    // Optimistically flip state
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId ? { ...u, isActive: !u.isActive } : u
      )
    );

    try {
      await apiClient.put(`/users/${userId}/toggle-active`);
      toast.success("User status updated");
    } catch {
      // Rollback if API fails
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === userId ? { ...u, isActive: !u.isActive } : u
        )
      );
      toast.error("Failed to update user status");
    }
  };

  const qc = useQueryClient();
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.delete(`/users/${userId}/soft-delete`);
      toast.success("User deleted");

      // ✅ Trigger refetch
      qc.invalidateQueries({ queryKey: ["users"] });
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const totalPages = Math.ceil((data?.totalCount ?? 0) / pageSize);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col ${height}`}>
      {/* Title */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-brand-700">User Management</h2>
      </div>

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
              {users.map((u) => (
                <TableRow
                  key={u.userId}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedUser(u)}
                >
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.firstName}</TableCell>
                  <TableCell>{u.lastName ?? "-"}</TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={u.isActive}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleDeactivate(u.userId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      color="failure"
                      size="xs"
                      className="font-semibold"
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
              {users.length === 0 && (
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

      {/* Pagination (only if > 1 page) */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 p-3 border-t">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page ? "bg-brand-600 text-white" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        show={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        dismissible
      >
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