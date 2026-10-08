import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/account/order-detail";
import { getOrder } from "@/lib/services/orders";

export async function generateMetadata(
  props: PageProps<"/account/orders/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  return { title: `Order ${id}`, robots: { index: false, follow: false } };
}

export default async function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();
  return <OrderDetail order={order} />;
}
