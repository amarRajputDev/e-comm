import { OrdersView } from "@/components/admin/orders-view";

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const params = await props.searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  return <OrdersView initialQuery={q} />;
}
