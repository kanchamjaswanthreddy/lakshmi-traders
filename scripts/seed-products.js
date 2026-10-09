// Complete CPVC Product Catalog — Ashirvad FlowGuard Plus Price List (w.e.f. 01 Mar 2025)
// Every single row from the PDF, verified page by page
// Naming: "SIZE CPVC ProductType" — e.g. "1/2 CPVC Elbow 90°"
// Price = MRP / 1.18 (MRP includes 18% GST, we store base price)

const SUPABASE_URL = 'https://rmlivwqapxlvzdwpzbcp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbGl2d3FhcHhsdnpkd3B6YmNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyOTY2NiwiZXhwIjoyMDk2NTA1NjY2fQ.1lfEPkNsC8YIv_XBztomHYrdUtU0MZxqy2AS2zMLwFc';

const HSN = '39172390';
const GST = 18;
function base(mrp) { return Math.round((mrp / 1.18) * 100) / 100; }
function p(name, mrp, unit = 'NOS', cat = 'cpvc') {
  return { name, category: cat, price: base(mrp), gst_percent: GST, hsn_code: HSN, unit, is_active: true };
}

const products = [

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 7 — PIPES, ELBOWS, BENDS, TEES                       ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Pipe SDR 11 (Class 1) 3 mtr ──
  p('1/2 CPVC Pipe 3m SDR11', 120, 'PCS'),
  p('3/4 CPVC Pipe 3m SDR11', 166, 'PCS'),
  p('1 CPVC Pipe 3m SDR11', 257, 'PCS'),
  p('1-1/4 CPVC Pipe 3m SDR11', 427, 'PCS'),
  p('1-1/2 CPVC Pipe 3m SDR11', 593, 'PCS'),
  p('2 CPVC Pipe 3m SDR11', 1001, 'PCS'),

  // ── Pipe SDR 11 (Class 1) 5 mtr ──
  p('1/2 CPVC Pipe 5m SDR11', 600, 'PCS'),
  p('3/4 CPVC Pipe 5m SDR11', 830, 'PCS'),
  p('1 CPVC Pipe 5m SDR11', 1285, 'PCS'),
  p('1-1/4 CPVC Pipe 5m SDR11', 2135, 'PCS'),
  p('1-1/2 CPVC Pipe 5m SDR11', 2965, 'PCS'),
  p('2 CPVC Pipe 5m SDR11', 5005, 'PCS'),

  // ── Pipe SDR 13.5 (Class 2) 3 mtr ──
  p('1/2 CPVC Pipe 3m SDR13.5', 105, 'PCS'),
  p('3/4 CPVC Pipe 3m SDR13.5', 154, 'PCS'),
  p('1 CPVC Pipe 3m SDR13.5', 221, 'PCS'),
  p('1-1/4 CPVC Pipe 3m SDR13.5', 361, 'PCS'),
  p('1-1/2 CPVC Pipe 3m SDR13.5', 496, 'PCS'),
  p('2 CPVC Pipe 3m SDR13.5', 834, 'PCS'),

  // ── Pipe SDR 13.5 (Class 2) 5 mtr ──
  p('1/2 CPVC Pipe 5m SDR13.5', 525, 'PCS'),
  p('3/4 CPVC Pipe 5m SDR13.5', 770, 'PCS'),
  p('1 CPVC Pipe 5m SDR13.5', 1105, 'PCS'),
  p('1-1/4 CPVC Pipe 5m SDR13.5', 1805, 'PCS'),
  p('1-1/2 CPVC Pipe 5m SDR13.5', 2480, 'PCS'),
  p('2 CPVC Pipe 5m SDR13.5', 4170, 'PCS'),

  // ── Elbow 90° ──
  p('1/2 CPVC Elbow 90°', 26),
  p('3/4 CPVC Elbow 90°', 28),
  p('1 CPVC Elbow 90°', 58),
  p('1-1/4 CPVC Elbow 90°', 130),
  p('1-1/2 CPVC Elbow 90°', 239),
  p('2 CPVC Elbow 90°', 502),

  // ── Reducer Elbow 90° ──
  p('3/4x1/2 CPVC Reducer Elbow 90°', 51),
  p('1x1/2 CPVC Reducer Elbow 90°', 77),
  p('1x3/4 CPVC Reducer Elbow 90°', 120),
  p('1-1/4x3/4 CPVC Reducer Elbow 90°', 143),
  p('1-1/4x1 CPVC Reducer Elbow 90°', 150),
  p('1-1/2x3/4 CPVC Reducer Elbow 90°', 177),
  p('1-1/2x1 CPVC Reducer Elbow 90°', 215),
  p('1-1/2x1-1/4 CPVC Reducer Elbow 90°', 258),
  p('2x3/4 CPVC Reducer Elbow 90°', 489),
  p('2x1 CPVC Reducer Elbow 90°', 499),
  p('2x1-1/4 CPVC Reducer Elbow 90°', 513),
  p('2x1-1/2 CPVC Reducer Elbow 90°', 538),

  // ── Elbow 45° ──
  p('1/2 CPVC Elbow 45°', 30),
  p('3/4 CPVC Elbow 45°', 43),
  p('1 CPVC Elbow 45°', 73),
  p('1-1/4 CPVC Elbow 45°', 168),
  p('1-1/2 CPVC Elbow 45°', 257),
  p('2 CPVC Elbow 45°', 529),

  // ── 3 Way Elbow ──
  p('3/4 CPVC 3 Way Elbow', 350),

  // ── Sweep Bend (Socket at Both Sides) ──
  p('1/2 CPVC Sweep Bend', 92),
  p('3/4 CPVC Sweep Bend', 73),
  p('1 CPVC Sweep Bend', 122),
  p('1-1/4 CPVC Sweep Bend', 200),
  p('1-1/2 CPVC Sweep Bend', 396),
  p('2 CPVC Sweep Bend', 509),

  // ── Step Over Bend ──
  p('1/2 CPVC Step Over Bend', 100),
  p('3/4 CPVC Step Over Bend', 134),
  p('3/4 CPVC Step Over Bend (9084)', 100),
  p('1 CPVC Step Over Bend', 260),
  p('1-1/4 CPVC Step Over Bend', 364),
  p('1-1/2 CPVC Step Over Bend', 436),
  p('2 CPVC Step Over Bend', 1080),

  // ── Tee ──
  p('1/2 CPVC Tee', 36),
  p('3/4 CPVC Tee', 49),
  p('1 CPVC Tee', 73),
  p('1-1/4 CPVC Tee', 168),
  p('1-1/2 CPVC Tee', 296),
  p('2 CPVC Tee', 638),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 8 — REDUCER TEES, COUPLERS, BUSHINGS                  ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Reducer Tee ──
  p('1/2x1/2x3/4 CPVC Reducer Tee', 77),
  p('3/4x1/2x1/2 CPVC Reducer Tee', 77),
  p('3/4x1/2x3/4 CPVC Reducer Tee', 72),
  p('3/4x3/4x1/2 CPVC Reducer Tee', 77),
  p('1x1x1/2 CPVC Reducer Tee', 123),
  p('1x1x3/4 CPVC Reducer Tee', 136),
  p('1-1/4x1-1/4x1/2 CPVC Reducer Tee', 222),
  p('1-1/4x1-1/4x3/4 CPVC Reducer Tee', 259),
  p('1-1/4x1-1/4x1 CPVC Reducer Tee', 215),
  p('1-1/2x1-1/2x3/4 CPVC Reducer Tee', 357),
  p('1-1/2x1-1/2x1 CPVC Reducer Tee', 353),
  p('1-1/2x1-1/2x1-1/4 CPVC Reducer Tee', 352),
  p('2x2x1/2 CPVC Reducer Tee', 343),
  p('2x2x3/4 CPVC Reducer Tee', 653),
  p('2x2x1 CPVC Reducer Tee', 679),
  p('2x2x1-1/4 CPVC Reducer Tee', 654),
  p('2x2x1-1/2 CPVC Reducer Tee', 723),
  p('2x2x2x1-1/2 CPVC Reducer Tee', 670),

  // ── Cross Tee ──
  p('1/2 CPVC Cross Tee', 46),
  p('3/4 CPVC Cross Tee', 97),
  p('1 CPVC Cross Tee', 162),

  // ── Coupler ──
  p('1/2 CPVC Coupler', 21),
  p('3/4 CPVC Coupler', 25),
  p('1 CPVC Coupler', 40),
  p('1-1/4 CPVC Coupler', 82),
  p('1-1/2 CPVC Coupler', 148),
  p('2 CPVC Coupler', 307),

  // ── Reducer Coupler ──
  p('3/4x1/2 CPVC Reducer Coupler', 38),
  p('1x1/2 CPVC Reducer Coupler', 53),
  p('1x3/4 CPVC Reducer Coupler', 57),
  p('1-1/4x1/2 CPVC Reducer Coupler', 121),
  p('1-1/4x3/4 CPVC Reducer Coupler', 116),
  p('1-1/4x1 CPVC Reducer Coupler', 123),
  p('1-1/2x1/2 CPVC Reducer Coupler', 156),
  p('1-1/2x3/4 CPVC Reducer Coupler', 161),
  p('1-1/2x1 CPVC Reducer Coupler', 166),
  p('1-1/2x1-1/4 CPVC Reducer Coupler', 171),
  p('2x1/2 CPVC Reducer Coupler', 276),
  p('2x3/4 CPVC Reducer Coupler', 291),
  p('2x1 CPVC Reducer Coupler', 303),
  p('2x1-1/4 CPVC Reducer Coupler', 330),
  p('2x1-1/2 CPVC Reducer Coupler', 410),

  // ── Bushing ──
  p('3/4x1/2 CPVC Bushing', 22),
  p('1x1/2 CPVC Bushing', 44),
  p('1x3/4 CPVC Bushing', 30),
  p('1-1/4x1/2 CPVC Bushing', 81),
  p('1-1/4x3/4 CPVC Bushing', 58),
  p('1-1/4x1 CPVC Bushing', 30),
  p('1-1/2x3/4 CPVC Bushing', 104),
  p('1-1/2x1 CPVC Bushing', 94),
  p('1-1/2x1-1/4 CPVC Bushing', 91),
  p('2x1 CPVC Bushing', 68),
  p('2x1-1/4 CPVC Bushing', 194),
  p('2x3/4 CPVC Bushing', 180),
  p('2x1-1/2 CPVC Bushing', 180),
  p('2x1-1/4 CPVC Bushing B', 194),
  p('2-1/2x1-1/2 CPVC Bushing', 52),

  // ── Converter Bushing (CTS) ──
  p('1/2 CPVC Converter Bushing', 22),
  p('3/4 CPVC Converter Bushing', 26),
  p('1 CPVC Converter Bushing', 40),
  p('1-1/4 CPVC Converter Bushing', 71),
  p('1-1/2 CPVC Converter Bushing', 87),
  p('2 CPVC Converter Bushing', 132),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 9 — ADAPTERS, END CAPS, NIPPLES, UNIONS, VALVES       ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Female Adapter Plastic Threaded (FAPT) ──
  p('1/2 CPVC FAPT', 32),
  p('3/4 CPVC FAPT', 47),
  p('1 CPVC FAPT', 67),
  p('1-1/4 CPVC FAPT', 180),
  p('1-1/2 CPVC FAPT', 234),
  p('2 CPVC FAPT', 367),

  // ── Male Adapter Plastic Threaded (MAPT) ──
  p('1/2 CPVC MAPT', 25),
  p('3/4 CPVC MAPT', 35),
  p('1 CPVC MAPT', 53),
  p('1-1/4 CPVC MAPT', 91),
  p('1-1/2 CPVC MAPT', 133),
  p('2 CPVC MAPT', 258),

  // ── Reducing Male Adapter Plastic Threaded ──
  p('3/4x1/2 CPVC Reducing MAPT', 49),
  p('1x3/4 CPVC Reducing MAPT', 65),

  // ── End Cap ──
  p('1/2 CPVC End Cap', 17),
  p('3/4 CPVC End Cap', 21),
  p('1 CPVC End Cap', 34),
  p('1-1/4 CPVC End Cap', 72),
  p('1-1/2 CPVC End Cap', 103),
  p('2 CPVC End Cap', 220),

  // ── Flange with Gasket - End Cap Open ──
  p('1 CPVC Flange Open', 446),
  p('1-1/4 CPVC Flange Open', 548),
  p('1-1/2 CPVC Flange Open', 718),
  p('2 CPVC Flange Open', 1038),

  // ── Flange with Gasket - End Cap Closed ──
  p('1 CPVC Flange Closed', 459),
  p('1-1/4 CPVC Flange Closed', 559),
  p('1-1/2 CPVC Flange Closed', 742),
  p('2 CPVC Flange Closed', 1051),

  // ── Tank Nipple ──
  p('1/2 CPVC Tank Nipple', 91),
  p('3/4 CPVC Tank Nipple', 100),
  p('1 CPVC Tank Nipple', 151),
  p('1-1/4 CPVC Tank Nipple', 234),
  p('1-1/2 CPVC Tank Nipple', 341),
  p('2 CPVC Tank Nipple', 536),
  p('2-1/2 CPVC Tank Nipple', 2217),
  p('3 CPVC Tank Nipple', 2913),
  p('4 CPVC Tank Nipple', 5578),

  // ── Tank Nipple (One Side Pipe Fitment) ──
  p('3/4 CPVC Tank Nipple One Side', 84),
  p('1 CPVC Tank Nipple One Side', 132),
  p('1-1/4 CPVC Tank Nipple One Side', 231),
  p('1-1/2 CPVC Tank Nipple One Side', 312),
  p('2 CPVC Tank Nipple One Side', 546),

  // ── Hex Nipple ──
  p('3/4 CPVC Hex Nipple', 38),
  p('1 CPVC Hex Nipple', 61),
  p('1-1/4 CPVC Hex Nipple', 91),
  p('1-1/2 CPVC Hex Nipple', 135),
  p('2 CPVC Hex Nipple', 199),

  // ── Union ──
  p('1/2 CPVC Union', 87),
  p('3/4 CPVC Union', 134),
  p('1 CPVC Union', 162),
  p('1-1/4 CPVC Union', 273),
  p('1-1/2 CPVC Union', 449),
  p('2 CPVC Union', 811),

  // ── Non Return Valve ──
  p('3/4 CPVC Non Return Valve', 450),
  p('1 CPVC Non Return Valve', 860),
  p('1-1/4 CPVC Non Return Valve', 1357),
  p('1-1/2 CPVC Non Return Valve', 2085),
  p('2 CPVC Non Return Valve', 4945),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 10 — BALL VALVES, BRASS FITTINGS                      ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Ball Valve Handle ──
  p('1/2 CPVC Ball Valve Handle', 25),
  p('3/4 CPVC Ball Valve Handle', 37),
  p('1 CPVC Ball Valve Handle', 56),
  p('1-1/4 CPVC Ball Valve Handle', 87),
  p('1-1/2 CPVC Ball Valve Handle', 105),
  p('2 CPVC Ball Valve Handle', 162),
  p('2-1/2 CPVC Ball Valve Handle', 187),
  p('3 CPVC Ball Valve Handle', 207),
  p('4 CPVC Ball Valve Handle', 252),

  // ── Ball Valve ──
  p('1/2 CPVC Ball Valve', 158),
  p('3/4 CPVC Ball Valve', 273),
  p('1 CPVC Ball Valve', 507),
  p('1-1/4 CPVC Ball Valve', 890),
  p('1-1/2 CPVC Ball Valve', 1400),
  p('2 CPVC Ball Valve', 2465),

  // ── Ball Valve With Union Ends ──
  p('3/4 CPVC Ball Valve Union Ends', 394),
  p('1 CPVC Ball Valve Union Ends', 595),
  p('1-1/4 CPVC Ball Valve Union Ends', 990),
  p('1-1/2 CPVC Ball Valve Union Ends', 1520),
  p('2 CPVC Ball Valve Union Ends', 3038),

  // ── Ball Valve With Brass Threaded (One Side) ──
  p('3/4 CPVC Ball Valve Brass 1 Side', 358),
  p('1 CPVC Ball Valve Brass 1 Side', 627),
  p('1-1/4 CPVC Ball Valve Brass 1 Side', 1078),

  // ── Ball Valve With Brass Threaded (Two Side) ──
  p('3/4 CPVC Ball Valve Brass 2 Side', 432),
  p('1 CPVC Ball Valve Brass 2 Side', 760),
  p('1-1/4 CPVC Ball Valve Brass 2 Side', 1275),

  // ── Elbow 90° Brass ──
  p('1/2x1/2 CPVC Brass Elbow 90°', 102),
  p('3/4x1/2 CPVC Brass Elbow 90°', 106),
  p('3/4x3/4 CPVC Brass Elbow 90°', 152),
  p('1x1/2 CPVC Brass Elbow 90°', 195),
  p('1x3/4 CPVC Brass Elbow 90°', 303),
  p('1x1 CPVC Brass Elbow 90°', 586),
  p('1-1/4x1/2 CPVC Brass Elbow 90°', 359),
  p('1-1/4x3/4 CPVC Brass Elbow 90°', 420),
  p('1-1/4x1-1/4 CPVC Brass Elbow 90°', 759),

  // ── Brass Elbow With Clamp ──
  p('3/4x1/2 CPVC Brass Elbow Clamp', 142),

  // ── Tee Brass ──
  p('1/2x1/2x1/2 CPVC Brass Tee', 129),
  p('3/4x3/4x1/2 CPVC Brass Tee', 130),
  p('3/4x3/4x3/4 CPVC Brass Tee', 194),
  p('1x1x1/2 CPVC Brass Tee', 224),
  p('1x1x3/4 CPVC Brass Tee', 329),
  p('1x1x1 CPVC Brass Tee', 412),
  p('1-1/4x1-1/4x1/2 CPVC Brass Tee', 424),

  // ── Male Adapter Brass Threaded (MABT) ──
  p('1/2 CPVC MABT', 236),
  p('3/4 CPVC MABT', 302),
  p('1 CPVC MABT', 478),
  p('1-1/4 CPVC MABT', 992),
  p('1-1/2 CPVC MABT', 1240),
  p('2 CPVC MABT', 2374),
  p('2-1/2 CPVC MABT', 3600),
  p('3 CPVC MABT', 4989),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  PAGE 11 — REDUCING MABT, UNION MABT                        ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ── Reducing Male Adapter Brass Threaded ──
  p('3/4x1/2 CPVC Reducing MABT', 188),
  p('1x1/2 CPVC Reducing MABT', 312),
  p('1x3/4 CPVC Reducing MABT', 322),

  // ── Reducing MABT (Ring Type) ──
  p('3/4x1/2 CPVC Reducing MABT Ring', 151),

  // ── Union MABT ──
  p('3/4 CPVC Union MABT', 444),
  p('1 CPVC Union MABT', 727),

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  SOLVENTS (Other category)                                   ║
  // ╚══════════════════════════════════════════════════════════════╝
  p('CPVC Solvent Cement 50ml', 85, 'NOS', 'other'),
  p('CPVC Solvent Cement 100ml', 145, 'NOS', 'other'),
  p('CPVC Solvent Cement 200ml', 260, 'NOS', 'other'),
  p('CPVC Solvent Cement 500ml', 575, 'NOS', 'other'),
];

async function seed() {
  console.log(`Seeding ${products.length} CPVC products...`);
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
      console.error(`  Batch ${Math.floor(i/50)+1} FAILED:`, err.slice(0, 200));
      failed += batch.length;
    }
  }
  console.log(`\nTotal: ${success} inserted, ${failed} failed out of ${products.length}`);
}

seed().catch(console.error);
