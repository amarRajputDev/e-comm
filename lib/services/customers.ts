import type { Customer } from "@/types";
import { customers as source, customerMap } from "@/lib/data/customers";

export async function getCustomers(): Promise<Customer[]> {
  return source;
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  return customerMap[id];
}

export interface CustomerQuery {
  q?: string;
  status?: Customer["status"] | "all";
  page?: number;
  perPage?: number;
}

export async function queryCustomers(query: CustomerQuery = {}) {
  const perPage = query.perPage ?? 8;
  const page = Math.max(1, query.page ?? 1);
  const q = query.q?.trim().toLowerCase() ?? "";

  const items = source.filter((c) => {
    if (query.status && query.status !== "all" && c.status !== query.status) return false;
    if (!q) return true;
    return [c.name, c.email, c.city].join(" ").toLowerCase().includes(q);
  });

  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    total: items.length,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(items.length / perPage)),
  };
}
