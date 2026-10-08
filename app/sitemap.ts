import type { MetadataRoute } from "next";
import { products } from "@/lib/data/products";
import { COLLECTIONS } from "@/lib/data/products";
import { SITE } from "@/lib/tokens";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/story`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/cart`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const collections: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${SITE.url}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE.url}/product/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...collections, ...productRoutes];
}
