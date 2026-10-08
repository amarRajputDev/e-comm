import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerLinks } from "@/lib/data/site";
import { SITE } from "@/lib/tokens";
import { Wordmark } from "./logo";
import { FacebookIcon, InstagramIcon, XIcon } from "./social-icons";

const paymentMethods = ["VISA", "Mastercard", "Amex", "UPI", "Net Banking", "COD"];

const socials = [
  { label: "Instagram", href: SITE.social.instagram, icon: InstagramIcon },
  { label: "Facebook", href: SITE.social.facebook, icon: FacebookIcon },
  { label: "X", href: SITE.social.x, icon: XIcon },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="container-x">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Link href="/" className="inline-block text-[var(--ink)]">
              <Wordmark />
            </Link>
            <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--ink-3)]">
              {SITE.description}
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-3)] transition-colors duration-200 hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  <s.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <p className="mt-6 text-[13px] text-[var(--ink-3)]">
              <span className="text-[var(--ink-2)]">Customer care</span>
              <br />
              <a href={`mailto:${SITE.email}`} className="hover:text-[var(--accent)]">
                {SITE.email}
              </a>
              <br />
              {SITE.phone}
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <p className="eyebrow mb-5 text-[var(--ink)]">{heading}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[14px] text-[var(--ink-3)] transition-colors duration-200 hover:text-[var(--ink)]"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-[var(--line)] py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-[var(--ink-3)]">
            <span>© 2026 {SITE.name}. All rights reserved.</span>
            <span className="hidden h-3 w-px bg-[var(--line-strong)] lg:block" />
            <span>{SITE.policies.returns}</span>
            <span className="hidden h-3 w-px bg-[var(--line-strong)] lg:block" />
            <span>Ships worldwide from Bengaluru</span>
          </div>

          <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-[2px] border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--ink-3)]"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
