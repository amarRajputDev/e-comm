import type { ColorOption, Product, ProductImage, SizeOption } from "@/types";

/* ---------------------------------------------------------------------------
   Catalogue seed data. Swap `getProducts` in lib/services/products.ts for a
   real API call and every surface of the app picks it up.
--------------------------------------------------------------------------- */

const img = (slug: string, i: number, alt: string): ProductImage => ({
  src: `/img/products/${slug}-${i}.jpg`,
  alt,
});

const colors = {
  black: { name: "Black", hex: "#141210", available: true },
  bone: { name: "Bone", hex: "#EDE6DA", available: true },
  chalk: { name: "Chalk", hex: "#F6F4F0", available: true },
  charcoal: { name: "Charcoal", hex: "#3C3A37", available: true },
  olive: { name: "Olive", hex: "#5A5B3F", available: true },
  rust: { name: "Rust", hex: "#A9522B", available: true },
  indigo: { name: "Indigo", hex: "#2C3E63", available: true },
  stone: { name: "Stone", hex: "#B8AFA1", available: true },
  espresso: { name: "Espresso", hex: "#40342B", available: true },
  cream: { name: "Cream", hex: "#E8DFCE", available: true },
  navy: { name: "Navy", hex: "#1F2A3C", available: true },
  sage: { name: "Sage", hex: "#A3AE97", available: true },
  blush: { name: "Blush", hex: "#D8A7A0", available: true },
  bordeaux: { name: "Bordeaux", hex: "#5E2B2E", available: true },
  powder: { name: "Powder", hex: "#A8C0D0", available: true },
  scarlet: { name: "Scarlet", hex: "#C1442E", available: true },
} satisfies Record<string, ColorOption>;

const apparelSizes = (available = ["XS", "S", "M", "L", "XL", "XXL"], missing: string[] = []): SizeOption[] =>
  available.map((label) => ({ label, available: !missing.includes(label) }));

const APPAREL_SIZES = apparelSizes();
const APPAREL_SIZES_NO_XXL = apparelSizes(["XS", "S", "M", "L", "XL"], ["XXL", "XS"]);
const SHOE_SIZES = ["6", "7", "8", "9", "10", "11"].map((label) => ({
  label,
  available: label !== "6",
}));
const ONE_SIZE: SizeOption[] = [{ label: "One Size", available: true }];

interface Seed {
  slug: string;
  name: string;
  category: "men" | "women" | "accessories";
  collections: string[];
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  colors: ColorOption[];
  sizes: SizeOption[];
  shortDescription: string;
  description: string;
  highlights: string[];
  details: { label: string; value: string }[];
  tags: string[];
  createdAt: string;
  alt: string;
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
}

const seeds: Seed[] = [
  {
    slug: "heavyweight-box-tee",
    name: "Heavyweight Box Tee",
    category: "men",
    collections: ["essentials", "best-sellers"],
    price: 2400,
    compareAt: 3000,
    rating: 4.7,
    reviewCount: 218,
    stock: 64,
    sold: 1240,
    colors: [colors.black, colors.bone, colors.olive],
    sizes: APPAREL_SIZES,
    shortDescription: "280gsm combed cotton with a squared, boxy drape.",
    description:
      "Cut from 280gsm combed cotton that holds its shape wash after wash. The body is squared off through the chest with a slightly dropped shoulder, so it layers cleanly under an overshirt without bunching. Ribbed collar, twin-needle hems, no side seam.",
    highlights: [
      "280gsm combed cotton, garment-washed for zero shrinkage",
      "Boxy fit with a dropped shoulder",
      "Ribbed collar with taped shoulder seams",
    ],
    details: [
      { label: "Material", value: "100% combed cotton, 280gsm" },
      { label: "Fit", value: "Boxy — size down for a regular fit" },
      { label: "Care", value: "Machine wash cold, tumble dry low" },
      { label: "Origin", value: "Milled and sewn in Tiruppur, India" },
    ],
    tags: ["tee", "basic", "cotton", "unisex"],
    createdAt: "2025-11-04T09:00:00.000Z",
    alt: "Model wearing the heavyweight bone box tee",
    featured: true,
    trending: true,
  },
  {
    slug: "oxford-overshirt",
    name: "Oxford Overshirt",
    category: "men",
    collections: ["new-arrivals", "essentials"],
    price: 6800,
    rating: 4.8,
    reviewCount: 143,
    stock: 32,
    sold: 610,
    colors: [colors.charcoal, colors.bone, colors.sage],
    sizes: APPAREL_SIZES,
    shortDescription: "A shirt-jacket hybrid in brushed organic oxford.",
    description:
      "Half shirt, half jacket. Woven from a brushed organic oxford that softens with wear but keeps enough body to sit away from the torso. Two chest pockets with hidden plackets, horn buttons, and a curved hem that works worn open or tucked.",
    highlights: [
      "Brushed organic oxford, 240gsm",
      "Corozo horn buttons",
      "Two flap pockets with hidden plackets",
    ],
    details: [
      { label: "Material", value: "98% organic cotton, 2% elastane" },
      { label: "Fit", value: "Relaxed — true to size" },
      { label: "Care", value: "Machine wash cold, warm iron" },
      { label: "Origin", value: "Woven in Coimbatore, sewn in Bengaluru" },
    ],
    tags: ["overshirt", "layering", "oxford"],
    createdAt: "2026-08-18T09:00:00.000Z",
    alt: "Charcoal oxford overshirt worn open over a tee",
    isNew: true,
  },
  {
    slug: "pleated-wool-trouser",
    name: "Pleated Wool Trouser",
    category: "men",
    collections: ["essentials"],
    price: 7500,
    rating: 4.6,
    reviewCount: 96,
    stock: 28,
    sold: 430,
    colors: [colors.charcoal, colors.navy, colors.stone],
    sizes: APPAREL_SIZES_NO_XXL,
    shortDescription: "Single-pleat trouser in a fluid Italian wool blend.",    description:
      "A single forward pleat gives these legs room through the hip while the taper keeps the silhouette clean. The wool blend has enough drape to fall without creasing sharply — dressed down with a tee, or pressed for dinner.",
    highlights: [
      "Italian wool-blend with fluid drape",
      "Single forward pleat, extended waistband",
      "Unfinished hem for a custom break",
    ],
    details: [
      { label: "Material", value: "70% wool, 28% poly, 2% elastane" },
      { label: "Fit", value: "Mid-rise, tapered" },
      { label: "Care", value: "Dry clean only" },
      { label: "Origin", value: "Fabric from Italy, sewn in India" },
    ],
    tags: ["trouser", "tailoring", "wool"],
    createdAt: "2026-02-11T09:00:00.000Z",
    alt: "Charcoal pleated wool trouser, full-length view",
  },
  {
    slug: "merino-crew-knit",
    name: "Merino Crew Knit",
    category: "men",
    collections: ["essentials", "best-sellers"],
    price: 5400,
    compareAt: 6800,
    rating: 4.9,
    reviewCount: 187,
    stock: 41,
    sold: 980,
    colors: [colors.black, colors.cream, colors.rust],
    sizes: APPAREL_SIZES,
    shortDescription: "Fine-gauge extra-fine merino that never itches.",
    description:
      "Knitted from 19.5-micron merino that regulates temperature without the itch. Fully fashioned — the panels are knitted to shape rather than cut — so the seams lie flat and the garment keeps its structure through the season.",
    highlights: [
      "19.5-micron extra-fine merino wool",
      "Fully fashioned seams, no bulk",
      "Naturally odour-resistant",
    ],
    details: [
      { label: "Material", value: "100% extra-fine merino wool" },
      { label: "Fit", value: "Regular, slightly trimmed" },
      { label: "Care", value: "Hand wash cold, dry flat" },
      { label: "Origin", value: "Yarn from Italy, knitted in India" },
    ],
    tags: ["knitwear", "merino", "winter"],
    createdAt: "2025-12-02T09:00:00.000Z",
    alt: "Rust merino crew knit folded on a neutral surface",
    featured: true,
    trending: true,
  },
  {
    slug: "cafe-racer-jacket",
    name: "Café Racer Jacket",
    category: "men",
    collections: ["new-arrivals"],
    price: 12800,
    rating: 4.8,
    reviewCount: 74,
    stock: 18,
    sold: 320,
    colors: [
      { name: "Cognac", hex: "#8A4B2A", available: true },
      { name: "Black", hex: "#141210", available: true },
    ],
    sizes: APPAREL_SIZES_NO_XXL,
    shortDescription: "Vegetable-tanned lambskin with a clean, minimal collar.",
    description:
      "Cut from vegetable-tanned lambskin that starts structured and moulds to your shoulders over the first month. The stand collar is cut in one piece with the front yoke, so there is no seam to irritate the neck, and the zip is a heavy-gauge Riri with a leather pull tab.",
    highlights: [
      "Vegetable-tanned lambskin, 0.8mm",
      "Heavy-gauge Riri zip with leather pull",
      "Cotton twill lining, taped seams",
    ],
    details: [
      { label: "Material", value: "100% lambskin, cotton lining" },
      { label: "Fit", value: "Close through the body — size up for layers" },
      { label: "Care", value: "Specialist leather clean only" },
      { label: "Origin", value: "Leather from Punjab, sewn in Jaipur" },
    ],
    tags: ["jacket", "leather", "outerwear", "biker"],
    createdAt: "2026-09-01T09:00:00.000Z",
    alt: "Model wearing the cognac café racer jacket",
    isNew: true,
  },
  {
    slug: "relaxed-linen-shirt",
    name: "Relaxed Linen Shirt",
    category: "men",
    collections: ["essentials"],
    price: 4200,
    compareAt: 5200,
    rating: 4.5,
    reviewCount: 132,
    stock: 0,
    sold: 720,
    colors: [colors.chalk, colors.sage, colors.navy],
    sizes: APPAREL_SIZES,
    shortDescription: "European flax linen, washed twice for a lived-in hand.",
    description:
      "Made from European flax that has been washed twice before cutting, so it arrives soft rather than crisp. The weave is open enough to breathe in 35°C afternoons, and the collar is structured enough to hold its shape under a jacket.",
    highlights: [
      "100% European flax linen",
      "Double-washed for softness",
      "Breathable open weave",
    ],
    details: [
      { label: "Material", value: "100% linen, 165gsm" },
      { label: "Fit", value: "Relaxed, straight body" },
      { label: "Care", value: "Machine wash cold, line dry" },
      { label: "Origin", value: "Fabric from Belgium, sewn in India" },
    ],
    tags: ["linen", "summer", "shirt"],
    createdAt: "2026-03-20T09:00:00.000Z",
    alt: "Chalk linen shirt hanging against a warm wall",
  },
  {
    slug: "structured-trench-coat",
    name: "Structured Trench Coat",
    category: "women",
    collections: ["new-arrivals", "best-sellers"],
    price: 14500,
    compareAt: 17500,
    rating: 4.9,
    reviewCount: 88,
    stock: 14,
    sold: 340,
    colors: [colors.bordeaux, colors.powder, colors.black],
    sizes: APPAREL_SIZES_NO_XXL,
    shortDescription: "Bonded cotton trench with a sculpted shoulder.",
    description:
      "A modern trench with the drama removed: no storm flap, no epaulettes, just a clean bond-edged collar and a shoulder cut to hold its line. The cotton is bonded to a light interlining so the coat keeps its architecture in wind and rain.",
    highlights: [
      "Bonded cotton with light interlining",
      "Sculpted shoulder, clean front",
      "Concealed placket and back vent",
    ],
    details: [
      { label: "Material", value: "76% cotton, 24% recycled poly" },
      { label: "Fit", value: "Oversized — take your usual size" },
      { label: "Care", value: "Dry clean only" },
      { label: "Origin", value: "Sewn in Bengaluru" },
    ],
    tags: ["coat", "trench", "outerwear"],
    createdAt: "2026-08-28T09:00:00.000Z",
    alt: "Model wearing the bordeaux structured trench coat in daylight",
    featured: true,
    isNew: true,
    trending: true,
  },
  {
    slug: "silk-slip-dress",
    name: "Silk Slip Dress",
    category: "women",
    collections: ["new-arrivals"],
    price: 8900,
    rating: 4.7,
    reviewCount: 61,
    stock: 22,
    sold: 260,
    colors: [colors.black, colors.rust, colors.sage],
    sizes: APPAREL_SIZES_NO_XXL,
    shortDescription: "Bias-cut mulberry silk with adjustable straps.",
    description:
      "Cut on the bias so the silk falls in one continuous line from shoulder to hem. Adjustable straps, French seams throughout, and a matte finish that reads as quietly expensive rather than shiny.",
    highlights: [
      "22-momme mulberry silk",
      "Bias cut for a fluid fall",
      "French seams, adjustable straps",
    ],
    details: [
      { label: "Material", value: "100% mulberry silk, 22 momme" },
      { label: "Fit", value: "Skims the body" },
      { label: "Care", value: "Hand wash cold, dry flat" },
      { label: "Origin", value: "Silk from Karnataka, sewn in India" },
    ],
    tags: ["dress", "silk", "evening"],
    createdAt: "2026-09-05T09:00:00.000Z",
    alt: "Black bias-cut silk slip dress on a model",
    isNew: true,
  },
  {
    slug: "ribbed-knit-tank",
    name: "Ribbed Knit Tank",
    category: "women",
    collections: ["essentials", "best-sellers"],
    price: 2800,
    rating: 4.6,
    reviewCount: 204,
    stock: 88,
    sold: 1480,
    colors: [colors.black, colors.chalk, colors.stone, colors.rust],
    sizes: APPAREL_SIZES,
    shortDescription: "Compact rib that holds its shape under everything.",
    description:
      "A dense 2×2 rib with enough recovery to stay close without gripping. Wide straps sit comfortably under a bag strap, and the neckline is bound rather than folded so it never rolls.",
    highlights: [
      "Compact 2×2 rib with recovery",
      "Bound neckline — never rolls",
      "Layering weight, not sheer",
    ],
    details: [
      { label: "Material", value: "92% cotton, 8% elastane" },
      { label: "Fit", value: "Close fit" },
      { label: "Care", value: "Machine wash cold" },
      { label: "Origin", value: "Sewn in Tiruppur, India" },
    ],
    tags: ["tank", "basic", "ribbed"],
    createdAt: "2025-10-15T09:00:00.000Z",
    alt: "Bone ribbed knit tank, front view",
    trending: true,
  },
  {
    slug: "high-rise-wide-trouser",
    name: "High-Rise Wide Trouser",
    category: "women",
    collections: ["essentials"],
    price: 6400,
    rating: 4.7,
    reviewCount: 118,
    stock: 36,
    sold: 560,
    colors: [colors.blush, colors.cream, colors.charcoal],
    sizes: APPAREL_SIZES_NO_XXL,
    shortDescription: "A long, unbroken line in a heavyweight crepe.",
    description:
      "Sits at the natural waist and falls in one uninterrupted line to the ankle. The crepe is heavy enough to swing rather than cling, with a hook-and-bar closure that stays flat under a knit.",
    highlights: [
      "Heavyweight crepe with movement",
      "Hook-and-bar closure, flat front",
      "Press crease holds after washing",
    ],
    details: [
      { label: "Material", value: "65% polyester, 32% viscose, 3% elastane" },
      { label: "Fit", value: "High-rise, wide leg" },
      { label: "Care", value: "Machine wash cold, hang to dry" },
      { label: "Origin", value: "Sewn in Bengaluru" },
    ],
    tags: ["trouser", "wide-leg", "tailoring"],
    createdAt: "2026-01-22T09:00:00.000Z",
    alt: "Blush high-rise wide-leg trouser, side view",
  },
  {
    slug: "cashmere-cardigan",
    name: "Cashmere Cardigan",
    category: "women",
    collections: ["new-arrivals"],
    price: 11200,
    rating: 4.8,
    reviewCount: 54,
    stock: 12,
    sold: 210,
    colors: [colors.cream, colors.charcoal, colors.sage],
    sizes: APPAREL_SIZES_NO_XXL,
    shortDescription: "Grade-A Mongolian cashmere, boxed and unforced.",
    description:
      "Knitted from grade-A Mongolian cashmere at a 7-gauge, so it reads as a sweater rather than a shawl. Dropped shoulders, a slightly cropped body, and corozo buttons that will not yellow.",
    highlights: [
      "Grade-A Mongolian cashmere",
      "7-gauge knit, boxed construction",
      "Corozo nut buttons",
    ],
    details: [
      { label: "Material", value: "100% grade-A cashmere" },
      { label: "Fit", value: "Relaxed, slightly cropped" },
      { label: "Care", value: "Hand wash cold, dry flat" },
      { label: "Origin", value: "Yarn from Mongolia, knitted in India" },
    ],
    tags: ["cashmere", "knitwear", "luxury"],
    createdAt: "2026-09-10T09:00:00.000Z",
    alt: "Cream cashmere cardigan draped over a chair",
    isNew: true,
  },
  {
    slug: "poplin-midi-shirt",
    name: "Poplin Midi Shirt",
    category: "women",
    collections: ["essentials"],
    price: 5100,
    rating: 4.5,
    reviewCount: 92,
    stock: 44,
    sold: 470,
    colors: [colors.chalk, colors.indigo, colors.black],
    sizes: APPAREL_SIZES,
    shortDescription: "Crisp compact poplin cut long enough to wear as a dress.",
    description:
      "Compact cotton poplin with a hand that stays crisp through a full day. Cut long, with a shirt-tail hem and a single rear pleat, so it works buttoned as a dress or half-tucked over denim.",
    highlights: [
      "Compact 120-thread poplin",
      "Midi length with shirt-tail hem",
      "Rear box pleat for movement",
    ],
    details: [
      { label: "Material", value: "100% long-staple cotton" },
      { label: "Fit", value: "Relaxed, midi length" },
      { label: "Care", value: "Machine wash warm, iron damp" },
      { label: "Origin", value: "Sewn in Bengaluru" },
    ],
    tags: ["shirt", "poplin", "midi"],
    createdAt: "2025-11-28T09:00:00.000Z",
    alt: "Chalk poplin midi shirt worn open over a tank",
  },
  {
    slug: "grain-leather-tote",
    name: "Grain Leather Tote",
    category: "accessories",
    collections: ["new-arrivals", "best-sellers"],
    price: 9800,
    rating: 4.9,
    reviewCount: 126,
    stock: 24,
    sold: 690,
    colors: [colors.scarlet, colors.espresso, colors.black],
    sizes: ONE_SIZE,
    shortDescription: "Full-grain vegetable-tanned leather, unlined.",
    description:
      "One piece of full-grain, vegetable-tanned leather folded and stitched — no lining, no hardware to rattle. It arrives stiff and structured, then softens into a slouch over a few weeks of use. Fits a 15-inch laptop upright.",
    highlights: [
      "Full-grain vegetable-tanned leather",
      "Fits a 15\" laptop upright",
      "Unlined, edges burnished by hand",
    ],
    details: [
      { label: "Material", value: "Full-grain leather, brass hardware" },
      { label: "Dimensions", value: "38 × 32 × 12 cm" },
      { label: "Care", value: "Wipe dry, condition twice a year" },
      { label: "Origin", value: "Leather from Kanpur, made in Jaipur" },
    ],
    tags: ["bag", "tote", "leather"],
    createdAt: "2026-08-08T09:00:00.000Z",
    alt: "Structured scarlet leather tote in studio light",
    featured: true,
    isNew: true,
    trending: true,
  },
  {
    slug: "acetate-sunglasses",
    name: "Acetate Sunglasses",
    category: "accessories",
    collections: ["essentials"],
    price: 5600,
    compareAt: 6900,
    rating: 4.6,
    reviewCount: 87,
    stock: 38,
    sold: 540,
    colors: [colors.black, colors.espresso, colors.stone],
    sizes: ONE_SIZE,
    shortDescription: "Italian acetate, CR-39 lenses, 100% UV protection.",
    description:
      "Milled from Italian Mazzucchelli acetate and hand-polished over three days. The keyhole bridge suits a wide range of faces, and the CR-39 lenses are category 3 with full UV400 protection.",
    highlights: [
      "Italian Mazzucchelli acetate",
      "CR-39 category 3 lenses, UV400",
      "Hand-polished, spring hinges",
    ],
    details: [
      { label: "Material", value: "Acetate frame, CR-39 lens" },
      { label: "Fit", value: "Medium — 52-18-145mm" },
      { label: "Care", value: "Clean with the included microfibre" },
      { label: "Origin", value: "Frames from Italy, assembled in India" },
    ],
    tags: ["eyewear", "sunglasses", "summer"],
    createdAt: "2026-02-04T09:00:00.000Z",
    alt: "Black acetate sunglasses on a warm neutral surface",
  },
  {
    slug: "minimal-automatic-watch",
    name: "Minimal Automatic Watch",
    category: "accessories",
    collections: ["best-sellers"],
    price: 12500,
    rating: 4.8,
    reviewCount: 64,
    stock: 9,
    sold: 280,
    colors: [colors.chalk, colors.black],
    sizes: ONE_SIZE,
    shortDescription: "38mm case, sapphire crystal, 42-hour automatic movement.",
    description:
      "A 38mm brushed steel case with a sunray dial and applied indices — no date window, no clutter. Inside is a Japanese automatic movement with a 42-hour power reserve, visible through the exhibition case back.",
    highlights: [
      "38mm brushed 316L steel case",
      "Japanese automatic, 42-hour reserve",
      "Sapphire crystal, exhibition back",
    ],
    details: [
      { label: "Movement", value: "Miyota 9039 automatic" },
      { label: "Water resistance", value: "5 ATM" },
      { label: "Strap", value: "20mm quick-release leather" },
      { label: "Warranty", value: "2 years international" },
    ],
    tags: ["watch", "automatic", "gift"],
    createdAt: "2025-12-18T09:00:00.000Z",
    alt: "Minimal automatic watch with a white strap and dark dial",
    featured: true,
  },
  {
    slug: "brushed-wool-scarf",
    name: "Brushed Wool Scarf",
    category: "accessories",
    collections: ["essentials"],
    price: 3400,
    rating: 4.7,
    reviewCount: 71,
    stock: 52,
    sold: 620,
    colors: [colors.charcoal, colors.rust, colors.sage],
    sizes: ONE_SIZE,
    shortDescription: "Brushed lambswool, generous 200×70cm.",
    description:
      "Brushed on both faces so the nap catches the light, then finished with a short, hand-knotted fringe. Long enough to double once and still hang past the waist.",
    highlights: [
      "Brushed lambswool from Scotland",
      "200 × 70cm generous length",
      "Hand-knotted fringe",
    ],
    details: [
      { label: "Material", value: "100% lambswool" },
      { label: "Dimensions", value: "200 × 70 cm" },
      { label: "Care", value: "Dry clean only" },
      { label: "Origin", value: "Woven in Scotland" },
    ],
    tags: ["scarf", "winter", "wool"],
    createdAt: "2025-10-30T09:00:00.000Z",
    alt: "Charcoal brushed wool scarf folded in soft light",
  },
  {
    slug: "court-canvas-sneaker",
    name: "Court Canvas Sneaker",
    category: "accessories",
    collections: ["new-arrivals"],
    price: 7900,
    rating: 4.5,
    reviewCount: 156,
    stock: 46,
    sold: 810,
    colors: [colors.chalk, colors.black, colors.navy],
    sizes: SHOE_SIZES,
    shortDescription: "Organic canvas on a vulcanised gum sole.",
    description:
      "A low-profile court silhouette built on a vulcanised gum sole that grips polished floors. The canvas is organic and undyed, the toe is reinforced, and the footbed is cork-lined so it moulds to you.",
    highlights: [
      "Organic cotton canvas upper",
      "Vulcanised gum rubber sole",
      "Cork-lined moulded footbed",
    ],
    details: [
      { label: "Material", value: "Organic canvas, gum rubber" },
      { label: "Fit", value: "Runs true to size" },
      { label: "Care", value: "Spot clean, air dry" },
      { label: "Origin", value: "Made in Karnataka, India" },
    ],
    tags: ["sneaker", "footwear", "canvas"],
    createdAt: "2026-07-14T09:00:00.000Z",
    alt: "Black court sneaker with a gum sole",
    isNew: true,
  },
  {
    slug: "edge-grain-belt",
    name: "Edge-Grain Belt",
    category: "accessories",
    collections: ["essentials"],
    price: 2900,
    rating: 4.6,
    reviewCount: 58,
    stock: 70,
    sold: 480,
    colors: [colors.espresso, colors.black],
    sizes: [
      { label: "28", available: true },
      { label: "30", available: true },
      { label: "32", available: true },
      { label: "34", available: false },
      { label: "36", available: true },
      { label: "38", available: true },
    ],
    shortDescription: "35mm full-grain leather with a solid brass buckle.",
    description:
      "Cut from a single strip of full-grain leather with the edge left raw and burnished rather than painted. The solid brass buckle is PVD-coated to hold its tone, and the keeper is fixed so the tail never slips.",
    highlights: [
      "35mm full-grain leather",
      "Solid brass buckle, PVD-coated",
      "Raw burnished edge",
    ],
    details: [
      { label: "Material", value: "Full-grain leather, brass" },
      { label: "Width", value: "35mm" },
      { label: "Care", value: "Condition annually" },
      { label: "Origin", value: "Made in Jaipur, India" },
    ],
    tags: ["belt", "leather", "essential"],
    createdAt: "2025-09-19T09:00:00.000Z",
    alt: "Espresso leather belt coiled on a stone surface",
  },
];

function buildProduct(seed: Seed): Product {
  const images: ProductImage[] = [
    img(seed.slug, 1, seed.alt),
    img(seed.slug, 2, `${seed.name}, alternate view`),
    img(seed.slug, 3, `${seed.name}, detail`),
  ];
  return {
    id: `prd-${seed.slug}`,
    slug: seed.slug,
    name: seed.name,
    brand: "ATELIER NOIR",
    category: seed.category,
    collections: seed.collections,
    price: seed.price,
    compareAt: seed.compareAt ?? null,
    cost: Math.round(seed.price * 0.42),
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    stock: seed.stock,
    sold: seed.sold,
    status: seed.stock === 0 ? "active" : "active",
    colors: seed.colors,
    sizes: seed.sizes,
    images,
    hoverIndex: 1,
    shortDescription: seed.shortDescription,
    description: seed.description,
    highlights: seed.highlights,
    details: seed.details,
    tags: seed.tags,
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    featured: seed.featured,
    trending: seed.trending,
    isNew: seed.isNew ?? new Date(seed.createdAt) > new Date("2026-07-01"),
    seo: {
      title: `${seed.name} — ${seed.shortDescription}`,
      description: seed.description.slice(0, 155),
    },
  };
}

export const products: Product[] = seeds.map(buildProduct);

export const productMap = Object.fromEntries(
  products.map((p) => [p.slug, p]),
) as Record<string, Product>;

export const COLLECTIONS = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh silhouettes and new fabrications, added fortnightly.",
    match: (p: Product) => p.isNew === true,
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    description: "The pieces our customers come back for.",
    match: (p: Product) => p.sold >= 500,
  },
  {
    slug: "essentials",
    name: "The Essentials",
    description: "Permanent collection — never on sale, never out of place.",
    match: (p: Product) => p.collections.includes("essentials"),
  },
  {
    slug: "sale",
    name: "Archive Sale",
    description: "Last-chance pieces from previous seasons, up to 30% off.",
    match: (p: Product) => p.compareAt != null,
  },
] as const;

export type CollectionSlug = (typeof COLLECTIONS)[number]["slug"];
