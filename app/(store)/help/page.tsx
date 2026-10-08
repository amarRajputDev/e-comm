import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { SITE } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Help & support",
  description:
    "Shipping, returns, sizing and everything else — plus how to reach a real human at ATELIER NOIR.",
  alternates: { canonical: "/help" },
};

const faqs = [
  {
    group: "Shipping",
    id: "shipping",
    items: [
      {
        id: "s1",
        title: "When will my order ship?",
        content:
          "Orders placed before 2pm IST on a working day leave our Bengaluru studio the same day. Everything else ships the next working day, and you will get a tracking link by SMS and email.",
      },
      {
        id: "s2",
        title: "How much does shipping cost?",
        content:
          "Standard delivery is free over ₹999 (₹99 below that) and takes 3–5 days. Express is ₹249 and arrives in 1–2 days. Collection from our Indiranagar studio is always free.",
      },
      {
        id: "s3",
        title: "Do you ship internationally?",
        content:
          "We ship to the UAE, Singapore and the UK. Duties are prepaid at checkout so nothing surprises you on arrival. International delivery takes 5–8 working days.",
      },
    ],
  },
  {
    group: "Returns & exchanges",
    id: "returns",
    items: [
      {
        id: "r1",
        title: "What is your return policy?",
        content:
          "30 days to change your mind on anything unworn with tags attached. Start the return from your account and we will email a prepaid label. Refunds land in 3–5 working days of the parcel reaching us.",
      },
      {
        id: "r2",
        title: "Can I exchange for a different size?",
        content:
          "Yes — size exchanges are free once per order. Pick the new size in your account and we will dispatch it as soon as the first parcel is scanned, so you are not waiting around.",
      },
      {
        id: "r3",
        title: "What about sale items?",
        content:
          "Sale pieces can be returned for store credit within 14 days. Full-price pieces are always eligible for a refund to the original payment method.",
      },
    ],
  },
  {
    group: "Sizing & care",
    id: "size",
    items: [
      {
        id: "z1",
        title: "How do I find my size?",
        content:
          "Every product page has a size guide with garment measurements taken flat. Our fits run true to size — if you are between sizes and want a relaxed silhouette, size up.",
      },
      {
        id: "z2",
        title: "How should I wash merino and cashmere?",
        content:
          "Hand wash in cold water with a wool detergent, then dry flat away from direct sun. Never tumble dry knits. A cedar block in the drawer keeps moths away.",
      },
      {
        id: "z3",
        title: "Will linen and cotton shrink?",
        content:
          "Both are pre-washed before cutting, so shrinkage is under 2%. Wash cold and line dry and the piece will keep its shape for years.",
      },
    ],
  },
  {
    group: "Orders & payment",
    id: "faq",
    items: [
      {
        id: "o1",
        title: "Which payment methods do you accept?",
        content:
          "UPI, all major credit and debit cards, net banking, wallets and cash on delivery. Every payment is processed over a PCI-DSS compliant gateway — we never see your card details.",
      },
      {
        id: "o2",
        title: "Can I change or cancel an order?",
        content:
          "Yes, within 30 minutes of ordering — just reply to your confirmation email or contact care. After that the parcel is already moving, but you can still return it free once delivered.",
      },
      {
        id: "o3",
        title: "How do I track my order?",
        content:
          "Sign in and open Orders for live tracking, or use the link in your shipping email. You will get an update at every stage: packed, shipped, out for delivery and delivered.",
      },
    ],
  },
];

const policies = [
  {
    id: "privacy",
    title: "Privacy policy",
    body: "We collect only what we need to fulfil your order: name, address, contact details and order history. We never sell personal data. Marketing emails are opt-in and every message has a one-click unsubscribe. Payment details are handled entirely by our payment processor and never touch our servers. You can request a full export or deletion of your data at any time from Settings.",
  },
  {
    id: "terms",
    title: "Terms of service",
    body: "By placing an order you confirm that the details you provide are accurate and that you are authorised to use the chosen payment method. Prices are listed in INR and include GST unless stated otherwise. We reserve the right to cancel orders affected by pricing errors or suspected fraud, with a full refund issued the same day. These terms are governed by the laws of India, with disputes subject to the courts of Bengaluru.",
  },
  {
    id: "cookies",
    title: "Cookie preferences",
    body: "We use strictly necessary cookies to keep your cart and session working, plus optional analytics cookies to understand which pages help shoppers most. Nothing is shared with advertisers. You can clear or block cookies from your browser at any time — the store still works, you will just need to re-add your bag.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    body: "We target WCAG 2.2 AA: full keyboard navigation, visible focus states, semantic headings, alt text on every image and support for prefers-reduced-motion. If something on this site blocks you, email care@ateliernoir.example.com and we will fix it — usually within two working days.",
  },
];

export default function HelpPage() {
  return (
    <div className="container-x pb-24 pt-10 md:pt-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Help" }]} />

      <header className="mt-6 border-b border-[var(--line)] pb-9">
        <p className="eyebrow text-[var(--accent)]">Support</p>
        <h1 className="h1 mt-4 max-w-2xl text-[var(--ink)]">How can we help?</h1>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[var(--ink-3)]">
          Answers to the questions we get most — and a real person if you need one.
        </p>
      </header>

      {/* quick contact */}
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Mail, k: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
          { icon: Phone, k: "Phone", v: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
          { icon: MessageCircle, k: "Live chat", v: "Mon–Sat, 10–19 IST", href: "#contact" },
          { icon: MapPin, k: "Studio", v: "Indiranagar, Bengaluru", href: "#contact" },
        ].map((c) => (
          <a
            key={c.k}
            href={c.href}
            className="group flex items-start gap-3 border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--ink)]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)] transition-colors group-hover:text-[var(--accent)]">
              <c.icon size={16} strokeWidth={1.6} />
            </span>
            <span>
              <span className="block text-[11.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                {c.k}
              </span>
              <span className="mt-1 block text-[14px] text-[var(--ink)]">{c.v}</span>
            </span>
          </a>
        ))}
      </div>

      {/* FAQ groups */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label="Help topics" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <p className="eyebrow mb-4 text-[var(--ink-3)]">Topics</p>
          <ul className="space-y-2.5">
            {faqs.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="text-[14px] text-[var(--ink-2)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
                >
                  {g.group}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a
                href="#contact"
                className="text-[14px] text-[var(--ink-2)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
              >
                Contact us
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-12">
          {faqs.map((group) => (
            <Reveal key={group.id} delay={0.04}>
              <section id={group.id} className="scroll-mt-32">
                <h2 className="h3 text-[var(--ink)]">{group.group}</h2>
                <div className="mt-5">
                  <Accordion items={group.items} />
                </div>
              </section>
            </Reveal>
          ))}

          {/* contact */}
          <Reveal>
            <section id="contact" className="scroll-mt-32 border border-[var(--line)] bg-[var(--surface)] p-7">
              <h2 className="h3">Talk to a human</h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-3)]">
                Our care team answers in under four working hours — usually much faster. No bots,
                no ticket numbers.
              </p>
              <dl className="mt-6 grid gap-5 sm:grid-cols-3">
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  <div>
                    <dt className="text-[12.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                      Hours
                    </dt>
                    <dd className="mt-1 text-[14px] text-[var(--ink)]">{SITE.policies.support}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  <div>
                    <dt className="text-[12.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                      Email
                    </dt>
                    <dd className="mt-1 text-[14px] text-[var(--ink)]">{SITE.email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  <div>
                    <dt className="text-[12.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                      Studio
                    </dt>
                    <dd className="mt-1 text-[14px] text-[var(--ink)]">Indiranagar, Bengaluru</dd>
                  </div>
                </div>
              </dl>
            </section>
          </Reveal>

          {/* policies */}
          <div className="space-y-10">
            {policies.map((p) => (
              <Reveal key={p.id} delay={0.04}>
                <section id={p.id} className="scroll-mt-32">
                  <h2 className="h3 text-[var(--ink)]">{p.title}</h2>
                  <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-3)]">
                    {p.body}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>

          <div className="border-t border-[var(--line)] pt-8">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center rounded-[2px] bg-[var(--ink)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
            >
              Back to shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
