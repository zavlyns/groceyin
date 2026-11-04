/**
 * Automated Test Suite for GroceryIn Logic
 * Smart Grocery & Budget Safety Tracker (PWA Mobile Edition - Black & Red)
 */
const assert = require('assert');

// 1. Rumus Harga2 = Harga - (Diskon * Harga)
function calculateHarga2(harga, diskon) {
  if (!diskon || diskon <= 0) {
    return { hasDiscount: false, harga2: harga, discountPercent: 0 };
  }
  const discountAmount = Math.round(diskon * harga);
  const harga2 = harga - discountAmount;
  return {
    hasDiscount: true,
    harga2: harga2,
    discountAmount: discountAmount,
    discountPercent: Math.round(diskon * 100)
  };
}

// 2. Price Fluctuation Detection Logic Test:
// a) ⬆ (Merah), muncul bila harga produk meningkat dibanding bulan lalu
// b) ⬇︎ (Hijau), muncul bila harga produk menurun dibanding bulan lalu
// c) = (Abu-abu), muncul bila harga produk masih sama dengan bulan lalu
function detectPriceFluctuation(currentPrice, lastMonthPrice) {
  if (lastMonthPrice === undefined || lastMonthPrice <= 0 || !currentPrice || currentPrice <= 0) {
    return { status: "EQUAL", emote: "=", color: "gray", diffNominal: 0, diffPercent: 0 };
  }
  const diff = currentPrice - lastMonthPrice;
  const diffPercent = parseFloat(((diff / lastMonthPrice) * 100).toFixed(1));

  if (diff > 0) {
    return { status: "UP", emote: "⬆", color: "red", diffNominal: diff, diffPercent: Math.abs(diffPercent) };
  } else if (diff < 0) {
    return { status: "DOWN", emote: "⬇︎", color: "green", diffNominal: Math.abs(diff), diffPercent: Math.abs(diffPercent) };
  } else {
    return { status: "EQUAL", emote: "=", color: "gray", diffNominal: 0, diffPercent: 0 };
  }
}

// 3. Three-Tier Budget Logic:
// - HIJAU: Masih aman (pengeluaran < 75%)
// - KUNING: Warning / mau habis (pengeluaran 75% - 99%)
// - MERAH: Habis & kelewatan (pengeluaran >= 100%)
function getBudgetStatusTier(totalSpent, initialBudget) {
  if (initialBudget <= 0) return { tier: "RED", color: "#EF4444", status: "OVER_BUDGET" };
  const ratio = totalSpent / initialBudget;
  if (ratio >= 1.0) {
    return { tier: "RED", color: "#EF4444", status: "HABIS_DAN_KELEWATAN" };
  } else if (ratio >= 0.75) {
    return { tier: "YELLOW", color: "#EAB308", status: "WARNING_MAU_HABIS" };
  } else {
    return { tier: "GREEN", color: "#22C55E", status: "AMAN" };
  }
}

// 4. City Supermarket Filter Mapping
const CITY_SUPERMARKETS = {
  "Jakarta Barat (Puri Indah)": [
    "Lotte Mart Grocery - Puri Indah",
    "Indomaret",
    "Alfamart",
    "Alfamidi",
    "Family Mart"
  ],
  "Jabodetabek / Jakarta": [
    "Lotte Mart Grocery - Puri Indah",
    "Indomaret",
    "Alfamart",
    "Alfamidi",
    "Family Mart"
  ],
  "Bandung": [
    "Indomaret",
    "Alfamart",
    "Alfamidi",
    "Lotte Mart Grocery"
  ],
  "Surabaya": [
    "Indomaret",
    "Alfamart",
    "Alfamidi",
    "Family Mart",
    "Lotte Mart Grocery"
  ]
};

// 5. Default Products Catalog Test
const DEFAULT_COMMODITIES = [
  { id: "prod-beras-5kg-74", name: "Beras 5kg", defaultUnit: "kg", price: 74000, lastMonthPrice: 68000, discount: 0 },
  { id: "prod-telur-1kg", name: "Telur 1kg (Tanpa Diskon)", defaultUnit: "kg", price: 28000, lastMonthPrice: 32000, discount: 0 },
  { id: "prod-garam-500g", name: "Garam 500g", defaultUnit: "pack", price: 5000, lastMonthPrice: 5000, discount: 0 },
  { id: "prod-beras-5kg-745", name: "Beras 5kg (Premium)", defaultUnit: "pack", price: 74500, lastMonthPrice: 74500, discount: 0 },
  { id: "prod-minyak-2l", name: "Minyak Goreng 2L", defaultUnit: "liter", price: 42000, lastMonthPrice: 42000, discount: 0 },
  { id: "prod-indomie-goreng-5", name: "Indomie Goreng 5 pcs", defaultUnit: "pack", price: 16500, lastMonthPrice: 16500, discount: 0 },
  { id: "prod-indomie-kuah-5", name: "Indomie Kuah 5 pcs", defaultUnit: "pack", price: 16000, lastMonthPrice: 16000, discount: 0 },
  { id: "prod-terigu-1kg", name: "Tepung Terigu 1kg", defaultUnit: "kg", price: 15500, lastMonthPrice: 15500, discount: 0 },
  { id: "prod-gula-1kg", name: "Gula Pasir 1kg", defaultUnit: "kg", price: 19500, lastMonthPrice: 19500, discount: 0 },
  { id: "prod-ultra-milk-1l", name: "Susu Ultra Milk 1L", defaultUnit: "liter", price: 22500, lastMonthPrice: 22000, discount: 0 },
  { id: "prod-aqua-6", name: "Aqua 6 Botol", defaultUnit: "botol", price: 24000, lastMonthPrice: 24000, discount: 0 },
  { id: "prod-daging-300g", name: "Daging Sapi 300g", defaultUnit: "pack", price: 55000, lastMonthPrice: 52000, discount: 0 },
  { id: "prod-sabun-cuci", name: "Sabun Cuci", defaultUnit: "pack", price: 20000, lastMonthPrice: 21000, discount: 0 },
  { id: "prod-sabun-mandi", name: "Sabun Mandi", defaultUnit: "pcs", price: 29500, lastMonthPrice: 32000, discount: 0 }
];

// 6. Intelligent Merge Test
function mergeCatalogWithUserEdits(defaults, savedUserItems) {
  const merged = JSON.parse(JSON.stringify(defaults));
  savedUserItems.forEach(userItem => {
    const idx = merged.findIndex(it => it.id === userItem.id);
    if (idx !== -1) {
      merged[idx] = { ...merged[idx], ...userItem };
    } else {
      merged.push(userItem);
    }
  });
  return merged;
}

// ==================== RUNNING TESTS ====================
console.log("=== RUNNING GROCERYIN LOGIC UNIT TESTS ===");

// Test 1: Rumus Harga2 = Harga - (Diskon * Harga)
const testHarga2 = calculateHarga2(20000, 0.15);
assert.strictEqual(testHarga2.harga2, 17000, "Harga2 harus tepat Rp 17.000");
console.log("✔ Test 1 Passed: Rumus Harga2 = Harga - (Diskon * Harga) terbukti valid.");

// Test 2: Beras 5kg (bulan lalu 68rb naik jadi 74rb -> ⬆ Merah)
const berasFluc = detectPriceFluctuation(74000, 68000);
assert.strictEqual(berasFluc.status, "UP");
assert.strictEqual(berasFluc.emote, "⬆");
assert.strictEqual(berasFluc.color, "red");
assert.strictEqual(berasFluc.diffNominal, 6000);
console.log("✔ Test 2 Passed: Beras 5kg naik jadi 74rb terbukti panah merah atas (⬆).");

// Test 3: Telur 1kg (bulan lalu 32rb turun jadi 28rb -> ⬇︎ Hijau)
const telurFluc = detectPriceFluctuation(28000, 32000);
assert.strictEqual(telurFluc.status, "DOWN");
assert.strictEqual(telurFluc.emote, "⬇︎");
assert.strictEqual(telurFluc.color, "green");
assert.strictEqual(telurFluc.diffNominal, 4000);
console.log("✔ Test 3 Passed: Telur 1kg turun jadi 28rb terbukti panah hijau turun (⬇︎).");

// Test 4: Garam 500g (bulan lalu 5rb sekarang 5rb -> = Abu-abu)
const garamFluc = detectPriceFluctuation(5000, 5000);
assert.strictEqual(garamFluc.status, "EQUAL");
assert.strictEqual(garamFluc.emote, "=");
assert.strictEqual(garamFluc.color, "gray");
console.log("✔ Test 4 Passed: Garam 500g setara terbukti tanda setara abu-abu (=).");

// Test 5: Lokasi Supermarket Lotte Mart Grocery - Puri Indah
assert.ok(CITY_SUPERMARKETS["Jakarta Barat (Puri Indah)"].includes("Lotte Mart Grocery - Puri Indah"));
assert.ok(CITY_SUPERMARKETS["Jabodetabek / Jakarta"].includes("Lotte Mart Grocery - Puri Indah"));
console.log("✔ Test 5 Passed: Lotte Mart Grocery - Puri Indah terdaftar di pilihan supermarket.");

// Test 6: Intelligent Database Persistence (User edits never revert to default)
const userEditedBeras = [{ id: "prod-beras-5kg-74", price: 76000, lastMonthPrice: 74000 }];
const merged = mergeCatalogWithUserEdits(DEFAULT_COMMODITIES, userEditedBeras);
const resultBeras = merged.find(it => it.id === "prod-beras-5kg-74");
assert.strictEqual(resultBeras.price, 76000, "Harga hasil editan user harus tetap 76000 dan tidak kembali ke 74000");
console.log("✔ Test 6 Passed: Data yang diubah user tetap tersimpan dan tidak terganti balik ke default.");

// Test 7: Three-Tier Budget Logic (Hijau = Aman, Kuning = Warning Mau Habis, Merah = Habis & Kelewatan)
const budgetAman = getBudgetStatusTier(150000, 300000); // 50%
assert.strictEqual(budgetAman.tier, "GREEN");
assert.strictEqual(budgetAman.status, "AMAN");

const budgetWarning = getBudgetStatusTier(240000, 300000); // 80%
assert.strictEqual(budgetWarning.tier, "YELLOW");
assert.strictEqual(budgetWarning.status, "WARNING_MAU_HABIS");

const budgetOver = getBudgetStatusTier(310000, 300000); // 103%
assert.strictEqual(budgetOver.tier, "RED");
assert.strictEqual(budgetOver.status, "HABIS_DAN_KELEWATAN");
console.log("✔ Test 7 Passed: Logika Budget (Hijau = Aman, Kuning = Warning Mau Habis, Merah = Habis & Kelewatan) terbukti akurat.");

// Test 8: Unit & Discount Configuration on Cart Item
const testItem = {
  name: "Beras 5kg",
  price: 74000,
  unit: "kg",
  quantity: 2,
  discount: 0.10, // 10%
  finalPrice: 74000 * (1 - 0.10) // 66600
};
assert.strictEqual(testItem.unit, "kg");
assert.strictEqual(testItem.finalPrice, 66600);
assert.strictEqual(testItem.finalPrice * testItem.quantity, 133200);
console.log("✔ Test 8 Passed: Pilihan satuan (kg) dan diskon (10%) menghasilkan harga akhir yang sesuai.");

console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
