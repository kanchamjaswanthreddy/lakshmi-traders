// Complete product data extracted from Ashirvad Price List w.e.f. 01 Apr, 2026
// Categories: CPVC, UPVC, SWR PUSHFIT, SWR SOLFIT

export interface SeedCategory {
  name: string;
  description: string;
  regular_discount_pct: number;
  shop_owner_discount_pct: number;
}

export interface SeedProduct {
  category: string;
  name: string;
  unit: string;
  master_price: number;
}

export const categories: SeedCategory[] = [
  { name: "CPVC", description: "CPVC Plumbing System - Hot & Cold Water (FlowGuard Plus)", regular_discount_pct: 0, shop_owner_discount_pct: 0 },
  { name: "UPVC", description: "uPVC Aqualife Plumbing System - Cold Water", regular_discount_pct: 0, shop_owner_discount_pct: 0 },
  { name: "SWR PUSHFIT", description: "SWR Drainage System - Pushfit Type Joints", regular_discount_pct: 0, shop_owner_discount_pct: 0 },
  { name: "SWR SOLFIT", description: "SWR Drainage System - Solfit/Solvent Joints", regular_discount_pct: 0, shop_owner_discount_pct: 0 },
];

export const products: SeedProduct[] = [
  // ============================================================
  // CPVC PLUMBING SYSTEM (FlowGuard Plus)
  // ============================================================

  // --- Pipe SDR 11 (Class 1) 3 mtr ---
  { category: "CPVC", name: "Pipe SDR 11 1.5cm (½\") 3mtr", unit: "mtr", master_price: 383 },
  { category: "CPVC", name: "Pipe SDR 11 2.0cm (¾\") 3mtr", unit: "mtr", master_price: 529 },
  { category: "CPVC", name: "Pipe SDR 11 2.5cm (1\") 3mtr", unit: "mtr", master_price: 819 },
  { category: "CPVC", name: "Pipe SDR 11 3.2cm (1¼\") 3mtr", unit: "mtr", master_price: 1360 },
  { category: "CPVC", name: "Pipe SDR 11 4.0cm (1½\") 3mtr", unit: "mtr", master_price: 1888 },
  { category: "CPVC", name: "Pipe SDR 11 5.0cm (2\") 3mtr", unit: "mtr", master_price: 3187 },

  // --- Pipe SDR 11 (Class 1) 5 mtr ---
  { category: "CPVC", name: "Pipe SDR 11 1.5cm (½\") 5mtr", unit: "mtr", master_price: 637 },
  { category: "CPVC", name: "Pipe SDR 11 2.0cm (¾\") 5mtr", unit: "mtr", master_price: 881 },
  { category: "CPVC", name: "Pipe SDR 11 2.5cm (1\") 5mtr", unit: "mtr", master_price: 1364 },
  { category: "CPVC", name: "Pipe SDR 11 3.2cm (1¼\") 5mtr", unit: "mtr", master_price: 2266 },
  { category: "CPVC", name: "Pipe SDR 11 4.0cm (1½\") 5mtr", unit: "mtr", master_price: 3146 },
  { category: "CPVC", name: "Pipe SDR 11 5.0cm (2\") 5mtr", unit: "mtr", master_price: 5311 },

  // --- Pipe SDR 13.5 (Class 2) 3 mtr ---
  { category: "CPVC", name: "Pipe SDR 13.5 1.5cm (½\") 3mtr", unit: "mtr", master_price: 335 },
  { category: "CPVC", name: "Pipe SDR 13.5 2.0cm (¾\") 3mtr", unit: "mtr", master_price: 491 },
  { category: "CPVC", name: "Pipe SDR 13.5 2.5cm (1\") 3mtr", unit: "mtr", master_price: 704 },
  { category: "CPVC", name: "Pipe SDR 13.5 3.2cm (1¼\") 3mtr", unit: "mtr", master_price: 1150 },
  { category: "CPVC", name: "Pipe SDR 13.5 4.0cm (1½\") 3mtr", unit: "mtr", master_price: 1579 },
  { category: "CPVC", name: "Pipe SDR 13.5 5.0cm (2\") 3mtr", unit: "mtr", master_price: 2656 },

  // --- Pipe SDR 13.5 (Class 2) 5 mtr ---
  { category: "CPVC", name: "Pipe SDR 13.5 1.5cm (½\") 5mtr", unit: "mtr", master_price: 558 },
  { category: "CPVC", name: "Pipe SDR 13.5 2.0cm (¾\") 5mtr", unit: "mtr", master_price: 818 },
  { category: "CPVC", name: "Pipe SDR 13.5 2.5cm (1\") 5mtr", unit: "mtr", master_price: 1174 },
  { category: "CPVC", name: "Pipe SDR 13.5 3.2cm (1¼\") 5mtr", unit: "mtr", master_price: 1916 },
  { category: "CPVC", name: "Pipe SDR 13.5 4.0cm (1½\") 5mtr", unit: "mtr", master_price: 2632 },
  { category: "CPVC", name: "Pipe SDR 13.5 5.0cm (2\") 5mtr", unit: "mtr", master_price: 4425 },

  // --- Elbow 90° ---
  { category: "CPVC", name: "Elbow 90° 1.5cm (½\")", unit: "pc", master_price: 28 },
  { category: "CPVC", name: "Elbow 90° 2.0cm (¾\")", unit: "pc", master_price: 30 },
  { category: "CPVC", name: "Elbow 90° 2.5cm (1\")", unit: "pc", master_price: 62 },
  { category: "CPVC", name: "Elbow 90° 3.2cm (1¼\")", unit: "pc", master_price: 139 },
  { category: "CPVC", name: "Elbow 90° 4.0cm (1½\")", unit: "pc", master_price: 255 },
  { category: "CPVC", name: "Elbow 90° 5.0cm (2\")", unit: "pc", master_price: 534 },

  // --- Reducer Elbow 90° ---
  { category: "CPVC", name: "Reducer Elbow 90° 2.0x1.5 (¾x½\")", unit: "pc", master_price: 55 },
  { category: "CPVC", name: "Reducer Elbow 90° 2.5x1.5 (1x½\")", unit: "pc", master_price: 83 },
  { category: "CPVC", name: "Reducer Elbow 90° 2.5x2.0 (1x¾\")", unit: "pc", master_price: 128 },
  { category: "CPVC", name: "Reducer Elbow 90° 3.2x2.0 (1¼x¾\")", unit: "pc", master_price: 153 },
  { category: "CPVC", name: "Reducer Elbow 90° 3.2x2.5 (1¼x1\")", unit: "pc", master_price: 160 },
  { category: "CPVC", name: "Reducer Elbow 90° 4.0x2.0 (1½x¾\")", unit: "pc", master_price: 189 },
  { category: "CPVC", name: "Reducer Elbow 90° 4.0x2.5 (1½x1\")", unit: "pc", master_price: 229 },
  { category: "CPVC", name: "Reducer Elbow 90° 4.0x3.2 (1½x1¼\")", unit: "pc", master_price: 274 },
  { category: "CPVC", name: "Reducer Elbow 90° 5.0x2.0 (2x¾\")", unit: "pc", master_price: 520 },
  { category: "CPVC", name: "Reducer Elbow 90° 5.0x2.5 (2x1\")", unit: "pc", master_price: 530 },
  { category: "CPVC", name: "Reducer Elbow 90° 5.0x3.2 (2x1¼\")", unit: "pc", master_price: 545 },
  { category: "CPVC", name: "Reducer Elbow 90° 5.0x4.0 (2x1½\")", unit: "pc", master_price: 572 },

  // --- Elbow 45° ---
  { category: "CPVC", name: "Elbow 45° 1.5cm (½\")", unit: "pc", master_price: 32 },
  { category: "CPVC", name: "Elbow 45° 2.0cm (¾\")", unit: "pc", master_price: 47 },
  { category: "CPVC", name: "Elbow 45° 2.5cm (1\")", unit: "pc", master_price: 79 },
  { category: "CPVC", name: "Elbow 45° 3.2cm (1¼\")", unit: "pc", master_price: 180 },
  { category: "CPVC", name: "Elbow 45° 4.0cm (1½\")", unit: "pc", master_price: 273 },
  { category: "CPVC", name: "Elbow 45° 5.0cm (2\")", unit: "pc", master_price: 562 },

  // --- 3 Way Elbow ---
  { category: "CPVC", name: "3 Way Elbow 2.0cm (¾\")", unit: "pc", master_price: 81 },

  // --- Sweep Bend - Socket at Both Sides ---
  { category: "CPVC", name: "Sweep Bend 1.5cm (½\")", unit: "pc", master_price: 98 },
  { category: "CPVC", name: "Sweep Bend 2.0cm (¾\")", unit: "pc", master_price: 79 },
  { category: "CPVC", name: "Sweep Bend 2.5cm (1\")", unit: "pc", master_price: 130 },
  { category: "CPVC", name: "Sweep Bend 3.2cm (1¼\")", unit: "pc", master_price: 213 },
  { category: "CPVC", name: "Sweep Bend 4.0cm (1½\")", unit: "pc", master_price: 421 },
  { category: "CPVC", name: "Sweep Bend 5.0cm (2\")", unit: "pc", master_price: 541 },

  // --- Step Over Bend ---
  { category: "CPVC", name: "Step Over Bend 1.5cm (½\")", unit: "pc", master_price: 107 },
  { category: "CPVC", name: "Step Over Bend 2.0cm (¾\")", unit: "pc", master_price: 144 },
  { category: "CPVC", name: "Step Over Bend 2.0cm (¾\") alt", unit: "pc", master_price: 107 },
  { category: "CPVC", name: "Step Over Bend 2.5cm (1\")", unit: "pc", master_price: 277 },
  { category: "CPVC", name: "Step Over Bend 2.5cm (1\") alt", unit: "pc", master_price: 192 },
  { category: "CPVC", name: "Step Over Bend 3.2cm (1¼\")", unit: "pc", master_price: 387 },
  { category: "CPVC", name: "Step Over Bend 4.0cm (1½\")", unit: "pc", master_price: 464 },
  { category: "CPVC", name: "Step Over Bend 5.0cm (2\")", unit: "pc", master_price: 1147 },

  // --- Tee ---
  { category: "CPVC", name: "Tee 1.5cm (½\")", unit: "pc", master_price: 40 },
  { category: "CPVC", name: "Tee 2.0cm (¾\")", unit: "pc", master_price: 53 },
  { category: "CPVC", name: "Tee 2.5cm (1\")", unit: "pc", master_price: 79 },
  { category: "CPVC", name: "Tee 3.2cm (1¼\")", unit: "pc", master_price: 180 },
  { category: "CPVC", name: "Tee 4.0cm (1½\")", unit: "pc", master_price: 315 },
  { category: "CPVC", name: "Tee 5.0cm (2\")", unit: "pc", master_price: 678 },

  // --- Reducer Tee ---
  { category: "CPVC", name: "Reducer Tee 1.5x1.5x2.0 (½x½x¾\")", unit: "pc", master_price: 83 },
  { category: "CPVC", name: "Reducer Tee 2.0x1.5x1.5 (¾x½x½\")", unit: "pc", master_price: 83 },
  { category: "CPVC", name: "Reducer Tee 2.0x1.5x2.0 (¾x½x¾\")", unit: "pc", master_price: 78 },
  { category: "CPVC", name: "Reducer Tee 2.0x2.0x1.5 (¾x¾x½\")", unit: "pc", master_price: 83 },
  { category: "CPVC", name: "Reducer Tee 2.5x2.5x1.5 (1x1x½\")", unit: "pc", master_price: 131 },
  { category: "CPVC", name: "Reducer Tee 2.5x2.5x2.0 (1x1x¾\")", unit: "pc", master_price: 146 },
  { category: "CPVC", name: "Reducer Tee 3.2x3.2x1.5 (1¼x1¼x½\")", unit: "pc", master_price: 236 },
  { category: "CPVC", name: "Reducer Tee 3.2x3.2x2.0 (1¼x1¼x¾\")", unit: "pc", master_price: 276 },
  { category: "CPVC", name: "Reducer Tee 3.2x3.2x2.5 (1¼x1¼x1\")", unit: "pc", master_price: 229 },
  { category: "CPVC", name: "Reducer Tee 4.0x4.0x1.5 (1½x1½x½\")", unit: "pc", master_price: 380 },
  { category: "CPVC", name: "Reducer Tee 4.0x4.0x2.0 (1½x1½x¾\")", unit: "pc", master_price: 375 },
  { category: "CPVC", name: "Reducer Tee 4.0x4.0x2.5 (1½x1½x1\")", unit: "pc", master_price: 374 },
  { category: "CPVC", name: "Reducer Tee 4.0x4.0x3.2 (1½x1½x1¼\")", unit: "pc", master_price: 365 },
  { category: "CPVC", name: "Reducer Tee 5.0x5.0x1.5 (2x2x½\")", unit: "pc", master_price: 694 },
  { category: "CPVC", name: "Reducer Tee 5.0x5.0x2.0 (2x2x¾\")", unit: "pc", master_price: 721 },
  { category: "CPVC", name: "Reducer Tee 5.0x5.0x2.5 (2x2x1\")", unit: "pc", master_price: 695 },
  { category: "CPVC", name: "Reducer Tee 5.0x5.0x3.2 (2x2x1¼\")", unit: "pc", master_price: 768 },
  { category: "CPVC", name: "Reducer Tee 5.0x5.0x4.0 (2x2x1½\")", unit: "pc", master_price: 712 },

  // --- Cross Tee ---
  { category: "CPVC", name: "Cross Tee 1.5cm (½\")", unit: "pc", master_price: 50 },
  { category: "CPVC", name: "Cross Tee 2.0cm (¾\")", unit: "pc", master_price: 103 },
  { category: "CPVC", name: "Cross Tee 2.5cm (1\")", unit: "pc", master_price: 173 },

  // --- Coupler ---
  { category: "CPVC", name: "Coupler 1.5cm (½\")", unit: "pc", master_price: 23 },
  { category: "CPVC", name: "Coupler 2.0cm (¾\")", unit: "pc", master_price: 27 },
  { category: "CPVC", name: "Coupler 2.5cm (1\")", unit: "pc", master_price: 44 },
  { category: "CPVC", name: "Coupler 3.2cm (1¼\")", unit: "pc", master_price: 88 },
  { category: "CPVC", name: "Coupler 4.0cm (1½\")", unit: "pc", master_price: 158 },
  { category: "CPVC", name: "Coupler 5.0cm (2\")", unit: "pc", master_price: 327 },

  // --- Reducer Coupler ---
  { category: "CPVC", name: "Reducer Coupler 2.0x1.5 (¾x½\")", unit: "pc", master_price: 42 },
  { category: "CPVC", name: "Reducer Coupler 2.5x1.5 (1x½\")", unit: "pc", master_price: 57 },
  { category: "CPVC", name: "Reducer Coupler 2.5x2.0 (1x¾\")", unit: "pc", master_price: 61 },
  { category: "CPVC", name: "Reducer Coupler 3.2x1.5 (1¼x½\")", unit: "pc", master_price: 129 },
  { category: "CPVC", name: "Reducer Coupler 3.2x2.0 (1¼x¾\")", unit: "pc", master_price: 124 },
  { category: "CPVC", name: "Reducer Coupler 3.2x2.5 (1¼x1\")", unit: "pc", master_price: 131 },
  { category: "CPVC", name: "Reducer Coupler 4.0x1.5 (1½x½\")", unit: "pc", master_price: 166 },
  { category: "CPVC", name: "Reducer Coupler 4.0x2.0 (1½x¾\")", unit: "pc", master_price: 171 },
  { category: "CPVC", name: "Reducer Coupler 4.0x2.5 (1½x1\")", unit: "pc", master_price: 177 },
  { category: "CPVC", name: "Reducer Coupler 4.0x3.2 (1½x1¼\")", unit: "pc", master_price: 183 },
  { category: "CPVC", name: "Reducer Coupler 5.0x1.5 (2x½\")", unit: "pc", master_price: 294 },
  { category: "CPVC", name: "Reducer Coupler 5.0x2.0 (2x¾\")", unit: "pc", master_price: 309 },
  { category: "CPVC", name: "Reducer Coupler 5.0x2.5 (2x1\")", unit: "pc", master_price: 323 },
  { category: "CPVC", name: "Reducer Coupler 5.0x3.2 (2x1¼\")", unit: "pc", master_price: 351 },
  { category: "CPVC", name: "Reducer Coupler 5.0x4.0 (2x1½\")", unit: "pc", master_price: 436 },

  // --- Bushing ---
  { category: "CPVC", name: "Bushing 2.0x1.5 (¾x½\")", unit: "pc", master_price: 24 },
  { category: "CPVC", name: "Bushing 2.5x1.5 (1x½\")", unit: "pc", master_price: 48 },
  { category: "CPVC", name: "Bushing 2.5x2.0 (1x¾\")", unit: "pc", master_price: 32 },
  { category: "CPVC", name: "Bushing 3.2x1.5 (1¼x½\")", unit: "pc", master_price: 87 },
  { category: "CPVC", name: "Bushing 3.2x2.0 (1¼x¾\")", unit: "pc", master_price: 62 },
  { category: "CPVC", name: "Bushing 3.2x2.5 (1¼x1\")", unit: "pc", master_price: 56 },
  { category: "CPVC", name: "Bushing 4.0x1.5 (1½x½\")", unit: "pc", master_price: 112 },
  { category: "CPVC", name: "Bushing 4.0x2.0 (1½x¾\")", unit: "pc", master_price: 100 },
  { category: "CPVC", name: "Bushing 4.0x2.5 (1½x1\")", unit: "pc", master_price: 97 },
  { category: "CPVC", name: "Bushing 4.0x3.2 (1½x1¼\")", unit: "pc", master_price: 74 },
  { category: "CPVC", name: "Bushing 5.0x1.5 (2x½\")", unit: "pc", master_price: 206 },
  { category: "CPVC", name: "Bushing 5.0x2.0 (2x¾\")", unit: "pc", master_price: 192 },
  { category: "CPVC", name: "Bushing 5.0x2.5 (2x1\")", unit: "pc", master_price: 192 },
  { category: "CPVC", name: "Bushing 5.0x3.2 (2x1¼\")", unit: "pc", master_price: 206 },
  { category: "CPVC", name: "Bushing 5.0x4.0 (2x1½\")", unit: "pc", master_price: 173 },

  // --- Converter Bushing (CTS) ---
  { category: "CPVC", name: "Converter Bushing CTS 1.5cm (½\")", unit: "pc", master_price: 24 },
  { category: "CPVC", name: "Converter Bushing CTS 2.0cm (¾\")", unit: "pc", master_price: 28 },
  { category: "CPVC", name: "Converter Bushing CTS 2.5cm (1\")", unit: "pc", master_price: 44 },
  { category: "CPVC", name: "Converter Bushing CTS 3.2cm (1¼\")", unit: "pc", master_price: 77 },
  { category: "CPVC", name: "Converter Bushing CTS 4.0cm (1½\")", unit: "pc", master_price: 93 },
  { category: "CPVC", name: "Converter Bushing CTS 5.0cm (2\")", unit: "pc", master_price: 141 },

  // --- Female Adapter Plastic Threaded (FAPT) ---
  { category: "CPVC", name: "FAPT 1.5cm (½\")", unit: "pc", master_price: 34 },
  { category: "CPVC", name: "FAPT 2.0cm (¾\")", unit: "pc", master_price: 51 },
  { category: "CPVC", name: "FAPT 2.5cm (1\")", unit: "pc", master_price: 73 },
  { category: "CPVC", name: "FAPT 3.2cm (1¼\")", unit: "pc", master_price: 192 },
  { category: "CPVC", name: "FAPT 4.0cm (1½\")", unit: "pc", master_price: 250 },
  { category: "CPVC", name: "FAPT 5.0cm (2\")", unit: "pc", master_price: 391 },

  // --- Male Adapter Plastic Threaded (MAPT) ---
  { category: "CPVC", name: "MAPT 1.5cm (½\")", unit: "pc", master_price: 27 },
  { category: "CPVC", name: "MAPT 2.0cm (¾\")", unit: "pc", master_price: 39 },
  { category: "CPVC", name: "MAPT 2.5cm (1\")", unit: "pc", master_price: 57 },
  { category: "CPVC", name: "MAPT 3.2cm (1¼\")", unit: "pc", master_price: 97 },
  { category: "CPVC", name: "MAPT 4.0cm (1½\")", unit: "pc", master_price: 142 },
  { category: "CPVC", name: "MAPT 5.0cm (2\")", unit: "pc", master_price: 274 },

  // --- Reducing MAPT ---
  { category: "CPVC", name: "Reducing MAPT 2.0x1.5 (¾x½\")", unit: "pc", master_price: 53 },
  { category: "CPVC", name: "Reducing MAPT 2.5x2.0 (1x¾\")", unit: "pc", master_price: 70 },

  // --- End Cap ---
  { category: "CPVC", name: "End Cap 1.5cm (½\")", unit: "pc", master_price: 19 },
  { category: "CPVC", name: "End Cap 2.0cm (¾\")", unit: "pc", master_price: 23 },
  { category: "CPVC", name: "End Cap 2.5cm (1\")", unit: "pc", master_price: 38 },
  { category: "CPVC", name: "End Cap 3.2cm (1¼\")", unit: "pc", master_price: 78 },
  { category: "CPVC", name: "End Cap 4.0cm (1½\")", unit: "pc", master_price: 111 },
  { category: "CPVC", name: "End Cap 5.0cm (2\")", unit: "pc", master_price: 234 },

  // --- Tank Nipple ---
  { category: "CPVC", name: "Tank Nipple 1.5cm (½\")", unit: "pc", master_price: 97 },
  { category: "CPVC", name: "Tank Nipple 2.0cm (¾\")", unit: "pc", master_price: 107 },
  { category: "CPVC", name: "Tank Nipple 2.5cm (1\")", unit: "pc", master_price: 161 },
  { category: "CPVC", name: "Tank Nipple 3.2cm (1¼\")", unit: "pc", master_price: 250 },
  { category: "CPVC", name: "Tank Nipple 4.0cm (1½\")", unit: "pc", master_price: 363 },
  { category: "CPVC", name: "Tank Nipple 5.0cm (2\")", unit: "pc", master_price: 570 },
  { category: "CPVC", name: "Tank Nipple 6.5cm (2½\")", unit: "pc", master_price: 2353 },
  { category: "CPVC", name: "Tank Nipple 8.0cm (3\")", unit: "pc", master_price: 3092 },
  { category: "CPVC", name: "Tank Nipple 10.0cm (4\")", unit: "pc", master_price: 5919 },

  // --- Tank Nipple (One Side Pipe Fitment) ---
  { category: "CPVC", name: "Tank Nipple One Side 2.0cm (¾\")", unit: "pc", master_price: 90 },
  { category: "CPVC", name: "Tank Nipple One Side 2.5cm (1\")", unit: "pc", master_price: 141 },
  { category: "CPVC", name: "Tank Nipple One Side 3.2cm (1¼\")", unit: "pc", master_price: 246 },
  { category: "CPVC", name: "Tank Nipple One Side 4.0cm (1½\")", unit: "pc", master_price: 332 },
  { category: "CPVC", name: "Tank Nipple One Side 5.0cm (2\")", unit: "pc", master_price: 580 },

  // --- Hex Nipple ---
  { category: "CPVC", name: "Hex Nipple 2.0cm (¾\")", unit: "pc", master_price: 42 },
  { category: "CPVC", name: "Hex Nipple 2.5cm (1\")", unit: "pc", master_price: 65 },
  { category: "CPVC", name: "Hex Nipple 3.2cm (1¼\")", unit: "pc", master_price: 97 },
  { category: "CPVC", name: "Hex Nipple 4.0cm (1½\")", unit: "pc", master_price: 145 },
  { category: "CPVC", name: "Hex Nipple 5.0cm (2\")", unit: "pc", master_price: 212 },

  // --- Union ---
  { category: "CPVC", name: "Union 1.5cm (½\")", unit: "pc", master_price: 93 },
  { category: "CPVC", name: "Union 2.0cm (¾\")", unit: "pc", master_price: 144 },
  { category: "CPVC", name: "Union 2.5cm (1\")", unit: "pc", master_price: 173 },
  { category: "CPVC", name: "Union 3.2cm (1¼\")", unit: "pc", master_price: 291 },
  { category: "CPVC", name: "Union 4.0cm (1½\")", unit: "pc", master_price: 477 },
  { category: "CPVC", name: "Union 5.0cm (2\")", unit: "pc", master_price: 862 },

  // --- Non Return Valve ---
  { category: "CPVC", name: "Non Return Valve 2.0cm (¾\")", unit: "pc", master_price: 477 },
  { category: "CPVC", name: "Non Return Valve 2.5cm (1\")", unit: "pc", master_price: 912 },
  { category: "CPVC", name: "Non Return Valve 3.2cm (1¼\")", unit: "pc", master_price: 1439 },
  { category: "CPVC", name: "Non Return Valve 4.0cm (1½\")", unit: "pc", master_price: 2211 },
  { category: "CPVC", name: "Non Return Valve 5.0cm (2\")", unit: "pc", master_price: 5242 },

  // --- Flange with Gasket - End Cap Open ---
  { category: "CPVC", name: "Flange Gasket End Cap Open 2.5cm (1\")", unit: "pc", master_price: 474 },
  { category: "CPVC", name: "Flange Gasket End Cap Open 3.2cm (1¼\")", unit: "pc", master_price: 582 },
  { category: "CPVC", name: "Flange Gasket End Cap Open 4.0cm (1½\")", unit: "pc", master_price: 763 },
  { category: "CPVC", name: "Flange Gasket End Cap Open 5.0cm (2\")", unit: "pc", master_price: 1103 },

  // --- Flange with Gasket - End Cap Closed ---
  { category: "CPVC", name: "Flange Gasket End Cap Closed 2.5cm (1\")", unit: "pc", master_price: 488 },
  { category: "CPVC", name: "Flange Gasket End Cap Closed 3.2cm (1¼\")", unit: "pc", master_price: 594 },
  { category: "CPVC", name: "Flange Gasket End Cap Closed 4.0cm (1½\")", unit: "pc", master_price: 788 },
  { category: "CPVC", name: "Flange Gasket End Cap Closed 5.0cm (2\")", unit: "pc", master_price: 1116 },

  // --- Ball Valve - Handle ---
  { category: "CPVC", name: "Ball Valve Handle 1.5cm (½\")", unit: "pc", master_price: 27 },
  { category: "CPVC", name: "Ball Valve Handle 2.0cm (¾\")", unit: "pc", master_price: 40 },
  { category: "CPVC", name: "Ball Valve Handle 2.5cm (1\")", unit: "pc", master_price: 60 },
  { category: "CPVC", name: "Ball Valve Handle 3.2cm (1¼\")", unit: "pc", master_price: 93 },
  { category: "CPVC", name: "Ball Valve Handle 4.0cm (1½\")", unit: "pc", master_price: 112 },
  { category: "CPVC", name: "Ball Valve Handle 5.0cm (2\")", unit: "pc", master_price: 172 },
  { category: "CPVC", name: "Ball Valve Handle 6.5cm (2½\")", unit: "pc", master_price: 199 },
  { category: "CPVC", name: "Ball Valve Handle 8.0cm (3\")", unit: "pc", master_price: 220 },
  { category: "CPVC", name: "Ball Valve Handle 10.0cm (4\")", unit: "pc", master_price: 268 },

  // --- Ball Valve ---
  { category: "CPVC", name: "Ball Valve 1.5cm (½\")", unit: "pc", master_price: 168 },
  { category: "CPVC", name: "Ball Valve 2.0cm (¾\")", unit: "pc", master_price: 290 },
  { category: "CPVC", name: "Ball Valve 2.5cm (1\")", unit: "pc", master_price: 538 },
  { category: "CPVC", name: "Ball Valve 3.2cm (1¼\")", unit: "pc", master_price: 944 },
  { category: "CPVC", name: "Ball Valve 4.0cm (1½\")", unit: "pc", master_price: 1484 },
  { category: "CPVC", name: "Ball Valve 5.0cm (2\")", unit: "pc", master_price: 2613 },

  // --- Ball Valve With Union Ends ---
  { category: "CPVC", name: "Ball Valve Union Ends 2.0cm (¾\")", unit: "pc", master_price: 418 },
  { category: "CPVC", name: "Ball Valve Union Ends 2.5cm (1\")", unit: "pc", master_price: 631 },
  { category: "CPVC", name: "Ball Valve Union Ends 3.2cm (1¼\")", unit: "pc", master_price: 1050 },
  { category: "CPVC", name: "Ball Valve Union Ends 4.0cm (1½\")", unit: "pc", master_price: 1612 },
  { category: "CPVC", name: "Ball Valve Union Ends 5.0cm (2\")", unit: "pc", master_price: 3221 },

  // --- Ball Valve With Brass Threaded (One Side) ---
  { category: "CPVC", name: "Ball Valve Brass Threaded One Side 2.0cm (¾\")", unit: "pc", master_price: 380 },
  { category: "CPVC", name: "Ball Valve Brass Threaded One Side 2.5cm (1\")", unit: "pc", master_price: 665 },
  { category: "CPVC", name: "Ball Valve Brass Threaded One Side 3.2cm (1¼\")", unit: "pc", master_price: 1143 },

  // --- Ball Valve With Brass Threaded (Two Side) ---
  { category: "CPVC", name: "Ball Valve Brass Threaded Two Side 2.0cm (¾\")", unit: "pc", master_price: 458 },
  { category: "CPVC", name: "Ball Valve Brass Threaded Two Side 2.5cm (1\")", unit: "pc", master_price: 806 },
  { category: "CPVC", name: "Ball Valve Brass Threaded Two Side 3.2cm (1¼\")", unit: "pc", master_price: 1352 },

  // --- Elbow 90° Brass ---
  { category: "CPVC", name: "Elbow 90° Brass 1.5x1.5 (½x½\")", unit: "pc", master_price: 120 },
  { category: "CPVC", name: "Elbow 90° Brass 2.0x1.5 (¾x½\")", unit: "pc", master_price: 124 },
  { category: "CPVC", name: "Elbow 90° Brass 2.0x2.0 (¾x¾\")", unit: "pc", master_price: 179 },
  { category: "CPVC", name: "Elbow 90° Brass 2.5x1.5 (1x½\")", unit: "pc", master_price: 229 },
  { category: "CPVC", name: "Elbow 90° Brass 2.5x2.0 (1x¾\")", unit: "pc", master_price: 355 },
  { category: "CPVC", name: "Elbow 90° Brass 2.5x2.5 (1x1\")", unit: "pc", master_price: 685 },
  { category: "CPVC", name: "Elbow 90° Brass 3.2x1.5 (1¼x½\")", unit: "pc", master_price: 421 },
  { category: "CPVC", name: "Elbow 90° Brass 3.2x2.0 (1¼x¾\")", unit: "pc", master_price: 492 },
  { category: "CPVC", name: "Elbow 90° Brass 3.2x3.2 (1¼x1¼\")", unit: "pc", master_price: 887 },

  // --- Brass Elbow With Clamp ---
  { category: "CPVC", name: "Brass Elbow With Clamp 2.0x1.5 (¾x½\")", unit: "pc", master_price: 166 },

  // --- Tee Brass ---
  { category: "CPVC", name: "Tee Brass 1.5x1.5x1.5 (½x½x½\")", unit: "pc", master_price: 151 },
  { category: "CPVC", name: "Tee Brass 2.0x2.0x1.5 (¾x¾x½\")", unit: "pc", master_price: 153 },
  { category: "CPVC", name: "Tee Brass 2.0x2.0x2.0 (¾x¾x¾\")", unit: "pc", master_price: 228 },
  { category: "CPVC", name: "Tee Brass 2.5x2.5x1.5 (1x1x½\")", unit: "pc", master_price: 262 },
  { category: "CPVC", name: "Tee Brass 2.5x2.5x2.0 (1x1x¾\")", unit: "pc", master_price: 385 },
  { category: "CPVC", name: "Tee Brass 2.5x2.5x2.5 (1x1x1\")", unit: "pc", master_price: 483 },
  { category: "CPVC", name: "Tee Brass 3.2x3.2x1.5 (1¼x1¼x½\")", unit: "pc", master_price: 496 },

  // --- Male Adapter Brass Threaded (MABT) ---
  { category: "CPVC", name: "MABT 1.5cm (½\")", unit: "pc", master_price: 277 },
  { category: "CPVC", name: "MABT 2.0cm (¾\")", unit: "pc", master_price: 354 },
  { category: "CPVC", name: "MABT 2.5cm (1\")", unit: "pc", master_price: 560 },
  { category: "CPVC", name: "MABT 3.2cm (1¼\")", unit: "pc", master_price: 1160 },
  { category: "CPVC", name: "MABT 4.0cm (1½\")", unit: "pc", master_price: 1450 },
  { category: "CPVC", name: "MABT 5.0cm (2\")", unit: "pc", master_price: 2774 },
  { category: "CPVC", name: "MABT 6.5cm (2½\")", unit: "pc", master_price: 4206 },
  { category: "CPVC", name: "MABT 8.0cm (3\")", unit: "pc", master_price: 5828 },

  // --- Reducing MABT ---
  { category: "CPVC", name: "Reducing MABT 2.0x1.5 (¾x½\")", unit: "pc", master_price: 220 },
  { category: "CPVC", name: "Reducing MABT 2.5x1.5 (1x½\")", unit: "pc", master_price: 366 },
  { category: "CPVC", name: "Reducing MABT 2.5x2.0 (1x¾\")", unit: "pc", master_price: 377 },

  // --- Reducing MABT Ring Type ---
  { category: "CPVC", name: "Reducing MABT Ring Type 2.0x1.5 (¾x½\")", unit: "pc", master_price: 178 },

  // --- Union MABT ---
  { category: "CPVC", name: "Union MABT 2.0cm (¾\")", unit: "pc", master_price: 520 },
  { category: "CPVC", name: "Union MABT 2.5cm (1\")", unit: "pc", master_price: 850 },

  // --- Female Adapter Brass Threaded (FABT) ---
  { category: "CPVC", name: "FABT 1.5cm (½\")", unit: "pc", master_price: 266 },
  { category: "CPVC", name: "FABT 2.0cm (¾\")", unit: "pc", master_price: 355 },
  { category: "CPVC", name: "FABT 2.5cm (1\")", unit: "pc", master_price: 562 },
  { category: "CPVC", name: "FABT 3.2cm (1¼\")", unit: "pc", master_price: 1182 },
  { category: "CPVC", name: "FABT 4.0cm (1½\")", unit: "pc", master_price: 1324 },
  { category: "CPVC", name: "FABT 5.0cm (2\")", unit: "pc", master_price: 2485 },
  { category: "CPVC", name: "FABT 6.5cm (2½\")", unit: "pc", master_price: 3280 },
  { category: "CPVC", name: "FABT 8.0cm (3\")", unit: "pc", master_price: 4010 },

  // --- Reducing FABT ---
  { category: "CPVC", name: "Reducing FABT 2.0x1.5 (¾x½\")", unit: "pc", master_price: 153 },
  { category: "CPVC", name: "Reducing FABT 2.5x1.5 (1x½\")", unit: "pc", master_price: 195 },
  { category: "CPVC", name: "Reducing FABT 2.5x2.0 (1x¾\")", unit: "pc", master_price: 205 },

  // --- Union FABT ---
  { category: "CPVC", name: "Union FABT 2.0cm (¾\")", unit: "pc", master_price: 487 },
  { category: "CPVC", name: "Union FABT 2.5cm (1\")", unit: "pc", master_price: 793 },

  // --- Brass Elbow MABT ---
  { category: "CPVC", name: "Brass Elbow MABT 2.0x1.5 (¾x½\")", unit: "pc", master_price: 315 },

  // --- Brass Tee MABT ---
  { category: "CPVC", name: "Brass Tee MABT 2.0x2.0x1.5 (¾x¾x½\")", unit: "pc", master_price: 202 },

  // --- Brass Elbow Long ---
  { category: "CPVC", name: "Brass Elbow Long 2.0x1.5 (¾x½\")", unit: "pc", master_price: 341 },

  // --- 3 in 1 Mixer Adaptor ---
  { category: "CPVC", name: "3in1 Mixer Adaptor All Top 6\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 670 },
  { category: "CPVC", name: "3in1 Mixer Adaptor All Top 6\" 2.5x1.5 (1x½\")", unit: "pc", master_price: 815 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Bottom 6\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 670 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Bottom 6\" 2.5x1.5 (1x½\")", unit: "pc", master_price: 815 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Side 6\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 670 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Side 6\" 2.5x1.5 (1x½\")", unit: "pc", master_price: 815 },
  { category: "CPVC", name: "3in1 Mixer Adaptor All Top 7\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 676 },
  { category: "CPVC", name: "3in1 Mixer Adaptor All Top 7\" 2.5x1.5 (1x½\")", unit: "pc", master_price: 823 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Bottom 7\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 670 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Bottom 7\" 2.5x1.5 (1x½\")", unit: "pc", master_price: 815 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Side 7\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 676 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Top & Side 7\" 2.5x1.5 (1x½\")", unit: "pc", master_price: 823 },
  { category: "CPVC", name: "3in1 Mixer MABT Top 2.0x1.5 (¾x½\")", unit: "pc", master_price: 1064 },
  { category: "CPVC", name: "3in1 Mixer MABT Bottom 2.0x1.5 (¾x½\")", unit: "pc", master_price: 1064 },
  { category: "CPVC", name: "3in1 Mixer MABT Top & Side 2.0x1.5 (¾x½\")", unit: "pc", master_price: 1064 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Lock All Top 6\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 644 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Lock Top & Bottom 6\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 644 },
  { category: "CPVC", name: "3in1 Mixer Adaptor Lock Top & Side 6\" 2.0x1.5 (¾x½\")", unit: "pc", master_price: 644 },

  // --- Kitchen Mixer Adaptor ---
  { category: "CPVC", name: "Kitchen Mixer Adaptor Down 2.0x1.5 (¾x½\")", unit: "pc", master_price: 579 },
  { category: "CPVC", name: "Kitchen Mixer Adaptor Straight 2.0x1.5 (¾x½\")", unit: "pc", master_price: 512 },

  // --- Tee Holder ---
  { category: "CPVC", name: "Tee Holder 1.5x1.5x1.5 (½x½x½\")", unit: "pc", master_price: 30 },
  { category: "CPVC", name: "Tee Holder 2.0x2.0x1.5 (¾x¾x½\")", unit: "pc", master_price: 28 },

  // --- Elbow Holder ---
  { category: "CPVC", name: "Elbow Holder 1.5x1.5 (½x½\")", unit: "pc", master_price: 23 },
  { category: "CPVC", name: "Elbow Holder 1.5x2.0 (½x¾\")", unit: "pc", master_price: 24 },

  // --- Threaded End Plug ---
  { category: "CPVC", name: "Threaded End Plug 1.5cm (½\")", unit: "pc", master_price: 14 },
  { category: "CPVC", name: "Threaded End Plug 2.0cm (¾\")", unit: "pc", master_price: 16 },

  // --- Expansion Loop ---
  { category: "CPVC", name: "Expansion Loop 1.5cm (½\")", unit: "pc", master_price: 220 },
  { category: "CPVC", name: "Expansion Loop 2.0cm (¾\")", unit: "pc", master_price: 291 },
  { category: "CPVC", name: "Expansion Loop 2.5cm (1\")", unit: "pc", master_price: 408 },
  { category: "CPVC", name: "Expansion Loop 3.2cm (1¼\")", unit: "pc", master_price: 762 },
  { category: "CPVC", name: "Expansion Loop 4.0cm (1½\")", unit: "pc", master_price: 1228 },
  { category: "CPVC", name: "Expansion Loop 5.0cm (2\")", unit: "pc", master_price: 1999 },

  // --- Nail Clamp ---
  { category: "CPVC", name: "Nail Clamp 2.0cm (¾\")", unit: "pc", master_price: 13 },
  { category: "CPVC", name: "Nail Clamp 2.5cm (1\")", unit: "pc", master_price: 15 },

  // --- Powder Coated Metal Clamp ---
  { category: "CPVC", name: "Powder Coated Metal Clamp 1.5cm (½\")", unit: "pc", master_price: 14 },
  { category: "CPVC", name: "Powder Coated Metal Clamp 2.0cm (¾\")", unit: "pc", master_price: 15 },
  { category: "CPVC", name: "Powder Coated Metal Clamp 2.5cm (1\")", unit: "pc", master_price: 19 },
  { category: "CPVC", name: "Powder Coated Metal Clamp 3.2cm (1¼\")", unit: "pc", master_price: 19 },
  { category: "CPVC", name: "Powder Coated Metal Clamp 4.0cm (1½\")", unit: "pc", master_price: 20 },
  { category: "CPVC", name: "Powder Coated Metal Clamp 5.0cm (2\")", unit: "pc", master_price: 23 },

  // --- SS Clamp ---
  { category: "CPVC", name: "SS Clamp 1.5cm (½\")", unit: "pc", master_price: 20 },
  { category: "CPVC", name: "SS Clamp 2.0cm (¾\")", unit: "pc", master_price: 20 },
  { category: "CPVC", name: "SS Clamp 2.5cm (1\")", unit: "pc", master_price: 22 },
  { category: "CPVC", name: "SS Clamp 3.2cm (1¼\")", unit: "pc", master_price: 23 },
  { category: "CPVC", name: "SS Clamp 4.0cm (1½\")", unit: "pc", master_price: 27 },
  { category: "CPVC", name: "SS Clamp 5.0cm (2\")", unit: "pc", master_price: 31 },

  // --- Plastic Clamp ---
  { category: "CPVC", name: "Plastic Clamp 1.5cm (½\")", unit: "pc", master_price: 9 },
  { category: "CPVC", name: "Plastic Clamp 2.0cm (¾\")", unit: "pc", master_price: 10 },
  { category: "CPVC", name: "Plastic Clamp 2.5cm (1\")", unit: "pc", master_price: 12 },
  { category: "CPVC", name: "Plastic Clamp 3.2cm (1¼\")", unit: "pc", master_price: 17 },
  { category: "CPVC", name: "Plastic Clamp 4.0cm (1½\")", unit: "pc", master_price: 27 },
  { category: "CPVC", name: "Plastic Clamp 5.0cm (2\")", unit: "pc", master_price: 26 },

  // --- Rubber Washer Tank Nipple ---
  { category: "CPVC", name: "Rubber Washer Tank Nipple 1.5cm (½\")", unit: "pc", master_price: 10 },
  { category: "CPVC", name: "Rubber Washer Tank Nipple 2.0cm (¾\")", unit: "pc", master_price: 13 },
  { category: "CPVC", name: "Rubber Washer Tank Nipple 2.5cm (1\")", unit: "pc", master_price: 14 },
  { category: "CPVC", name: "Rubber Washer Tank Nipple 3.2cm (1¼\")", unit: "pc", master_price: 13 },
  { category: "CPVC", name: "Rubber Washer Tank Nipple 4.0cm (1½\")", unit: "pc", master_price: 13 },
  { category: "CPVC", name: "Rubber Washer Tank Nipple 5.0cm (2\")", unit: "pc", master_price: 20 },
  { category: "CPVC", name: "Rubber Washer Tank Nipple 8.0cm (3\")", unit: "pc", master_price: 80 },

  // --- Rubber Washer Union ---
  { category: "CPVC", name: "Rubber Washer Union 1.5cm (½\")", unit: "pc", master_price: 4 },
  { category: "CPVC", name: "Rubber Washer Union 2.0cm (¾\")", unit: "pc", master_price: 5 },
  { category: "CPVC", name: "Rubber Washer Union 2.5cm (1\")", unit: "pc", master_price: 6 },
  { category: "CPVC", name: "Rubber Washer Union 3.2cm (1¼\")", unit: "pc", master_price: 6 },
  { category: "CPVC", name: "Rubber Washer Union 4.0cm (1½\")", unit: "pc", master_price: 7 },
  { category: "CPVC", name: "Rubber Washer Union 5.0cm (2\")", unit: "pc", master_price: 9 },

  // --- Rubber Washer FAPT ---
  { category: "CPVC", name: "Rubber Washer FAPT 1.5cm (½\")", unit: "pc", master_price: 4 },
  { category: "CPVC", name: "Rubber Washer FAPT 2.0cm (¾\")", unit: "pc", master_price: 4 },
  { category: "CPVC", name: "Rubber Washer FAPT 2.5cm (1\")", unit: "pc", master_price: 4 },
  { category: "CPVC", name: "Rubber Washer FAPT 3.2cm (1¼\")", unit: "pc", master_price: 10 },
  { category: "CPVC", name: "Rubber Washer FAPT 4.0cm (1½\")", unit: "pc", master_price: 10 },
  { category: "CPVC", name: "Rubber Washer FAPT 5.0cm (2\")", unit: "pc", master_price: 17 },

  // --- Rubber Gasket for Flange ---
  { category: "CPVC", name: "Rubber Gasket Flange 2.5cm (1\")", unit: "pc", master_price: 20 },
  { category: "CPVC", name: "Rubber Gasket Flange 3.2cm (1¼\")", unit: "pc", master_price: 24 },
  { category: "CPVC", name: "Rubber Gasket Flange 4.0cm (1½\")", unit: "pc", master_price: 27 },
  { category: "CPVC", name: "Rubber Gasket Flange 5.0cm (2\")", unit: "pc", master_price: 34 },
  { category: "CPVC", name: "Rubber Gasket Flange 6.5cm (2½\")", unit: "pc", master_price: 49 },
  { category: "CPVC", name: "Rubber Gasket Flange 8.0cm (3\")", unit: "pc", master_price: 64 },
  { category: "CPVC", name: "Rubber Gasket Flange 10.0cm (4\")", unit: "pc", master_price: 103 },
  { category: "CPVC", name: "Rubber Gasket Flange 15.0cm (6\")", unit: "pc", master_price: 136 },

  // --- SS Bolts for Butterfly Valves ---
  { category: "CPVC", name: "SS Bolts Butterfly Valve M12x125", unit: "pc", master_price: 218 },
  { category: "CPVC", name: "SS Bolts Butterfly Valve M16x125", unit: "pc", master_price: 318 },
  { category: "CPVC", name: "SS Bolts Butterfly Valve M16x150", unit: "pc", master_price: 366 },
  { category: "CPVC", name: "SS Bolts Butterfly Valve M16x160", unit: "pc", master_price: 382 },

  // --- Butterfly Valve ---
  { category: "CPVC", name: "Butterfly Valve 4.0cm (1½\")", unit: "pc", master_price: 12371 },
  { category: "CPVC", name: "Butterfly Valve 5.0cm (2\")", unit: "pc", master_price: 13494 },
  { category: "CPVC", name: "Butterfly Valve 6.5cm (2½\")", unit: "pc", master_price: 18275 },
  { category: "CPVC", name: "Butterfly Valve 8.0cm (3\")", unit: "pc", master_price: 22101 },
  { category: "CPVC", name: "Butterfly Valve 10.0cm (4\")", unit: "pc", master_price: 23925 },
  { category: "CPVC", name: "Butterfly Valve 15.0cm (6\")", unit: "pc", master_price: 37005 },

  // --- Y-Strainer ---
  { category: "CPVC", name: "Y-Strainer 2.5cm (1\")", unit: "pc", master_price: 1500 },
  { category: "CPVC", name: "Y-Strainer 3.2cm (1¼\")", unit: "pc", master_price: 2100 },
  { category: "CPVC", name: "Y-Strainer 4.0cm (1½\")", unit: "pc", master_price: 2980 },
  { category: "CPVC", name: "Y-Strainer 5.0cm (2\")", unit: "pc", master_price: 4382 },

  // ============================================================
  // UPVC AQUALIFE PLUMBING SYSTEM
  // ============================================================

  // --- uPVC Pipes SCH 40 3 & 6 mtr ---
  { category: "UPVC", name: "Pipe SCH 40 1.5cm (½\") 3mtr", unit: "mtr", master_price: 278 },
  { category: "UPVC", name: "Pipe SCH 40 2.0cm (¾\") 3mtr", unit: "mtr", master_price: 349 },
  { category: "UPVC", name: "Pipe SCH 40 2.5cm (1\") 3mtr", unit: "mtr", master_price: 521 },
  { category: "UPVC", name: "Pipe SCH 40 3.2cm (1¼\") 3mtr", unit: "mtr", master_price: 743 },
  { category: "UPVC", name: "Pipe SCH 40 4.0cm (1½\") 3mtr", unit: "mtr", master_price: 878 },
  { category: "UPVC", name: "Pipe SCH 40 5.0cm (2\") 3mtr", unit: "mtr", master_price: 1215 },
  { category: "UPVC", name: "Pipe SCH 40 6.5cm (2½\") 3mtr", unit: "mtr", master_price: 1901 },
  { category: "UPVC", name: "Pipe SCH 40 8.0cm (3\") 3mtr", unit: "mtr", master_price: 2453 },
  { category: "UPVC", name: "Pipe SCH 40 10.0cm (4\") 3mtr", unit: "mtr", master_price: 3484 },
  { category: "UPVC", name: "Pipe SCH 40 15.0cm (6\") 3mtr", unit: "mtr", master_price: 6113 },
  { category: "UPVC", name: "Pipe SCH 40 21.9cm (8\") 3mtr", unit: "mtr", master_price: 9574 },
  { category: "UPVC", name: "Pipe SCH 40 27.3cm (10\") 3mtr", unit: "mtr", master_price: 13991 },
  { category: "UPVC", name: "Pipe SCH 40 32.3cm (12\") 3mtr", unit: "mtr", master_price: 0 },

  { category: "UPVC", name: "Pipe SCH 40 1.5cm (½\") 6mtr", unit: "mtr", master_price: 555 },
  { category: "UPVC", name: "Pipe SCH 40 2.0cm (¾\") 6mtr", unit: "mtr", master_price: 698 },
  { category: "UPVC", name: "Pipe SCH 40 2.5cm (1\") 6mtr", unit: "mtr", master_price: 1043 },
  { category: "UPVC", name: "Pipe SCH 40 3.2cm (1¼\") 6mtr", unit: "mtr", master_price: 1485 },
  { category: "UPVC", name: "Pipe SCH 40 4.0cm (1½\") 6mtr", unit: "mtr", master_price: 1755 },
  { category: "UPVC", name: "Pipe SCH 40 5.0cm (2\") 6mtr", unit: "mtr", master_price: 2430 },
  { category: "UPVC", name: "Pipe SCH 40 6.5cm (2½\") 6mtr", unit: "mtr", master_price: 3803 },
  { category: "UPVC", name: "Pipe SCH 40 8.0cm (3\") 6mtr", unit: "mtr", master_price: 4905 },
  { category: "UPVC", name: "Pipe SCH 40 10.0cm (4\") 6mtr", unit: "mtr", master_price: 6966 },
  { category: "UPVC", name: "Pipe SCH 40 15.0cm (6\") 6mtr", unit: "mtr", master_price: 12225 },
  { category: "UPVC", name: "Pipe SCH 40 21.9cm (8\") 6mtr", unit: "mtr", master_price: 19148 },
  { category: "UPVC", name: "Pipe SCH 40 27.3cm (10\") 6mtr", unit: "mtr", master_price: 27983 },

  // --- uPVC Pipes SCH 80 3 & 6 mtr ---
  { category: "UPVC", name: "Pipe SCH 80 1.5cm (½\") 3mtr", unit: "mtr", master_price: 356 },
  { category: "UPVC", name: "Pipe SCH 80 2.0cm (¾\") 3mtr", unit: "mtr", master_price: 446 },
  { category: "UPVC", name: "Pipe SCH 80 2.5cm (1\") 3mtr", unit: "mtr", master_price: 679 },
  { category: "UPVC", name: "Pipe SCH 80 3.2cm (1¼\") 3mtr", unit: "mtr", master_price: 949 },
  { category: "UPVC", name: "Pipe SCH 80 4.0cm (1½\") 3mtr", unit: "mtr", master_price: 1170 },
  { category: "UPVC", name: "Pipe SCH 80 5.0cm (2\") 3mtr", unit: "mtr", master_price: 1601 },
  { category: "UPVC", name: "Pipe SCH 80 6.5cm (2½\") 3mtr", unit: "mtr", master_price: 2434 },
  { category: "UPVC", name: "Pipe SCH 80 8.0cm (3\") 3mtr", unit: "mtr", master_price: 3278 },
  { category: "UPVC", name: "Pipe SCH 80 10.0cm (4\") 3mtr", unit: "mtr", master_price: 4804 },
  { category: "UPVC", name: "Pipe SCH 80 15.0cm (6\") 3mtr", unit: "mtr", master_price: 9574 },
  { category: "UPVC", name: "Pipe SCH 80 21.9cm (8\") 3mtr", unit: "mtr", master_price: 0 },

  { category: "UPVC", name: "Pipe SCH 80 1.5cm (½\") 6mtr", unit: "mtr", master_price: 713 },
  { category: "UPVC", name: "Pipe SCH 80 2.0cm (¾\") 6mtr", unit: "mtr", master_price: 893 },
  { category: "UPVC", name: "Pipe SCH 80 2.5cm (1\") 6mtr", unit: "mtr", master_price: 1358 },
  { category: "UPVC", name: "Pipe SCH 80 3.2cm (1¼\") 6mtr", unit: "mtr", master_price: 1898 },
  { category: "UPVC", name: "Pipe SCH 80 4.0cm (1½\") 6mtr", unit: "mtr", master_price: 2340 },
  { category: "UPVC", name: "Pipe SCH 80 5.0cm (2\") 6mtr", unit: "mtr", master_price: 3203 },
  { category: "UPVC", name: "Pipe SCH 80 6.5cm (2½\") 6mtr", unit: "mtr", master_price: 4868 },
  { category: "UPVC", name: "Pipe SCH 80 8.0cm (3\") 6mtr", unit: "mtr", master_price: 6555 },
  { category: "UPVC", name: "Pipe SCH 80 10.0cm (4\") 6mtr", unit: "mtr", master_price: 9608 },
  { category: "UPVC", name: "Pipe SCH 80 15.0cm (6\") 6mtr", unit: "mtr", master_price: 19148 },

  // --- uPVC Elbow 90° SCH 40 ---
  { category: "UPVC", name: "Elbow 90° SCH 40 1.5cm (½\")", unit: "pc", master_price: 16 },
  { category: "UPVC", name: "Elbow 90° SCH 40 2.0cm (¾\")", unit: "pc", master_price: 20 },
  { category: "UPVC", name: "Elbow 90° SCH 40 2.5cm (1\")", unit: "pc", master_price: 39 },
  { category: "UPVC", name: "Elbow 90° SCH 40 3.2cm (1¼\")", unit: "pc", master_price: 59 },
  { category: "UPVC", name: "Elbow 90° SCH 40 4.0cm (1½\")", unit: "pc", master_price: 78 },
  { category: "UPVC", name: "Elbow 90° SCH 40 5.0cm (2\")", unit: "pc", master_price: 106 },

  // --- uPVC Elbow 90° SCH 80 ---
  { category: "UPVC", name: "Elbow 90° SCH 80 1.5cm (½\")", unit: "pc", master_price: 19 },
  { category: "UPVC", name: "Elbow 90° SCH 80 2.0cm (¾\")", unit: "pc", master_price: 21 },
  { category: "UPVC", name: "Elbow 90° SCH 80 2.5cm (1\")", unit: "pc", master_price: 41 },
  { category: "UPVC", name: "Elbow 90° SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 64 },
  { category: "UPVC", name: "Elbow 90° SCH 80 4.0cm (1½\")", unit: "pc", master_price: 81 },
  { category: "UPVC", name: "Elbow 90° SCH 80 5.0cm (2\")", unit: "pc", master_price: 109 },
  { category: "UPVC", name: "Elbow 90° SCH 80 6.5cm (2½\")", unit: "pc", master_price: 346 },
  { category: "UPVC", name: "Elbow 90° SCH 80 8.0cm (3\")", unit: "pc", master_price: 503 },
  { category: "UPVC", name: "Elbow 90° SCH 80 10.0cm (4\")", unit: "pc", master_price: 859 },
  { category: "UPVC", name: "Elbow 90° SCH 80 15.0cm (6\")", unit: "pc", master_price: 2148 },

  // --- uPVC Elbow 45° SCH 80 ---
  { category: "UPVC", name: "Elbow 45° SCH 80 2.0cm (¾\")", unit: "pc", master_price: 29 },
  { category: "UPVC", name: "Elbow 45° SCH 80 2.5cm (1\")", unit: "pc", master_price: 34 },
  { category: "UPVC", name: "Elbow 45° SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 51 },
  { category: "UPVC", name: "Elbow 45° SCH 80 4.0cm (1½\")", unit: "pc", master_price: 85 },
  { category: "UPVC", name: "Elbow 45° SCH 80 5.0cm (2\")", unit: "pc", master_price: 133 },
  { category: "UPVC", name: "Elbow 45° SCH 80 6.5cm (2½\")", unit: "pc", master_price: 305 },
  { category: "UPVC", name: "Elbow 45° SCH 80 8.0cm (3\")", unit: "pc", master_price: 289 },
  { category: "UPVC", name: "Elbow 45° SCH 80 10.0cm (4\")", unit: "pc", master_price: 455 },
  { category: "UPVC", name: "Elbow 45° SCH 80 15.0cm (6\")", unit: "pc", master_price: 1099 },

  // --- uPVC Tee SCH 80 ---
  { category: "UPVC", name: "Tee SCH 80 1.5cm (½\")", unit: "pc", master_price: 20 },
  { category: "UPVC", name: "Tee SCH 80 2.0cm (¾\")", unit: "pc", master_price: 31 },
  { category: "UPVC", name: "Tee SCH 80 2.5cm (1\")", unit: "pc", master_price: 71 },
  { category: "UPVC", name: "Tee SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 81 },
  { category: "UPVC", name: "Tee SCH 80 4.0cm (1½\")", unit: "pc", master_price: 104 },
  { category: "UPVC", name: "Tee SCH 80 5.0cm (2\")", unit: "pc", master_price: 155 },
  { category: "UPVC", name: "Tee SCH 80 6.5cm (2½\")", unit: "pc", master_price: 470 },
  { category: "UPVC", name: "Tee SCH 80 8.0cm (3\")", unit: "pc", master_price: 694 },
  { category: "UPVC", name: "Tee SCH 80 10.0cm (4\")", unit: "pc", master_price: 1156 },
  { category: "UPVC", name: "Tee SCH 80 15.0cm (6\")", unit: "pc", master_price: 2733 },

  // --- uPVC Tee SCH 40 ---
  { category: "UPVC", name: "Tee SCH 40 2.0cm (¾\")", unit: "pc", master_price: 20 },
  { category: "UPVC", name: "Tee SCH 40 2.0cm (¾\") alt", unit: "pc", master_price: 25 },
  { category: "UPVC", name: "Tee SCH 40 2.5cm (1\")", unit: "pc", master_price: 53 },
  { category: "UPVC", name: "Tee SCH 40 3.2cm (1¼\")", unit: "pc", master_price: 74 },
  { category: "UPVC", name: "Tee SCH 40 4.0cm (1½\")", unit: "pc", master_price: 98 },
  { category: "UPVC", name: "Tee SCH 40 5.0cm (2\")", unit: "pc", master_price: 144 },

  // --- uPVC Coupler SCH 80 ---
  { category: "UPVC", name: "Coupler SCH 80 1.5cm (½\")", unit: "pc", master_price: 10 },
  { category: "UPVC", name: "Coupler SCH 80 2.0cm (¾\")", unit: "pc", master_price: 19 },
  { category: "UPVC", name: "Coupler SCH 80 2.5cm (1\")", unit: "pc", master_price: 26 },
  { category: "UPVC", name: "Coupler SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 39 },
  { category: "UPVC", name: "Coupler SCH 80 4.0cm (1½\")", unit: "pc", master_price: 50 },
  { category: "UPVC", name: "Coupler SCH 80 5.0cm (2\")", unit: "pc", master_price: 65 },
  { category: "UPVC", name: "Coupler SCH 80 6.5cm (2½\")", unit: "pc", master_price: 204 },
  { category: "UPVC", name: "Coupler SCH 80 8.0cm (3\")", unit: "pc", master_price: 305 },
  { category: "UPVC", name: "Coupler SCH 80 15.0cm (6\")", unit: "pc", master_price: 1099 },

  // --- uPVC Coupler SCH 40 ---
  { category: "UPVC", name: "Coupler SCH 40 1.5cm (½\")", unit: "pc", master_price: 10 },
  { category: "UPVC", name: "Coupler SCH 40 2.0cm (¾\")", unit: "pc", master_price: 16 },
  { category: "UPVC", name: "Coupler SCH 40 2.5cm (1\")", unit: "pc", master_price: 25 },
  { category: "UPVC", name: "Coupler SCH 40 3.2cm (1¼\")", unit: "pc", master_price: 33 },
  { category: "UPVC", name: "Coupler SCH 40 4.0cm (1½\")", unit: "pc", master_price: 40 },
  { category: "UPVC", name: "Coupler SCH 40 5.0cm (2\")", unit: "pc", master_price: 65 },

  // --- uPVC End Cap SCH 80 ---
  { category: "UPVC", name: "End Cap SCH 80 1.5cm (½\")", unit: "pc", master_price: 10 },
  { category: "UPVC", name: "End Cap SCH 80 2.0cm (¾\")", unit: "pc", master_price: 15 },
  { category: "UPVC", name: "End Cap SCH 80 2.5cm (1\")", unit: "pc", master_price: 28 },
  { category: "UPVC", name: "End Cap SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 40 },
  { category: "UPVC", name: "End Cap SCH 80 4.0cm (1½\")", unit: "pc", master_price: 54 },
  { category: "UPVC", name: "End Cap SCH 80 5.0cm (2\")", unit: "pc", master_price: 84 },
  { category: "UPVC", name: "End Cap SCH 80 6.5cm (2½\")", unit: "pc", master_price: 139 },
  { category: "UPVC", name: "End Cap SCH 80 8.0cm (3\")", unit: "pc", master_price: 200 },
  { category: "UPVC", name: "End Cap SCH 80 10.0cm (4\")", unit: "pc", master_price: 346 },
  { category: "UPVC", name: "End Cap SCH 80 15.0cm (6\")", unit: "pc", master_price: 853 },

  // --- uPVC FAPT SCH 80 ---
  { category: "UPVC", name: "FAPT SCH 80 1.5cm (½\")", unit: "pc", master_price: 14 },
  { category: "UPVC", name: "FAPT SCH 80 2.0cm (¾\")", unit: "pc", master_price: 23 },
  { category: "UPVC", name: "FAPT SCH 80 2.5cm (1\")", unit: "pc", master_price: 36 },
  { category: "UPVC", name: "FAPT SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 50 },
  { category: "UPVC", name: "FAPT SCH 80 4.0cm (1½\")", unit: "pc", master_price: 66 },
  { category: "UPVC", name: "FAPT SCH 80 5.0cm (2\")", unit: "pc", master_price: 94 },
  { category: "UPVC", name: "FAPT SCH 80 6.5cm (2½\")", unit: "pc", master_price: 149 },
  { category: "UPVC", name: "FAPT SCH 80 8.0cm (3\")", unit: "pc", master_price: 243 },
  { category: "UPVC", name: "FAPT SCH 80 10.0cm (4\")", unit: "pc", master_price: 403 },

  // --- uPVC MAPT SCH 80 ---
  { category: "UPVC", name: "MAPT SCH 80 1.5cm (½\")", unit: "pc", master_price: 13 },
  { category: "UPVC", name: "MAPT SCH 80 2.0cm (¾\")", unit: "pc", master_price: 18 },
  { category: "UPVC", name: "MAPT SCH 80 2.5cm (1\")", unit: "pc", master_price: 31 },
  { category: "UPVC", name: "MAPT SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 43 },
  { category: "UPVC", name: "MAPT SCH 80 4.0cm (1½\")", unit: "pc", master_price: 58 },
  { category: "UPVC", name: "MAPT SCH 80 5.0cm (2\")", unit: "pc", master_price: 81 },
  { category: "UPVC", name: "MAPT SCH 80 6.5cm (2½\")", unit: "pc", master_price: 153 },
  { category: "UPVC", name: "MAPT SCH 80 8.0cm (3\")", unit: "pc", master_price: 209 },
  { category: "UPVC", name: "MAPT SCH 80 10.0cm (4\")", unit: "pc", master_price: 408 },

  // --- uPVC Tank Nipple SCH 80 ---
  { category: "UPVC", name: "Tank Nipple SCH 80 1.5cm (½\")", unit: "pc", master_price: 39 },
  { category: "UPVC", name: "Tank Nipple SCH 80 2.0cm (¾\")", unit: "pc", master_price: 54 },
  { category: "UPVC", name: "Tank Nipple SCH 80 2.5cm (1\")", unit: "pc", master_price: 75 },
  { category: "UPVC", name: "Tank Nipple SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 94 },
  { category: "UPVC", name: "Tank Nipple SCH 80 4.0cm (1½\")", unit: "pc", master_price: 144 },
  { category: "UPVC", name: "Tank Nipple SCH 80 5.0cm (2\")", unit: "pc", master_price: 231 },
  { category: "UPVC", name: "Tank Nipple SCH 80 6.5cm (2½\")", unit: "pc", master_price: 946 },
  { category: "UPVC", name: "Tank Nipple SCH 80 8.0cm (3\")", unit: "pc", master_price: 1253 },
  { category: "UPVC", name: "Tank Nipple SCH 80 10.0cm (4\")", unit: "pc", master_price: 2330 },

  // --- uPVC Union SCH 80 ---
  { category: "UPVC", name: "Union SCH 80 1.5cm (½\")", unit: "pc", master_price: 48 },
  { category: "UPVC", name: "Union SCH 80 2.0cm (¾\")", unit: "pc", master_price: 66 },
  { category: "UPVC", name: "Union SCH 80 2.5cm (1\")", unit: "pc", master_price: 88 },
  { category: "UPVC", name: "Union SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 121 },
  { category: "UPVC", name: "Union SCH 80 4.0cm (1½\")", unit: "pc", master_price: 243 },
  { category: "UPVC", name: "Union SCH 80 5.0cm (2\")", unit: "pc", master_price: 411 },
  { category: "UPVC", name: "Union SCH 80 6.5cm (2½\")", unit: "pc", master_price: 635 },
  { category: "UPVC", name: "Union SCH 80 8.0cm (3\")", unit: "pc", master_price: 869 },
  { category: "UPVC", name: "Union SCH 80 10.0cm (4\")", unit: "pc", master_price: 1306 },

  // --- uPVC Ball Valve SCH 80 ---
  { category: "UPVC", name: "Ball Valve SCH 80 1.5cm (½\")", unit: "pc", master_price: 114 },
  { category: "UPVC", name: "Ball Valve SCH 80 2.0cm (¾\")", unit: "pc", master_price: 229 },
  { category: "UPVC", name: "Ball Valve SCH 80 2.5cm (1\")", unit: "pc", master_price: 435 },
  { category: "UPVC", name: "Ball Valve SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 698 },
  { category: "UPVC", name: "Ball Valve SCH 80 4.0cm (1½\")", unit: "pc", master_price: 1060 },
  { category: "UPVC", name: "Ball Valve SCH 80 5.0cm (2\")", unit: "pc", master_price: 2025 },

  // --- uPVC Non Return Valve ---
  { category: "UPVC", name: "Non Return Valve SCH 80 2.0cm (¾\")", unit: "pc", master_price: 395 },
  { category: "UPVC", name: "Non Return Valve SCH 80 2.5cm (1\")", unit: "pc", master_price: 588 },
  { category: "UPVC", name: "Non Return Valve SCH 80 3.2cm (1¼\")", unit: "pc", master_price: 1135 },
  { category: "UPVC", name: "Non Return Valve SCH 80 4.0cm (1½\")", unit: "pc", master_price: 1760 },
  { category: "UPVC", name: "Non Return Valve SCH 80 5.0cm (2\")", unit: "pc", master_price: 4000 },

  // --- uPVC Gate Valve ---
  { category: "UPVC", name: "Gate Valve 1.5cm (½\")", unit: "pc", master_price: 1256 },
  { category: "UPVC", name: "Gate Valve 2.0cm (¾\")", unit: "pc", master_price: 1303 },
  { category: "UPVC", name: "Gate Valve 2.5cm (1\")", unit: "pc", master_price: 1719 },

  // --- uPVC to CPVC Converter Coupler SCH 80 ---
  { category: "UPVC", name: "uPVC to CPVC Converter 1.5cm (½\")", unit: "pc", master_price: 26 },
  { category: "UPVC", name: "uPVC to CPVC Converter 2.0cm (¾\")", unit: "pc", master_price: 36 },
  { category: "UPVC", name: "uPVC to CPVC Converter 2.5cm (1\")", unit: "pc", master_price: 55 },
  { category: "UPVC", name: "uPVC to CPVC Converter 3.2cm (1¼\")", unit: "pc", master_price: 86 },
  { category: "UPVC", name: "uPVC to CPVC Converter 4.0cm (1½\")", unit: "pc", master_price: 150 },
  { category: "UPVC", name: "uPVC to CPVC Converter 5.0cm (2\")", unit: "pc", master_price: 159 },

  // ============================================================
  // SWR PUSHFIT DRAINAGE SYSTEM
  // ============================================================

  // --- SWR Pushfit Pipes Type A (S/S = Single Socket) ---
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 7.5cm (2½\") 1.8m", unit: "length", master_price: 470 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 7.5cm (2½\") 2.7m", unit: "length", master_price: 650 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 7.5cm (2½\") 3m", unit: "length", master_price: 678 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 7.5cm (2½\") 3.6m", unit: "length", master_price: 921 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 7.5cm (2½\") 6m", unit: "length", master_price: 1426 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 9cm (3\") 3m", unit: "length", master_price: 906 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 9cm (3\") 3.6m", unit: "length", master_price: 1285 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 9cm (3\") 6m", unit: "length", master_price: 2016 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 11cm (4\") 1.8m", unit: "length", master_price: 858 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 11cm (4\") 2.7m", unit: "length", master_price: 1150 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 11cm (4\") 3m", unit: "length", master_price: 1178 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 11cm (4\") 3.6m", unit: "length", master_price: 1588 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 11cm (4\") 6m", unit: "length", master_price: 2503 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 16cm (6\") 1.8m", unit: "length", master_price: 1861 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 16cm (6\") 3m", unit: "length", master_price: 2750 },
  { category: "SWR PUSHFIT", name: "Pipe Type A S/S 16cm (6\") 6m", unit: "length", master_price: 5381 },

  // --- SWR Pushfit Pipes Type A (D/S = Double Socket) ---
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 7.5cm (2½\") 0.6m", unit: "length", master_price: 181 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 7.5cm (2½\") 0.9m", unit: "length", master_price: 283 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 7.5cm (2½\") 1.2m", unit: "length", master_price: 325 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 7.5cm (2½\") 1.8m", unit: "length", master_price: 469 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 7.5cm (2½\") 3m", unit: "length", master_price: 725 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 11cm (4\") 0.6m", unit: "length", master_price: 306 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 11cm (4\") 0.9m", unit: "length", master_price: 483 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 11cm (4\") 1.2m", unit: "length", master_price: 581 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 11cm (4\") 1.8m", unit: "length", master_price: 825 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 11cm (4\") 3m", unit: "length", master_price: 1300 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 16cm (6\") 0.6m", unit: "length", master_price: 746 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 16cm (6\") 0.9m", unit: "length", master_price: 1115 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 16cm (6\") 1.2m", unit: "length", master_price: 1351 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 16cm (6\") 1.8m", unit: "length", master_price: 1921 },
  { category: "SWR PUSHFIT", name: "Pipe Type A D/S 16cm (6\") 3m", unit: "length", master_price: 3084 },

  // --- SWR Pushfit Fittings ---
  { category: "SWR PUSHFIT", name: "Plain Bend/Elbow 7.5cm (2½\")", unit: "pc", master_price: 126 },
  { category: "SWR PUSHFIT", name: "Plain Bend/Elbow 9cm (3\")", unit: "pc", master_price: 204 },
  { category: "SWR PUSHFIT", name: "Plain Bend/Elbow 11cm (4\")", unit: "pc", master_price: 244 },
  { category: "SWR PUSHFIT", name: "Plain Bend/Elbow 16cm (6\")", unit: "pc", master_price: 555 },
  { category: "SWR PUSHFIT", name: "Plain Bend/Elbow 20cm (8\")", unit: "pc", master_price: 1374 },

  { category: "SWR PUSHFIT", name: "Door Bend/Door Elbow 7.5cm (2½\")", unit: "pc", master_price: 169 },
  { category: "SWR PUSHFIT", name: "Door Bend/Door Elbow 9cm (3\")", unit: "pc", master_price: 224 },
  { category: "SWR PUSHFIT", name: "Door Bend/Door Elbow 11cm (4\")", unit: "pc", master_price: 293 },
  { category: "SWR PUSHFIT", name: "Door Bend/Door Elbow 16cm (6\")", unit: "pc", master_price: 631 },
  { category: "SWR PUSHFIT", name: "Door Bend/Door Elbow 20cm (8\")", unit: "pc", master_price: 1893 },

  { category: "SWR PUSHFIT", name: "Bend 45° / Shoe Bend 7.5cm (2½\")", unit: "pc", master_price: 105 },
  { category: "SWR PUSHFIT", name: "Bend 45° / Shoe Bend 9cm (3\")", unit: "pc", master_price: 161 },
  { category: "SWR PUSHFIT", name: "Bend 45° / Shoe Bend 11cm (4\")", unit: "pc", master_price: 194 },
  { category: "SWR PUSHFIT", name: "Bend 45° / Shoe Bend 16cm (6\")", unit: "pc", master_price: 479 },
  { category: "SWR PUSHFIT", name: "Bend 45° / Shoe Bend 20cm (8\")", unit: "pc", master_price: 1164 },

  { category: "SWR PUSHFIT", name: "Coupler/Socket 7.5cm (2½\")", unit: "pc", master_price: 91 },
  { category: "SWR PUSHFIT", name: "Coupler/Socket 9cm (3\")", unit: "pc", master_price: 140 },
  { category: "SWR PUSHFIT", name: "Coupler/Socket 11cm (4\")", unit: "pc", master_price: 163 },
  { category: "SWR PUSHFIT", name: "Coupler/Socket 16cm (6\")", unit: "pc", master_price: 388 },
  { category: "SWR PUSHFIT", name: "Coupler/Socket 20cm (8\")", unit: "pc", master_price: 866 },

  { category: "SWR PUSHFIT", name: "Repair Coupler 7.5cm (2½\")", unit: "pc", master_price: 101 },
  { category: "SWR PUSHFIT", name: "Repair Coupler 9cm (3\")", unit: "pc", master_price: 140 },
  { category: "SWR PUSHFIT", name: "Repair Coupler 11cm (4\")", unit: "pc", master_price: 175 },
  { category: "SWR PUSHFIT", name: "Repair Coupler 16cm (6\")", unit: "pc", master_price: 440 },
  { category: "SWR PUSHFIT", name: "Repair Coupler 20cm (8\")", unit: "pc", master_price: 913 },

  { category: "SWR PUSHFIT", name: "Reducer 11.0x7.5 (4x2½\")", unit: "pc", master_price: 115 },
  { category: "SWR PUSHFIT", name: "Reducer 11.0x7.5 (4x2½\") alt", unit: "pc", master_price: 150 },
  { category: "SWR PUSHFIT", name: "Reducer 11.0x9.0 (4x3\")", unit: "pc", master_price: 148 },
  { category: "SWR PUSHFIT", name: "Reducer 16.0x11.0 (6x4\")", unit: "pc", master_price: 318 },
  { category: "SWR PUSHFIT", name: "Reducer 20.0x16.0 (8x6\")", unit: "pc", master_price: 746 },

  { category: "SWR PUSHFIT", name: "Single Tee 7.5cm (2½\")", unit: "pc", master_price: 178 },
  { category: "SWR PUSHFIT", name: "Single Tee 9cm (3\")", unit: "pc", master_price: 258 },
  { category: "SWR PUSHFIT", name: "Single Tee 11cm (4\")", unit: "pc", master_price: 319 },
  { category: "SWR PUSHFIT", name: "Single Tee 16cm (6\")", unit: "pc", master_price: 798 },
  { category: "SWR PUSHFIT", name: "Single Tee 20cm (8\")", unit: "pc", master_price: 1846 },

  { category: "SWR PUSHFIT", name: "Door Tee 7.5cm (2½\")", unit: "pc", master_price: 210 },
  { category: "SWR PUSHFIT", name: "Door Tee 9cm (3\")", unit: "pc", master_price: 298 },
  { category: "SWR PUSHFIT", name: "Door Tee 11cm (4\")", unit: "pc", master_price: 373 },
  { category: "SWR PUSHFIT", name: "Door Tee 16cm (6\")", unit: "pc", master_price: 918 },
  { category: "SWR PUSHFIT", name: "Door Tee 20cm (8\")", unit: "pc", master_price: 2089 },

  { category: "SWR PUSHFIT", name: "Double Tee / Cross Tee 7.5cm (2½\")", unit: "pc", master_price: 255 },
  { category: "SWR PUSHFIT", name: "Double Tee / Cross Tee 9cm (3\")", unit: "pc", master_price: 370 },
  { category: "SWR PUSHFIT", name: "Double Tee / Cross Tee 11cm (4\")", unit: "pc", master_price: 419 },

  { category: "SWR PUSHFIT", name: "Double Tee w/ Door 7.5cm (2½\")", unit: "pc", master_price: 375 },
  { category: "SWR PUSHFIT", name: "Double Tee w/ Door 9cm (3\")", unit: "pc", master_price: 445 },
  { category: "SWR PUSHFIT", name: "Double Tee w/ Door 11cm (4\")", unit: "pc", master_price: 505 },

  { category: "SWR PUSHFIT", name: "Single Y 7.5cm (2½\")", unit: "pc", master_price: 206 },
  { category: "SWR PUSHFIT", name: "Single Y 9cm (3\")", unit: "pc", master_price: 291 },
  { category: "SWR PUSHFIT", name: "Single Y 11cm (4\")", unit: "pc", master_price: 415 },
  { category: "SWR PUSHFIT", name: "Single Y 16cm (6\")", unit: "pc", master_price: 1128 },
  { category: "SWR PUSHFIT", name: "Single Y 20cm (8\")", unit: "pc", master_price: 2188 },

  { category: "SWR PUSHFIT", name: "Single Y w/ Door 7.5cm (2½\")", unit: "pc", master_price: 254 },
  { category: "SWR PUSHFIT", name: "Single Y w/ Door 9cm (3\")", unit: "pc", master_price: 369 },
  { category: "SWR PUSHFIT", name: "Single Y w/ Door 11cm (4\")", unit: "pc", master_price: 519 },
  { category: "SWR PUSHFIT", name: "Single Y w/ Door 16cm (6\")", unit: "pc", master_price: 1325 },
  { category: "SWR PUSHFIT", name: "Single Y w/ Door 20cm (8\")", unit: "pc", master_price: 2698 },

  { category: "SWR PUSHFIT", name: "Double Y 7.5cm (2½\")", unit: "pc", master_price: 274 },
  { category: "SWR PUSHFIT", name: "Double Y 9cm (3\")", unit: "pc", master_price: 476 },
  { category: "SWR PUSHFIT", name: "Double Y 11cm (4\")", unit: "pc", master_price: 560 },
  { category: "SWR PUSHFIT", name: "Double Y 16cm (6\")", unit: "pc", master_price: 5421 },

  { category: "SWR PUSHFIT", name: "Double Y w/ Door 7.5cm (2½\")", unit: "pc", master_price: 374 },
  { category: "SWR PUSHFIT", name: "Double Y w/ Door 9cm (3\")", unit: "pc", master_price: 573 },
  { category: "SWR PUSHFIT", name: "Double Y w/ Door 11cm (4\")", unit: "pc", master_price: 674 },

  { category: "SWR PUSHFIT", name: "Reducing Y w/ Door 11.0x7.5 (4x2½\")", unit: "pc", master_price: 333 },
  { category: "SWR PUSHFIT", name: "Reducing Y w/o Door 16.0x11.0 (6x4\")", unit: "pc", master_price: 935 },

  { category: "SWR PUSHFIT", name: "Reducing Tee 9x7.5 (3x2½\")", unit: "pc", master_price: 235 },
  { category: "SWR PUSHFIT", name: "Reducing Tee 11.0x7.5 (4x2½\")", unit: "pc", master_price: 306 },
  { category: "SWR PUSHFIT", name: "Reducing Tee 16.0x11.0 (6x4\")", unit: "pc", master_price: 676 },

  { category: "SWR PUSHFIT", name: "Reducing Door Tee 11.0x7.5 (4x2½\")", unit: "pc", master_price: 365 },

  { category: "SWR PUSHFIT", name: "Reducing Y w/o Door 11.0x7.5 (4x2½\")", unit: "pc", master_price: 304 },
  { category: "SWR PUSHFIT", name: "Reducing Y w/o Door 16.0x7.5 (6x2½\")", unit: "pc", master_price: 1250 },
  { category: "SWR PUSHFIT", name: "Reducing Y w/o Door 16.0x11.0 (6x4\")", unit: "pc", master_price: 1500 },

  { category: "SWR PUSHFIT", name: "Reverse Y 7.5cm (2½\")", unit: "pc", master_price: 240 },

  { category: "SWR PUSHFIT", name: "Cleaning Pipe/Access Pipe 7.5cm (2½\")", unit: "pc", master_price: 164 },
  { category: "SWR PUSHFIT", name: "Cleaning Pipe/Access Pipe 9cm (3\")", unit: "pc", master_price: 285 },
  { category: "SWR PUSHFIT", name: "Cleaning Pipe/Access Pipe 11cm (4\")", unit: "pc", master_price: 326 },
  { category: "SWR PUSHFIT", name: "Cleaning Pipe/Access Pipe 16cm (6\")", unit: "pc", master_price: 639 },

  { category: "SWR PUSHFIT", name: "Swept Tee Triple Socket (T) 11cm (4\")", unit: "pc", master_price: 1436 },

  { category: "SWR PUSHFIT", name: "Long Swept Bend 11cm (4\")", unit: "pc", master_price: 439 },
  { category: "SWR PUSHFIT", name: "Long Swept Bend 16cm (6\")", unit: "pc", master_price: 1056 },
  { category: "SWR PUSHFIT", name: "Long Swept Bend 20cm (8\")", unit: "pc", master_price: 1980 },

  { category: "SWR PUSHFIT", name: "Long Swept Bend w/ Door 11cm (4\")", unit: "pc", master_price: 526 },
  { category: "SWR PUSHFIT", name: "Long Swept Bend w/ Door 16cm (6\")", unit: "pc", master_price: 1170 },
  { category: "SWR PUSHFIT", name: "Long Swept Bend w/ Door 20cm (8\")", unit: "pc", master_price: 2198 },

  { category: "SWR PUSHFIT", name: "Pass Over Bend Type B Pipe 7.5cm (2½\")", unit: "pc", master_price: 629 },
  { category: "SWR PUSHFIT", name: "Pass Over Bend Type B Pipe 9cm (3\")", unit: "pc", master_price: 953 },
  { category: "SWR PUSHFIT", name: "Pass Over Bend Type B Pipe 11cm (4\")", unit: "pc", master_price: 1175 },

  { category: "SWR PUSHFIT", name: "NRV/Back Flow Preventer 11cm (4\")", unit: "pc", master_price: 2566 },
  { category: "SWR PUSHFIT", name: "NRV/Back Flow Preventer 16cm (6\")", unit: "pc", master_price: 5985 },

  { category: "SWR PUSHFIT", name: "Flap for NRV 11cm (4\")", unit: "pc", master_price: 44 },
  { category: "SWR PUSHFIT", name: "Flap for NRV 16cm (6\")", unit: "pc", master_price: 85 },

  { category: "SWR PUSHFIT", name: "Yellow Seal O Ring 7.5cm (2½\")", unit: "pc", master_price: 19 },
  { category: "SWR PUSHFIT", name: "Yellow Seal O Ring 9cm (3\")", unit: "pc", master_price: 25 },
  { category: "SWR PUSHFIT", name: "Yellow Seal O Ring 11cm (4\")", unit: "pc", master_price: 39 },
  { category: "SWR PUSHFIT", name: "Yellow Seal O Ring 16cm (6\")", unit: "pc", master_price: 66 },
  { category: "SWR PUSHFIT", name: "Yellow Seal O Ring 20cm (8\")", unit: "pc", master_price: 103 },
  { category: "SWR PUSHFIT", name: "Yellow Seal O Ring 25cm (10\")", unit: "pc", master_price: 303 },

  { category: "SWR PUSHFIT", name: "Rubber Lubricant 100ml", unit: "pc", master_price: 37 },
  { category: "SWR PUSHFIT", name: "Rubber Lubricant 250ml", unit: "pc", master_price: 72 },
  { category: "SWR PUSHFIT", name: "Rubber Lubricant 500ml", unit: "pc", master_price: 118 },

  { category: "SWR PUSHFIT", name: "Aerator SWR Pushfit 11cm (4\")", unit: "pc", master_price: 4918 },

  // ============================================================
  // SWR SOLFIT DRAINAGE SYSTEM
  // ============================================================

  { category: "SWR SOLFIT", name: "Plain Bend/Elbow 7.5cm (2½\")", unit: "pc", master_price: 108 },
  { category: "SWR SOLFIT", name: "Plain Bend/Elbow 9cm (3\")", unit: "pc", master_price: 178 },
  { category: "SWR SOLFIT", name: "Plain Bend/Elbow 11cm (4\")", unit: "pc", master_price: 205 },
  { category: "SWR SOLFIT", name: "Plain Bend/Elbow 16cm (6\")", unit: "pc", master_price: 495 },

  { category: "SWR SOLFIT", name: "Door Bend/Door Elbow 7.5cm (2½\")", unit: "pc", master_price: 149 },
  { category: "SWR SOLFIT", name: "Door Bend/Door Elbow 9cm (3\")", unit: "pc", master_price: 225 },
  { category: "SWR SOLFIT", name: "Door Bend/Door Elbow 11cm (4\")", unit: "pc", master_price: 249 },
  { category: "SWR SOLFIT", name: "Door Bend/Door Elbow 16cm (6\")", unit: "pc", master_price: 576 },

  { category: "SWR SOLFIT", name: "Bend 45° / Shoe Bend 7.5cm (2½\")", unit: "pc", master_price: 94 },
  { category: "SWR SOLFIT", name: "Bend 45° / Shoe Bend 9cm (3\")", unit: "pc", master_price: 138 },
  { category: "SWR SOLFIT", name: "Bend 45° / Shoe Bend 11cm (4\")", unit: "pc", master_price: 169 },
  { category: "SWR SOLFIT", name: "Bend 45° / Shoe Bend 16cm (6\")", unit: "pc", master_price: 479 },

  { category: "SWR SOLFIT", name: "Heavy Coupler 7.5cm (2½\")", unit: "pc", master_price: 93 },
  { category: "SWR SOLFIT", name: "Heavy Coupler 11cm (4\")", unit: "pc", master_price: 236 },

  { category: "SWR SOLFIT", name: "Coupler/Socket 4.0cm (1¼\")", unit: "pc", master_price: 25 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 5.0cm (1½\")", unit: "pc", master_price: 34 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 6.3cm (1½\")", unit: "pc", master_price: 54 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 7.5cm (2½\")", unit: "pc", master_price: 73 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 9cm (3\")", unit: "pc", master_price: 121 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 11cm (4\")", unit: "pc", master_price: 131 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 16cm (6\")", unit: "pc", master_price: 328 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 20cm (8\")", unit: "pc", master_price: 859 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 25cm (10\")", unit: "pc", master_price: 1936 },
  { category: "SWR SOLFIT", name: "Coupler/Socket 31.5cm (12\")", unit: "pc", master_price: 3869 },

  { category: "SWR SOLFIT", name: "Single Tee 7.5cm (2½\")", unit: "pc", master_price: 156 },
  { category: "SWR SOLFIT", name: "Single Tee 9cm (3\")", unit: "pc", master_price: 235 },
  { category: "SWR SOLFIT", name: "Single Tee 11cm (4\")", unit: "pc", master_price: 296 },
  { category: "SWR SOLFIT", name: "Single Tee 16cm (6\")", unit: "pc", master_price: 785 },

  { category: "SWR SOLFIT", name: "Door Tee 7.5cm (2½\")", unit: "pc", master_price: 191 },
  { category: "SWR SOLFIT", name: "Door Tee 9cm (3\")", unit: "pc", master_price: 295 },
  { category: "SWR SOLFIT", name: "Door Tee 11cm (4\")", unit: "pc", master_price: 345 },
  { category: "SWR SOLFIT", name: "Door Tee 16cm (6\")", unit: "pc", master_price: 874 },

  { category: "SWR SOLFIT", name: "Double Tee / Cross Tee 7.5cm (2½\")", unit: "pc", master_price: 223 },
  { category: "SWR SOLFIT", name: "Double Tee / Cross Tee 9cm (3\")", unit: "pc", master_price: 289 },
  { category: "SWR SOLFIT", name: "Double Tee / Cross Tee 11cm (4\")", unit: "pc", master_price: 344 },
  { category: "SWR SOLFIT", name: "Double Tee / Cross Tee 16cm (6\")", unit: "pc", master_price: 0 },

  { category: "SWR SOLFIT", name: "Double Tee w/ Door 7.5cm (2½\")", unit: "pc", master_price: 269 },
  { category: "SWR SOLFIT", name: "Double Tee w/ Door 9cm (3\")", unit: "pc", master_price: 355 },
  { category: "SWR SOLFIT", name: "Double Tee w/ Door 11cm (4\")", unit: "pc", master_price: 474 },

  { category: "SWR SOLFIT", name: "Single Y 7.5cm (2½\")", unit: "pc", master_price: 185 },
  { category: "SWR SOLFIT", name: "Single Y 9cm (3\")", unit: "pc", master_price: 276 },
  { category: "SWR SOLFIT", name: "Single Y 11cm (4\")", unit: "pc", master_price: 368 },
  { category: "SWR SOLFIT", name: "Single Y 16cm (6\")", unit: "pc", master_price: 975 },

  { category: "SWR SOLFIT", name: "Single Y w/ Door 7.5cm (2½\")", unit: "pc", master_price: 234 },
  { category: "SWR SOLFIT", name: "Single Y w/ Door 9cm (3\")", unit: "pc", master_price: 371 },
  { category: "SWR SOLFIT", name: "Single Y w/ Door 11cm (4\")", unit: "pc", master_price: 478 },
  { category: "SWR SOLFIT", name: "Single Y w/ Door 16cm (6\")", unit: "pc", master_price: 1229 },

  { category: "SWR SOLFIT", name: "Double Y 7.5cm (2½\")", unit: "pc", master_price: 253 },
  { category: "SWR SOLFIT", name: "Double Y 9cm (3\")", unit: "pc", master_price: 360 },
  { category: "SWR SOLFIT", name: "Double Y 11cm (4\")", unit: "pc", master_price: 493 },

  { category: "SWR SOLFIT", name: "Double Y w/ Door 7.5cm (2½\")", unit: "pc", master_price: 340 },
  { category: "SWR SOLFIT", name: "Double Y w/ Door 9cm (3\")", unit: "pc", master_price: 449 },
  { category: "SWR SOLFIT", name: "Double Y w/ Door 11cm (4\")", unit: "pc", master_price: 626 },

  { category: "SWR SOLFIT", name: "Reducing Y w/ Door 11.0x7.5 (4x2½\")", unit: "pc", master_price: 365 },
  { category: "SWR SOLFIT", name: "Reducing Y w/o Door 11.0x7.5 (4x2½\")", unit: "pc", master_price: 304 },
  { category: "SWR SOLFIT", name: "Reducing Y w/o Door 16.0x7.5 (6x2½\")", unit: "pc", master_price: 1250 },
  { category: "SWR SOLFIT", name: "Reducing Y w/o Door 16.0x11.0 (6x4\")", unit: "pc", master_price: 1500 },

  { category: "SWR SOLFIT", name: "Cleaning Pipe / Access Pipe 7.5cm (2½\")", unit: "pc", master_price: 161 },
  { category: "SWR SOLFIT", name: "Cleaning Pipe / Access Pipe 9cm (3\")", unit: "pc", master_price: 236 },
  { category: "SWR SOLFIT", name: "Cleaning Pipe / Access Pipe 11cm (4\")", unit: "pc", master_price: 299 },
  { category: "SWR SOLFIT", name: "Cleaning Pipe / Access Pipe 16cm (6\")", unit: "pc", master_price: 596 },

  { category: "SWR SOLFIT", name: "Reducing Tee 9x7.5 (3x2½\")", unit: "pc", master_price: 208 },
  { category: "SWR SOLFIT", name: "Reducing Tee 11.0x7.5 (4x2½\")", unit: "pc", master_price: 295 },
  { category: "SWR SOLFIT", name: "Reducing Tee 16.0x11.0 (6x4\")", unit: "pc", master_price: 686 },

  { category: "SWR SOLFIT", name: "Reducing Door Tee 9.0x7.5 (3x2½\")", unit: "pc", master_price: 261 },
  { category: "SWR SOLFIT", name: "Reducing Door Tee 11.0x7.5 (4x2½\")", unit: "pc", master_price: 356 },
  { category: "SWR SOLFIT", name: "Reducing Door Tee 16.0x11.0 (6x4\")", unit: "pc", master_price: 749 },

  { category: "SWR SOLFIT", name: "Reducer Offset 11.0x7.5 (4x2½\")", unit: "pc", master_price: 130 },
  { category: "SWR SOLFIT", name: "Reducer Offset 16.0x11.0 (6x4\")", unit: "pc", master_price: 276 },

  { category: "SWR SOLFIT", name: "Repair Coupler 7.5cm (2½\")", unit: "pc", master_price: 91 },
  { category: "SWR SOLFIT", name: "Repair Coupler 9cm (3\")", unit: "pc", master_price: 91 },
  { category: "SWR SOLFIT", name: "Repair Coupler 11cm (4\")", unit: "pc", master_price: 160 },
  { category: "SWR SOLFIT", name: "Repair Coupler 16cm (6\")", unit: "pc", master_price: 299 },

  { category: "SWR SOLFIT", name: "Reducer Coupler 6.3x5.0 (2x1½\")", unit: "pc", master_price: 55 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 7.5x5.0 (2½x1½\")", unit: "pc", master_price: 63 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 7.5x6.3 (2½x2\")", unit: "pc", master_price: 75 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 11.0x7.5 (4x2½\")", unit: "pc", master_price: 130 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 11.0x9.0 (4x3\")", unit: "pc", master_price: 159 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 14.0x11.0 (5x4\")", unit: "pc", master_price: 211 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 16.0x11.0 (6x4\")", unit: "pc", master_price: 274 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 20.0x16.0 (8x6\")", unit: "pc", master_price: 816 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 25.0x20.0 (10x8\")", unit: "pc", master_price: 1601 },
  { category: "SWR SOLFIT", name: "Reducer Coupler 31.5x25.0 (12x10\")", unit: "pc", master_price: 3104 },

  { category: "SWR SOLFIT", name: "Reducing Bush 5.0x4.0 (1½x1¼\")", unit: "pc", master_price: 34 },
  { category: "SWR SOLFIT", name: "Reducing Bush 6.3x5.0 (2x1½\")", unit: "pc", master_price: 51 },
  { category: "SWR SOLFIT", name: "Reducing Bush 7.5x4.0 (2½x1¼\")", unit: "pc", master_price: 60 },
  { category: "SWR SOLFIT", name: "Reducing Bush 7.5x5.0 (2½x1½\")", unit: "pc", master_price: 61 },
  { category: "SWR SOLFIT", name: "Reducing Bush 7.5x6.3 (2½x2\")", unit: "pc", master_price: 63 },
  { category: "SWR SOLFIT", name: "Reducing Bush 9.0x7.5 (3x2½\")", unit: "pc", master_price: 76 },
  { category: "SWR SOLFIT", name: "Reducing Bush 11.0x7.5 (4x2½\")", unit: "pc", master_price: 99 },
  { category: "SWR SOLFIT", name: "Reducing Bush 11.0x9.0 (4x3\")", unit: "pc", master_price: 105 },
  { category: "SWR SOLFIT", name: "Reducing Bush 14.0x11.0 (5x4\")", unit: "pc", master_price: 185 },
  { category: "SWR SOLFIT", name: "Reducing Bush 16.0x7.5 (6x2½\")", unit: "pc", master_price: 239 },
  { category: "SWR SOLFIT", name: "Reducing Bush 16.0x11.0 (6x4\")", unit: "pc", master_price: 271 },

  { category: "SWR SOLFIT", name: "Pass Over Bend Type B Pipe 7.5cm (2½\")", unit: "pc", master_price: 624 },
  { category: "SWR SOLFIT", name: "Pass Over Bend Type B Pipe 9cm (3\")", unit: "pc", master_price: 949 },
  { category: "SWR SOLFIT", name: "Pass Over Bend Type B Pipe 11cm (4\")", unit: "pc", master_price: 1155 },

  { category: "SWR SOLFIT", name: "Swept Tee Plain 11cm (4\")", unit: "pc", master_price: 330 },
  { category: "SWR SOLFIT", name: "Swept Tee w/ Door 11cm (4\")", unit: "pc", master_price: 366 },

  { category: "SWR SOLFIT", name: "Solvent Cement 50ml", unit: "pc", master_price: 77 },
  { category: "SWR SOLFIT", name: "Solvent Cement 100ml", unit: "pc", master_price: 85 },
  { category: "SWR SOLFIT", name: "Solvent Cement 250ml", unit: "pc", master_price: 183 },
  { category: "SWR SOLFIT", name: "Solvent Cement 500ml", unit: "pc", master_price: 320 },
  { category: "SWR SOLFIT", name: "Solvent Cement 1000ml", unit: "pc", master_price: 551 },
  { category: "SWR SOLFIT", name: "Solvent Cement 5000ml", unit: "pc", master_price: 3415 },

  { category: "SWR SOLFIT", name: "Aerator SWR Solfit 11cm (4\")", unit: "pc", master_price: 4459 },
  { category: "SWR SOLFIT", name: "Stack-Aerator v2.0 11cm (4\")", unit: "pc", master_price: 4459 },
  { category: "SWR SOLFIT", name: "Dummy Cap 11cm (4\")", unit: "pc", master_price: 153 },
  { category: "SWR SOLFIT", name: "Inspection Plug 11cm (4\")", unit: "pc", master_price: 221 },

  // --- Common Fittings for Both Pushfit and Solfit ---
  { category: "SWR PUSHFIT", name: "P Trap 7.5x7.5 (2½x2½\")", unit: "pc", master_price: 278 },
  { category: "SWR PUSHFIT", name: "P Trap 9.0x9.0 (3x3\")", unit: "pc", master_price: 496 },
  { category: "SWR PUSHFIT", name: "P Trap 9.0x9.0 (3x3\") w/o Leg", unit: "pc", master_price: 461 },
  { category: "SWR PUSHFIT", name: "P Trap 11.0x11.0 Short (4x4\")", unit: "pc", master_price: 519 },
  { category: "SWR PUSHFIT", name: "P Trap 11.0x11.0 Long (4x4\")", unit: "pc", master_price: 596 },
  { category: "SWR PUSHFIT", name: "P Trap 11.0x11.0 Deeper (4x4\")", unit: "pc", master_price: 648 },
  { category: "SWR PUSHFIT", name: "P Trap 12.5x11.0 (4½x4\")", unit: "pc", master_price: 768 },
  { category: "SWR PUSHFIT", name: "P Trap 12.5x11.0 Deeper (4½x4\")", unit: "pc", master_price: 661 },

  { category: "SWR PUSHFIT", name: "Q Trap 11.0x11.0 (4x4\")", unit: "pc", master_price: 591 },
  { category: "SWR PUSHFIT", name: "Q Trap 12.5x11.0 (4½x4\")", unit: "pc", master_price: 770 },

  { category: "SWR PUSHFIT", name: "S Trap 11.0x11.0 (4x4\")", unit: "pc", master_price: 769 },
  { category: "SWR PUSHFIT", name: "S Trap 12.5x11.0 (4½x4\")", unit: "pc", master_price: 895 },

  { category: "SWR PUSHFIT", name: "Bell Mouth Trap 11.0x7.5 P.F.", unit: "pc", master_price: 663 },
  { category: "SWR PUSHFIT", name: "Bell Mouth Trap 11.0x7.5 S.F.", unit: "pc", master_price: 643 },

  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 5.0 (1½\")", unit: "pc", master_price: 88 },
  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 6.3x6.3 (2x2\")", unit: "pc", master_price: 111 },
  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 9.0x9.0 (3x3\")", unit: "pc", master_price: 214 },
  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 11.0x11.0 (4x4\")", unit: "pc", master_price: 394 },
  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 11.0x7.5 (4x2½\")", unit: "pc", master_price: 354 },
  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 11.0x9.0 (4x3\")", unit: "pc", master_price: 380 },
  { category: "SWR PUSHFIT", name: "Nahani Trap w/o Jali 11.0x11.0 (4x4\") alt", unit: "pc", master_price: 436 },

  { category: "SWR PUSHFIT", name: "Nahani Trap Single Piece 11.0x7.5 (4x2½\")", unit: "pc", master_price: 180 },
  { category: "SWR PUSHFIT", name: "Nahani Trap Single Piece 11.0x6.3 (4x2\")", unit: "pc", master_price: 261 },
  { category: "SWR PUSHFIT", name: "Nahani Trap Single Piece 11.0x9.0 (4x3\")", unit: "pc", master_price: 254 },

  { category: "SWR PUSHFIT", name: "Gully Trap w/ Jali 11cm (4\") Square", unit: "pc", master_price: 1000 },
  { category: "SWR PUSHFIT", name: "Gully Trap w/o Jali 11cm (4\") Square", unit: "pc", master_price: 1025 },

  { category: "SWR PUSHFIT", name: "Floor Trap 11.0x6.3 (4x2\")", unit: "pc", master_price: 250 },
  { category: "SWR PUSHFIT", name: "Floor Trap 11.0x7.5 (4x2½\")", unit: "pc", master_price: 230 },

  { category: "SWR PUSHFIT", name: "Multi Trap w/o Jali 11.0x7.5x5.0 (4\")", unit: "pc", master_price: 259 },
  { category: "SWR PUSHFIT", name: "Multi Trap w/o Jali 11.0x7.5x5.0x4.0 (7\")", unit: "pc", master_price: 410 },
  { category: "SWR PUSHFIT", name: "Multi Trap w/o Jali 11.0x9.0x7.5x5.0 (5\")", unit: "pc", master_price: 463 },

  { category: "SWR PUSHFIT", name: "Multi Floor Trap w/ Foul Arrester 7\" 11.0x7.5", unit: "pc", master_price: 494 },
  { category: "SWR PUSHFIT", name: "Balcony Floor Drain 7.5cm (2½\")", unit: "pc", master_price: 829 },

  { category: "SWR PUSHFIT", name: "Branch Saddle 11.0x4.0 (4x1¼\")", unit: "pc", master_price: 115 },
  { category: "SWR PUSHFIT", name: "Branch Saddle 11.0x5.0 (4x1½\")", unit: "pc", master_price: 124 },

  { category: "SWR PUSHFIT", name: "Lip Ring 11.0x12.5 (4x4½\")", unit: "pc", master_price: 223 },

  { category: "SWR PUSHFIT", name: "End Cap 4.0cm (1¼\")", unit: "pc", master_price: 20 },
  { category: "SWR PUSHFIT", name: "End Cap 5.0cm (1½\")", unit: "pc", master_price: 26 },
  { category: "SWR PUSHFIT", name: "End Cap 6.3cm (2\")", unit: "pc", master_price: 48 },
  { category: "SWR PUSHFIT", name: "End Cap 7.5cm (2½\")", unit: "pc", master_price: 54 },
  { category: "SWR PUSHFIT", name: "End Cap 9.0cm (3\")", unit: "pc", master_price: 76 },
  { category: "SWR PUSHFIT", name: "End Cap 11.0cm (4\")", unit: "pc", master_price: 115 },
  { category: "SWR PUSHFIT", name: "End Cap 16.0cm (6\")", unit: "pc", master_price: 286 },

  { category: "SWR PUSHFIT", name: "Socket Plug 4.0cm (1¼\")", unit: "pc", master_price: 14 },
  { category: "SWR PUSHFIT", name: "Socket Plug 5.0cm (1½\")", unit: "pc", master_price: 31 },
  { category: "SWR PUSHFIT", name: "Socket Plug 6.3cm (2\")", unit: "pc", master_price: 40 },
  { category: "SWR PUSHFIT", name: "Socket Plug 7.5cm (2½\")", unit: "pc", master_price: 64 },
  { category: "SWR PUSHFIT", name: "Socket Plug 9.0cm (3\")", unit: "pc", master_price: 71 },
  { category: "SWR PUSHFIT", name: "Socket Plug 11.0cm (4\")", unit: "pc", master_price: 99 },
  { category: "SWR PUSHFIT", name: "Socket Plug 16.0cm (6\")", unit: "pc", master_price: 228 },

  { category: "SWR PUSHFIT", name: "Threaded End Plug 6.3cm (2\")", unit: "pc", master_price: 108 },
  { category: "SWR PUSHFIT", name: "Threaded End Plug 7.5cm (2½\")", unit: "pc", master_price: 139 },
  { category: "SWR PUSHFIT", name: "Threaded End Plug 9.0cm (3\")", unit: "pc", master_price: 185 },
  { category: "SWR PUSHFIT", name: "Threaded End Plug 11.0cm (4\")", unit: "pc", master_price: 314 },
  { category: "SWR PUSHFIT", name: "Threaded End Plug 16.0cm (6\")", unit: "pc", master_price: 509 },

  { category: "SWR PUSHFIT", name: "WC Connecter Straight 11.0x12.5 (4x4½\")", unit: "pc", master_price: 158 },
  { category: "SWR PUSHFIT", name: "WC Connecter Bend 11.0x12.5 (4x4½\")", unit: "pc", master_price: 295 },

  { category: "SWR PUSHFIT", name: "Multi Trap Partition Cap 11cm (4\")", unit: "pc", master_price: 4 },
  { category: "SWR PUSHFIT", name: "Multi Trap Partition Cap 11cm (4\") alt", unit: "pc", master_price: 16 },

  { category: "SWR PUSHFIT", name: "Anti Siphon 7.5x4.0 (2½x1¼\")", unit: "pc", master_price: 473 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 7.5x5.0 (2½x1½\")", unit: "pc", master_price: 431 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 7.5x6.3 (2½x2\")", unit: "pc", master_price: 366 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 11.0x4.0 (4x1¼\")", unit: "pc", master_price: 709 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 11.0x5.0 (4x1½\")", unit: "pc", master_price: 771 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 11.0x6.3 (4x2\")", unit: "pc", master_price: 715 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 11.0x7.5 (4x2½\")", unit: "pc", master_price: 646 },
  { category: "SWR PUSHFIT", name: "Anti Siphon 11.0x9.0 (4x3\")", unit: "pc", master_price: 655 },

  { category: "SWR PUSHFIT", name: "Height Riser w/ Wings 110x50x40", unit: "pc", master_price: 271 },
  { category: "SWR PUSHFIT", name: "Height Riser w/o Wings 110x50x40", unit: "pc", master_price: 370 },

  { category: "SWR PUSHFIT", name: "Pipe Clips Small Holes 7.5cm (2½\")", unit: "pc", master_price: 39 },
  { category: "SWR PUSHFIT", name: "Pipe Clips Small Holes 9cm (3\")", unit: "pc", master_price: 39 },
  { category: "SWR PUSHFIT", name: "Pipe Clips Small Holes 11cm (4\")", unit: "pc", master_price: 46 },
  { category: "SWR PUSHFIT", name: "Pipe Clips Small Holes 16cm (6\")", unit: "pc", master_price: 98 },

  { category: "SWR PUSHFIT", name: "Pipe Clips Big Holes 7.5cm (2½\")", unit: "pc", master_price: 31 },
  { category: "SWR PUSHFIT", name: "Pipe Clips Big Holes 9cm (3\")", unit: "pc", master_price: 39 },
  { category: "SWR PUSHFIT", name: "Pipe Clips Big Holes 11cm (4\")", unit: "pc", master_price: 43 },
  { category: "SWR PUSHFIT", name: "Pipe Clips Big Holes 16cm (6\")", unit: "pc", master_price: 88 },

  { category: "SWR PUSHFIT", name: "Vent Cowl 7.5cm (2½\")", unit: "pc", master_price: 34 },
  { category: "SWR PUSHFIT", name: "Vent Cowl 9cm (3\")", unit: "pc", master_price: 45 },
  { category: "SWR PUSHFIT", name: "Vent Cowl 11cm (4\")", unit: "pc", master_price: 65 },
  { category: "SWR PUSHFIT", name: "Vent Cowl 16cm (6\")", unit: "pc", master_price: 186 },

  { category: "SWR PUSHFIT", name: "Door Cap 5.0cm (1½\")", unit: "pc", master_price: 19 },
  { category: "SWR PUSHFIT", name: "Door Cap 6.3cm (2\")", unit: "pc", master_price: 28 },
  { category: "SWR PUSHFIT", name: "Door Cap 7.5cm (2½\")", unit: "pc", master_price: 53 },
  { category: "SWR PUSHFIT", name: "Door Cap 9.0cm (3\")", unit: "pc", master_price: 71 },
  { category: "SWR PUSHFIT", name: "Door Cap 11.0cm (4\")", unit: "pc", master_price: 76 },
  { category: "SWR PUSHFIT", name: "Door Cap 16.0cm (6\")", unit: "pc", master_price: 230 },
  { category: "SWR PUSHFIT", name: "Door Cap 20.0cm (8\")", unit: "pc", master_price: 335 },

  { category: "SWR PUSHFIT", name: "Round Jali for Nahani Traps 5.0cm (1½\")", unit: "pc", master_price: 14 },
  { category: "SWR PUSHFIT", name: "Round Jali for Nahani Traps 6.3cm (2\")", unit: "pc", master_price: 20 },
  { category: "SWR PUSHFIT", name: "Round Jali for Nahani Traps 9.0cm (3\")", unit: "pc", master_price: 21 },
  { category: "SWR PUSHFIT", name: "Round Jali for Nahani Traps 11.0cm (4\")", unit: "pc", master_price: 40 },

  { category: "SWR PUSHFIT", name: "Square Jali 16.0x16.0 (6x6\")", unit: "pc", master_price: 101 },

  // --- Pan Connectors ---
  { category: "SWR PUSHFIT", name: "Pan Connector APCS2 Straight", unit: "pc", master_price: 392 },
  { category: "SWR PUSHFIT", name: "Pan Connector APCO2 1.8cm Offset", unit: "pc", master_price: 448 },
  { category: "SWR PUSHFIT", name: "Pan Connector APCO4 4.0cm Offset", unit: "pc", master_price: 448 },
  { category: "SWR PUSHFIT", name: "Pan Connector APCC2 Collapsible", unit: "pc", master_price: 561 },
  { category: "SWR PUSHFIT", name: "WC Inlet Rubber Bush / Washer", unit: "pc", master_price: 51 },
];
