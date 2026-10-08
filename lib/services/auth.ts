import type { UserProfile } from "@/types";

/**
 * Mock authentication. The shape mirrors a REST/Supabase session so it can be
 * replaced with a real provider without touching components.
 *
 * NOTE: this is a demo session only — real authorisation must be enforced
 * server-side (see lib/services/auth note in app/admin/layout.tsx).
 */

const DEMO_ACCOUNTS: (UserProfile & { password: string })[] = [
  {
    id: "cus-amar",
    name: "Amar Verma",
    email: "amar.verma@example.com",
    role: "customer",
    phone: "+91 98450 21140",
    initials: "AV",
    joinedAt: "2024-03-12T09:00:00.000Z",
    rewards: 2480,
    password: "demo1234",
  },
  {
    id: "adm-root",
    name: "Nisha Kulkarni",
    email: "admin@ateliernoir.example.com",
    role: "admin",
    initials: "NK",
    joinedAt: "2023-08-01T09:00:00.000Z",
    rewards: 0,
    password: "admin1234",
  },
];

const STORAGE_KEY = "an.session";

export type AuthResult =
  | { ok: true; user: UserProfile | null }
  | { ok: false; message: string };

function strip(user: UserProfile & { password?: string }): UserProfile {
  const { password: _password, ...rest } = user;
  return rest;
}

function readSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function writeSession(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — session stays in memory */
  }
}

let memorySession: UserProfile | null = null;

export function getSession(): UserProfile | null {
  memorySession ??= readSession();
  return memorySession;
}

export function setSession(user: UserProfile | null) {
  memorySession = user;
  writeSession(user);
}

export async function login(email: string, password: string): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 450));
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!account) return { ok: false, message: "No account found for that email." };
  if (account.password !== password)
    return { ok: false, message: "That password doesn’t match our records." };
  const user = strip(account);
  setSession(user);
  return { ok: true, user };
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 600));
  if (input.password.length < 8)
    return { ok: false, message: "Use at least 8 characters for your password." };
  const initials = input.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const user: UserProfile = {
    id: `cus-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    role: "customer",
    initials: initials || "AN",
    joinedAt: new Date().toISOString(),
    rewards: 250,
  };
  setSession(user);
  return { ok: true, user };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 500));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, message: "Enter a valid email address." };
  return { ok: true, user: null };
}

export function logout() {
  setSession(null);
}

export const demoAccounts = DEMO_ACCOUNTS.map(({ password: _p, ...acc }) => acc);
