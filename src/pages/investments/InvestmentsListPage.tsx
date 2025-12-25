// src/pages/investments/InvestmentsListPage.tsx
import { useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  TextInput,
  Select,
  Pagination,
} from "flowbite-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useInvestments } from "../../hooks/useInvestments";
import type { InvestmentListFilter } from "../../hooks/useInvestments";
import {
  useInvestmentTypeOptions,
  useInvestmentStatusOptions,
} from "../../hooks/useConfigurations";
import { EditInvestmentModal } from "./EditInvestmentModal";
import apiClient from "../../lib/apiClient";
import type { InvestmentListItemDto } from "../../hooks/useInvestments";

export default function InvestmentsListPage() {
  const navigate = useNavigate();

  // Filters/sort/pagination state
  const [filter, setFilter] = useState<InvestmentListFilter>({
    search: "",
    type: null,
    status: null,
    fromDate: null,
    toDate: null,
    minGainLossPercent: null,
    maxGainLossPercent: null,
    sortBy: "Date",
    sortDirection: "DESC",
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError } = useInvestments(filter);
  const typeOptions = useInvestmentTypeOptions();
  const statusOptions = useInvestmentStatusOptions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.info("No investments selected.");
      return;
    }
    try {
      await apiClient.delete("/investments", { data: { ids: selectedIds } });
      toast.success("Selected investments deleted.");
      setSelectedIds([]);
      // Optionally invalidate the query if not configured globally
      // queryClient.invalidateQueries({ queryKey: ["investments"] });
    } catch {
      toast.error("Delete failed.");
    }
  };

  const exportCsv = async () => {
    try {
      const resp = await apiClient.get("/investments/export", {
        params: filter,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(resp.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investments_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed.");
    }
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700">Investments</h1>
        <div className="flex gap-3">
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={() => {
              setEditId(null); // ensures add mode
              setIsEditOpen(true);
            }}
          >
            + Add Investment
          </Button>

          <Button color="gray" onClick={exportCsv}>
            Export CSV
          </Button>

          {/* Delete button with stronger red background */}
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={bulkDelete}
          >
            Delete Selected
          </Button>

        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <TextInput
          placeholder="Search by name"
          value={filter.search ?? ""}
          onChange={(e) => setFilter((f: InvestmentListFilter) => ({ ...f, search: e.target.value, page: 1 }))}
        />
        <Select
          value={filter.type ?? ""}
          onChange={(e) => setFilter((f: InvestmentListFilter) => ({ ...f, type: e.target.value || null, page: 1 }))}
        >
          <option value="">All Types</option>
          {typeOptions.map((o: { label: string; value: string }) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select
          value={filter.status ?? ""}
          onChange={(e) => setFilter((f: InvestmentListFilter) => ({ ...f, status: e.target.value || null, page: 1 }))}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((o: { label: string; value: string }) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <TextInput
          type="date"
          value={filter.fromDate ?? ""}
          onChange={(e) =>
            setFilter((f: InvestmentListFilter) => ({ ...f, fromDate: e.target.value || null, page: 1 }))
          }
        />
        <TextInput
          type="date"
          value={filter.toDate ?? ""}
          onChange={(e) => setFilter((f: InvestmentListFilter) => ({ ...f, toDate: e.target.value || null, page: 1 }))}
        />
        <div className="flex gap-2">
          <TextInput
            placeholder="Min Gain/Loss %"
            value={filter.minGainLossPercent?.toString() ?? ""}
            onChange={(e) =>
              setFilter((f: InvestmentListFilter) => ({
                ...f,
                minGainLossPercent: e.target.value ? Number(e.target.value) : null,
                page: 1,
              }))
            }
          />
          <TextInput
            placeholder="Max Gain/Loss %"
            value={filter.maxGainLossPercent?.toString() ?? ""}
            onChange={(e) =>
              setFilter((f: InvestmentListFilter) => ({
                ...f,
                maxGainLossPercent: e.target.value ? Number(e.target.value) : null,
                page: 1,
              }))
            }
          />
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-3">
        <Select
          value={filter.sortBy}
          onChange={(e) => setFilter((f: InvestmentListFilter) => ({ ...f, sortBy: e.target.value as any }))}
        >
          <option value="Amount">Amount</option>
          <option value="CurrentValue">Current Value</option>
          <option value="GainLoss">Gain/Loss %</option>
          <option value="Date">Date</option>
        </Select>
        <Select
          value={filter.sortDirection}
          onChange={(e) =>
            setFilter((f: InvestmentListFilter) => ({ ...f, sortDirection: e.target.value as any }))
          }
        >
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={
                    data?.items?.length ? selectedIds.length === data.items.length : false
                  }
                  onChange={(e) => {
                    if (data?.items) {
                      setSelectedIds(
                        e.target.checked ? data.items.map((i: InvestmentListItemDto) => i.investmentId) : []
                      );
                    }
                  }}
                />
              </TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Amount</TableHeadCell>
              <TableHeadCell>Current Value</TableHeadCell>
              <TableHeadCell>Gain/Loss %</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Edit</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9}>Loading...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={9}>Failed to load investments.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && data?.items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={9}>No investments found.</TableCell>
              </TableRow>
            )}
            {data?.items?.map((i: InvestmentListItemDto) => (
              <TableRow
                key={i.investmentId}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/investments/${i.investmentId}`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={!!selectedIds.find((x) => x === i.investmentId)}
                    onChange={(e) => toggleSelect(i.investmentId, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>{i.amount.toFixed(2)}</TableCell>
                <TableCell>{i.currentValue.toFixed(2)}</TableCell>
                <TableCell>{i.gainLossPercent.toFixed(2)}</TableCell>
                <TableCell>{i.purchaseDate}</TableCell>
                <TableCell>{i.status}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button size="xs" color="gray" onClick={() => openEdit(i.investmentId)}>
                    ✏️
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination
          currentPage={filter.page ?? 1}
          totalPages={Math.max(1, Math.ceil((data?.totalCount ?? 0) / (filter.pageSize ?? 10)))}
          onPageChange={(p) => setFilter((f: InvestmentListFilter) => ({ ...f, page: p }))}
          showIcons
        />
      </div>

      {/* Add/Edit modal */}
      <EditInvestmentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        investmentId={editId}
      />
    </div>
  );
}