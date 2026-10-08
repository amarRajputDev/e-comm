import type { Review, Testimonial } from "@/types";
import { productMap } from "./products";

function review(
  slug: string,
  rating: number,
  title: string,
  body: string,
  customer: string,
  daysAgo: number,
  status: Review["status"] = "approved",
  verified = true,
): Review {
  const p = productMap[slug];
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `rev-${slug}-${d.getTime()}`,
    productId: p.id,
    productName: p.name,
    productSlug: p.slug,
    customerName: customer,
    customerInitials: customer
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    rating,
    title,
    body,
    createdAt: d.toISOString(),
    status,
    verified,
    helpful: (rating * 3 + title.length) % 17,
  };
}

export const reviews: Review[] = [
  review("heavyweight-box-tee", 5, "The last tee I’ll buy", "I’ve washed this maybe forty times and the collar still sits flat. The weight is exactly what I wanted — opaque, structured, no cling.", "Amar Verma", 12),
  review("heavyweight-box-tee", 4, "Slightly boxier than expected", "Size down if you want a regular fit. I usually wear M in everything and the S works better here. Fabric is excellent.", "Rohan Mehta", 26),
  review("heavyweight-box-tee", 5, "Bought three", "Bone, black, olive. The bone isn’t see-through, which is rare at this price.", "Tara Menon", 41),
  review("merino-crew-knit", 5, "Genuinely itch-free", "I react to almost every wool sweater. This one I can wear against skin all day. The rust colour is beautifully muted.", "Ananya Rao", 8),
  review("merino-crew-knit", 5, "Worth the price", "Fully fashioned seams make a noticeable difference — it hangs properly instead of twisting after a wash.", "Neel Shah", 33),
  review("oxford-overshirt", 5, "Perfect middle layer", "Wear it open over a tee in the AC, buttoned up at night. The sage colour is more grey than green — very wearable.", "Kabir Singh", 5, "approved"),
  review("oxford-overshirt", 4, "Buttons take a while to soften", "Stiff for the first week, then it settles. Stitching is immaculate throughout.", "Dev Malhotra", 58),
  review("structured-trench-coat", 5, "Editorial in real life", "Photographs like something three times the price. The shoulder line is what sells it.", "Meera Iyer", 3),
  review("structured-trench-coat", 5, "Bought after the show", "Sizing is generous — I took my usual S and it still layers over a knit. Bone hides nothing, order accordingly.", "Isha Kapoor", 17),
  review("silk-slip-dress", 4, "Beautiful but delicate", "The matte finish is exactly right. Take it to a proper dry cleaner, not a neighbourhood one.", "Sana Qureshi", 9),
  review("ribbed-knit-tank", 5, "The perfect base layer", "Dense enough to wear alone, thin enough under a blazer. Four washes in, no bagging at the hem.", "Ananya Rao", 21),
  review("ribbed-knit-tank", 4, "Runs close", "If you’re between sizes go up. The black is a true black.", "Isha Kapoor", 62),
  review("grain-leather-tote", 5, "It gets better", "Arrived stiff, three weeks later it slouches exactly the way the photos show. Fits my 15-inch laptop upright.", "Amar Verma", 14),
  review("grain-leather-tote", 5, "No lining, no nonsense", "Everything I wanted — no zip to break, no logo, edges burnished properly.", "Neel Shah", 39),
  review("minimal-automatic-watch", 5, "Understated and correct", "No date window, exhibition back, 42-hour reserve. It’s the only watch I wear now.", "Rohan Mehta", 20),
  review("minimal-automatic-watch", 4, "Strap is the weak link", "Beautiful head — I swapped the strap for a bracelet within a month.", "Dev Malhotra", 70),
  review("acetate-sunglasses", 5, "Sits properly on a narrow face", "Keyhole bridges usually slide off mine. These don’t. Case and cloth included.", "Tara Menon", 29),
  review("court-canvas-sneaker", 4, "Cork footbed is the detail", " moulds to your foot after a week. Slightly narrow — half size up if you’re wide.", "Kabir Singh", 11, "pending", false),
  review("brushed-wool-scarf", 5, "Enormous and warm", "Doubles once and still hangs past my waist. The fringe is hand-knotted, not glued.", "Meera Iyer", 47),
  review("high-rise-wide-trouser", 5, "Finally, a wide leg that swings", "The crease survives a full day of sitting. I’ve ordered the navy too.", "Ananya Rao", 24, "pending"),
  review("cashmere-cardigan", 5, "Grade-A is real", "No pills after a month of wear. The crop works over high-rise trousers.", "Isha Kapoor", 6),
  review("cafe-racer-jacket", 5, "Breaks in beautifully", "Three weeks in and the leather has softened exactly at the shoulders. The cognac darkens where it creases — looks better every wear.", "Amar Verma", 16),
];

export const approvedReviews = reviews.filter((r) => r.status === "approved");

export function reviewsForProduct(productId: string) {
  return approvedReviews.filter((r) => r.productId === productId);
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "This is now my favourite everyday piece. I reach for it before anything else in the wardrobe.",
    name: "Ananya Rao",
    location: "Hyderabad",
    rating: 5,
    product: "Merino Crew Knit",
  },
  {
    id: "t2",
    quote: "The kind of quality you feel in the first three seconds — the weight of the fabric, the way the seams sit.",
    name: "Amar Verma",
    location: "Bengaluru",
    rating: 5,
    product: "Heavyweight Box Tee",
  },
  {
    id: "t3",
    quote: "Ordered on a Tuesday, wore it Friday. Packaging alone made me keep the box.",
    name: "Meera Iyer",
    location: "Mumbai",
    rating: 5,
    product: "Structured Trench Coat",
  },
  {
    id: "t4",
    quote: "I’ve replaced half my wardrobe with essentials from here and nothing has needed repairing yet.",
    name: "Neel Shah",
    location: "Ahmedabad",
    rating: 5,
    product: "Oxford Overshirt",
  },
  {
    id: "t5",
    quote: "Returns were painless when I sized wrong — refunded in two days, no questions asked.",
    name: "Tara Menon",
    location: "Chennai",
    rating: 5,
    product: "High-Rise Wide Trouser",
  },
];
