import { useEffect, useState } from "react";
import { apiRequest } from "@/api/apiClient";
import { DataTable, ColumnDef, PaginationData } from "./DataTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  url: string;
  columns: ColumnDef<any>[];
}

export function GenericSubResourceTable({ url, columns }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [url, page, limit, debouncedSearch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sep = url.includes("?") ? "&" : "?";
      const fullUrl = `${url}${sep}page=${page}&limit=${limit}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`;
      const response = await apiRequest<any>({
        method: "GET",
        url: fullUrl,
      });
      if (response?.data?.[0]) {
        const result = response.data[0];
        setData(result.data || []);
        setPagination({
          total: result.total || 0,
          page: result.page || 1,
          limit: result.limit || limit,
          totalPages: result.totalPages || 1,
        });
      } else {
        setData([]);
      }
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          keyExtractor={(item) => item._id}
        />
      </div>
    </div>
  );
}
