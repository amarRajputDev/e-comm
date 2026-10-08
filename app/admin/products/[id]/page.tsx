import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/panel";
import { products } from "@/lib/data/products";

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params;
  const product = products.find((p) => p.slug === id || p.id === id);
  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title={product.name}
        description={`Last updated ${new Date(product.updatedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })} · ${product.reviewCount} reviews · ${product.sold.toLocaleString("en-IN")} sold`}
      />
      <ProductForm product={product} />
    </div>
  );
}
