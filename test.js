/**
 * Automated Test Suite for GroceryIn Logic
 */
const assert = require('assert');

// 1. Cascading Tiered Discount Logic Test
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

// 2. Price Fluctuation Detection Logic Test
function detectPriceFluctuation(currentPrice, lastMonthPrice) {
  if (!lastMonthPrice || lastMonthPrice <= 0 || !currentPrice || currentPrice <= 0) {
    return { status: "EQUAL", arrow: "=", diffNominal: 0, diffPercent: 0 };
  }
  const diff = currentPrice - lastMonthPrice;
  const diffPercent = parseFloat(((diff / lastMonthPrice) * 100).toFixed(1));

  if (diff > 0) {
    return { status: "UP", arrow: "↑", diffNominal: diff, diffPercent: Math.abs(diffPercent) };
  } else if (diff < 0) {
    return { status: "DOWN", arrow: "↓", diffNominal: Math.abs(diff), diffPercent: Math.abs(diffPercent) };
  } else {
    return { status: "EQUAL", arrow: "=", diffNominal: 0, diffPercent: 0 };
  }
}

// 3. Budget Safety Cap Logic Test
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

// ==================== RUNNING TESTS ====================
console.log("=== RUNNING GROCERYIN LOGIC UNIT TESTS ===");

// Test 1: Tiered Discount 50% + 20% on Rp 100,000
const test1 = calculateTieredDiscount(100000, "50+20");
console.log("Test 1 (50% + 20% on Rp 100.000):", test1);
assert.strictEqual(test1.finalPrice, 40000, "Final price must be Rp 40.000, not Rp 30.000 flat");
assert.strictEqual(test1.totalSaved, 60000, "Total saved must be Rp 60.000");
assert.strictEqual(test1.effectivePercent, 60, "Effective percent must be 60%");
console.log("✔ Test 1 Passed: Diskon bertingkat 50%+20% terbukti menghasilkan Rp 40.000 (hemat 60%, bukan flat 70%).");

// Test 2: Tiered Discount 30% + 10% on Rp 200,000
// 200,000 - 30% = 140,000; 140,000 - 10% = 126,000
const test2 = calculateTieredDiscount(200000, "30+10");
assert.strictEqual(test2.finalPrice, 126000);
assert.strictEqual(test2.totalSaved, 74000);
console.log("✔ Test 2 Passed: Diskon bertingkat 30%+10% terbukti valid.");

// Test 3: Price Fluctuation (UP, DOWN, EQUAL)
const flucUp = detectPriceFluctuation(75000, 70000);
assert.strictEqual(flucUp.status, "UP");
assert.strictEqual(flucUp.arrow, "↑");
assert.strictEqual(flucUp.diffNominal, 5000);

const flucDown = detectPriceFluctuation(65000, 70000);
assert.strictEqual(flucDown.status, "DOWN");
assert.strictEqual(flucDown.arrow, "↓");
assert.strictEqual(flucDown.diffNominal, 5000);

const flucEqual = detectPriceFluctuation(70000, 70000);
assert.strictEqual(flucEqual.status, "EQUAL");
assert.strictEqual(flucEqual.arrow, "=");
console.log("✔ Test 3 Passed: Deteksi fluktuasi harga (↑ Naik Merah, ↓ Turun Hijau, = Setara) valid.");

// Test 4: Budget Safety Cap Trigger
const capSafe = evaluateBudgetSafetyCap(200000, 500000); // 40%
assert.strictEqual(capSafe.state, "SAFE");

const capWarning = evaluateBudgetSafetyCap(350000, 500000); // 70%
assert.strictEqual(capWarning.state, "WARNING");

const capCritical = evaluateBudgetSafetyCap(450000, 500000); // 90%
assert.strictEqual(capCritical.state, "DANGER_CRITICAL");

const capExceeded = evaluateBudgetSafetyCap(550000, 500000); // 110%
assert.strictEqual(capExceeded.state, "DANGER_EXCEEDED");
console.log("✔ Test 4 Passed: Budget safety cap (Aman, Waspada, Bahaya Berkedip Merah saat melampaui limit) valid.");

console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
