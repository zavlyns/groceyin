/**
 * GROCERYIN - SMART GROCERY & EXPENSE TRACKER
 * FIREBASE EDITION & PWA MOBILE-FIRST ENGINE
 *
 * Connected Features:
 * - PWA (Progressive Web App) Service Worker & Manifest
 * - Single-User Lock Authentication + Firebase Auth
 * - Cloud Firestore Realtime Sync + LocalStorage Offline Persistence
 * - Realtime Price Fluctuation Detection (Acuan Pasar Bulan Lalu)
 * - Cascading Tiered Compound Discounts (50+20, etc.)
 * - Budget Safety Cap with Danger Glow Pulse & Spending Breakdown
 * - Mobile Touch Ergonomics: Big Stepper Buttons, Large Inputs, Floating Bottom Nav
 */

// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyCyr3K9_IxxrD30TYkpLApD6AMxsYoxf1c",
  authDomain: "grocery1n.firebaseapp.com",
  projectId: "grocery1n",
  storageBucket: "grocery1n.firebasestorage.app",
  messagingSenderId: "135631831952",
  appId: "1:135631831952:web:e680edb0bb9fffebf72915"
};

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

// ==================== STATE MANAGEMENT & APP ENGINE ====================
class GroceryInApp {
  constructor() {
    this.storageKeyUser = "groceryin_single_user_lock";
    this.storageKeyItems = "groceryin_items_data";
    this.storageKeyBudget = "groceryin_budget_cap";

    this.currentUser = null;
    this.items = [];
    this.budgetCap = 500000;
    this.editingId = null;
    this.currentTab = "belanja"; // belanja, catat, anggaran, riwayat

    // Firebase instances
    this.firebaseApp = null;
    this.firebaseAuth = null;
    this.firestoreDb = null;
    this.isCloudSyncActive = false;
    this.firestoreUnsubscribe = null;

    this.initFirebase();
    this.initElements();
    this.initEventListeners();
    this.initPWA();
    this.loadState();
  }

  // ==================== PWA INITIALIZATION ====================
  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('🚀 GroceryIn PWA Service Worker Ready:', reg.scope))
          .catch((err) => console.warn('PWA registration warning:', err));
      });
    }
  }

  // ==================== INITIALIZE FIREBASE SDK ====================
  initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && firebase.initializeApp) {
        if (!firebase.apps || firebase.apps.length === 0) {
          this.firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
          this.firebaseApp = firebase.app();
        }
        this.firebaseAuth = firebase.auth();
        this.firestoreDb = firebase.firestore();
        this.isCloudSyncActive = true;
        console.log("🔥 Firebase initialized successfully for project grocery1n!");
      }
    } catch (err) {
      console.warn("Firebase initialization warning (using local fallback mode):", err);
      this.isCloudSyncActive = false;
    }
  }

  // ==================== ELEMENT SELECTORS ====================
  initElements() {
    // Cloud Status Badge
    this.cloudStatusBadge = document.getElementById("cloudStatusBadge");

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

    // Floating Bottom Navigation & Views
    this.floatingBottomNav = document.getElementById("floatingBottomNav");
    this.navTabBelanja = document.getElementById("navTabBelanja");
    this.navTabCatat = document.getElementById("navTabCatat");
    this.navTabAnggaran = document.getElementById("navTabAnggaran");
    this.navTabRiwayat = document.getElementById("navTabRiwayat");
    this.navCartCount = document.getElementById("navCartCount");
    this.navBudgetDot = document.getElementById("navBudgetDot");

    this.viewBelanja = document.getElementById("viewBelanja");
    this.viewCatat = document.getElementById("viewCatat");
    this.viewAnggaran = document.getElementById("viewAnggaran");
    this.viewRiwayat = document.getElementById("viewRiwayat");

    // Quick Action & Switcher Buttons
    this.btnThumbAdd = document.getElementById("btnThumbAdd");
    this.btnBackFromCatat = document.getElementById("btnBackFromCatat");
    this.btnBackToBelanja = document.getElementById("btnBackToBelanja");
    this.btnOpenReceiptFromHistory = document.getElementById("btnOpenReceiptFromHistory");

    // Mini Budget Strip (Belanja View)
    this.miniBudgetStrip = document.getElementById("miniBudgetStrip");
    this.miniBudgetSpent = document.getElementById("miniBudgetSpent");
    this.miniBudgetRemaining = document.getElementById("miniBudgetRemaining");
    this.miniBudgetBarFill = document.getElementById("miniBudgetBarFill");

    // Budget Cap Elements (Anggaran View)
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
    this.budgetCategoryBreakdown = document.getElementById("budgetCategoryBreakdown");

    // Item Form Elements (Catat View)
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
    this.btnGoogleLogin.addEventListener("click", () => this.handleGoogleLoginFirebase());
    this.btnCloseGoogleModal.addEventListener("click", () => this.closeGoogleModal());
    this.gAccDemo1.addEventListener("click", () => this.handleCustomGoogleSelect("Budi Santoso", "budi.santoso@gmail.com", "👨"));
    this.gAccDemo2.addEventListener("click", () => this.handleCustomGoogleSelect("Siti Rahma", "siti.rahma99@gmail.com", "👩"));
    this.btnLogout.addEventListener("click", () => this.handleLogout());

    // Floating Bottom Navigation Tabs
    if (this.navTabBelanja) this.navTabBelanja.addEventListener("click", () => this.switchTab("belanja"));
    if (this.navTabCatat) this.navTabCatat.addEventListener("click", () => this.switchTab("catat"));
    if (this.navTabAnggaran) this.navTabAnggaran.addEventListener("click", () => this.switchTab("anggaran"));
    if (this.navTabRiwayat) this.navTabRiwayat.addEventListener("click", () => this.switchTab("riwayat"));

    // Quick Action Buttons
    if (this.btnThumbAdd) this.btnThumbAdd.addEventListener("click", () => {
      this.resetForm();
      this.switchTab("catat");
    });
    if (this.btnBackFromCatat) this.btnBackFromCatat.addEventListener("click", () => this.switchTab("belanja"));
    if (this.btnBackToBelanja) this.btnBackToBelanja.addEventListener("click", () => this.switchTab("belanja"));
    if (this.miniBudgetStrip) this.miniBudgetStrip.addEventListener("click", () => this.switchTab("anggaran"));
    if (this.btnOpenReceiptFromHistory) this.btnOpenReceiptFromHistory.addEventListener("click", () => this.openReceiptModal());

    // Budget Cap input & quick presets
    this.inputBudgetCap.addEventListener("input", () => {
      const val = parseFloat(this.inputBudgetCap.value) || 0;
      this.budgetCap = val;
      this.saveBudget();
      this.renderBudgetSafetyCap();
    });

    document.querySelectorAll(".chip-budget").forEach(btn => {
      btn.addEventListener("click", () => {
        const add = btn.getAttribute("data-add");
        const set = btn.getAttribute("data-set");
        if (add) {
          this.budgetCap += parseFloat(add);
        } else if (set) {
          this.budgetCap = parseFloat(set);
        }
        this.inputBudgetCap.value = this.budgetCap;
        this.saveBudget();
        this.renderBudgetSafetyCap();
      });
    });

    // Form Live Quantity Stepper (+ / -) Listeners
    this.btnQtyMinus.addEventListener("click", () => {
      let current = parseFloat(this.inputQty.value) || 1;
      if (current > 1) {
        current = current - 1;
      } else if (current > 0.1) {
        current = Math.max(0.1, parseFloat((current - 0.1).toFixed(1)));
      }
      this.inputQty.value = current;
      this.updateLiveFormCalculations();
    });

    this.btnQtyPlus.addEventListener("click", () => {
      let current = parseFloat(this.inputQty.value) || 1;
      current = current + 1;
      this.inputQty.value = current;
      this.updateLiveFormCalculations();
    });

    this.inputQty.addEventListener("input", () => this.updateLiveFormCalculations());
    this.inputPrice.addEventListener("input", () => this.updateLiveFormCalculations());
    this.inputLastMonthPrice.addEventListener("input", () => this.updateLiveFormCalculations());
    this.inputDiscountTiers.addEventListener("input", () => this.updateLiveFormCalculations());

    // Preset discount chips
    document.querySelectorAll(".preset-chips .chip").forEach(chip => {
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

    // Save & Cancel Form
    this.btnSaveItem.addEventListener("click", () => this.handleSaveItem());
    this.groceryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSaveItem();
    });

    this.btnCancelEdit.addEventListener("click", () => {
      this.resetForm();
      this.switchTab("belanja");
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

    // Receipt Modal Print
    this.btnPrintReceipt.addEventListener("click", () => this.openReceiptModal());
    this.btnCloseReceipt.addEventListener("click", () => this.closeReceiptModal());
    this.btnDoPrint.addEventListener("click", () => window.print());
  }

  // ==================== TAB SWITCHER ENGINE ====================
  switchTab(tabName) {
    // Normalization aliases
    let activeTab = tabName;
    if (tabName === "cart") activeTab = "belanja";
    if (tabName === "add") activeTab = "catat";
    if (tabName === "catalog" || tabName === "history") activeTab = "riwayat";
    if (tabName === "budget") activeTab = "anggaran";

    this.currentTab = activeTab;

    // Toggle views
    const views = [
      { id: "viewBelanja", name: "belanja" },
      { id: "viewCatat", name: "catat" },
      { id: "viewAnggaran", name: "anggaran" },
      { id: "viewRiwayat", name: "riwayat" }
    ];

    views.forEach(v => {
      const el = document.getElementById(v.id);
      if (el) el.classList.toggle("active-view", v.name === activeTab);
    });

    // Toggle nav buttons
    const navs = [
      { id: "navTabBelanja", name: "belanja" },
      { id: "navTabCatat", name: "catat" },
      { id: "navTabAnggaran", name: "anggaran" },
      { id: "navTabRiwayat", name: "riwayat" }
    ];

    navs.forEach(n => {
      const btn = document.getElementById(n.id);
      if (btn) btn.classList.toggle("active", n.name === activeTab);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Alias for backward compatibility
  switchMobileTab(tabName) {
    this.switchTab(tabName);
  }

  // ==================== CLOUD SYNC & AUTHENTICATION ====================
  loadState() {
    this.switchTab("belanja");

    // 1. Check Locked Single-User
    const savedUserJson = localStorage.getItem(this.storageKeyUser);
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        this.currentUser = savedUser;
        this.showActiveUserSession(savedUser);
        this.authOverlay.classList.add("hidden");
      } catch (e) {
        this.showLoginModalForFirstUser();
      }
    } else {
      this.showLoginModalForFirstUser();
    }

    // 2. Load Local Budget Cap
    const savedBudget = localStorage.getItem(this.storageKeyBudget);
    if (savedBudget) {
      this.budgetCap = parseFloat(savedBudget) || 500000;
      this.inputBudgetCap.value = this.budgetCap;
    }

    // 3. Load Items (Local fallback)
    const savedItemsJson = localStorage.getItem(this.storageKeyItems);
    if (savedItemsJson) {
      try {
        this.items = JSON.parse(savedItemsJson);
      } catch (e) {
        this.items = [...INITIAL_ITEMS];
      }
    } else {
      this.items = [...INITIAL_ITEMS];
    }

    // 4. Initial Render
    this.renderGroceryList();
    this.renderBudgetSafetyCap();
    this.renderQuickCatalog();
    this.updateLiveFormCalculations();

    // 5. Connect Firestore Realtime Cloud Listener
    this.connectFirestoreRealtime();
  }

  showLoginModalForFirstUser() {
    this.authOverlay.classList.remove("hidden");
    this.authTitle.textContent = "Selamat Datang di GroceryIn";
    this.singleUserNoticeDesc.textContent = "Aplikasi diamankan secara eksklusif untuk satu profil pengguna aktif per perangkat.";
    this.singleUserNotice.style.background = "#eff6ff";
    this.singleUserNotice.style.borderColor = "#bfdbfe";
  }

  showActiveUserSession(user) {
    this.displayName.textContent = user.username || "Pengguna";
    this.userAvatar.textContent = user.avatar || "👤";
  }

  handleUsernameLogin() {
    const username = this.inputUsername.value.trim();
    if (!username) {
      alert("Silakan masukkan username terlebih dahulu!");
      this.inputUsername.focus();
      return;
    }

    const savedUserJson = localStorage.getItem(this.storageKeyUser);
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        if (savedUser.username.toLowerCase() !== username.toLowerCase()) {
          alert(`AKSES DITOLAK: Perangkat ini terikat eksklusif dengan profil "${savedUser.username}".`);
          return;
        }
      } catch (e) {}
    }

    const userData = {
      username: username,
      avatar: "👤",
      type: "username",
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKeyUser, JSON.stringify(userData));
    this.currentUser = userData;
    this.showActiveUserSession(userData);
    this.authOverlay.classList.add("hidden");
    this.inputUsername.value = "";
  }

  handleGoogleLoginFirebase() {
    this.googleModal.classList.remove("hidden");
  }

  closeGoogleModal() {
    this.googleModal.classList.add("hidden");
  }

  handleCustomGoogleSelect(name, email, avatar) {
    const savedUserJson = localStorage.getItem(this.storageKeyUser);
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        if (savedUser.email && savedUser.email !== email) {
          alert(`AKSES DITOLAK: Perangkat ini terikat pada akun Google "${savedUser.email}".`);
          this.closeGoogleModal();
          return;
        }
      } catch (e) {}
    }

    const userData = {
      username: name,
      email: email,
      avatar: avatar,
      type: "google_firebase",
      loginAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKeyUser, JSON.stringify(userData));
    this.currentUser = userData;
    this.showActiveUserSession(userData);
    this.closeGoogleModal();
    this.authOverlay.classList.add("hidden");
  }

  handleLogout() {
    if (confirm("Keluar dari sesi akun tunggal ini?")) {
      localStorage.removeItem(this.storageKeyUser);
      this.currentUser = null;
      this.displayName.textContent = "Pengguna";
      this.userAvatar.textContent = "👤";
      this.showLoginModalForFirstUser();
    }
  }

  connectFirestoreRealtime() {
    if (!this.firestoreDb) return;

    try {
      this.firestoreUnsubscribe = this.firestoreDb.collection("groceries_shared")
        .doc("current_cart")
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data.items && Array.isArray(data.items)) {
              this.items = data.items;
              localStorage.setItem(this.storageKeyItems, JSON.stringify(this.items));
            }
            if (data.budgetCap && typeof data.budgetCap === 'number') {
              this.budgetCap = data.budgetCap;
              this.inputBudgetCap.value = this.budgetCap;
              localStorage.setItem(this.storageKeyBudget, this.budgetCap.toString());
            }
            this.renderGroceryList();
            this.renderBudgetSafetyCap();
            this.isCloudSyncActive = true;
            this.updateCloudStatusIndicator();
          }
        }, err => {
          console.warn("Firestore realtime sync offline fallback:", err);
          this.isCloudSyncActive = false;
          this.updateCloudStatusIndicator();
        });
    } catch (e) {
      console.warn("Firestore snapshot error:", e);
      this.isCloudSyncActive = false;
      this.updateCloudStatusIndicator();
    }
  }

  updateCloudStatusIndicator() {
    if (!this.cloudStatusBadge) return;
    if (this.isCloudSyncActive) {
      this.cloudStatusBadge.style.display = "inline-flex";
      this.cloudStatusBadge.title = "Tersambung ke Cloud Firestore";
    } else {
      this.cloudStatusBadge.title = "Mode Offline (Data tersimpan di perangkat)";
    }
  }

  // ==================== CASCADING TIERED DISCOUNT LOGIC ====================
  calculateTieredDiscount(grossPrice, tierInput) {
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

  // ==================== PRICE FLUCTUATION DETECTION ====================
  detectPriceFluctuation(currentPrice, lastMonthPrice) {
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

  // ==================== FORM REALTIME CALCULATIONS ====================
  updateLiveFormCalculations() {
    const qty = parseFloat(this.inputQty.value) || 0;
    const price = parseFloat(this.inputPrice.value) || 0;
    const lastMonthPrice = parseFloat(this.inputLastMonthPrice.value) || 0;
    const discountTiers = this.inputDiscountTiers.value.trim();

    const gross = qty * price;
    const discountResult = this.calculateTieredDiscount(gross, discountTiers);

    // Live Subtotal Notes
    this.calcSubtotalNote.textContent = `${qty} x ${this.formatRupiah(price)}`;
    if (discountResult.totalSaved > 0) {
      this.calcOriginalStrike.textContent = this.formatRupiah(gross);
      this.calcFinalItemTotal.textContent = this.formatRupiah(discountResult.finalPrice);
    } else {
      this.calcOriginalStrike.textContent = "";
      this.calcFinalItemTotal.textContent = this.formatRupiah(gross);
    }

    // Fluctuation Preview
    const fluc = this.detectPriceFluctuation(price, lastMonthPrice);
    if (fluc.status === "UP") {
      this.flucIconBox.textContent = "🔺";
      this.flucTitle.textContent = `Harga Naik +${this.formatRupiah(fluc.diffNominal)} (+${fluc.diffPercent}%)`;
      this.flucSub.textContent = `Harga saat ini lebih mahal dibandingkan acuan bulan lalu (${this.formatRupiah(lastMonthPrice)}).`;
      this.flucBadge.textContent = "↑ Naik";
      this.flucBadge.style.background = "#fee2e2";
      this.flucBadge.style.color = "#dc2626";
    } else if (fluc.status === "DOWN") {
      this.flucIconBox.textContent = "🔻";
      this.flucTitle.textContent = `Harga Turun -${this.formatRupiah(fluc.diffNominal)} (-${fluc.diffPercent}%)`;
      this.flucSub.textContent = `Pilihan hemat! Lebih murah daripada acuan bulan lalu (${this.formatRupiah(lastMonthPrice)}).`;
      this.flucBadge.textContent = "↓ Turun / Hemat";
      this.flucBadge.style.background = "#dcfce7";
      this.flucBadge.style.color = "#16a34a";
    } else {
      this.flucIconBox.textContent = "⚖️";
      this.flucTitle.textContent = "Harga Stabil";
      this.flucSub.textContent = lastMonthPrice > 0 
        ? `Tepat setara dengan acuan bulan lalu (${this.formatRupiah(lastMonthPrice)}).`
        : "Masukkan harga bulan lalu untuk mendeteksi fluktuasi pasar.";
      this.flucBadge.textContent = "= Stabil";
      this.flucBadge.style.background = "#f1f5f9";
      this.flucBadge.style.color = "#475569";
    }

    // Cascading Discount Breakdown
    if (discountResult.steps.length > 0 && discountResult.totalSaved > 0) {
      let breakdownHtml = `<ul style="list-style: none; padding-left: 0; line-height: 1.6;">`;
      discountResult.steps.forEach(st => {
        breakdownHtml += `<li><strong>Tahap ${st.stepNumber}</strong>: Potongan ${st.percent}% (-${this.formatRupiah(st.deduction)}) &rarr; Jadi <strong>${this.formatRupiah(st.priceAfter)}</strong></li>`;
      });
      breakdownHtml += `</ul><div style="margin-top: 6px; font-weight: 700; color: #166534;">🎉 Total Hemat: ${this.formatRupiah(discountResult.totalSaved)} (Diskon Efektif: ${discountResult.effectivePercent}%)</div>`;
      this.discountMathContent.innerHTML = breakdownHtml;
      this.discountMathBox.classList.remove("hidden");
    } else {
      this.discountMathContent.textContent = "Tidak ada diskon aktif. Perhitungan harga normal tanpa potongan.";
    }
  }

  // ==================== BUDGET SAFETY CAP & DANGER PULSE ====================
  renderBudgetSafetyCap() {
    let totalGross = 0;
    let totalCartNet = 0;

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

    // Update displays in Anggaran View
    this.budgetSpentText.textContent = this.formatRupiah(totalCartNet);
    this.budgetPercentText.textContent = `${spentPercent.toFixed(1)}%`;
    this.budgetRemainingText.textContent = this.formatRupiah(remaining);
    this.budgetProgressBar.style.width = `${clampedWidth}%`;

    // Overview stats in Belanja View
    this.totalCartPrice.textContent = this.formatRupiah(totalCartNet);
    this.totalDiscountSaved.textContent = this.formatRupiah(totalSaved);
    this.totalItemsCount.textContent = `${this.items.length} Item`;

    // Mini budget overview strip (Belanja View)
    if (this.miniBudgetSpent) this.miniBudgetSpent.textContent = this.formatRupiah(totalCartNet);
    if (this.miniBudgetRemaining) this.miniBudgetRemaining.textContent = this.formatRupiah(remaining);
    if (this.miniBudgetBarFill) {
      this.miniBudgetBarFill.style.width = `${clampedWidth}%`;
      this.miniBudgetBarFill.className = "mini-progress-bar-fill " + (spentPercent >= 85 ? "danger" : spentPercent >= 65 ? "warning" : "safe");
    }

    // Floating nav indicators
    if (this.navCartCount) this.navCartCount.textContent = this.items.length;
    if (this.navBudgetDot) {
      this.navBudgetDot.className = "nav-status-dot " + (spentPercent >= 85 ? "danger" : spentPercent >= 65 ? "warning" : "safe");
    }

    // Status Styling
    this.budgetCard.classList.remove("status-safe", "status-warning", "status-danger");
    this.budgetProgressBar.classList.remove("safe", "warning", "danger");
    this.budgetAlertBanner.classList.remove("safe", "warning", "danger");

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

    this.renderCategoryBreakdown();
  }

  // ==================== CATEGORY SPENDING BREAKDOWN ====================
  renderCategoryBreakdown() {
    if (!this.budgetCategoryBreakdown) return;

    const catMap = {};
    this.items.forEach(it => {
      const gross = it.quantity * it.price;
      const discount = this.calculateTieredDiscount(gross, it.discountTiers);
      catMap[it.category] = (catMap[it.category] || 0) + discount.finalPrice;
    });

    const entries = Object.entries(catMap);
    if (entries.length === 0) {
      this.budgetCategoryBreakdown.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada barang belanjaan tercatat.</p>`;
      return;
    }

    let html = `<div class="category-breakdown-list">`;
    entries.sort((a, b) => b[1] - a[1]).forEach(([cat, sum]) => {
      html += `
        <div class="cat-breakdown-item">
          <span>${cat}</span>
          <strong>${this.formatRupiah(sum)}</strong>
        </div>
      `;
    });
    html += `</div>`;
    this.budgetCategoryBreakdown.innerHTML = html;
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
          notes,
          updatedAt: new Date().toISOString()
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
        isBought: false,
        createdAt: new Date().toISOString()
      };
      this.items.unshift(newItem);
    }

    this.saveItems();
    this.resetForm();
    this.renderGroceryList();
    this.renderBudgetSafetyCap();

    // Return to Belanja view smoothly
    this.switchTab("belanja");
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
    this.switchTab("catat");
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
    this.inputQty.value = "1";
    this.inputPrice.value = "";
    this.inputLastMonthPrice.value = "";
    this.inputDiscountTiers.value = "";
    this.updateLiveFormCalculations();
  }

  // ==================== RENDERING LISTS & CATALOG ====================
  renderGroceryList() {
    const search = (this.searchCart.value || "").toLowerCase().trim();
    const category = this.filterCategory.value;

    const filtered = this.items.filter(it => {
      const matchSearch = it.name.toLowerCase().includes(search) || (it.notes && it.notes.toLowerCase().includes(search));
      const matchCategory = category === "ALL" || it.category === category;
      return matchSearch && matchCategory;
    });

    if (filtered.length === 0) {
      if (this.items.length === 0) {
        this.groceryListContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🛒</div>
            <h3>Keranjang Belanja Masih Kosong</h3>
            <p>Mulai catat belanjaan Anda dengan menekan tombol di bawah ini.</p>
            <button type="button" class="btn-primary" onclick="app.switchTab('catat')">
              <span>➕ Mulai Catat Belanjaan</span>
            </button>
          </div>
        `;
      } else {
        this.groceryListContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>Tidak Ada Barang yang Cocok</h3>
            <p>Coba gunakan kata kunci pencarian lain atau pilih Semua Kategori.</p>
          </div>
        `;
      }
      return;
    }

    let html = "";
    filtered.forEach(it => {
      const gross = it.quantity * it.price;
      const discount = this.calculateTieredDiscount(gross, it.discountTiers);
      const fluc = this.detectPriceFluctuation(it.price, it.lastMonthPrice);

      let flucPillHtml = "";
      if (fluc.status === "UP") {
        flucPillHtml = `<span class="price-fluc-pill fluc-up" title="Harga naik dari acuan bulan lalu ${this.formatRupiah(it.lastMonthPrice)}">↑ +${this.formatRupiah(fluc.diffNominal)} (+${fluc.diffPercent}%)</span>`;
      } else if (fluc.status === "DOWN") {
        flucPillHtml = `<span class="price-fluc-pill fluc-down" title="Harga turun dari acuan bulan lalu ${this.formatRupiah(it.lastMonthPrice)}">↓ -${this.formatRupiah(fluc.diffNominal)} (-${fluc.diffPercent}%)</span>`;
      } else {
        flucPillHtml = `<span class="price-fluc-pill fluc-equal" title="Harga stabil setara acuan bulan lalu">= Stabil</span>`;
      }

      let discountPillHtml = "";
      if (discount.totalSaved > 0) {
        discountPillHtml = `<span class="item-discount-pill" title="Diskon bertingkat hemat ${this.formatRupiah(discount.totalSaved)}">Promo ${it.discountTiers}% (-${this.formatRupiah(discount.totalSaved)})</span>`;
      }

      html += `
        <div class="grocery-item-card ${it.isBought ? 'is-bought' : ''}" data-id="${it.id}">
          <div class="item-top-row">
            <label class="item-checkbox-wrap" title="Tandai sudah dibeli">
              <input type="checkbox" class="item-checkbox" ${it.isBought ? 'checked' : ''} onchange="app.toggleBought('${it.id}')">
            </label>
            <div class="item-main-details">
              <div class="item-name-row">
                <span class="item-title">${this.escapeHtml(it.name)}</span>
                <span class="item-cat-badge">${it.category}</span>
                ${flucPillHtml}
                ${discountPillHtml}
              </div>
              <div class="item-meta-row">
                <span>Kuantitas: <strong>${it.quantity} ${it.unit}</strong></span>
                <span>•</span>
                <span>Harga: <strong>${this.formatRupiah(it.price)}</strong>/${it.unit}</span>
                ${it.lastMonthPrice ? `<span>• Acuan: ${this.formatRupiah(it.lastMonthPrice)}</span>` : ''}
              </div>
              ${it.notes ? `<div class="item-notes">💬 ${this.escapeHtml(it.notes)}</div>` : ''}
            </div>
          </div>

          <div class="item-bottom-row">
            <div class="item-price-box">
              ${discount.totalSaved > 0 ? `<span class="item-original-price">${this.formatRupiah(gross)}</span>` : ''}
              <span class="item-total-price">${this.formatRupiah(discount.finalPrice)}</span>
            </div>
            <div class="item-actions">
              <button type="button" class="btn-icon btn-edit" onclick="app.editItem('${it.id}')" title="Edit Belanjaan" aria-label="Edit Belanjaan">✏️</button>
              <button type="button" class="btn-icon btn-delete" onclick="app.deleteItem('${it.id}')" title="Hapus Belanjaan" aria-label="Hapus Belanjaan">🗑️</button>
            </div>
          </div>
        </div>
      `;
    });

    this.groceryListContainer.innerHTML = html;
  }

  renderQuickCatalog() {
    if (!this.quickCatalogGrid) return;
    let html = "";
    BENCHMARK_CATALOG.forEach(item => {
      html += `
        <div class="quick-catalog-item" onclick="app.fillFromCatalog('${item.name}')">
          <span class="quick-icon">${item.icon}</span>
          <div class="quick-details">
            <span class="quick-name">${item.name}</span>
            <span class="quick-price">${this.formatRupiah(item.currentPrice)} / ${item.unit}</span>
            <span class="quick-benchmark">Acuan bulan lalu: ${this.formatRupiah(item.lastMonthPrice)}</span>
          </div>
        </div>
      `;
    });
    this.quickCatalogGrid.innerHTML = html;
  }

  fillFromCatalog(itemName) {
    const found = BENCHMARK_CATALOG.find(b => b.name === itemName);
    if (!found) return;

    this.editingId = null;
    this.formTitle.textContent = "📝 Catat: " + found.name;
    this.btnSaveText.textContent = "➕ Masukkan ke Keranjang";
    this.btnCancelEdit.classList.remove("hidden");

    this.inputItemName.value = found.name;
    this.inputCategory.value = found.category;
    this.inputUnit.value = found.unit;
    this.inputQty.value = found.defaultQty;
    this.inputPrice.value = found.currentPrice;
    this.inputLastMonthPrice.value = found.lastMonthPrice;
    this.inputDiscountTiers.value = found.discount || "";
    this.inputNotes.value = `Acuan pasar bulan lalu ${this.formatRupiah(found.lastMonthPrice)}`;

    this.updateLiveFormCalculations();
    this.switchTab("catat");
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

  // ==================== UTILS & CLOUD PERSISTENCE ====================
  saveItems() {
    localStorage.setItem(this.storageKeyItems, JSON.stringify(this.items));

    if (this.firestoreDb) {
      this.firestoreDb.collection("groceries_shared").doc("current_cart").set({
        items: this.items,
        budgetCap: this.budgetCap,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: this.currentUser ? this.currentUser.username : "Guest"
      }, { merge: true }).then(() => {
        this.isCloudSyncActive = true;
        this.updateCloudStatusIndicator();
      }).catch(err => {
        console.warn("Firestore save warning (stored locally):", err);
      });
    }
  }

  saveBudget() {
    localStorage.setItem(this.storageKeyBudget, this.budgetCap.toString());

    if (this.firestoreDb) {
      this.firestoreDb.collection("groceries_shared").doc("current_cart").set({
        budgetCap: this.budgetCap,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true }).catch(() => {});
    }
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
