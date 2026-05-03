import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationData | null;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  emptyMessage = "No results found.",
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="flex-1 bg-[#09090b] border border-white/5 rounded-xl flex flex-col h-full min-h-0 relative shadow-lg">
      <div className="overflow-auto flex-1 relative">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-[#09090b] sticky top-0 z-20 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
            <tr className="border-none">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`h-12 px-4 text-left align-middle font-medium text-zinc-400 whitespace-nowrap bg-[#09090b] ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {loading ? (
              Array.from({ length: pagination?.limit || 10 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className={`p-4 align-middle whitespace-nowrap ${col.className || ''}`}>
                      <Skeleton className="h-6 w-full rounded-md bg-white/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 h-32 text-center text-zinc-500 align-middle">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={keyExtractor(item)} 
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                >
                  {columns.map((col, i) => (
                    <td key={i} className={`p-4 align-middle whitespace-nowrap ${col.className || ''}`}>
                      {col.cell ? col.cell(item) : (col.accessorKey ? String(item[col.accessorKey as keyof T]) : null)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#09090b] shrink-0 z-10">
          <div className="text-sm text-zinc-500 hidden sm:block">
            Showing <span className="text-zinc-300 font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="text-zinc-300 font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-zinc-300 font-medium">{pagination.total}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50"
              onClick={() => onPageChange?.(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1 || loading}
            >
              <ChevronLeft size={14} className="mr-1" /> Prev
            </Button>
            <div className="flex items-center gap-1 hidden sm:flex">
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, idx) => {
                let pageNum = idx + 1;
                if (pagination.totalPages > 5) {
                  if (pagination.page <= 3) {
                    pageNum = idx + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + idx;
                  } else {
                    pageNum = pagination.page - 2 + idx;
                  }
                }

                return (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 border-white/10 ${
                      pagination.page === pageNum
                        ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                        : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => onPageChange?.(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50"
              onClick={() => onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
