"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Check,
  ShoppingBag,
  Lock,
} from "lucide-react";
import { useCart, useSession } from "@/lib/store/providers";
import { placeOrder } from "@/lib/services/orders";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StepIndicator, CHECKOUT_STEPS } from "./step-indicator";
import { OrderSummary } from "@/components/cart/order-summary";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Img } from "@/components/ui/img";

interface FormState {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

const INDIA_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const PAYMENT_OPTIONS = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "netbanking", label: "Net banking", hint: "All major banks", icon: Landmark },
  { id: "cod", label: "Cash on delivery", hint: "Pay when it arrives", icon: Banknote },
] as const;

type PaymentId = (typeof PAYMENT_OPTIONS)[number]["id"];

function Field({
  id,
  label,
  error,
  className,
  children,
  span,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  span?: "full" | "half";
}) {
  return (
    <div className={cn(span === "full" ? "sm:col-span-2" : "", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-[12.5px] text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40";

const inputErr =
  "!border-[var(--danger)] focus:!border-[var(--danger)] focus:!ring-[var(--danger)]/30";

export function CheckoutView() {
  const router = useRouter();
  const { lines, totals, hydrated, couponCode, shippingMethod, setShippingMethod, clear } =
    useCart();
  const { user } = useSession();

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | string, string>>>({});
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [payment, setPayment] = useState<PaymentId>("upi");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      email: prev.email || user.email,
      firstName: prev.firstName || user.name.split(" ")[0],
      lastName: prev.lastName || user.name.split(" ").slice(1).join(" "),
      phone: prev.phone || user.phone || "",
    }));
  }, [user]);

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]" role="status" aria-label="Loading checkout">
        <div className="space-y-5">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--ink-3)]">
          <ShoppingBag size={22} strokeWidth={1.4} />
        </div>
        <h1 className="h2 mt-6">Your bag is empty</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-3)]">
          Add a piece or two before heading to checkout.
        </p>
        <Button href="/shop" size="lg" className="mt-7">
          Browse the collection
        </Button>
      </div>
    );
  }

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateInformation = () => {
    const e: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{8,}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim()) e.lastName = "Required.";
    if (!form.address1.trim()) e.address1 = "Required.";
    if (!form.city.trim()) e.city = "Required.";
    if (!form.state) e.state = "Select a state.";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit PIN code.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (payment === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) e.cardNumber = "16-digit card number.";
      if (!card.name.trim()) e.cardName = "Name on card.";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/YY.";
      if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = "3-digit code.";
    }
    if (payment === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId))
      e.upiId = "Enter a valid UPI ID, e.g. name@okhdfc";
    if (payment === "netbanking" && !bank) e.bank = "Choose your bank.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const place = async () => {
    if (!validatePayment()) return;
    setBusy(true);
    try {
      await placeOrder({
        items: lines.map((l) => ({
          productSlug: l.productSlug,
          name: l.name,
          image: l.image,
          variantLabel: l.variantLabel,
          price: l.price,
          quantity: l.quantity,
        })),
        contact: { email: form.email, phone: form.phone },
        address: {
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          line1: form.address1,
          line2: form.address2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        shippingMethod,
        paymentMethod: payment,
        totals: {
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          total: totals.total,
        },
        couponCode: couponCode || undefined,
      });
      clear();
      router.push("/checkout/success");
    } finally {
      setBusy(false);
    }
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0 && !validateInformation()) return;
    if (step === 1) {
      setStep(2);
      return;
    }
    place();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div>
        <div className="mb-9">
          <StepIndicator current={step} />
        </div>

        <form onSubmit={next} noValidate>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
                    Contact
                  </h2>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <Field id="email" label="Email address" error={errors.email} span="full">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@example.com"
                        className={cn(inputCls, errors.email && inputErr)}
                      />
                    </Field>
                    <Field id="phone" label="Phone" error={errors.phone} span="full">
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className={cn(inputCls, errors.phone && inputErr)}
                      />
                    </Field>
                  </div>
                </section>

                <section>
                  <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
                    Shipping address
                  </h2>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <Field id="firstName" label="First name" error={errors.firstName}>
                      <input
                        id="firstName"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        className={cn(inputCls, errors.firstName && inputErr)}
                      />
                    </Field>
                    <Field id="lastName" label="Last name" error={errors.lastName}>
                      <input
                        id="lastName"
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                        className={cn(inputCls, errors.lastName && inputErr)}
                      />
                    </Field>
                    <Field
                      id="address1"
                      label="Address"
                      error={errors.address1}
                      span="full"
                    >
                      <input
                        id="address1"
                        autoComplete="address-line1"
                        value={form.address1}
                        onChange={(e) => set("address1", e.target.value)}
                        placeholder="Flat / house number, street"
                        className={cn(inputCls, errors.address1 && inputErr)}
                      />
                    </Field>
                    <Field id="address2" label="Apartment, landmark (optional)" span="full">
                      <input
                        id="address2"
                        autoComplete="address-line2"
                        value={form.address2}
                        onChange={(e) => set("address2", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field id="city" label="City" error={errors.city}>
                      <input
                        id="city"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        className={cn(inputCls, errors.city && inputErr)}
                      />
                    </Field>
                    <Field id="state" label="State" error={errors.state}>
                      <Select
                        id="state"
                        value={form.state}
                        onChange={(e) => set("state", e.target.value)}
                        className={cn(errors.state && inputErr)}
                      >
                        <option value="">Select state</option>
                        {INDIA_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field id="pincode" label="PIN code" error={errors.pincode}>
                      <input
                        id="pincode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={form.pincode}
                        onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
                        placeholder="560038"
                        className={cn(inputCls, errors.pincode && inputErr)}
                      />
                    </Field>
                    <Field id="notes" label="Delivery notes (optional)">
                      <input
                        id="notes"
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        placeholder="Ring the bell twice"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </section>
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
                  Delivery method
                </h2>
                <div className="mt-4 space-y-3">
                  {(
                    [
                      { id: "standard", title: "Standard delivery", detail: "3–5 business days", price: totals.subtotal >= 999 ? "Free" : money(99) },
                      { id: "express", title: "Express delivery", detail: "1–2 business days", price: money(249) },
                      { id: "pickup", title: "Collect in store", detail: "Indiranagar, Bengaluru · ready in 2 hours", price: "Free" },
                    ] as const
                  ).map((option) => {
                    const active = shippingMethod === option.id;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-[2px] border p-4 transition-colors",
                          active
                            ? "border-[var(--ink)] bg-[var(--surface)]"
                            : "border-[var(--line-strong)] hover:border-[var(--ink-3)]",
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          className="peer sr-only"
                          checked={active}
                          onChange={() => setShippingMethod(option.id)}
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border transition-all",
                            active ? "border-[var(--accent)]" : "border-[var(--line-strong)]",
                          )}
                        >
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full bg-[var(--accent)] transition-transform",
                              active ? "scale-100" : "scale-0",
                            )}
                          />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-medium text-[var(--ink)]">
                            {option.title}
                          </span>
                          <span className="block text-[13px] text-[var(--ink-3)]">
                            {option.detail}
                          </span>
                        </span>
                        <span className="text-[14.5px] font-medium tabular-nums text-[var(--ink)]">
                          {option.price}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[2px] border border-[var(--line)] bg-[var(--surface-2)] p-4 text-[13.5px] leading-relaxed text-[var(--ink-2)]">
                  Delivering to{" "}
                  <span className="font-medium text-[var(--ink)]">
                    {form.address1}, {form.city}, {form.state} {form.pincode}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="mt-2 block text-[12.5px] text-[var(--accent)] underline underline-offset-4"
                  >
                    Edit address
                  </button>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-7"
              >
                <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
                  Payment
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PAYMENT_OPTIONS.map((option) => {
                    const active = payment === option.id;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-[2px] border p-4 transition-colors",
                          active
                            ? "border-[var(--ink)] bg-[var(--surface)]"
                            : "border-[var(--line-strong)] hover:border-[var(--ink-3)]",
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          className="sr-only"
                          checked={active}
                          onChange={() => setPayment(option.id)}
                        />
                        <option.icon
                          size={18}
                          strokeWidth={1.5}
                          className={active ? "text-[var(--accent)]" : "text-[var(--ink-3)]"}
                        />
                        <span>
                          <span className="block text-[14.5px] font-medium text-[var(--ink)]">
                            {option.label}
                          </span>
                          <span className="block text-[12.5px] text-[var(--ink-3)]">
                            {option.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={payment}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {payment === "card" ? (
                      <div className="grid gap-5 rounded-[2px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:grid-cols-2">
                        <Field id="cardNumber" label="Card number" error={errors.cardNumber} span="full">
                          <input
                            id="cardNumber"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={card.number}
                            onChange={(e) =>
                              setCard((p) => ({
                                ...p,
                                number: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 16)
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim(),
                              }))
                            }
                            placeholder="4242 4242 4242 4242"
                            className={cn(inputCls, errors.cardNumber && inputErr)}
                          />
                        </Field>
                        <Field id="cardName" label="Name on card" error={errors.cardName} span="full">
                          <input
                            id="cardName"
                            autoComplete="cc-name"
                            value={card.name}
                            onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                            className={cn(inputCls, errors.cardName && inputErr)}
                          />
                        </Field>
                        <Field id="expiry" label="Expiry" error={errors.expiry}>
                          <input
                            id="expiry"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={card.expiry}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                              const formatted =
                                digits.length > 2
                                  ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                                  : digits;
                              setCard((p) => ({ ...p, expiry: formatted }));
                            }}
                            placeholder="09/28"
                            className={cn(inputCls, errors.expiry && inputErr)}
                          />
                        </Field>
                        <Field id="cvc" label="CVC" error={errors.cvc}>
                          <input
                            id="cvc"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={card.cvc}
                            onChange={(e) =>
                              setCard((p) => ({
                                ...p,
                                cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                              }))
                            }
                            placeholder="123"
                            className={cn(inputCls, errors.cvc && inputErr)}
                          />
                        </Field>
                      </div>
                    ) : null}

                    {payment === "upi" ? (
                      <div className="rounded-[2px] border border-[var(--line)] bg-[var(--surface)] p-5">
                        <Field id="upiId" label="UPI ID" error={errors.upiId}>
                          <input
                            id="upiId"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@okhdfc"
                            className={cn(inputCls, errors.upiId && inputErr)}
                          />
                        </Field>
                        <p className="mt-3 text-[13px] text-[var(--ink-3)]">
                          A collect request will be sent to your UPI app. This is a demo — no
                          real payment is taken.
                        </p>
                      </div>
                    ) : null}

                    {payment === "netbanking" ? (
                      <div className="rounded-[2px] border border-[var(--line)] bg-[var(--surface)] p-5">
                        <Field id="bank" label="Choose your bank" error={errors.bank}>
                          <Select
                            id="bank"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            className={cn(errors.bank && inputErr)}
                          >
                            <option value="">Select bank</option>
                            {[
                              "HDFC Bank",
                              "ICICI Bank",
                              "State Bank of India",
                              "Axis Bank",
                              "Kotak Mahindra",
                              "IDFC First",
                            ].map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      </div>
                    ) : null}

                    {payment === "cod" ? (
                      <div className="rounded-[2px] border border-[var(--line)] bg-[var(--surface)] p-5 text-[14px] leading-relaxed text-[var(--ink-2)]">
                        Pay the courier in cash or by UPI when your order arrives. Please keep
                        exact change handy — our partners carry limited float.
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* actions */}
          <div className="mt-9 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            <button
              type="button"
              onClick={() => (step === 0 ? router.push("/cart") : setStep(step - 1))}
              className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
            >
              <ArrowLeft size={14} /> {step === 0 ? "Return to bag" : "Back"}
            </button>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={busy}
              iconEnd={<ArrowRight size={15} />}
            >
              {step === 2 ? `Pay ${money(totals.total)}` : "Continue"}
            </Button>
          </div>
        </form>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            Order summary
          </h2>

          <ul className="mb-5 max-h-72 space-y-4 overflow-y-auto pr-1">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-3.5">
                <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-[var(--surface-2)]">
                  <Img sizes="64px" width={128} height={160} src={line.image} alt={line.name} className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-semibold text-[var(--bg)]">
                    {line.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] text-[var(--ink)]">{line.name}</span>
                  <span className="block truncate text-[12.5px] text-[var(--ink-3)]">
                    {line.variantLabel}
                  </span>
                </span>
                <span className="text-[14px] tabular-nums text-[var(--ink)]">
                  {money(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <OrderSummary showProgress={false} />
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-[var(--ink-3)]">
          <Lock size={13} strokeWidth={1.6} />
          Payments are encrypted and never stored on our servers.
        </p>
      </aside>
    </div>
  );
}

export { CHECKOUT_STEPS };

export function ConfirmationIcon() {
  return (
    <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--success)]/12 text-[var(--success)]">
      <Check size={30} strokeWidth={2} />
    </span>
  );
}
