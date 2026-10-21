/**
 * GROCERYIN - SMART GROCERY & PRICE TRACKER
 * Features:
 * - Single-User Authentication Lock & Google Sign-In Simulation
 * - Realtime Quantity & Subtotal Auto-Calculation
 * - Cascading Tiered Discount Engine (e.g. 50% + 20%)
 * - Realtime Price Fluctuation Detection (↑ Panah Merah Naik, ↓ Panah Hijau Turun, = Setara)
 * - Budget Safety Cap with Dynamic Glowing Red Danger Alerts
 * - Mobile-First Segmented Navigation & Floating Cart Bar
 * - Quick Benchmark Market Catalog
 * - Printable Digital Receipt
 */

// ==================== INITIAL DATA & BENCHMARKS ====================
const BENCHMARK_CATALOG = [
  { name: "Beras Ramos Premium", category: "Sembako", unit: "kg", defaultQty: 5, currentPrice: 72000, lastMonthPrice: 68000, icon: "🍚", discount: "" },
  { name: "Minyak Goreng 2 Liter", category: "Sembako", unit: "liter", defaultQty: 2, currentPrice: 34500, lastMonthPrice: 37000, icon: "🛢️", discount: "10" },
  { name: "Telur Ayam Negeri", category: "Susu & Telur", unit: "kg", defaultQty: 1, currentPrice: 28500, lastMonthPrice: 28500, icon: "🥚", discount: "" },
  { name: "Daging Sapi Segar", category: "Daging & Ikan", unit: "kg", defaultQty: 1, currentPrice: 142000, lastMonthPrice: 135000, icon: "🥩", discount: "20+10" },
  { name: "Bawang Merah Brebes", category: "Bumbu Dapur", unit: "kg", defaultQty: 1, currentPrice: 30000, lastMonthPrice: 35000, icon: "🧅", discount: "" },
  { name: "Susu UHT Full Cream 1L", category: "Susu & Telur", unit: "liter", defaultQty: 2, currentPrice: 19500, lastMonthPrice: 19500, icon: "🥛", discount: "50+20" },
  { name: "Apel Fuji Segar", category: "Sayur & Buah", unit: "kg", defaultQty: 1.5, currentPrice: 48000, lastMonthPrice: 42000, icon: "🍎", discount: "15" },
  { name: "Sabun Cuci Piring Refill", category: "Kebersihan", unit: "pack", defaultQty: 1, currentPrice: 13500, lastMonthPrice: 15000, icon: "🧼", discount: "" }
];

// Initial starter shopping cart items
const INITIAL_ITEMS = [
  {
    id: "item-1",
    name: "Minyak Goreng 2 Liter",
    category: "Sembako",
    unit: "liter",
    quantity: 2,
    price: 34500,
    lastMonthPrice: 37000,
    discountTiers: "10",
    notes: "Promo supermarket akhir pekan",
    isBought: true
  },
  {
    id: "item-2",
    name: "Beras Ramos Premium",
    category: "Sembako",
    unit: "kg",
    quantity: 5,
    price: 72000,
    lastMonthPrice: 68000,
    discountTiers: "",
    notes: "Pilih karung yang bersih",
    isBought: false
  },
  {
    id: "item-3",
    name: "Daging Sapi Segar",
    category: "Daging & Ikan",
    unit: "kg",
    quantity: 1,
    price: 142000,
    lastMonthPrice: 135000,
    discountTiers: "20+10",
    notes: "Diskon bertingkat promo kartu member",
    isBought: false
  }
];

// ==================== STATE MANAGEMENT ====================
class GroceryInApp {
  constructor() {
    this.storageKeyUser = "groceryin_single_user_lock";
    this.storageKeyItems = "groceryin_items_data";
    this.storageKeyBudget = "groceryin_budget_cap";

    this.currentUser = null;
    this.items = [];
    this.budgetCap = 500000;
    this.editingId = null;
    this.currentMobileTab = "cart"; // cart, add, catalog

    this.initElements();
    this.initEventListeners();
    this.loadState();
  }

  // ==================== ELEMENT SELECTORS ====================
  initElements() {
    // Auth Elements
    this.authOverlay = document.getElementById("authOverlay");
    this.authTitle = document.getElementById("authTitle");
    this.singleUserNotice = document.getElementById("singleUserNotice");
    this.singleUserNoticeDesc = document.getElementById("singleUserNoticeDesc");
    this.inputUsername = document.getElementById("inputUsername");
    this.usernameHint = document.getElementById("usernameHint");
    this.btnSubmitLogin = document.getElementById("btnSubmitLogin");
    this.btnGoogleLogin = document.getElementById("btnGoogleLogin");
    this.googleModal = document.getElementById("googleModal");
    this.btnCloseGoogleModal = document.getElementById("btnCloseGoogleModal");
    this.gAccDemo1 = document.getElementById("gAccDemo1");
    this.gAccDemo2 = document.getElementById("gAccDemo2");
    this.displayName = document.getElementById("displayName");
    this.userAvatar = document.getElementById("userAvatar");
    this.btnLogout = document.getElementById("btnLogout");

    // Budget Cap Elements
    this.budgetCard = document.getElementById("budgetCard");
    this.inputBudgetCap = document.getElementById("inputBudgetCap");
    this.budgetSpentText = document.getElementById("budgetSpentText");
    this.budgetPercentText = document.getElementById("budgetPercentText");
    this.budgetRemainingText = document.getElementById("budgetRemainingText");
    this.budgetProgressBar = document.getElementById("budgetProgressBar");
    this.budgetAlertBanner = document.getElementById("budgetAlertBanner");
    this.alertIcon = document.getElementById("alertIcon");
    this.alertMessage = document.getElementById("alertMessage");
    this.budgetStatusBadge = document.getElementById("budgetStatusBadge");

    // Mobile Navigation & Floating Bar Elements
    this.tabBtnCart = document.getElementById("tabBtnCart");
    this.tabBtnAdd = document.getElementById("tabBtnAdd");
    this.tabBtnCatalog = document.getElementById("tabBtnCatalog");
    this.tabCartCount = document.getElementById("tabCartCount");
    this.mobileBottomPrice = document.getElementById("mobileBottomPrice");
    this.btnMobileAdd = document.getElementById("btnMobileAdd");
    this.btnMobileReceipt = document.getElementById("btnMobileReceipt");

    // Item Form Elements
    this.groceryForm = document.getElementById("groceryForm");
    this.formTitle = document.getElementById("formTitle");
    this.editingItemId = document.getElementById("editingItemId");
    this.inputItemName = document.getElementById("inputItemName");
    this.inputCategory = document.getElementById("inputCategory");
    this.inputUnit = document.getElementById("inputUnit");
    this.inputQty = document.getElementById("inputQty");
    this.btnQtyMinus = document.getElementById("btnQtyMinus");
    this.btnQtyPlus = document.getElementById("btnQtyPlus");
    this.inputPrice = document.getElementById("inputPrice");
    this.inputLastMonthPrice = document.getElementById("inputLastMonthPrice");
    this.inputDiscountTiers = document.getElementById("inputDiscountTiers");
    this.inputNotes = document.getElementById("inputNotes");
    this.btnSaveItem = document.getElementById("btnSaveItem");
    this.btnSaveText = document.getElementById("btnSaveText");
    this.btnCancelEdit = document.getElementById("btnCancelEdit");

    // Realtime Form Live Preview
    this.flucPreviewCard = document.getElementById("fluctuationPreviewCard");
    this.flucIconBox = document.getElementById("flucIconBox");
    this.flucTitle = document.getElementById("flucTitle");
    this.flucSub = document.getElementById("flucSub");
    this.flucBadge = document.getElementById("flucBadge");
    this.discountMathBox = document.getElementById("discountMathBox");
    this.discountMathContent = document.getElementById("discountMathContent");
    this.calcSubtotalNote = document.getElementById("calcSubtotalNote");
    this.calcOriginalStrike = document.getElementById("calcOriginalStrike");
    this.calcFinalItemTotal = document.getElementById("calcFinalItemTotal");

    // Cart List & Controls
    this.groceryListContainer = document.getElementById("groceryListContainer");
    this.emptyState = document.getElementById("emptyState");
    this.totalCartPrice = document.getElementById("totalCartPrice");
    this.totalDiscountSaved = document.getElementById("totalDiscountSaved");
    this.totalItemsCount = document.getElementById("totalItemsCount");
    this.searchCart = document.getElementById("searchCart");
    this.filterCategory = document.getElementById("filterCategory");
    this.btnPrintReceipt = document.getElementById("btnPrintReceipt");
    this.btnClearAll = document.getElementById("btnClearAll");
    this.quickCatalogGrid = document.getElementById("quickCatalogGrid");

    // Receipt Modal Elements
    this.receiptModal = document.getElementById("receiptModal");
    this.btnCloseReceipt = document.getElementById("btnCloseReceipt");
    this.btnDoPrint = document.getElementById("btnDoPrint");
    this.receiptUser = document.getElementById("receiptUser");
    this.receiptDate = document.getElementById("receiptDate");
    this.receiptItemsTable = document.getElementById("receiptItemsTable");
    this.rBudget = document.getElementById("rBudget");
    this.rGross = document.getElementById("rGross");
    this.rDiscount = document.getElementById("rDiscount");
    this.rNet = document.getElementById("rNet");
    this.rRemaining = document.getElementById("rRemaining");
  }

  // ==================== EVENT LISTENERS ====================
  initEventListeners() {
    // Auth events
    this.btnSubmitLogin.addEventListener("click", () => this.handleUsernameLogin());
    this.inputUsername.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleUsernameLogin();
    });
    this.btnGoogleLogin.addEventListener("click", () => this.openGoogleModal());
    this.btnCloseGoogleModal.addEventListener("click", () => this.closeGoogleModal());
    this.gAccDemo1.addEventListener("click", () => this.handleGoogleLogin("Budi Santoso", "budi.santoso@gmail.com", "👨"));
    this.gAccDemo2.addEventListener("click", () => this.handleGoogleLogin("Siti Rahma", "siti.rahma99@gmail.com", "👩"));
    this.btnLogout.addEventListener("click", () => this.handleLogout());

    // Mobile Segmented Navigation Tabs
    if (this.tabBtnCart) this.tabBtnCart.addEventListener("click", () => this.switchMobileTab("cart"));
    if (this.tabBtnAdd) this.tabBtnAdd.addEventListener("click", () => this.switchMobileTab("add"));
    if (this.tabBtnCatalog) this.tabBtnCatalog.addEventListener("click", () => this.switchMobileTab("catalog"));

    // Mobile bottom bar quick actions
    if (this.btnMobileAdd) this.btnMobileAdd.addEventListener("click", () => this.switchMobileTab("add"));
    if (this.btnMobileReceipt) this.btnMobileReceipt.addEventListener("click", () => this.openReceiptModal());

    // Budget Cap input
    this.inputBudgetCap.addEventListener("input", () => {
      const val = parseFloat(this.inputBudgetCap.value) || 0;
      this.budgetCap = val;
      this.saveBudget();
      this.renderBudgetSafetyCap();
    });

    // Form Live Quantity & Price Calculation Listeners
    this.btnQtyMinus.addEventListener("click", () => {
      let current = parseFloat(this.inputQty.value) || 1;
      if (current > 1) {
        this.inputQty.value = current - 1;
      } else if (current > 0.1) {
        this.inputQty.value = Math.max(0.1, (current - 0.1).toFixed(1));
      }
      this.updateLiveFormCalculations();
    });

    this.btnQtyPlus.addEventListener("click", () => {
      let current = parseFloat(this.inputQty.value) || 0;
      this.inputQty.value = current + 1;
      this.updateLiveFormCalculations();
    });

    this.inputQty.addEventListener("input", () => this.updateLiveFormCalculations());
    this.inputPrice.addEventListener("input", () => this.updateLiveFormCalculations());
    this.inputLastMonthPrice.addEventListener("input", () => this.updateLiveFormCalculations());
    this.inputDiscountTiers.addEventListener("input", () => this.updateLiveFormCalculations());

    // Preset discount chips
    document.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        const tier = e.target.getAttribute("data-tier");
        if (tier === "0") {
          this.inputDiscountTiers.value = "";
        } else {
          this.inputDiscountTiers.value = tier;
        }
        this.updateLiveFormCalculations();
      });
    });

    // Form Submit (Save / Edit)
    this.groceryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSaveItem();
    });

    this.btnCancelEdit.addEventListener("click", () => {
      this.resetForm();
      this.switchMobileTab("cart");
    });

    // Cart Search & Filter
    this.searchCart.addEventListener("input", () => this.renderGroceryList());
    this.filterCategory.addEventListener("change", () => this.renderGroceryList());

    // Clear All
    this.btnClearAll.addEventListener("click", () => {
      if (this.items.length === 0) return;
      if (confirm("Apakah Anda yakin ingin mengosongkan seluruh daftar belanja?")) {
        this.items = [];
        this.saveItems();
        this.renderGroceryList();
        this.renderBudgetSafetyCap();
      }
    });

    // Receipt modal
    this.btnPrintReceipt.addEventListener("click", () => this.openReceiptModal());
    this.btnCloseReceipt.addEventListener("click", () => this.closeReceiptModal());
    this.btnDoPrint.addEventListener("click", () => window.print());
  }

  // ==================== MOBILE TAB SWITCHER ====================
  switchMobileTab(tabName) {
    this.currentMobileTab = tabName;
    document.body.classList.remove("tab-active-cart", "tab-active-add", "tab-active-catalog");
    document.body.classList.add(`tab-active-${tabName}`);

    if (this.tabBtnCart && this.tabBtnAdd && this.tabBtnCatalog) {
      this.tabBtnCart.classList.toggle("active", tabName === "cart");
      this.tabBtnAdd.classList.toggle("active", tabName === "add");
      this.tabBtnCatalog.classList.toggle("active", tabName === "catalog");
    }

    // Scroll smoothly to top of content
    window.scrollTo({ top: 120, behavior: "smooth" });
  }

  // ==================== AUTHENTICATION & SINGLE-USER LOCK ====================
  loadState() {
    // Default mobile tab
    this.switchMobileTab("cart");

    // 1. Check Locked Single-User
    const savedUserJson = localStorage.getItem(this.storageKeyUser);
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        this.currentUser = savedUser;
        this.showActiveUserSession(savedUser);
        this.authOverlay.classList.add("hidden");
      } catch (e) {
        this.showAuthModal(null);
      }
    } else {
      this.showAuthModal(null);
    }

    // 2. Load Budget
    const savedBudget = localStorage.getItem(this.storageKeyBudget);
    if (savedBudget) {
      this.budgetCap = parseFloat(savedBudget) || 500000;
      this.inputBudgetCap.value = this.budgetCap;
    }

    // 3. Load Items
    const savedItemsJson = localStorage.getItem(this.storageKeyItems);
    if (savedItemsJson) {
      try {
        this.items = JSON.parse(savedItemsJson);
      } catch (e) {
        this.items = [...INITIAL_ITEMS];
      }
    } else {
      this.items = [...INITIAL_ITEMS];
      this.saveItems();
    }

    // Render components
    this.renderQuickCatalog();
    this.renderGroceryList();
    this.renderBudgetSafetyCap();
    this.updateLiveFormCalculations();
  }

  showAuthModal(existingUser) {
    this.authOverlay.classList.remove("hidden");
    if (existingUser) {
      this.singleUserNotice.classList.add("locked");
      this.singleUserNoticeDesc.innerHTML = `Profil pengguna tunggal terdaftar: <strong>${existingUser.username}</strong> (${existingUser.authType}). Sistem menolak username lain untuk menjaga data anggaran tetap personal.`;
      this.inputUsername.value = existingUser.username;
    } else {
      this.singleUserNotice.classList.remove("locked");
      this.singleUserNoticeDesc.textContent = "Aplikasi diamankan untuk satu profil pengguna aktif per perangkat demi integritas anggaran pribadi.";
      this.inputUsername.value = "";
    }
  }

  handleUsernameLogin() {
    const username = this.inputUsername.value.trim();
    if (!username) {
      alert("Silakan masukkan username terlebih dahulu!");
      this.inputUsername.focus();
      return;
    }

    // Check single-user rule:
    const lockedUserJson = localStorage.getItem(this.storageKeyUser);
    if (lockedUserJson) {
      const lockedUser = JSON.parse(lockedUserJson);
      if (lockedUser.username.toLowerCase() !== username.toLowerCase()) {
        alert(
          `⛔ AKSES DITOLAK (Single-User Enforcement):\n\n` +
          `Aplikasi GroceryIn dikonfigurasi KHUSUS Pengguna Tunggal.\n` +
          `Saat ini perangkat ini telah terikat dengan profil pengguna: "${lockedUser.username}".\n\n` +
          `Multi-user login tidak diizinkan. Silakan login sebagai "${lockedUser.username}" atau lakukan reset akun terlebih dahulu.`
        );
        this.inputUsername.value = lockedUser.username;
        return;
      }
    }

    // Save and log in as single user
    const userObj = {
      username: username,
      authType: "Username",
      avatar: "👤",
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(this.storageKeyUser, JSON.stringify(userObj));
    this.currentUser = userObj;
    this.showActiveUserSession(userObj);
    this.authOverlay.classList.add("hidden");
  }

  handleGoogleLogin(name, email, avatar = "👤") {
    const lockedUserJson = localStorage.getItem(this.storageKeyUser);
    if (lockedUserJson) {
      const lockedUser = JSON.parse(lockedUserJson);
      if (lockedUser.email && lockedUser.email.toLowerCase() !== email.toLowerCase()) {
        alert(
          `⛔ AKSES DITOLAK (Single-User Enforcement):\n\n` +
          `Aplikasi GroceryIn telah terkunci untuk akun Google: "${lockedUser.email}".\n` +
          `Akun multi-user lain tidak diizinkan login bersamaan.`
        );
        this.closeGoogleModal();
        return;
      }
    }

    const userObj = {
      username: name,
      email: email,
      authType: "Google Sign-In",
      avatar: avatar,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(this.storageKeyUser, JSON.stringify(userObj));
    this.currentUser = userObj;
    this.closeGoogleModal();
    this.showActiveUserSession(userObj);
    this.authOverlay.classList.add("hidden");
  }

  showActiveUserSession(user) {
    this.displayName.textContent = user.username;
    this.userAvatar.textContent = user.avatar || "👤";
  }

  handleLogout() {
    const choice = confirm(
      "Apakah Anda ingin keluar dari sesi?\n\n" +
      "Catatan Pengguna Tunggal:\n" +
      "- Klik [OK] untuk keluar dari sesi GroceryIn."
    );
    if (choice) {
      this.currentUser = null;
      this.authOverlay.classList.remove("hidden");
      const locked = localStorage.getItem(this.storageKeyUser);
      if (locked) {
        this.showAuthModal(JSON.parse(locked));
      } else {
        this.showAuthModal(null);
      }
    }
  }

  openGoogleModal() {
    this.googleModal.classList.remove("hidden");
  }

  closeGoogleModal() {
    this.googleModal.classList.add("hidden");
  }

  // ==================== TIERED DISCOUNT MATHEMATICAL LOGIC ====================
  calculateTieredDiscount(grossPrice, tierInput) {
    if (!tierInput || grossPrice <= 0) {
      return {
        finalPrice: grossPrice,
        totalSaved: 0,
        effectivePercent: 0,
        tiers: [],
        steps: []
      };
    }

    let rawTiers = [];
    if (Array.isArray(tierInput)) {
      rawTiers = tierInput;
    } else {
      rawTiers = tierInput
        .replace(/%/g, "")
        .split(/[+,/ ]+/)
        .map(t => parseFloat(t.trim()))
        .filter(t => !isNaN(t) && t > 0);
    }

    if (rawTiers.length === 0) {
      return {
        finalPrice: grossPrice,
        totalSaved: 0,
        effectivePercent: 0,
        tiers: [],
        steps: []
      };
    }

    let currentPrice = grossPrice;
    const steps = [];

    rawTiers.forEach((discPct, idx) => {
      const clampedDisc = Math.min(100, Math.max(0, discPct));
      const potongan = (currentPrice * clampedDisc) / 100;
      const priceAfter = currentPrice - potongan;

      steps.push({
        stepNumber: idx + 1,
        percent: clampedDisc,
        baseForStep: currentPrice,
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
      tiers: rawTiers,
      steps: steps
    };
  }

  // ==================== PRICE FLUCTUATION DETECTION ====================
  detectPriceFluctuation(currentPrice, lastMonthPrice) {
    if (!lastMonthPrice || lastMonthPrice <= 0 || !currentPrice || currentPrice <= 0) {
      return {
        status: "EQUAL",
        arrow: "=",
        diffNominal: 0,
        diffPercent: 0,
        cssClass: "fluc-equal",
        label: "= Stabil (Tidak ada data)"
      };
    }

    const diff = currentPrice - lastMonthPrice;
    const diffPercent = parseFloat(((diff / lastMonthPrice) * 100).toFixed(1));

    if (diff > 0) {
      return {
        status: "UP",
        arrow: "↑",
        diffNominal: diff,
        diffPercent: Math.abs(diffPercent),
        cssClass: "fluc-up",
        label: `↑ Naik ${this.formatRupiah(diff)} (+${Math.abs(diffPercent)}%)`
      };
    } else if (diff < 0) {
      return {
        status: "DOWN",
        arrow: "↓",
        diffNominal: Math.abs(diff),
        diffPercent: Math.abs(diffPercent),
        cssClass: "fluc-down",
        label: `↓ Turun ${this.formatRupiah(Math.abs(diff))} (-${Math.abs(diffPercent)}%)`
      };
    } else {
      return {
        status: "EQUAL",
        arrow: "=",
        diffNominal: 0,
        diffPercent: 0,
        cssClass: "fluc-equal",
        label: `= Setara bulan lalu`
      };
    }
  }

  // ==================== REALTIME LIVE FORM CALCULATIONS ====================
  updateLiveFormCalculations() {
    const qty = parseFloat(this.inputQty.value) || 0;
    const price = parseFloat(this.inputPrice.value) || 0;
    const lastMonthPrice = parseFloat(this.inputLastMonthPrice.value) || 0;
    const discountRaw = this.inputDiscountTiers.value.trim();

    // 1. Calculate Gross & Tiered Discounts
    const grossItemTotal = qty * price;
    const discountResult = this.calculateTieredDiscount(grossItemTotal, discountRaw);

    // 2. Update Live Subtotal Display
    this.calcSubtotalNote.textContent = `${qty} x ${this.formatRupiah(price)}`;
    if (discountResult.totalSaved > 0) {
      this.calcOriginalStrike.textContent = this.formatRupiah(grossItemTotal);
      this.calcFinalItemTotal.textContent = this.formatRupiah(discountResult.finalPrice);
    } else {
      this.calcOriginalStrike.textContent = "";
      this.calcFinalItemTotal.textContent = this.formatRupiah(grossItemTotal);
    }

    // 3. Update Discount Mathematical Breakdown
    if (discountResult.steps.length > 0 && grossItemTotal > 0) {
      let breakdownHtml = `<div class="math-step"><strong>Harga Awal:</strong> ${this.formatRupiah(grossItemTotal)}</div>`;
      discountResult.steps.forEach(s => {
        breakdownHtml += `
          <div class="math-step">
            👉 Diskon ke-${s.stepNumber} (${s.percent}%): Potongan ${this.formatRupiah(s.deduction)} &rarr; Sisa ${this.formatRupiah(s.priceAfter)}
          </div>
        `;
      });
      breakdownHtml += `
        <div class="math-step" style="margin-top: 4px; color: #15803d; font-weight: 700;">
          🎉 Total Hemat: ${this.formatRupiah(discountResult.totalSaved)} (Efektif ${discountResult.effectivePercent}%, BUKAN flat ${discountResult.tiers.reduce((a,b)=>a+b, 0)}%)
        </div>
      `;
      this.discountMathContent.innerHTML = breakdownHtml;
    } else {
      this.discountMathContent.textContent = "Tidak ada promo aktif. Total dihitung normal (Kuantitas x Harga Satuan).";
    }

    // 4. Update Realtime Price Fluctuation Preview Box
    const fluc = this.detectPriceFluctuation(price, lastMonthPrice);
    this.flucPreviewCard.className = `fluctuation-preview-card state-${fluc.status.toLowerCase()}`;

    if (fluc.status === "UP") {
      this.flucIconBox.textContent = "🔺";
      this.flucTitle.innerHTML = `<span style="color: #b91c1c;">Harga Naik Dibanding Bulan Lalu!</span>`;
      this.flucSub.textContent = `Bulan lalu: ${this.formatRupiah(lastMonthPrice)} | Saat ini: ${this.formatRupiah(price)} (+${this.formatRupiah(fluc.diffNominal)})`;
      this.flucBadge.className = "fluc-badge badge-up";
      this.flucBadge.textContent = fluc.label;
    } else if (fluc.status === "DOWN") {
      this.flucIconBox.textContent = "🔻";
      this.flucTitle.innerHTML = `<span style="color: #047857;">Harga Turun Lebih Murah!</span>`;
      this.flucSub.textContent = `Bulan lalu: ${this.formatRupiah(lastMonthPrice)} | Saat ini: ${this.formatRupiah(price)} (Hemat ${this.formatRupiah(fluc.diffNominal)})`;
      this.flucBadge.className = "fluc-badge badge-down";
      this.flucBadge.textContent = fluc.label;
    } else {
      this.flucIconBox.textContent = "⚖️";
      this.flucTitle.textContent = "Harga Stabil / Tidak Ada Fluktuasi";
      if (lastMonthPrice > 0) {
        this.flucSub.textContent = `Harga tepat sama dengan bulan lalu: ${this.formatRupiah(lastMonthPrice)}.`;
      } else {
        this.flucSub.textContent = "Masukkan harga bulan lalu untuk melihat analisa perbandingan otomatis.";
      }
      this.flucBadge.className = "fluc-badge badge-equal";
      this.flucBadge.textContent = fluc.label;
    }
  }

  // ==================== BUDGET SAFETY CAP CONTROLLER ====================
  renderBudgetSafetyCap() {
    let totalCartNet = 0;
    let totalGross = 0;

    this.items.forEach(item => {
      const gross = item.quantity * item.price;
      const discount = this.calculateTieredDiscount(gross, item.discountTiers);
      totalGross += gross;
      totalCartNet += discount.finalPrice;
    });

    const totalSaved = totalGross - totalCartNet;
    const remaining = this.budgetCap - totalCartNet;
    const spentPercent = this.budgetCap > 0 ? (totalCartNet / this.budgetCap) * 100 : 0;
    const clampedWidth = Math.min(100, Math.max(0, spentPercent));

    // Update displays
    this.budgetSpentText.textContent = this.formatRupiah(totalCartNet);
    this.budgetPercentText.textContent = `${spentPercent.toFixed(1)}%`;
    this.budgetRemainingText.textContent = this.formatRupiah(remaining);
    this.budgetProgressBar.style.width = `${clampedWidth}%`;

    // Overview stats
    this.totalCartPrice.textContent = this.formatRupiah(totalCartNet);
    this.totalDiscountSaved.textContent = this.formatRupiah(totalSaved);
    this.totalItemsCount.textContent = `${this.items.length} Item`;

    // Mobile specific indicators
    if (this.tabCartCount) this.tabCartCount.textContent = this.items.length;
    if (this.mobileBottomPrice) this.mobileBottomPrice.textContent = this.formatRupiah(totalCartNet);

    // Remove existing state classes
    this.budgetCard.classList.remove("status-safe", "status-warning", "status-danger");
    this.budgetProgressBar.classList.remove("safe", "warning", "danger");
    this.budgetAlertBanner.classList.remove("safe", "warning", "danger");

    // DYNAMIC DANGER CAP LOGIC
    if (spentPercent > 100) {
      this.budgetCard.classList.add("status-danger");
      this.budgetProgressBar.classList.add("danger");
      this.budgetAlertBanner.classList.add("danger");
      this.alertIcon.textContent = "🚨";
      this.alertMessage.innerHTML = `<strong>BAHAYA: Anggaran Terlampaui!</strong> Total belanjaan melebihi batas uang dompet sebesar <strong>${this.formatRupiah(Math.abs(remaining))}</strong> (${spentPercent.toFixed(1)}%). Segera kurangi item sebelum menuju kasir!`;
      this.budgetStatusBadge.className = "badge-percent";
      this.budgetStatusBadge.style.background = "#fee2e2";
      this.budgetStatusBadge.style.color = "#dc2626";
      this.budgetStatusBadge.textContent = "⚠️ Over Budget!";
    } else if (spentPercent >= 85) {
      this.budgetCard.classList.add("status-danger");
      this.budgetProgressBar.classList.add("danger");
      this.budgetAlertBanner.classList.add("danger");
      this.alertIcon.textContent = "⚠️";
      this.alertMessage.innerHTML = `<strong>PERINGATAN KRITIS:</strong> Saldo saku hampir habis! Anda telah memakai <strong>${spentPercent.toFixed(1)}%</strong> dari limit dompet. Sisa uang tunai tinggal ${this.formatRupiah(remaining)}.`;
      this.budgetStatusBadge.className = "badge-percent";
      this.budgetStatusBadge.style.background = "#fffbeb";
      this.budgetStatusBadge.style.color = "#b45309";
      this.budgetStatusBadge.textContent = "Hampir Penuh";
    } else if (spentPercent >= 65) {
      this.budgetCard.classList.add("status-warning");
      this.budgetProgressBar.classList.add("warning");
      this.budgetAlertBanner.classList.add("warning");
      this.alertIcon.textContent = "⚡";
      this.alertMessage.textContent = `Peringatan: Belanjaan telah mencapai ${spentPercent.toFixed(1)}% batas dompet. Pantau item tambahan berikutnya.`;
      this.budgetStatusBadge.className = "badge-status-safe";
      this.budgetStatusBadge.textContent = "Waspada";
    } else {
      this.budgetCard.classList.add("status-safe");
      this.budgetProgressBar.classList.add("safe");
      this.budgetAlertBanner.classList.add("safe");
      this.alertIcon.textContent = "✅";
      this.alertMessage.textContent = "Pengeluaran belanja Anda dalam batas aman dan terkendali.";
      this.budgetStatusBadge.className = "badge-status-safe";
      this.budgetStatusBadge.textContent = "Aman";
    }
  }

  // ==================== ITEM CRUD OPERATIONS ====================
  handleSaveItem() {
    const name = this.inputItemName.value.trim();
    const category = this.inputCategory.value;
    const unit = this.inputUnit.value;
    const qty = parseFloat(this.inputQty.value) || 1;
    const price = parseFloat(this.inputPrice.value) || 0;
    const lastMonthPrice = parseFloat(this.inputLastMonthPrice.value) || 0;
    const discountTiers = this.inputDiscountTiers.value.trim();
    const notes = this.inputNotes.value.trim();

    if (!name) {
      alert("Nama barang belanjaan wajib diisi!");
      this.inputItemName.focus();
      return;
    }

    if (price <= 0) {
      alert("Harga satuan saat ini harus lebih besar dari Rp 0!");
      this.inputPrice.focus();
      return;
    }

    if (this.editingId) {
      const index = this.items.findIndex(it => it.id === this.editingId);
      if (index !== -1) {
        this.items[index] = {
          ...this.items[index],
          name,
          category,
          unit,
          quantity: qty,
          price,
          lastMonthPrice,
          discountTiers,
          notes
        };
      }
      this.editingId = null;
    } else {
      const newItem = {
        id: "item-" + Date.now(),
        name,
        category,
        unit,
        quantity: qty,
        price,
        lastMonthPrice,
        discountTiers,
        notes,
        isBought: false
      };
      this.items.unshift(newItem);
    }

    this.saveItems();
    this.resetForm();
    this.renderGroceryList();
    this.renderBudgetSafetyCap();

    // Auto-switch to cart tab on mobile for seamless flow
    if (window.innerWidth <= 840) {
      this.switchMobileTab("cart");
    }
  }

  editItem(id) {
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    this.editingId = item.id;
    this.formTitle.textContent = "✏️ Edit: " + item.name;
    this.btnSaveText.textContent = "💾 Simpan Perubahan";
    this.btnCancelEdit.classList.remove("hidden");

    this.inputItemName.value = item.name;
    this.inputCategory.value = item.category;
    this.inputUnit.value = item.unit;
    this.inputQty.value = item.quantity;
    this.inputPrice.value = item.price;
    this.inputLastMonthPrice.value = item.lastMonthPrice || "";
    this.inputDiscountTiers.value = item.discountTiers || "";
    this.inputNotes.value = item.notes || "";

    this.updateLiveFormCalculations();

    // Switch to Add/Edit tab on mobile
    if (window.innerWidth <= 840) {
      this.switchMobileTab("add");
    }
    this.inputItemName.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  deleteItem(id) {
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    if (confirm(`Hapus "${item.name}" dari daftar belanja?`)) {
      this.items = this.items.filter(it => it.id !== id);
      if (this.editingId === id) this.resetForm();
      this.saveItems();
      this.renderGroceryList();
      this.renderBudgetSafetyCap();
    }
  }

  toggleBought(id) {
    const item = this.items.find(it => it.id === id);
    if (!item) return;
    item.isBought = !item.isBought;
    this.saveItems();
    this.renderGroceryList();
  }

  resetForm() {
    this.editingId = null;
    this.formTitle.textContent = "📝 Catat / Tambah Belanjaan";
    this.btnSaveText.textContent = "➕ Masukkan ke Keranjang";
    this.btnCancelEdit.classList.add("hidden");
    this.groceryForm.reset();
    this.inputQty.value = 1;
    this.inputDiscountTiers.value = "";
    this.updateLiveFormCalculations();
  }

  // ==================== RENDERING LIST & CATALOG ====================
  renderGroceryList() {
    const query = this.searchCart.value.trim().toLowerCase();
    const cat = this.filterCategory.value;

    const filtered = this.items.filter(it => {
      const matchSearch = it.name.toLowerCase().includes(query) || (it.notes && it.notes.toLowerCase().includes(query));
      const matchCat = cat === "ALL" || it.category === cat;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      this.groceryListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Tidak ada barang yang cocok</h3>
          <p>Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.</p>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(it => {
      const gross = it.quantity * it.price;
      const discount = this.calculateTieredDiscount(gross, it.discountTiers);
      const fluc = this.detectPriceFluctuation(it.price, it.lastMonthPrice);

      let flucPillHtml = "";
      if (fluc.status === "UP") {
        flucPillHtml = `<span class="price-fluc-pill fluc-up" title="Harga naik dari bulan lalu ${this.formatRupiah(it.lastMonthPrice)}">↑ +${this.formatRupiah(fluc.diffNominal)} (+${fluc.diffPercent}%)</span>`;
      } else if (fluc.status === "DOWN") {
        flucPillHtml = `<span class="price-fluc-pill fluc-down" title="Harga turun dari bulan lalu ${this.formatRupiah(it.lastMonthPrice)}">↓ -${this.formatRupiah(fluc.diffNominal)} (-${fluc.diffPercent}%)</span>`;
      } else {
        flucPillHtml = `<span class="price-fluc-pill fluc-equal" title="Harga stabil setara bulan lalu">= Stabil</span>`;
      }

      let discountPillHtml = "";
      if (discount.totalSaved > 0) {
        discountPillHtml = `<span class="item-discount-pill" title="Diskon bertingkat hemat ${this.formatRupiah(discount.totalSaved)}">Promo ${it.discountTiers}% (-${this.formatRupiah(discount.totalSaved)})</span>`;
      }

      html += `
        <div class="grocery-item-card ${it.isBought ? 'is-bought' : ''}" data-id="${it.id}">
          <div class="item-left-col">
            <input type="checkbox" class="item-checkbox" ${it.isBought ? 'checked' : ''} onchange="app.toggleBought('${it.id}')" title="Tandai sudah dibeli">
            <div class="item-main-info">
              <div class="item-title-row">
                <span class="item-title">${this.escapeHtml(it.name)}</span>
                <span class="item-cat-badge">${it.category}</span>
                ${flucPillHtml}
                ${discountPillHtml}
              </div>
              <div class="item-details-row">
                <span>Kuantitas: <strong>${it.quantity} ${it.unit}</strong></span>
                <span>Harga: <strong>${this.formatRupiah(it.price)}</strong> / ${it.unit}</span>
                ${it.lastMonthPrice ? `<span>Bulan lalu: ${this.formatRupiah(it.lastMonthPrice)}</span>` : ''}
              </div>
              ${it.notes ? `<div class="item-notes">💬 ${this.escapeHtml(it.notes)}</div>` : ''}
            </div>
          </div>

          <div class="item-right-col">
            <div class="item-pricing-box">
              ${discount.totalSaved > 0 ? `<span class="item-original-price">${this.formatRupiah(gross)}</span>` : ''}
              <span class="item-total-price">${this.formatRupiah(discount.finalPrice)}</span>
            </div>
            <div class="item-actions">
              <button type="button" class="btn-icon" onclick="app.editItem('${it.id}')" title="Edit belanjaan">✏️</button>
              <button type="button" class="btn-icon btn-delete" onclick="app.deleteItem('${it.id}')" title="Hapus belanjaan">🗑️</button>
            </div>
          </div>
        </div>
      `;
    });

    this.groceryListContainer.innerHTML = html;
  }

  renderQuickCatalog() {
    let html = "";
    BENCHMARK_CATALOG.forEach(item => {
      html += `
        <div class="quick-catalog-item" onclick="app.fillFromCatalog('${item.name}')">
          <span class="quick-icon">${item.icon}</span>
          <div class="quick-details">
            <span class="quick-name">${item.name}</span>
            <span class="quick-price">${this.formatRupiah(item.currentPrice)} / ${item.unit}</span>
            <span class="quick-benchmark">Bulan lalu: ${this.formatRupiah(item.lastMonthPrice)}</span>
          </div>
        </div>
      `;
    });
    this.quickCatalogGrid.innerHTML = html;
  }

  fillFromCatalog(itemName) {
    const found = BENCHMARK_CATALOG.find(i => i.name === itemName);
    if (!found) return;

    this.inputItemName.value = found.name;
    this.inputCategory.value = found.category;
    this.inputUnit.value = found.unit;
    this.inputQty.value = found.defaultQty;
    this.inputPrice.value = found.currentPrice;
    this.inputLastMonthPrice.value = found.lastMonthPrice;
    this.inputDiscountTiers.value = found.discount || "";
    this.inputNotes.value = `Acuan pasar bulan lalu ${this.formatRupiah(found.lastMonthPrice)}`;

    this.updateLiveFormCalculations();

    // Switch to Add tab on mobile
    if (window.innerWidth <= 840) {
      this.switchMobileTab("add");
    }
    this.inputItemName.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ==================== RECEIPT PRINT ENGINE ====================
  openReceiptModal() {
    let totalGross = 0;
    let totalNet = 0;
    let totalDiscount = 0;

    let itemsHtml = "";
    this.items.forEach(it => {
      const gross = it.quantity * it.price;
      const disc = this.calculateTieredDiscount(gross, it.discountTiers);
      totalGross += gross;
      totalNet += disc.finalPrice;
      totalDiscount += disc.totalSaved;

      itemsHtml += `
        <div class="r-item">
          <div>
            <strong>${this.escapeHtml(it.name)}</strong><br>
            <small>${it.quantity} ${it.unit} x ${this.formatRupiah(it.price)}${disc.totalSaved > 0 ? ` (Disc: -${this.formatRupiah(disc.totalSaved)})` : ''}</small>
          </div>
          <div><strong>${this.formatRupiah(disc.finalPrice)}</strong></div>
        </div>
      `;
    });

    this.receiptItemsTable.innerHTML = itemsHtml || "<p>Belum ada barang di keranjang.</p>";
    this.receiptUser.textContent = this.currentUser ? this.currentUser.username : "Pengguna Tunggal";
    const now = new Date();
    this.receiptDate.textContent = `${now.toLocaleDateString("id-ID")} ${now.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`;

    this.rBudget.textContent = this.formatRupiah(this.budgetCap);
    this.rGross.textContent = this.formatRupiah(totalGross);
    this.rDiscount.textContent = `-${this.formatRupiah(totalDiscount)}`;
    this.rNet.textContent = this.formatRupiah(totalNet);

    const remaining = this.budgetCap - totalNet;
    this.rRemaining.textContent = this.formatRupiah(remaining);
    if (remaining < 0) {
      this.rRemaining.style.color = "#dc2626";
      this.rRemaining.textContent = `${this.formatRupiah(remaining)} (OVER LIMIT)`;
    } else {
      this.rRemaining.style.color = "#166534";
    }

    this.receiptModal.classList.remove("hidden");
  }

  closeReceiptModal() {
    this.receiptModal.classList.add("hidden");
  }

  // ==================== UTILS & STORAGE ====================
  saveItems() {
    localStorage.setItem(this.storageKeyItems, JSON.stringify(this.items));
  }

  saveBudget() {
    localStorage.setItem(this.storageKeyBudget, this.budgetCap.toString());
  }

  formatRupiah(number) {
    if (isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(number);
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Global instance for inline button handlers
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new GroceryInApp();
});
