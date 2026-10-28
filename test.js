/**
 * Automated Test Suite for GroceryIn Logic
 * Smart Grocery & Budget Safety Tracker (Edition Anak Rantau)
 */
const assert = require('assert');

// 1. Rumus Diskon Tunggal: Harga2 = Harga - (Diskon * Harga)
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

// 2. Cascading Tiered Discount Logic Test (Legacy/Compound promo)
function calculateTieredDiscount(grossPrice, tierInput) {
  if (!tierInput || grossPrice <= 0) {
    return { finalPrice: grossPrice, totalSaved: 0, effectivePercent: 0, steps: [] };
  }

  let rawTiers = tierInput
    .toString()
    .replace(/%/g, "")
    .split(/[+,/ ]+/)
    .map(t => parseFloat(t.trim()))
    .filter(t => !isNaN(t) && t > 0);

  let currentPrice = grossPrice;
  const steps = [];

  rawTiers.forEach((discPct, idx) => {
    const clampedDisc = Math.min(100, Math.max(0, discPct));
    const potongan = (currentPrice * clampedDisc) / 100;
    const priceAfter = currentPrice - potongan;
    steps.push({
      stepNumber: idx + 1,
      percent: clampedDisc,
      deduction: potongan,
      priceAfter: priceAfter
    });
    currentPrice = priceAfter;
  });

  const totalSaved = grossPrice - currentPrice;
  const effectivePercent = grossPrice > 0 ? (totalSaved / grossPrice) * 100 : 0;

  return {
    finalPrice: Math.round(currentPrice),
    totalSaved: Math.round(totalSaved),
    effectivePercent: parseFloat(effectivePercent.toFixed(1)),
    steps
  };
}

// 3. Price Fluctuation Detection Logic Test
function detectPriceFluctuation(currentPrice, lastMonthPrice) {
  if (!lastMonthPrice || lastMonthPrice <= 0 || !currentPrice || currentPrice <= 0) {
    return { status: "EQUAL", emote: "=", color: "yellow", diffNominal: 0, diffPercent: 0 };
  }
  const diff = currentPrice - lastMonthPrice;
  const diffPercent = parseFloat(((diff / lastMonthPrice) * 100).toFixed(1));

  if (diff > 0) {
    return { status: "UP", emote: "⬆", color: "red", diffNominal: diff, diffPercent: Math.abs(diffPercent) };
  } else if (diff < 0) {
    return { status: "DOWN", emote: "⬇︎", color: "green", diffNominal: Math.abs(diff), diffPercent: Math.abs(diffPercent) };
  } else {
    return { status: "EQUAL", emote: "=", color: "yellow", diffNominal: 0, diffPercent: 0 };
  }
}

// 4. Budget Safety Cap Logic Test
function evaluateBudgetSafetyCap(totalSpent, budgetCap) {
  const remaining = budgetCap - totalSpent;
  const spentPercent = budgetCap > 0 ? (totalSpent / budgetCap) * 100 : 0;

  let state = "SAFE";
  if (spentPercent > 100) {
    state = "DANGER_EXCEEDED";
  } else if (spentPercent >= 85) {
    state = "DANGER_CRITICAL";
  } else if (spentPercent >= 65) {
    state = "WARNING";
  } else {
    state = "SAFE";
  }

  return { remaining, spentPercent, state };
}

// 5. City Supermarket Filter Mapping
const CITY_SUPERMARKETS = {
  "Bandung": ["Indomaret", "Alfamart", "Alfamidi"],
  "Jabodetabek / Jakarta": ["Indomaret", "Alfamart", "Alfamidi", "Family Mart"],
  "Yogyakarta": ["Indomaret", "Alfamart", "Alfamidi"],
  "Surabaya": ["Indomaret", "Alfamart", "Alfamidi", "Family Mart"]
};

// 6. Custom Unit (Satuan), Quantity & Discount Calculation Logic Test
function calculateItemSubtotal(basePrice, unit, quantity, discountMode, discountVal) {
  let discountPerUnit = 0;
  if (discountMode === "percent") {
    const pct = Math.min(100, Math.max(0, discountVal));
    discountPerUnit = Math.round(basePrice * (pct / 100));
  } else {
    discountPerUnit = Math.min(basePrice, Math.max(0, discountVal));
  }
  const netPrice = Math.max(0, basePrice - discountPerUnit);
  const subtotal = netPrice * quantity;
  const totalSaved = discountPerUnit * quantity;
  return { netPrice, subtotal, totalSaved, unit, quantity };
}

// ==================== RUNNING TESTS ====================
console.log("=== RUNNING GROCERYIN LOGIC UNIT TESTS ===");

// Test 1: Rumus Harga2 = Harga - (Diskon * Harga)
const testHarga2 = calculateHarga2(20000, 0.15);
console.log("Test 1 (Rumus Harga2 pada Rp 20.000 diskon 15%):", testHarga2);
assert.strictEqual(testHarga2.hasDiscount, true);
assert.strictEqual(testHarga2.harga2, 17000, "Harga2 harus tepat Rp 17.000");
assert.strictEqual(testHarga2.discountAmount, 3000);
console.log("✔ Test 1 Passed: Rumus Harga2 = Harga - (Diskon * Harga) terbukti valid.");

// Test 2: Tiered Discount 50% + 20% on Rp 100,000
const test2 = calculateTieredDiscount(100000, "50+20");
assert.strictEqual(test2.finalPrice, 40000, "Final price must be Rp 40.000");
assert.strictEqual(test2.totalSaved, 60000);
console.log("✔ Test 2 Passed: Diskon bertingkat 50%+20% terbukti menghasilkan Rp 40.000 (hemat 60%).");

// Test 3: Emote Fluktuasi Harga (⬆ Merah, ⬇︎ Hijau, = Kuning)
const flucUp = detectPriceFluctuation(3300, 3100);
assert.strictEqual(flucUp.status, "UP");
assert.strictEqual(flucUp.emote, "⬆");
assert.strictEqual(flucUp.color, "red");
assert.strictEqual(flucUp.diffNominal, 200);

const flucDown = detectPriceFluctuation(74500, 77000);
assert.strictEqual(flucDown.status, "DOWN");
assert.strictEqual(flucDown.emote, "⬇︎");
assert.strictEqual(flucDown.color, "green");
assert.strictEqual(flucDown.diffNominal, 2500);

const flucEqual = detectPriceFluctuation(36000, 36000);
assert.strictEqual(flucEqual.status, "EQUAL");
assert.strictEqual(flucEqual.emote, "=");
assert.strictEqual(flucEqual.color, "yellow");
console.log("✔ Test 3 Passed: Deteksi emote fluktuasi (⬆ Merah Naik, ⬇︎ Hijau Turun, = Kuning Stabil) valid.");

// Test 4: Supermarket filtering based on selected city
assert.ok(CITY_SUPERMARKETS["Jabodetabek / Jakarta"].includes("Family Mart"));
assert.ok(!CITY_SUPERMARKETS["Bandung"].includes("Family Mart"), "Family Mart tidak ada di Bandung");
assert.ok(CITY_SUPERMARKETS["Bandung"].includes("Indomaret"));
assert.ok(CITY_SUPERMARKETS["Bandung"].includes("Alfamart"));
console.log("✔ Test 4 Passed: Filter ketersediaan supermarket berdasarkan kota terbukti akurat.");

// Test 5: Budget Safety Cap Trigger
const capSafe = evaluateBudgetSafetyCap(120000, 300000); // 40%
assert.strictEqual(capSafe.state, "SAFE");

const capWarning = evaluateBudgetSafetyCap(210000, 300000); // 70%
assert.strictEqual(capWarning.state, "WARNING");

const capCritical = evaluateBudgetSafetyCap(270000, 300000); // 90%
assert.strictEqual(capCritical.state, "DANGER_CRITICAL");

const capExceeded = evaluateBudgetSafetyCap(320000, 300000); // 106%
assert.strictEqual(capExceeded.state, "DANGER_EXCEEDED");
console.log("✔ Test 5 Passed: Budget safety cap (Aman, Waspada, Bahaya saat budget habis) valid.");

// Test 6: Custom Unit (Satuan), Quantity, and Discount Calculation
// Case A: 2 kg Telur Ayam base Rp 28.500, discount 10%
const itemA = calculateItemSubtotal(28500, "kg", 2, "percent", 10);
assert.strictEqual(itemA.netPrice, 25650, "Net price per kg after 10% discount");
assert.strictEqual(itemA.subtotal, 51300, "Subtotal for 2 kg must be Rp 51.300");
assert.strictEqual(itemA.totalSaved, 5700, "Total discount saved must be Rp 5.700");

// Case B: 3 liter Minyak base Rp 36.000, nominal discount Rp 4.000
const itemB = calculateItemSubtotal(36000, "liter", 3, "nominal", 4000);
assert.strictEqual(itemB.netPrice, 32000, "Net price per liter after Rp 4.000 discount");
assert.strictEqual(itemB.subtotal, 96000, "Subtotal for 3 liter must be Rp 96.000");
assert.strictEqual(itemB.totalSaved, 12000, "Total discount saved must be Rp 12.000");

// Case C: 500 ml Sabun base Rp 14.000, 0% discount
const itemC = calculateItemSubtotal(14000, "ml", 1, "percent", 0);
assert.strictEqual(itemC.netPrice, 14000);
assert.strictEqual(itemC.subtotal, 14000);
assert.strictEqual(itemC.totalSaved, 0);

console.log("✔ Test 6 Passed: Pemilihan satuan (kg, liter, ml, pcs), kuantitas, dan diskon (persen & nominal) akurat.");

console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
