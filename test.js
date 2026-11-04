/**
 * Automated Test Suite for GroceryIn Logic
 * Smart Grocery & Budget Safety Tracker (PWA Mobile Edition)
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

// 3. City Supermarket Filter Mapping
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

// 4. Default Products Catalog Test
const DEFAULT_COMMODITIES = [
  { id: "prod-beras-5kg-74", name: "Beras 5kg", price: 74000, lastMonthPrice: 68000, discount: 0 },
  { id: "prod-telur-1kg", name: "Telur 1kg (Tanpa Diskon)", price: 28000, lastMonthPrice: 32000, discount: 0 },
  { id: "prod-garam-500g", name: "Garam 500g", price: 5000, lastMonthPrice: 5000, discount: 0 },
  { id: "prod-beras-5kg-745", name: "Beras 5kg (Premium)", price: 74500, lastMonthPrice: 74500, discount: 0 },
  { id: "prod-minyak-2l", name: "Minyak Goreng 2L", price: 42000, lastMonthPrice: 42000, discount: 0 },
  { id: "prod-indomie-goreng-5", name: "Indomie Goreng 5 pcs", price: 16500, lastMonthPrice: 16500, discount: 0 },
  { id: "prod-indomie-kuah-5", name: "Indomie Kuah 5 pcs", price: 16000, lastMonthPrice: 16000, discount: 0 },
  { id: "prod-terigu-1kg", name: "Tepung Terigu 1kg", price: 15500, lastMonthPrice: 15500, discount: 0 },
  { id: "prod-gula-1kg", name: "Gula Pasir 1kg", price: 19500, lastMonthPrice: 19500, discount: 0 },
  { id: "prod-ultra-milk-1l", name: "Susu Ultra Milk 1L", price: 22500, lastMonthPrice: 22500, discount: 0 },
  { id: "prod-aqua-6", name: "Aqua 6 Botol", price: 24000, lastMonthPrice: 24000, discount: 0 },
  { id: "prod-daging-300g", name: "Daging Sapi 300g", price: 55000, lastMonthPrice: 55000, discount: 0 },
  { id: "prod-sabun-cuci", name: "Sabun Cuci", price: 20000, lastMonthPrice: 20000, discount: 0 },
  { id: "prod-sabun-mandi", name: "Sabun Mandi", price: 29500, lastMonthPrice: 29500, discount: 0 }
];

// 5. Intelligent Merge Test (User edits must never be reverted back to default)
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

console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
