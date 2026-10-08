import type { Address, Customer, CustomerStatus } from "@/types";

export const addresses: Record<string, Address[]> = {
  "cus-amar": [
    {
      id: "addr-1",
      label: "Home",
      fullName: "Amar Verma",
      phone: "+91 98450 21140",
      line1: "14 Craftsmen Lane, Indiranagar",
      line2: "2nd Floor, above Kava",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      country: "India",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Studio",
      fullName: "Amar Verma",
      phone: "+91 98450 21140",
      line1: "Unit 6, Sector 15, Koramangala",
      line2: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560095",
      country: "India",
      isDefault: false,
    },
  ],
  "cus-meera": [
    {
      id: "addr-3",
      label: "Home",
      fullName: "Meera Iyer",
      phone: "+91 99870 41122",
      line1: "88 Marine Drive, Churchgate",
      line2: "Apt 12B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400020",
      country: "India",
      isDefault: true,
    },
  ],
};

interface Seed {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  joinedAt: string;
  city: string;
  lifetimeValue: number;
}

const seeds: Seed[] = [
  { id: "cus-amar", name: "Amar Verma", email: "amar.verma@example.com", phone: "+91 98450 21140", status: "vip", orderCount: 14, totalSpent: 128400, lastOrderAt: "2026-10-02T11:20:00.000Z", joinedAt: "2024-03-12T09:00:00.000Z", city: "Bengaluru", lifetimeValue: 164200 },
  { id: "cus-meera", name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 99870 41122", status: "active", orderCount: 8, totalSpent: 64200, lastOrderAt: "2026-09-28T15:05:00.000Z", joinedAt: "2024-11-02T09:00:00.000Z", city: "Mumbai", lifetimeValue: 71800 },
  { id: "cus-rohan", name: "Rohan Mehta", email: "rohan.mehta@example.com", phone: "+91 90040 88231", status: "active", orderCount: 6, totalSpent: 41800, lastOrderAt: "2026-09-21T10:41:00.000Z", joinedAt: "2025-01-19T09:00:00.000Z", city: "Pune", lifetimeValue: 47200 },
  { id: "cus-ananya", name: "Ananya Rao", email: "ananya.rao@example.com", phone: "+91 97390 22118", status: "vip", orderCount: 11, totalSpent: 98600, lastOrderAt: "2026-09-18T18:12:00.000Z", joinedAt: "2024-06-30T09:00:00.000Z", city: "Hyderabad", lifetimeValue: 118900 },
  { id: "cus-kabir", name: "Kabir Singh", email: "kabir.singh@example.com", phone: "+91 98110 55420", status: "new", orderCount: 1, totalSpent: 2400, lastOrderAt: "2026-10-05T09:32:00.000Z", joinedAt: "2026-10-05T09:10:00.000Z", city: "New Delhi", lifetimeValue: 2400 },
  { id: "cus-isha", name: "Isha Kapoor", email: "isha.kapoor@example.com", phone: "+91 96500 71104", status: "active", orderCount: 5, totalSpent: 36900, lastOrderAt: "2026-08-30T13:02:00.000Z", joinedAt: "2025-04-14T09:00:00.000Z", city: "Gurugram", lifetimeValue: 39400 },
  { id: "cus-dev", name: "Dev Malhotra", email: "dev.malhotra@example.com", phone: "+91 93220 66103", status: "blocked", orderCount: 3, totalSpent: 14700, lastOrderAt: "2026-05-11T16:44:00.000Z", joinedAt: "2025-08-08T09:00:00.000Z", city: "Kolkata", lifetimeValue: 14700 },
  { id: "cus-tara", name: "Tara Menon", email: "tara.menon@example.com", phone: "+91 99620 30945", status: "active", orderCount: 7, totalSpent: 58300, lastOrderAt: "2026-09-09T12:27:00.000Z", joinedAt: "2025-02-25T09:00:00.000Z", city: "Chennai", lifetimeValue: 62100 },
  { id: "cus-neel", name: "Neel Shah", email: "neel.shah@example.com", phone: "+91 90990 12388", status: "active", orderCount: 4, totalSpent: 33200, lastOrderAt: "2026-07-26T19:18:00.000Z", joinedAt: "2025-06-01T09:00:00.000Z", city: "Ahmedabad", lifetimeValue: 35600 },
  { id: "cus-sana", name: "Sana Qureshi", email: "sana.qureshi@example.com", phone: "+91 97040 88221", status: "new", orderCount: 2, totalSpent: 8900, lastOrderAt: "2026-10-01T08:55:00.000Z", joinedAt: "2026-09-14T09:00:00.000Z", city: "Lucknow", lifetimeValue: 8900 },
];

export const customers: Customer[] = seeds.map((s) => ({
  id: s.id,
  name: s.name,
  email: s.email,
  phone: s.phone,
  initials: s.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  status: s.status,
  orderCount: s.orderCount,
  totalSpent: s.totalSpent,
  lastOrderAt: s.lastOrderAt,
  joinedAt: s.joinedAt,
  city: s.city,
  addresses: addresses[s.id] ?? [],
  lifetimeValue: s.lifetimeValue,
}));

export const customerMap = Object.fromEntries(
  customers.map((c) => [c.id, c]),
) as Record<string, Customer>;
