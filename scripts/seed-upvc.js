// Complete UPVC Product Catalog — Ashirvad Aqualife uPVC Price List (w.e.f. 01 Mar 2025)
// Pages 27-31 of the PDF. Every row extracted.
// Naming: "SIZE UPVC ProductType" — e.g. "1/2 UPVC Elbow 90° SCH80"
// Price = MRP / 1.18 (MRP includes 18% GST, we store base price)

const SUPABASE_URL = 'https://rmlivwqapxlvzdwpzbcp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbGl2d3FhcHhsdnpkd3B6YmNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyOTY2NiwiZXhwIjoyMDk2NTA1NjY2fQ.1lfEPkNsC8YIv_XBztomHYrdUtU0MZxqy2AS2zMLwFc';

const HSN = '39172390';
const GST = 18;
function base(mrp) { return Math.round((mrp / 1.18) * 100) / 100; }
function p(name, mrp, unit = 'NOS') {
  return { name, category: 'upvc', price: base(mrp), gst_percent: GST, hsn_code: HSN, unit, is_active: true };
}

const products = [

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 27 — UPVC PIPES                                       ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Pipe SCH 40 — 3m length ──
  p('1/2 UPVC Pipe 3m SCH40', 222, 'PCS'),
  p('3/4 UPVC Pipe 3m SCH40', 279, 'PCS'),
  p('1 UPVC Pipe 3m SCH40', 417, 'PCS'),
  p('1-1/4 UPVC Pipe 3m SCH40', 594, 'PCS'),
  p('1-1/2 UPVC Pipe 3m SCH40', 702, 'PCS'),
  p('2 UPVC Pipe 3m SCH40', 972, 'PCS'),
  p('2-1/2 UPVC Pipe 3m SCH40', 1521, 'PCS'),
  p('3 UPVC Pipe 3m SCH40', 1962, 'PCS'),
  p('4 UPVC Pipe 3m SCH40', 2787, 'PCS'),

  // ── Pipe SCH 40 — 6m length ──
  p('1/2 UPVC Pipe 6m SCH40', 444, 'PCS'),
  p('3/4 UPVC Pipe 6m SCH40', 558, 'PCS'),
  p('1 UPVC Pipe 6m SCH40', 834, 'PCS'),
  p('1-1/4 UPVC Pipe 6m SCH40', 1188, 'PCS'),
  p('1-1/2 UPVC Pipe 6m SCH40', 1404, 'PCS'),
  p('2 UPVC Pipe 6m SCH40', 1944, 'PCS'),
  p('2-1/2 UPVC Pipe 6m SCH40', 3042, 'PCS'),
  p('3 UPVC Pipe 6m SCH40', 3924, 'PCS'),

  // ── Pipe SCH 80 — 3m length ──
  p('1/2 UPVC Pipe 3m SCH80', 285, 'PCS'),
  p('3/4 UPVC Pipe 3m SCH80', 357, 'PCS'),
  p('1 UPVC Pipe 3m SCH80', 543, 'PCS'),
  p('1-1/4 UPVC Pipe 3m SCH80', 759, 'PCS'),
  p('1-1/2 UPVC Pipe 3m SCH80', 956, 'PCS'),
  p('2 UPVC Pipe 3m SCH80', 1289, 'PCS'),
  p('2-1/2 UPVC Pipe 3m SCH80', 1947, 'PCS'),
  p('3 UPVC Pipe 3m SCH80', 2553, 'PCS'),
  p('4 UPVC Pipe 3m SCH80', 3843, 'PCS'),

  // ── Pipe SCH 80 — 6m length ──
  p('1/2 UPVC Pipe 6m SCH80', 570, 'PCS'),
  p('3/4 UPVC Pipe 6m SCH80', 714, 'PCS'),
  p('1 UPVC Pipe 6m SCH80', 1086, 'PCS'),
  p('1-1/4 UPVC Pipe 6m SCH80', 1518, 'PCS'),
  p('1-1/2 UPVC Pipe 6m SCH80', 1872, 'PCS'),
  p('2 UPVC Pipe 6m SCH80', 2562, 'PCS'),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 27 — ELBOWS, BENDS                                    ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Elbow 90° SCH 40 ──
  p('1/2 UPVC Elbow 90° SCH40', 13),
  p('3/4 UPVC Elbow 90° SCH40', 16),
  p('1 UPVC Elbow 90° SCH40', 31),
  p('1-1/4 UPVC Elbow 90° SCH40', 47),
  p('1-1/2 UPVC Elbow 90° SCH40', 62),
  p('2 UPVC Elbow 90° SCH40', 85),

  // ── Elbow 90° SCH 80 ──
  p('1/2 UPVC Elbow 90° SCH80', 15),
  p('3/4 UPVC Elbow 90° SCH80', 17),
  p('1 UPVC Elbow 90° SCH80', 33),
  p('1-1/4 UPVC Elbow 90° SCH80', 51),
  p('1-1/2 UPVC Elbow 90° SCH80', 65),
  p('2 UPVC Elbow 90° SCH80', 87),
  p('2-1/2 UPVC Elbow 90° SCH80', 277),
  p('3 UPVC Elbow 90° SCH80', 402),
  p('4 UPVC Elbow 90° SCH80', 687),
  p('6 UPVC Elbow 90° SCH80', 1717),

  // ── Elbow Reducer 90° SCH 80 ──
  p('3/4x1/2 UPVC Reducer Elbow 90°', 26),
  p('1x1/2 UPVC Reducer Elbow 90°', 39),
  p('1x3/4 UPVC Reducer Elbow 90°', 26),

  // ── Elbow 45° SCH 80 ──
  p('1/2 UPVC Elbow 45°', 15),
  p('3/4 UPVC Elbow 45°', 23),
  p('1 UPVC Elbow 45°', 27),
  p('1-1/4 UPVC Elbow 45°', 41),
  p('1-1/2 UPVC Elbow 45°', 68),
  p('2 UPVC Elbow 45°', 106),
  p('2-1/2 UPVC Elbow 45°', 244),

  // ── Sweep Bend Without Socket SCH 80 ──
  p('2-1/2 UPVC Sweep Bend W/O Socket', 693),
  p('3 UPVC Sweep Bend W/O Socket', 1083),
  p('4 UPVC Sweep Bend W/O Socket', 2192),

  // ── Sweep Bend Socket Both Sides SCH 80 ──
  p('1/2 UPVC Sweep Bend', 27),
  p('3/4 UPVC Sweep Bend', 44),
  p('1 UPVC Sweep Bend', 73),
  p('1-1/4 UPVC Sweep Bend', 122),
  p('1-1/2 UPVC Sweep Bend', 167),
  p('2 UPVC Sweep Bend', 279),

  // ── Step Over Bend SCH 80 ──
  p('1/2 UPVC Step Over Bend', 52),
  p('3/4 UPVC Step Over Bend', 87),
  p('1 UPVC Step Over Bend', 163),
  p('1-1/4 UPVC Step Over Bend', 272),
  p('1-1/2 UPVC Step Over Bend', 427),
  p('2 UPVC Step Over Bend', 641),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 28 — TEES, COUPLERS                                   ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Tee SCH 80 ──
  p('1/2 UPVC Tee SCH80', 16),
  p('3/4 UPVC Tee SCH80', 25),
  p('1 UPVC Tee SCH80', 57),
  p('1-1/4 UPVC Tee SCH80', 65),
  p('1-1/2 UPVC Tee SCH80', 83),
  p('2 UPVC Tee SCH80', 124),
  p('2-1/2 UPVC Tee SCH80', 376),
  p('3 UPVC Tee SCH80', 555),
  p('4 UPVC Tee SCH80', 925),
  p('6 UPVC Tee SCH80', 2186),

  // ── Tee SCH 40 ──
  p('1/2 UPVC Tee SCH40', 16),
  p('3/4 UPVC Tee SCH40', 20),
  p('1 UPVC Tee SCH40', 42),
  p('1-1/4 UPVC Tee SCH40', 59),
  p('1-1/2 UPVC Tee SCH40', 78),
  p('2 UPVC Tee SCH40', 115),

  // ── Reducer Tee SCH 80 ──
  p('1x1x1/2 UPVC Reducer Tee', 52),
  p('1x1x3/4 UPVC Reducer Tee', 55),
  p('1-1/4x1-1/4x3/4 UPVC Reducer Tee', 60),
  p('1-1/4x1-1/4x1 UPVC Reducer Tee', 79),
  p('1-1/2x1-1/2x1/2 UPVC Reducer Tee', 100),
  p('1-1/2x1-1/2x3/4 UPVC Reducer Tee', 101),
  p('1-1/2x1-1/2x1 UPVC Reducer Tee', 102),
  p('1-1/2x1-1/2x1-1/4 UPVC Reducer Tee', 109),
  p('2x2x1/2 UPVC Reducer Tee', 149),
  p('2x2x3/4 UPVC Reducer Tee', 152),
  p('2x2x1 UPVC Reducer Tee', 156),
  p('2x2x1-1/4 UPVC Reducer Tee', 162),
  p('2x2x1-1/2 UPVC Reducer Tee', 165),
  p('2-1/2x2-1/2x3/4 UPVC Reducer Tee', 341),
  p('2-1/2x2-1/2x1 UPVC Reducer Tee', 330),
  p('2-1/2x2-1/2x1-1/4 UPVC Reducer Tee', 363),
  p('2-1/2x2-1/2x1-1/2 UPVC Reducer Tee', 341),
  p('2-1/2x2-1/2x2 UPVC Reducer Tee', 361),
  p('3x3x2 UPVC Reducer Tee', 598),
  p('3x3x2-1/2 UPVC Reducer Tee', 547),

  // ── Reducer Tee SCH 40 ──
  p('1x1x1/2 UPVC Reducer Tee SCH40', 34),
  p('1-1/4x1-1/4x1/2 UPVC Reducer Tee SCH40', 52),
  p('1-1/4x1-1/4x1 UPVC Reducer Tee SCH40', 20),
  p('1-1/2x1-1/2x1/2 UPVC Reducer Tee SCH40', 231),
  p('4 UPVC Reducer Tee SCH40', 364),
  p('6 UPVC Reducer Tee SCH40', 879),

  // ── Cross Tee SCH 80 ──
  p('1/2 UPVC Cross Tee', 34),
  p('3/4 UPVC Cross Tee', 49),
  p('1 UPVC Cross Tee', 76),
  p('1-1/4 UPVC Cross Tee', 137),
  p('1-1/2 UPVC Cross Tee', 185),
  p('2 UPVC Cross Tee', 276),
  p('2-1/2 UPVC Cross Tee', 492),

  // ── Coupler SCH 80 ──
  p('1/2 UPVC Coupler SCH80', 8),
  p('3/4 UPVC Coupler SCH80', 15),
  p('1 UPVC Coupler SCH80', 21),
  p('1-1/4 UPVC Coupler SCH80', 31),
  p('1-1/2 UPVC Coupler SCH80', 40),
  p('2 UPVC Coupler SCH80', 52),
  p('2-1/2 UPVC Coupler SCH80', 163),

  // ── Coupler SCH 40 ──
  p('1/2 UPVC Coupler SCH40', 8),
  p('3/4 UPVC Coupler SCH40', 13),
  p('1 UPVC Coupler SCH40', 20),
  p('1-1/4 UPVC Coupler SCH40', 26),
  p('1-1/2 UPVC Coupler SCH40', 32),
  p('2 UPVC Coupler SCH40', 52),

  // ── uPVC to CPVC Converter Coupler SCH 80 ──
  p('1/2 UPVC-CPVC Converter Coupler', 21),
  p('3/4 UPVC-CPVC Converter Coupler', 29),
  p('1 UPVC-CPVC Converter Coupler', 44),
  p('1-1/4 UPVC-CPVC Converter Coupler', 69),
  p('1-1/2 UPVC-CPVC Converter Coupler', 120),
  p('2 UPVC-CPVC Converter Coupler', 127),

  // ── Converter Coupler Aqua to Agri ──
  p('1 UPVC Aqua-Agri Converter', 40),
  p('1-1/4 UPVC Aqua-Agri Converter', 60),
  p('1-1/2 UPVC Aqua-Agri Converter', 66),
  p('2 UPVC Aqua-Agri Converter', 94),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 29 — REDUCER COUPLERS, BUSHINGS                       ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Reducer Coupler SCH 80 ──
  p('3/4x1/2 UPVC Reducer Coupler', 18),
  p('1x1/2 UPVC Reducer Coupler', 29),
  p('1x3/4 UPVC Reducer Coupler', 29),
  p('1-1/4x1/2 UPVC Reducer Coupler', 39),
  p('1-1/4x3/4 UPVC Reducer Coupler', 39),
  p('1-1/4x1 UPVC Reducer Coupler', 42),
  p('1-1/2x1/2 UPVC Reducer Coupler', 52),
  p('1-1/2x3/4 UPVC Reducer Coupler', 52),
  p('1-1/2x1 UPVC Reducer Coupler', 56),
  p('1-1/2x1-1/4 UPVC Reducer Coupler', 59),
  p('2x1/2 UPVC Reducer Coupler', 75),
  p('2x3/4 UPVC Reducer Coupler', 77),
  p('2x1 UPVC Reducer Coupler', 79),
  p('2x1-1/4 UPVC Reducer Coupler', 86),
  p('2x1-1/2 UPVC Reducer Coupler', 87),
  p('2-1/2x3/4 UPVC Reducer Coupler', 200),
  p('2-1/2x1 UPVC Reducer Coupler', 188),
  p('2-1/2x1-1/4 UPVC Reducer Coupler', 216),
  p('2-1/2x1-1/2 UPVC Reducer Coupler', 198),
  p('2-1/2x2 UPVC Reducer Coupler', 219),
  p('3x2 UPVC Reducer Coupler', 341),
  p('3x2-1/2 UPVC Reducer Coupler', 310),

  // ── Bushing SCH 80 ──
  p('3/4x1/2 UPVC Bushing', 7),
  p('1x1/2 UPVC Bushing', 16),
  p('1x3/4 UPVC Bushing', 11),
  p('1-1/4x1/2 UPVC Bushing', 34),
  p('1-1/4x3/4 UPVC Bushing', 26),
  p('1-1/4x1 UPVC Bushing', 18),
  p('1-1/2x1/2 UPVC Bushing', 36),
  p('1-1/2x3/4 UPVC Bushing', 38),
  p('1-1/2x1 UPVC Bushing', 34),
  p('1-1/2x1-1/4 UPVC Bushing', 19),
  p('2x1/2 UPVC Bushing', 70),
  p('2x3/4 UPVC Bushing', 64),
  p('2x1 UPVC Bushing', 74),
  p('2x1-1/4 UPVC Bushing', 65),
  p('2x1-1/2 UPVC Bushing', 49),
  p('2-1/2x2 UPVC Bushing', 79),
  p('3x2 UPVC Bushing', 197),
  p('3x2-1/2 UPVC Bushing', 132),
  p('4x2 UPVC Bushing', 401),
  p('4x2-1/2 UPVC Bushing', 335),
  p('4x3 UPVC Bushing', 277),
  p('6x2-1/2 UPVC Bushing', 668),
  p('6x3 UPVC Bushing', 659),
  p('6x4 UPVC Bushing', 672),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 30 — ADAPTERS, END CAPS, FLANGES, TANK NIPPLES        ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── FAPT SCH 80 ──
  p('1/2 UPVC FAPT', 11),
  p('3/4 UPVC FAPT', 18),
  p('1 UPVC FAPT', 29),
  p('1-1/4 UPVC FAPT', 40),
  p('1-1/2 UPVC FAPT', 53),
  p('2 UPVC FAPT', 75),
  p('2-1/2 UPVC FAPT', 119),
  p('3 UPVC FAPT', 194),
  p('4 UPVC FAPT', 322),

  // ── MAPT SCH 80 ──
  p('1/2 UPVC MAPT', 10),
  p('3/4 UPVC MAPT', 14),
  p('1 UPVC MAPT', 25),
  p('1-1/4 UPVC MAPT', 34),
  p('1-1/2 UPVC MAPT', 46),
  p('2 UPVC MAPT', 65),
  p('2-1/2 UPVC MAPT', 122),
  p('3 UPVC MAPT', 167),
  p('4 UPVC MAPT', 326),

  // ── Reducing MAPT ──
  p('3/4x1/2 UPVC Reducing MAPT', 14),

  // ── End Cap SCH 80 ──
  p('1/2 UPVC End Cap', 8),
  p('3/4 UPVC End Cap', 12),
  p('1 UPVC End Cap', 22),
  p('1-1/4 UPVC End Cap', 32),
  p('1-1/2 UPVC End Cap', 43),
  p('2 UPVC End Cap', 67),
  p('2-1/2 UPVC End Cap', 111),
  p('3 UPVC End Cap', 160),
  p('4 UPVC End Cap', 277),
  p('6 UPVC End Cap', 682),

  // ── Flange End Cap Open SCH 80 ──
  p('1 UPVC Flange Open', 132),
  p('1-1/4 UPVC Flange Open', 146),
  p('1-1/2 UPVC Flange Open', 204),
  p('2 UPVC Flange Open', 281),
  p('2-1/2 UPVC Flange Open', 365),
  p('3 UPVC Flange Open', 437),
  p('4 UPVC Flange Open', 701),
  p('6 UPVC Flange Open', 1281),

  // ── Flange End Cap Closed SCH 80 ──
  p('1 UPVC Flange Closed', 133),
  p('1-1/4 UPVC Flange Closed', 150),
  p('1-1/2 UPVC Flange Closed', 212),
  p('2 UPVC Flange Closed', 288),
  p('2-1/2 UPVC Flange Closed', 367),
  p('3 UPVC Flange Closed', 440),
  p('4 UPVC Flange Closed', 711),

  // ── Flange with Gasket Open SCH 80 (large) ──
  p('2-1/2 UPVC Flange Gasket Open', 1967),
  p('3 UPVC Flange Gasket Open', 2344),
  p('4 UPVC Flange Gasket Open', 3822),
  p('6 UPVC Flange Gasket Open', 5611),

  // ── Flange with Gasket Closed SCH 80 ──
  p('2-1/2 UPVC Flange Gasket Closed', 2024),
  p('3 UPVC Flange Gasket Closed', 2421),
  p('4 UPVC Flange Gasket Closed', 3985),
  p('6 UPVC Flange Gasket Closed SCH40', 6016),

  // ── Tank Nipple SCH 80 ──
  p('1/2 UPVC Tank Nipple', 31),
  p('3/4 UPVC Tank Nipple', 43),
  p('1 UPVC Tank Nipple', 60),
  p('1-1/4 UPVC Tank Nipple', 75),
  p('1-1/2 UPVC Tank Nipple', 115),
  p('2 UPVC Tank Nipple', 185),
  p('2-1/2 UPVC Tank Nipple', 757),
  p('3 UPVC Tank Nipple', 1002),
  p('4 UPVC Tank Nipple', 1864),

  // ── Tank Nipple One Side Pipe Fitment ──
  p('3/4 UPVC Tank Nipple One Side', 40),
  p('1 UPVC Tank Nipple One Side', 66),
  p('1-1/4 UPVC Tank Nipple One Side', 97),
  p('1-1/2 UPVC Tank Nipple One Side', 124),
  p('2 UPVC Tank Nipple One Side', 182),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 31 — NIPPLES, UNIONS, VALVES, BRASS FITTINGS           ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Hex Nipple ──
  p('3/4 UPVC Hex Nipple', 10),
  p('1 UPVC Hex Nipple', 15),
  p('1-1/4 UPVC Hex Nipple', 24),
  p('1-1/2 UPVC Hex Nipple', 36),
  p('2 UPVC Hex Nipple', 53),

  // ── Union SCH 80 ──
  p('1/2 UPVC Union', 38),
  p('3/4 UPVC Union', 53),
  p('1 UPVC Union', 70),
  p('1-1/4 UPVC Union', 97),
  p('1-1/2 UPVC Union', 194),
  p('2 UPVC Union', 329),
  p('2-1/2 UPVC Union', 508),
  p('3 UPVC Union', 695),
  p('4 UPVC Union', 1045),

  // ── Non Return Valve ──
  p('3/4 UPVC Non Return Valve', 316),
  p('1 UPVC Non Return Valve', 470),
  p('1-1/4 UPVC Non Return Valve', 908),
  p('1-1/2 UPVC Non Return Valve', 1408),
  p('2 UPVC Non Return Valve', 3200),

  // ── Gate Valve ──
  p('1/2 UPVC Gate Valve', 1005),
  p('3/4 UPVC Gate Valve', 1042),
  p('1 UPVC Gate Valve', 1375),

  // ── Ball Valve SCH 80 ──
  p('1/2 UPVC Ball Valve', 91),
  p('3/4 UPVC Ball Valve', 100),
  p('1 UPVC Ball Valve', 183),
  p('1-1/4 UPVC Ball Valve', 348),
  p('1-1/2 UPVC Ball Valve', 848),
  p('2 UPVC Ball Valve', 1420),

  // ── Ball Valve With Brass Threaded One Side ──
  p('3/4 UPVC Ball Valve Brass 1 Side', 307),
  p('1 UPVC Ball Valve Brass 1 Side', 535),
  p('1-1/4 UPVC Ball Valve Brass 1 Side', 712),

  // ── Ball Valve With Brass Threaded Two Side ──
  p('3/4 UPVC Ball Valve Brass 2 Side', 353),
  p('1 UPVC Ball Valve Brass 2 Side', 618),
  p('1-1/4 UPVC Ball Valve Brass 2 Side', 840),

  // ── Ball Valve With Union Ends ──
  p('3/4 UPVC Ball Valve Union Ends', 233),
  p('1 UPVC Ball Valve Union Ends', 305),
  p('1-1/4 UPVC Ball Valve Union Ends', 505),
  p('1-1/2 UPVC Ball Valve Union Ends', 770),
  p('2 UPVC Ball Valve Union Ends', 1350),

  // ── Ball Valve Handle ──
  p('1/2 UPVC Ball Valve Handle', 33),
  p('3/4 UPVC Ball Valve Handle', 48),
  p('1 UPVC Ball Valve Handle', 76),
  p('1-1/4 UPVC Ball Valve Handle', 118),
  p('1-1/2 UPVC Ball Valve Handle', 142),
  p('2 UPVC Ball Valve Handle', 220),
  p('2-1/2 UPVC Ball Valve Handle', 240),
  p('3 UPVC Ball Valve Handle', 255),
  p('4 UPVC Ball Valve Handle', 275),

  // ── Brass Elbow 90° SCH 80 ──
  p('1/2x1/2 UPVC Brass Elbow 90°', 102),
  p('3/4x1/2 UPVC Brass Elbow 90°', 131),
  p('3/4x3/4 UPVC Brass Elbow 90°', 142),
  p('1x1/2 UPVC Brass Elbow 90°', 150),
  p('1x3/4 UPVC Brass Elbow 90°', 268),
  p('1x1 UPVC Brass Elbow 90°', 337),
  p('1-1/4x1/2 UPVC Brass Elbow 90°', 333),

  // ── Brass Tee SCH 80 ──
  p('1/2x1/2x1/2 UPVC Brass Tee', 146),
  p('3/4x3/4x1/2 UPVC Brass Tee', 150),
  p('3/4x3/4x3/4 UPVC Brass Tee', 162),
  p('1x1x1/2 UPVC Brass Tee', 162),
  p('1x1x3/4 UPVC Brass Tee', 322),
  p('1x1x1 UPVC Brass Tee', 439),
  p('1-1/4x1-1/4x1/2 UPVC Brass Tee', 427),
  p('1-1/2x1-1/2x1/2 UPVC Brass Tee', 505),
  p('2x2x1/2 UPVC Brass Tee', 714),
];

async function seed() {
  console.log(`Seeding ${products.length} UPVC products...`);
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
