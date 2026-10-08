import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { HomeSections } from "@/components/home/home-sections";
import { SITE } from "@/lib/tokens";

export const metadata: Metadata = {
  title: `${SITE.name} — Premium essentials for everyday icons`,
  description:
    "Shop premium everyday essentials: heavyweight tees, merino knitwear, tailored trousers and full-grain leather accessories. Free shipping over ₹999, 30-day returns.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}
