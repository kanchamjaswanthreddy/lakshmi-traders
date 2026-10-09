// Complete SWR Drainage System — Ashirvad Pushfit & Solfit Price List (w.e.f. 01 Mar 2025)
// Pages 55-61 of the PDF. Every row extracted.
// SWR uses cm sizes: 7.5(2½"), 9.0(3"), 11.0(4"), 14.0(5"), 16.0(6"), 20.0(8"), 25.0(10"), 31.5(12")
// Naming: "SIZE SWR TYPE ProductName" — e.g. "4 SWR Pushfit Plain Bend"
// Price = MRP / 1.18

const SUPABASE_URL = 'https://rmlivwqapxlvzdwpzbcp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbGl2d3FhcHhsdnpkd3B6YmNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyOTY2NiwiZXhwIjoyMDk2NTA1NjY2fQ.1lfEPkNsC8YIv_XBztomHYrdUtU0MZxqy2AS2zMLwFc';

const HSN = '39172390';
const GST = 18;
function base(mrp) { return Math.round((mrp / 1.18) * 100) / 100; }
function p(name, mrp, unit = 'NOS') {
  return { name, category: 'swr', price: base(mrp), gst_percent: GST, hsn_code: HSN, unit, is_active: true };
}

// Size mapping: cm → inch display used in product names
// 7.5cm=2½", 9.0cm=3", 11.0cm=4", 14.0cm=5", 16.0cm=6", 20.0cm=8", 25.0cm=10", 31.5cm=12"

const products = [

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 55 — SWR PUSHFIT FITTINGS                             ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Plain Bend / Elbow (Pushfit) ──
  p('2-1/2 SWR Pushfit Plain Bend', 101),
  p('3 SWR Pushfit Plain Bend', 163),
  p('4 SWR Pushfit Plain Bend', 195),
  p('6 SWR Pushfit Plain Bend', 444),
  p('8 SWR Pushfit Plain Bend', 1099),

  // ── Door Bend / Door Elbow (Pushfit) ──
  p('2-1/2 SWR Pushfit Door Bend', 135),
  p('3 SWR Pushfit Door Bend', 179),
  p('4 SWR Pushfit Door Bend', 234),
  p('6 SWR Pushfit Door Bend', 505),
  p('8 SWR Pushfit Door Bend', 1514),

  // ── Bend 45° / Shoe Bend (Pushfit) ──
  p('2-1/2 SWR Pushfit Bend 45°', 84),
  p('3 SWR Pushfit Bend 45°', 129),
  p('4 SWR Pushfit Bend 45°', 155),
  p('6 SWR Pushfit Bend 45°', 383),
  p('8 SWR Pushfit Bend 45°', 931),

  // ── Coupler / Socket (Pushfit) ──
  p('2-1/2 SWR Pushfit Coupler', 73),
  p('3 SWR Pushfit Coupler', 112),
  p('4 SWR Pushfit Coupler', 130),
  p('6 SWR Pushfit Coupler', 310),
  p('8 SWR Pushfit Coupler', 693),

  // ── Repair Coupler (Pushfit) ──
  p('2-1/2 SWR Pushfit Repair Coupler', 81),
  p('3 SWR Pushfit Repair Coupler', 112),
  p('4 SWR Pushfit Repair Coupler', 130),
  p('6 SWR Pushfit Repair Coupler', 310),
  p('8 SWR Pushfit Repair Coupler', 693),

  // ── Single Tee (Pushfit) ──
  p('2-1/2 SWR Pushfit Single Tee', 142),
  p('3 SWR Pushfit Single Tee', 204),
  p('4 SWR Pushfit Single Tee', 255),
  p('6 SWR Pushfit Single Tee', 638),
  p('8 SWR Pushfit Single Tee', 1477),

  // ── Door Tee / Tee with Door (Pushfit) ──
  p('2-1/2 SWR Pushfit Door Tee', 168),
  p('3 SWR Pushfit Door Tee', 238),
  p('4 SWR Pushfit Door Tee', 298),
  p('6 SWR Pushfit Door Tee', 734),
  p('8 SWR Pushfit Door Tee', 1671),

  // ── Double Tee / Cross Tee (Pushfit) ──
  p('2-1/2 SWR Pushfit Double Tee', 204),
  p('3 SWR Pushfit Double Tee', 296),
  p('4 SWR Pushfit Double Tee', 335),

  // ── Double Tee with Door (Pushfit) ──
  p('2-1/2 SWR Pushfit Double Tee Door', 219),
  p('3 SWR Pushfit Double Tee Door', 381),
  p('4 SWR Pushfit Double Tee Door', 448),
  p('6 SWR Pushfit Double Tee Door', 4337),

  // ── Double Y with Door (Pushfit) ──
  p('2-1/2 SWR Pushfit Double Y Door', 299),
  p('3 SWR Pushfit Double Y Door', 458),
  p('4 SWR Pushfit Double Y Door', 539),

  // ── Reducer / Eccentric Reducer (Pushfit) ──
  p('3x2-1/2 SWR Pushfit Reducer', 92),
  p('4x2-1/2 SWR Pushfit Reducer', 120),
  p('4x3 SWR Pushfit Reducer', 118),
  p('6x4 SWR Pushfit Reducer', 254),
  p('8x6 SWR Pushfit Reducer', 597),

  // ── Reducing Tee (Pushfit) ──
  p('3x2-1/2 SWR Pushfit Reducing Tee', 188),
  p('4x2-1/2 SWR Pushfit Reducing Tee', 245),
  p('6x4 SWR Pushfit Reducing Tee', 541),

  // ── Reducing Door Tee (Pushfit) ──
  p('3x2-1/2 SWR Pushfit Reducing Door Tee', 255),
  p('4x2-1/2 SWR Pushfit Reducing Door Tee', 330),
  p('6x4 SWR Pushfit Reducing Door Tee', 708),

  // ── Reducing Y with Door (Pushfit) ──
  p('4x2-1/2 SWR Pushfit Reducing Y Door', 314),
  p('6x4 SWR Pushfit Reducing Y Door', 834),

  // ── Reducing Y without Door (Pushfit) ──
  p('4x2-1/2 SWR Pushfit Reducing Y', 266),
  p('6x4 SWR Pushfit Reducing Y', 748),

  // ── Single Y (Pushfit) ──
  p('2-1/2 SWR Pushfit Single Y', 165),
  p('3 SWR Pushfit Single Y', 233),
  p('4 SWR Pushfit Single Y', 332),
  p('6 SWR Pushfit Single Y', 730),

  // ── Single Y with Door (Pushfit) ──
  p('2-1/2 SWR Pushfit Single Y Door', 203),
  p('3 SWR Pushfit Single Y Door', 295),
  p('4 SWR Pushfit Single Y Door', 415),
  p('6 SWR Pushfit Single Y Door', 1060),
  p('8 SWR Pushfit Single Y Door', 2158),

  // ── Double Y (Pushfit) ──
  p('2-1/2 SWR Pushfit Double Y', 219),
  p('3 SWR Pushfit Double Y', 381),
  p('4 SWR Pushfit Double Y', 448),

  // ── Reverse Y (Pushfit) ──
  p('2-1/2 SWR Pushfit Reverse Y', 192),

  // ── Cleaning Pipe / Access Pipe (Pushfit) ──
  p('2-1/2 SWR Pushfit Cleaning Pipe', 131),
  p('3 SWR Pushfit Cleaning Pipe', 228),
  p('4 SWR Pushfit Cleaning Pipe', 261),
  p('6 SWR Pushfit Cleaning Pipe', 511),

  // ── Left/Right Side Single Y with Front Door (Pushfit) ──
  p('2-1/2 SWR Pushfit Left Y Front Door', 223),
  p('4 SWR Pushfit Left Y Front Door', 494),
  p('2-1/2 SWR Pushfit Right Y Front Door', 223),
  p('4 SWR Pushfit Right Y Front Door', 494),

  // ── Left/Right Side Door Elbow (Pushfit) ──
  p('4 SWR Pushfit Left Door Elbow', 295),
  p('4 SWR Pushfit Right Door Elbow', 295),

  // ── Left/Right Side Door Tee (Pushfit) ──
  p('4 SWR Pushfit Left Door Tee', 400),
  p('4 SWR Pushfit Right Door Tee', 400),

  // ── Swept Tee Plain (Pushfit) ──
  p('4 SWR Pushfit Swept Tee Plain', 318),

  // ── Swept Tee Plain with Door (Pushfit) ──
  p('4 SWR Pushfit Swept Tee Door', 343),

  // ── Swept Tee Triple Socket (Pushfit) ──
  p('4 SWR Pushfit Swept Tee Triple', 1149),

  // ── Long Swept Tee (Pushfit) ──
  p('2-1/2 SWR Pushfit Long Swept Tee', 165),
  p('4 SWR Pushfit Long Swept Tee', 339),
  p('6 SWR Pushfit Long Swept Tee', 930),
  p('8 SWR Pushfit Long Swept Tee', 2150),

  // ── Long Swept Tee with Door (Pushfit) ──
  p('2-1/2 SWR Pushfit Long Swept Tee Door', 194),
  p('4 SWR Pushfit Long Swept Tee Door', 544),
  p('6 SWR Pushfit Long Swept Tee Door', 915),
  p('8 SWR Pushfit Long Swept Tee Door', 2266),

  // ── Long Swept Bend (Pushfit) ──
  p('4 SWR Pushfit Long Swept Bend', 351),
  p('6 SWR Pushfit Long Swept Bend', 845),
  p('8 SWR Pushfit Long Swept Bend', 1584),

  // ── Long Swept Bend with Door (Pushfit) ──
  p('4 SWR Pushfit Long Swept Bend Door', 421),
  p('6 SWR Pushfit Long Swept Bend Door', 936),
  p('8 SWR Pushfit Long Swept Bend Door', 1758),

  // ── Pass Over Bend Type B (Pushfit) ──
  p('2-1/2 SWR Pushfit Pass Over Bend', 503),
  p('3 SWR Pushfit Pass Over Bend', 762),
  p('4 SWR Pushfit Pass Over Bend', 940),

  // ── NRV / Back Flow Preventer (Pushfit) ──
  p('4 SWR Pushfit NRV', 2053),
  p('6 SWR Pushfit NRV', 4788),

  // ── Flap for NRV (Pushfit) ──
  p('4 SWR Pushfit NRV Flap', 35),
  p('6 SWR Pushfit NRV Flap', 68),

  // ── SWR Pushfit Pipe (Single Stack) ──
  p('4 SWR Pushfit Pipe', 3934),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 57-58 — SWR SOLFIT FITTINGS                           ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Plain Bend / Elbow (Solfit) ──
  p('2-1/2 SWR Solfit Plain Bend', 86),
  p('3 SWR Solfit Plain Bend', 142),
  p('4 SWR Solfit Plain Bend', 164),
  p('6 SWR Solfit Plain Bend', 396),

  // ── Door Bend / Door Elbow (Solfit) ──
  p('2-1/2 SWR Solfit Door Bend', 119),
  p('3 SWR Solfit Door Bend', 180),
  p('4 SWR Solfit Door Bend', 199),
  p('6 SWR Solfit Door Bend', 461),

  // ── Bend 45° / Shoe Bend (Solfit) ──
  p('2-1/2 SWR Solfit Bend 45°', 75),
  p('3 SWR Solfit Bend 45°', 110),
  p('4 SWR Solfit Bend 45°', 135),
  p('6 SWR Solfit Bend 45°', 383),

  // ── Heavy Coupler (Solfit) ──
  p('2-1/2 SWR Solfit Heavy Coupler', 74),
  p('4 SWR Solfit Heavy Coupler', 189),

  // ── Coupler / Socket (Solfit) ──
  p('1-1/4 SWR Solfit Coupler', 20),
  p('1-1/2 SWR Solfit Coupler', 27),
  p('2 SWR Solfit Coupler', 43),
  p('2-1/2 SWR Solfit Coupler', 97),
  p('3 SWR Solfit Coupler', 105),
  p('4 SWR Solfit Coupler', 169),
  p('5 SWR Solfit Coupler', 262),
  p('6 SWR Solfit Coupler', 487),
  p('8 SWR Solfit Coupler', 1549),
  p('10 SWR Solfit Coupler', 1549),
  p('12 SWR Solfit Coupler', 3095),

  // ── Single Tee (Solfit) ──
  p('2-1/2 SWR Solfit Single Tee', 125),
  p('3 SWR Solfit Single Tee', 188),
  p('4 SWR Solfit Single Tee', 237),
  p('6 SWR Solfit Single Tee', 628),

  // ── Door Tee (Solfit) ──
  p('2-1/2 SWR Solfit Door Tee', 153),
  p('3 SWR Solfit Door Tee', 236),
  p('4 SWR Solfit Door Tee', 276),
  p('6 SWR Solfit Door Tee', 699),

  // ── Double Tee / Cross Tee (Solfit) ──
  p('2-1/2 SWR Solfit Double Tee', 178),
  p('3 SWR Solfit Double Tee', 231),
  p('4 SWR Solfit Double Tee', 275),

  // ── Double Tee with Door (Solfit) ──
  p('2-1/2 SWR Solfit Double Tee Door', 215),
  p('3 SWR Solfit Double Tee Door', 284),
  p('4 SWR Solfit Double Tee Door', 379),

  // ── Single Y (Solfit) ──
  p('2-1/2 SWR Solfit Single Y', 148),
  p('3 SWR Solfit Single Y', 221),
  p('4 SWR Solfit Single Y', 294),
  p('6 SWR Solfit Single Y', 780),

  // ── Single Y with Door (Solfit) ──
  p('2-1/2 SWR Solfit Single Y Door', 187),
  p('3 SWR Solfit Single Y Door', 297),
  p('4 SWR Solfit Single Y Door', 382),
  p('6 SWR Solfit Single Y Door', 983),

  // ── Double Y (Solfit) ──
  p('2-1/2 SWR Solfit Double Y', 202),
  p('3 SWR Solfit Double Y', 288),
  p('4 SWR Solfit Double Y', 394),

  // ── Double Y with Door (Solfit) ──
  p('2-1/2 SWR Solfit Double Y Door', 272),
  p('3 SWR Solfit Double Y Door', 359),
  p('4 SWR Solfit Double Y Door', 501),

  // ── Reducing Y with Door (Solfit) ──
  p('4x2-1/2 SWR Solfit Reducing Y Door', 292),

  // ── Reducing Y without Door (Solfit) ──
  p('4x2-1/2 SWR Solfit Reducing Y', 243),

  // ── Cleaning Pipe (Solfit) ──
  p('2-1/2 SWR Solfit Cleaning Pipe', 129),
  p('3 SWR Solfit Cleaning Pipe', 189),
  p('4 SWR Solfit Cleaning Pipe', 239),
  p('6 SWR Solfit Cleaning Pipe', 477),

  // ── Reducing Tee (Solfit) ──
  p('3x2-1/2 SWR Solfit Reducing Tee', 166),
  p('4x2-1/2 SWR Solfit Reducing Tee', 236),
  p('6x4 SWR Solfit Reducing Tee', 549),

  // ── Reducing Door Tee (Solfit) ──
  p('3x2-1/2 SWR Solfit Reducing Door Tee', 209),
  p('4x2-1/2 SWR Solfit Reducing Door Tee', 285),
  p('6x4 SWR Solfit Reducing Door Tee', 599),

  // ── Reducer / Eccentric Reducer (Solfit) ──
  p('2x1-1/2 SWR Solfit Reducer', 44),
  p('2-1/2x1-1/2 SWR Solfit Reducer', 50),
  p('2-1/2x2 SWR Solfit Reducer', 60),
  p('4x2-1/2 SWR Solfit Reducer', 104),
  p('4x3 SWR Solfit Reducer', 127),
  p('5x4 SWR Solfit Reducer', 169),
  p('6x4 SWR Solfit Reducer', 219),
  p('8x6 SWR Solfit Reducer', 653),
  p('10x8 SWR Solfit Reducer', 1281),
  p('12x10 SWR Solfit Reducer', 2483),

  // ── Reducer Offset / Eccentric Reducer (Solfit) ──
  p('4x2-1/2 SWR Solfit Reducer Offset', 104),
  p('6x4 SWR Solfit Reducer Offset', 221),

  // ── Repair Coupler (Solfit) ──
  p('2-1/2 SWR Solfit Repair Coupler', 73),
  p('3 SWR Solfit Repair Coupler', 73),
  p('4 SWR Solfit Repair Coupler', 128),
  p('6 SWR Solfit Repair Coupler', 239),

  // ── Reducer Coupler / Concentric Reducer (Solfit) ──
  p('2x1-1/2 SWR Solfit Reducer Coupler', 44),
  p('2-1/2x1-1/2 SWR Solfit Reducer Coupler', 50),
  p('2-1/2x2 SWR Solfit Reducer Coupler', 60),
  p('4x2-1/2 SWR Solfit Reducer Coupler', 104),
  p('4x3 SWR Solfit Reducer Coupler', 127),
  p('5x4 SWR Solfit Reducer Coupler', 169),
  p('6x4 SWR Solfit Reducer Coupler', 219),
  p('8x6 SWR Solfit Reducer Coupler', 653),
  p('10x8 SWR Solfit Reducer Coupler', 1281),
  p('12x10 SWR Solfit Reducer Coupler', 2483),

  // ── Reducing Bush (Solfit) ──
  p('2x1-1/4 SWR Solfit Reducing Bush', 27),
  p('2-1/2x1-1/2 SWR Solfit Reducing Bush', 41),
  p('2-1/2x1-1/4 SWR Solfit Reducing Bush', 48),
  p('2-1/2x1-1/2 SWR Solfit Reducing Bush B', 49),
  p('2-1/2x2 SWR Solfit Reducing Bush', 50),
  p('3x2-1/2 SWR Solfit Reducing Bush', 61),
  p('4x2-1/2 SWR Solfit Reducing Bush', 79),
  p('4x3 SWR Solfit Reducing Bush', 84),
  p('5x4 SWR Solfit Reducing Bush', 148),
  p('6x2-1/2 SWR Solfit Reducing Bush', 191),
  p('6x4 SWR Solfit Reducing Bush', 217),

  // ── Pass Over Bend Type B (Solfit) ──
  p('2-1/2 SWR Solfit Pass Over Bend', 499),
  p('3 SWR Solfit Pass Over Bend', 759),
  p('4 SWR Solfit Pass Over Bend', 924),

  // ── Swept Tee Plain (Solfit) ──
  p('4 SWR Solfit Swept Tee Plain', 264),

  // ── Swept Tee with Door (Solfit) ──
  p('4 SWR Solfit Swept Tee Door', 293),

  // ── SWR Solfit Pipe (Single Stack) ──
  p('4 SWR Solfit Pipe', 3567),

  // ── Stack Aerator v2.0 ──
  p('4 SWR Stack Aerator', 3567),

  // ── Dummy Cap ──
  p('4 SWR Dummy Cap', 122),

  // ── Inspection Plug ──
  p('4 SWR Inspection Plug', 177),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 59 — SWR EQUAL FITTINGS (SOLFIT)                      ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Equal Elbow (Solfit) ──
  p('1-1/4 SWR Solfit Equal Elbow', 32),
  p('1-1/2 SWR Solfit Equal Elbow', 43),
  p('2 SWR Solfit Equal Elbow', 79),
  p('2-1/2 SWR Solfit Equal Elbow', 101),
  p('3 SWR Solfit Equal Elbow', 127),
  p('4 SWR Solfit Equal Elbow', 196),
  p('5 SWR Solfit Equal Elbow', 356),
  p('6 SWR Solfit Equal Elbow', 425),
  p('8 SWR Solfit Equal Elbow', 950),

  // ── Equal Elbow with Door (Solfit) ──
  p('1-1/2 SWR Solfit Equal Elbow Door', 61),
  p('2 SWR Solfit Equal Elbow Door', 99),
  p('2-1/2 SWR Solfit Equal Elbow Door', 110),
  p('3 SWR Solfit Equal Elbow Door', 165),
  p('4 SWR Solfit Equal Elbow Door', 252),
  p('5 SWR Solfit Equal Elbow Door', 404),
  p('6 SWR Solfit Equal Elbow Door', 469),

  // ── Equal Tee (Solfit) ──
  p('1-1/4 SWR Solfit Equal Tee', 41),
  p('1-1/2 SWR Solfit Equal Tee', 75),
  p('2 SWR Solfit Equal Tee', 102),
  p('2-1/2 SWR Solfit Equal Tee', 137),
  p('3 SWR Solfit Equal Tee', 202),
  p('4 SWR Solfit Equal Tee', 306),
  p('5 SWR Solfit Equal Tee', 449),
  p('6 SWR Solfit Equal Tee', 602),
  p('8 SWR Solfit Equal Tee', 1500),

  // ── Equal Tee with Door (Solfit) ──
  p('1-1/2 SWR Solfit Equal Tee Door', 78),
  p('2 SWR Solfit Equal Tee Door', 122),
  p('2-1/2 SWR Solfit Equal Tee Door', 168),
  p('3 SWR Solfit Equal Tee Door', 239),
  p('4 SWR Solfit Equal Tee Door', 352),
  p('5 SWR Solfit Equal Tee Door', 371),
  p('6 SWR Solfit Equal Tee Door', 670),

  // ── Equal Reducer Tee (Solfit) ──
  p('2-1/2x1-1/4 SWR Solfit Equal Reducer Tee', 199),
  p('2-1/2x1-1/2 SWR Solfit Equal Reducer Tee', 177),
  p('2-1/2x2 SWR Solfit Equal Reducer Tee', 137),
  p('4x1-1/4 SWR Solfit Equal Reducer Tee', 334),
  p('4x1-1/2 SWR Solfit Equal Reducer Tee', 336),
  p('4x2 SWR Solfit Equal Reducer Tee', 340),
  p('4x2-1/2 SWR Solfit Equal Reducer Tee', 285),
  p('4x3 SWR Solfit Equal Reducer Tee', 290),

  // ── Equal Reducer Door Tee (Solfit) ──
  p('2-1/2x1-1/4 SWR Solfit Equal Reducer Door Tee', 239),
  p('2-1/2x1-1/2 SWR Solfit Equal Reducer Door Tee', 215),
  p('2-1/2x2 SWR Solfit Equal Reducer Door Tee', 143),
  p('4x1-1/4 SWR Solfit Equal Reducer Door Tee', 388),
  p('4x1-1/2 SWR Solfit Equal Reducer Door Tee', 389),
  p('4x2 SWR Solfit Equal Reducer Door Tee', 394),
  p('4x2-1/2 SWR Solfit Equal Reducer Door Tee', 334),
  p('4x3 SWR Solfit Equal Reducer Door Tee', 348),

  // ── Equal Y (Solfit) ──
  p('1-1/4 SWR Solfit Equal Y', 64),
  p('1-1/2 SWR Solfit Equal Y', 96),
  p('2 SWR Solfit Equal Y', 145),

  // ── Equal Y with Door (Solfit) ──
  p('1-1/2 SWR Solfit Equal Y Door', 113),
  p('2 SWR Solfit Equal Y Door', 172),

  // ── Equal Bend 45° (Solfit) ──
  p('1-1/4 SWR Solfit Equal Bend 45°', 27),
  p('1-1/2 SWR Solfit Equal Bend 45°', 40),
  p('2 SWR Solfit Equal Bend 45°', 65),
  p('2-1/2 SWR Solfit Equal Bend 45°', 88),
  p('3 SWR Solfit Equal Bend 45°', 116),
  p('4 SWR Solfit Equal Bend 45°', 186),
  p('5 SWR Solfit Equal Bend 45°', 284),
  p('6 SWR Solfit Equal Bend 45°', 369),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 60-61 — COMMON FITTINGS (Pushfit & Solfit)             ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── P Trap ──
  p('2-1/2 SWR P Trap', 222),
  p('3 SWR P Trap', 397),
  p('4 SWR P Trap Short', 415),
  p('4 SWR P Trap Long', 477),
  p('4 SWR P Trap Deep', 518),
  p('4-1/2x4 SWR P Trap Large', 614),
  p('4-1/2x4 SWR P Trap Deep Large', 529),

  // ── Q Trap ──
  p('4 SWR Q Trap', 473),
  p('4-1/2x4 SWR Q Trap', 616),

  // ── S Trap ──
  p('4 SWR S Trap', 615),
  p('4-1/2x4 SWR S Trap', 716),

  // ── Bell Mouth Trap ──
  p('4x2-1/2 SWR Bell Mouth Trap PF', 530),
  p('4x2-1/2 SWR Bell Mouth Trap SF', 514),

  // ── Nahani Trap without Jali ──
  p('1-1/2 SWR Nahani Trap', 70),
  p('2 SWR Nahani Trap', 89),
  p('3 SWR Nahani Trap', 171),
  p('4 SWR Nahani Trap', 315),
  p('4x2-1/2 SWR Nahani Trap 5"', 283),
  p('4x3 SWR Nahani Trap 6"', 304),
  p('4x4 SWR Nahani Trap 6"', 349),

  // ── Nahani Trap Single Piece ──
  p('4x2-1/2 SWR Nahani Single', 144),
  p('4x2 SWR Nahani Single', 209),
  p('4x3 SWR Nahani Single', 203),

  // ── Gully Trap with Jali ──
  p('4 SWR Gully Trap Jali', 800),

  // ── Gully Trap without Jali ──
  p('4 SWR Gully Trap', 820),

  // ── Floor Trap ──
  p('4x2 SWR Floor Trap', 200),
  p('4x2-1/2 SWR Floor Trap', 184),

  // ── Multi Trap without Jali ──
  p('4 SWR Multi Trap 4"', 207),
  p('4 SWR Multi Trap 7"', 328),

  // ── Multi Floor Trap with Foul Arrester ──
  p('4 SWR Multi Floor Trap Foul 7"', 395),

  // ── Balcony Floor Drain ──
  p('2-1/2 SWR Balcony Floor Drain', 663),

  // ── Branch Saddle ──
  p('4x1-1/4 SWR Branch Saddle', 92),
  p('4x1-1/2 SWR Branch Saddle', 99),

  // ── Lip Ring ──
  p('4-1/2 SWR Lip Ring', 178),

  // ── End Cap ──
  p('1-1/4 SWR End Cap', 16),
  p('1-1/2 SWR End Cap', 21),
  p('2 SWR End Cap', 38),
  p('2-1/2 SWR End Cap', 43),
  p('3 SWR End Cap', 61),
  p('4 SWR End Cap', 92),
  p('6 SWR End Cap', 229),

  // ── Socket Plug ──
  p('1-1/4 SWR Socket Plug', 11),
  p('1-1/2 SWR Socket Plug', 25),
  p('2 SWR Socket Plug', 32),
  p('2-1/2 SWR Socket Plug', 51),
  p('3 SWR Socket Plug', 57),
  p('4 SWR Socket Plug', 79),
  p('6 SWR Socket Plug', 182),

  // ── Threaded End Plug / Clean Out Plug ──
  p('2 SWR Threaded End Plug', 86),
  p('2-1/2 SWR Threaded End Plug', 111),
  p('3 SWR Threaded End Plug', 148),
  p('4 SWR Threaded End Plug', 251),
  p('6 SWR Threaded End Plug', 407),

  // ── WC Connecter Straight ──
  p('4 SWR WC Connecter Straight', 126),

  // ── WC Connecter Bend ──
  p('4 SWR WC Connecter Bend', 236),

  // ── Anti Siphon ──
  p('2-1/2x1-1/4 SWR Anti Siphon', 378),
  p('2-1/2x1-1/2 SWR Anti Siphon', 345),
  p('2-1/2x2 SWR Anti Siphon', 293),
  p('4x1-1/4 SWR Anti Siphon', 567),
  p('4x1-1/2 SWR Anti Siphon', 617),
  p('4x2 SWR Anti Siphon', 572),
  p('4x2-1/2 SWR Anti Siphon', 517),
  p('4x3 SWR Anti Siphon', 524),

  // ── Height Riser With Wings ──
  p('4 SWR Height Riser Wings', 217),

  // ── Height Riser Without Wings ──
  p('4 SWR Height Riser', 296),

  // ── Multi Trap Partition Cap ──
  p('4 SWR Multi Trap Partition Cap', 3),
  p('4 SWR Multi Trap Partition Cap B', 13),

  // ── Pipe Clips Small Holes ──
  p('2-1/2 SWR Pipe Clip Small', 31),
  p('3 SWR Pipe Clip Small', 31),
  p('4 SWR Pipe Clip Small', 37),
  p('6 SWR Pipe Clip Small', 78),

  // ── Pipe Clips Big Holes ──
  p('2-1/2 SWR Pipe Clip Big', 25),
  p('3 SWR Pipe Clip Big', 31),
  p('4 SWR Pipe Clip Big', 34),
  p('6 SWR Pipe Clip Big', 70),

  // ── Vent Cowl ──
  p('2-1/2 SWR Vent Cowl', 27),
  p('3 SWR Vent Cowl', 36),
  p('4 SWR Vent Cowl', 52),
  p('6 SWR Vent Cowl', 149),

  // ── Door Cap ──
  p('1-1/2 SWR Door Cap', 15),
  p('2 SWR Door Cap', 22),
  p('2-1/2 SWR Door Cap', 42),
  p('3 SWR Door Cap', 57),
  p('4 SWR Door Cap', 61),
  p('6 SWR Door Cap', 184),
  p('8 SWR Door Cap', 268),

  // ── Round Jali for Nahani Traps ──
  p('1-1/2 SWR Round Jali', 11),
  p('2 SWR Round Jali', 16),
  p('3 SWR Round Jali', 17),
  p('4 SWR Round Jali', 32),

  // ── Square Jali ──
  p('6x6 SWR Square Jali', 81),

  // ── Yellow Seal O Ring ──
  p('2-1/2 SWR Yellow Seal O Ring', 15),
  p('3 SWR Yellow Seal O Ring', 20),
  p('4 SWR Yellow Seal O Ring', 31),
  p('6 SWR Yellow Seal O Ring', 53),
  p('8 SWR Yellow Seal O Ring', 82),
  p('10 SWR Yellow Seal O Ring', 242),

  // ── Rubber Gasket for Flange ──
  { name: '1 SWR Rubber Gasket Flange', category: 'swr', price: base(18), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '1-1/4 SWR Rubber Gasket Flange', category: 'swr', price: base(22), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '1-1/2 SWR Rubber Gasket Flange', category: 'swr', price: base(25), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '2 SWR Rubber Gasket Flange', category: 'swr', price: base(32), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '2-1/2 SWR Rubber Gasket Flange', category: 'swr', price: base(46), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '3 SWR Rubber Gasket Flange', category: 'swr', price: base(60), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '4 SWR Rubber Gasket Flange', category: 'swr', price: base(97), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },
  { name: '6 SWR Rubber Gasket Flange', category: 'swr', price: base(128), gst_percent: GST, hsn_code: '40161000', unit: 'NOS', is_active: true },

  // ── Rubber Lubricant ──
  { name: 'SWR Rubber Lubricant 100ml', category: 'swr', price: base(26), gst_percent: GST, hsn_code: '34031900', unit: 'NOS', is_active: true },
  { name: 'SWR Rubber Lubricant 250ml', category: 'swr', price: base(49), gst_percent: GST, hsn_code: '34031900', unit: 'NOS', is_active: true },
  { name: 'SWR Rubber Lubricant 500ml', category: 'swr', price: base(98), gst_percent: GST, hsn_code: '34031900', unit: 'NOS', is_active: true },

  // ── SWR Solvent Cement ──
  { name: 'SWR Solvent Cement 50ml', category: 'other', price: base(71), gst_percent: GST, hsn_code: '35061000', unit: 'NOS', is_active: true },
  { name: 'SWR Solvent Cement 100ml', category: 'other', price: base(78), gst_percent: GST, hsn_code: '35061000', unit: 'NOS', is_active: true },
  { name: 'SWR Solvent Cement 250ml', category: 'other', price: base(169), gst_percent: GST, hsn_code: '35061000', unit: 'NOS', is_active: true },
  { name: 'SWR Solvent Cement 500ml', category: 'other', price: base(296), gst_percent: GST, hsn_code: '35061000', unit: 'NOS', is_active: true },
  { name: 'SWR Solvent Cement 1000ml', category: 'other', price: base(510), gst_percent: GST, hsn_code: '35061000', unit: 'NOS', is_active: true },
  { name: 'SWR Solvent Cement 5000ml', category: 'other', price: base(3162), gst_percent: GST, hsn_code: '35061000', unit: 'NOS', is_active: true },
];

async function seed() {
  console.log(`Seeding ${products.length} SWR products...`);
  let success = 0, failed = 0;

  for (let i = 0; i < products.length; i += 50) {
    const batch = products.slice(i, i + 50);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(batch),
    });
    if (res.ok) {
      const data = await res.json();
      success += data.length;
      console.log(`  Batch ${Math.floor(i/50)+1}: ${data.length} inserted`);
    } else {
      const err = await res.text();
      console.error(`  Batch ${Math.floor(i/50)+1} FAILED:`, err.slice(0, 300));
      failed += batch.length;
    }
  }
  console.log(`\nTotal: ${success} inserted, ${failed} failed out of ${products.length}`);
}

seed().catch(console.error);
