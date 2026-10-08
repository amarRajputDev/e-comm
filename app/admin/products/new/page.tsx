import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/panel";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader
        title="Add product"
        description="Fill in the essentials — you can save as a draft and finish later."
      />
      <ProductForm />
    </div>
  );
}
