import Link from "next/link";
import { Heart } from "lucide-react";
import { instagramPosts } from "@/lib/data/site";
import { SITE } from "@/lib/tokens";
import { SectionHeading } from "@/components/shared/section";
import { InstagramIcon } from "@/components/layout/social-icons";
import { Img } from "@/components/ui/img";

export function InstagramGrid() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="@ateliernoir"
          title="See it worn."
          description="Real customers, real rooms, real weather. Tag us and we will send you a code."
          action={{ label: "Follow us", href: SITE.social.instagram }}
          align="between"
        />

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative aspect-square overflow-hidden bg-[var(--surface-2)]"
              aria-label={`Instagram post: ${post.alt}`}
            >
              <Img
                src={post.src}
                alt={post.alt}
                width={900}
                height={900}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="h-full w-full transition-transform duration-[700ms] ease-out group-hover:scale-[1.08]"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--overlay)] opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                <InstagramIcon size={22} className="text-white" />
                <span className="inline-flex items-center gap-1.5 text-[12.5px] text-white/90">
                  <Heart size={13} fill="currentColor" strokeWidth={0} />
                  {post.likes.toLocaleString("en-IN")}
                </span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-[var(--ink-3)]">
          Want to be featured?{" "}
          <Link
            href="/help"
            className="text-[var(--ink)] underline underline-offset-4 hover:text-[var(--accent)]"
          >
            Read our community guidelines
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
