import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-men",
    slug: "men",
    name: "Men",
    tagline: "Considered layers for the everyday",
    description:
      "Structured outerwear, heavyweight knits and trousers cut with room to move — designed to be worn on rotation for years, not seasons.",
    image: {
      src: "/img/categories/men.jpg",
      alt: "Man in a tailored charcoal overcoat standing against a concrete wall",
    },
    order: 1,
    featured: true,
    subcategories: ["Shirts", "T-Shirts", "Knitwear", "Trousers", "Outerwear", "Denim"],
  },
  {
    id: "cat-women",
    slug: "women",
    name: "Women",
    tagline: "Quiet tailoring, honest fabric",
    description:
      "Fluid tailoring and elevated basics in natural fibres — a wardrobe built around proportion, texture and a palette that never fights itself.",
    image: {
      src: "/img/categories/women.jpg",
      alt: "Woman wearing a bone-white trench coat in soft daylight",
    },
    order: 2,
    featured: true,
    subcategories: ["Dresses", "Knitwear", "Shirts", "Trousers", "Coats", "Tops"],
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    tagline: "The finishing details",
    description:
      "Full-grain leather, brushed steel and acetate — small objects made with the same rigour as the garments they accompany.",
    image: {
      src: "/img/categories/accessories.jpg",
      alt: "Leather tote, sunglasses and a watch arranged on a warm stone surface",
    },
    order: 3,
    featured: true,
    subcategories: ["Bags", "Watches", "Eyewear", "Belts", "Scarves", "Footwear"],
  },
  {
    id: "cat-new",
    slug: "new-arrivals",
    name: "New Arrivals",
    tagline: "The season ahead",
    description:
      "Fresh silhouettes and new fabrications, added to the collection every fortnight.",
    image: {
      src: "/img/categories/new-arrivals.jpg",
      alt: "Rail of newly released garments in a bright studio",
    },
    order: 4,
    featured: true,
    subcategories: ["This Week", "Pre-Order", "Limited Runs"],
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<string, Category>;

export function getCategory(slug: string) {
  return categoryMap[slug];
}
