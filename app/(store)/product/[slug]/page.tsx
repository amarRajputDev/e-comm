import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ReviewsSection } from "@/components/product/reviews-section";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getProduct, getRelatedProducts } from "@/lib/services/products";
import { getProductReviews } from "@/lib/services/reviews";
import { products as allProducts } from "@/lib/data/products";
import { SITE } from "@/lib/tokens";

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.shortDescription}`,
    description: product.seo.description,
    keywords: product.tags,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description: product.shortDescription,
      images: [{ url: product.images[0]?.src, width: 1200, height: 1500 }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(slug, 4),
    getProductReviews(product.id),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((i) => `${SITE.url}${i.src}`),
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <div className="container-x pb-24 pt-8 md:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <ProductGallery
          images={product.images}
          name={product.name}
          priority
        />
        <ProductInfo product={product} />
      </div>

      <div className="mt-20">
        <ReviewsSection
          reviews={reviews}
          product={{ id: product.id, name: product.name, slug: product.slug }}
        />
      </div>

      <section className="mt-24 border-t border-[var(--line)] pt-14">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow text-[var(--accent)]">You may also like</p>
            <h2 className="h2 mt-4 text-[var(--ink)]">Complete the look</h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
          >
            Shop everything
          </Link>
        </div>
        <ProductGrid products={related} columns={4} />
      </section>
    </div>
  );
}
