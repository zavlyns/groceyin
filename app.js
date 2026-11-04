/**
 * GROCERYIN - SMART GROCERY & BUDGET SAFETY TRACKER
 * Native Mobile PWA Edition for Anak Rantau
 * 
 * Features:
 * - Dynamic Supermarket Filtering by City (Lotte Mart Grocery - Puri Indah, Indomaret, Alfamart, Alfamidi, Family Mart)
 * - Locked Initial Budget Enforcement (Safety Cap)
 * - Live Remaining Budget Updates across Store & List tabs
 * - Fading Color Transition (Green -> Yellow/Orange -> Full Red as budget exhausts)
 * - Add to list with automatic budget check & block when out of budget
 * - Interactive Quantity Stepper (-[]+) & X delete with budget refund
 * - Checkout locking list & archiving to History with printable receipt
 * - Realtime Product & Price Editor with Permanent Database Persistence (never reverted on updates)
 * - Fluctuation Emotes: ⬆ (Merah Naik), ⬇︎ (Hijau Turun), = (Abu-abu Setara)
 */

// ==================== 1. CITY & SUPERMARKET MAPPING ====================
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
  "Yogyakarta": [
    "Indomaret",
    "Alfamart",
    "Alfamidi"
  ],
  "Surabaya": [
    "Indomaret",
    "Alfamart",
    "Alfamidi",
    "Family Mart",
    "Lotte Mart Grocery"
  ],
  "Malang": [
    "Indomaret",
    "Alfamart",
    "Alfamidi"
  ],
  "Semarang": [
    "Indomaret",
    "Alfamart"
  ],
  "Medan": [
    "Indomaret",
    "Alfamart",
    "Alfamidi",
    "Lotte Mart Grocery"
  ],
  "Bali": [
    "Indomaret",
    "Alfamart",
    "Family Mart"
  ]
};

// ==================== 2. DEFAULT COMMODITY PRODUCTS ====================
// Default items tailored per user instructions:
// - Beras 5kg: Rp 74.000 (bulan lalu 68.000 -> ⬆ Merah)
// - Telur 1kg: Rp 28.000 (bulan lalu 32.000 -> ⬇︎ Hijau, tanpa diskon)
// - Garam 500g: Rp 5.000 (bulan lalu 5.000 -> = Abu-abu)
// - Beras 5kg: Rp 74.500
// - Minyak goreng 2L: Rp 42.000
// - Indomie Goreng 5 pcs: Rp 16.500
// - Indomie kuah 5 pcs: Rp 16.000
// - Tepung terigu 1kg: Rp 15.500
// - Gula pasir 1kg: Rp 19.500
// - Susu ultra milk 1L: Rp 22.500
// - Aqua 6 botol: Rp 24.000
// - Daging sapi 300g: Rp 55.000
// - Sabun cuci: Rp 20.000
// - Sabun mandi: Rp 29.500
const DEFAULT_COMMODITIES = [
  {
    id: "prod-beras-5kg-74",
    name: "Beras 5kg",
    category: "Sembako",
    price: 74000,
    lastMonthPrice: 68000, // ⬆ Merah (Naik dari 68rb jadi 74rb)
    discount: 0,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-telur-1kg",
    name: "Telur 1kg (Tanpa Diskon)",
    category: "Sembako",
    price: 28000,
    lastMonthPrice: 32000, // ⬇︎ Hijau (Turun dari 32rb jadi 28rb)
    discount: 0,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-garam-500g",
    name: "Garam 500g",
    category: "Dapur & Masak",
    price: 5000,
    lastMonthPrice: 5000, // = Abu-abu (Setara / Sama dengan bulan lalu)
    discount: 0,
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-beras-5kg-745",
    name: "Beras 5kg (Premium)",
    category: "Sembako",
    price: 74500,
    lastMonthPrice: 74500, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-minyak-2l",
    name: "Minyak Goreng 2L",
    category: "Sembako",
    price: 42000,
    lastMonthPrice: 42000, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-indomie-goreng-5",
    name: "Indomie Goreng 5 pcs",
    category: "Mie & Instan",
    price: 16500,
    lastMonthPrice: 15500, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-indomie-kuah-5",
    name: "Indomie Kuah 5 pcs",
    category: "Mie & Instan",
    price: 16000,
    lastMonthPrice: 15000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-terigu-1kg",
    name: "Tepung Terigu 1kg",
    category: "Dapur & Masak",
    price: 15500,
    lastMonthPrice: 15500, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-gula-1kg",
    name: "Gula Pasir 1kg",
    category: "Sembako",
    price: 19500,
    lastMonthPrice: 18000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-ultra-milk-1l",
    name: "Susu Ultra Milk 1L",
    category: "Minuman",
    price: 22500,
    lastMonthPrice: 22000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-aqua-6",
    name: "Aqua 6 Botol",
    category: "Minuman",
    price: 24000,
    lastMonthPrice: 24000, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-daging-300g",
    name: "Daging Sapi 300g",
    category: "Sembako",
    price: 55000,
    lastMonthPrice: 52000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-sabun-cuci",
    name: "Sabun Cuci",
    category: "Kebersihan",
    price: 20000,
    lastMonthPrice: 21000, // ⬇︎ Hijau
    discount: 0,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "prod-sabun-mandi",
    name: "Sabun Mandi",
    category: "Kebersihan",
    price: 29500,
    lastMonthPrice: 32000, // ⬇︎ Hijau
    discount: 0,
    image: "https://images.unsplash.com/photo-1607006314644-77a834b6b669?auto=format&fit=crop&w=400&q=80"
  }
];

// Helper to generate full catalog for any store
function buildDefaultCatalogForStore() {
  return JSON.parse(JSON.stringify(DEFAULT_COMMODITIES));
}

// Master Default Catalog Map
const INITIAL_MASTER_CATALOG = {
  "Lotte Mart Grocery - Puri Indah": buildDefaultCatalogForStore(),
  "Lotte Mart Grocery": buildDefaultCatalogForStore(),
  "Indomaret": buildDefaultCatalogForStore(),
  "Alfamart": buildDefaultCatalogForStore(),
  "Alfamidi": buildDefaultCatalogForStore(),
  "Family Mart": buildDefaultCatalogForStore()
};

// ==================== 3. GROCERYIN APP ENGINE ====================
class SmartGroceryApp {
  constructor() {
    // Storage keys
    this.STORAGE_SESSION = "groceryin_rantau_session";
    this.STORAGE_CART = "groceryin_rantau_cart";
    this.STORAGE_HISTORY = "groceryin_rantau_history";
    this.STORAGE_CUSTOM_CATALOG = "groceryin_catalog_db_v2";

    // State
    this.city = "Jakarta Barat (Puri Indah)";
    this.supermarket = "Lotte Mart Grocery - Puri Indah";
    this.initialBudget = 300000;
    this.isSessionLocked = false;

    this.catalog = {}; // Stores items per supermarket
    this.cart = []; // [{ id, name, price, discount, finalPrice, quantity, image, supermarket }]
    this.history = []; // [{ id, date, store, city, totalSpent, initialBudget, items: [] }]
    
    this.currentTab = "store"; // store, list, history
    this.currentCategory = "ALL";

    this.initDOM();
    this.initPWA();
    this.loadCatalogDatabase(); // Load & merge without ever reverting user changes
    this.initEvents();
    this.loadState();
  }

  // ==================== PWA SERVICE WORKER ====================
  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('📱 GroceryIn PWA SW Registered:', reg.scope))
          .catch(err => console.warn('PWA SW error:', err));
      });
    }
  }

  // ==================== DATABASE CATALOG LOADER (PRESERVES USER EDITS) ====================
  loadCatalogDatabase() {
    // 1. Start with fresh defaults
    this.catalog = JSON.parse(JSON.stringify(INITIAL_MASTER_CATALOG));

    // 2. Load saved modifications from localStorage
    const savedCatalogJson = localStorage.getItem(this.STORAGE_CUSTOM_CATALOG);
    if (savedCatalogJson) {
      try {
        const savedCatalog = JSON.parse(savedCatalogJson);
        // Merge intelligently: user edits override defaults, never lose customized prices/items!
        for (const storeName of Object.keys(savedCatalog)) {
          if (!this.catalog[storeName]) {
            this.catalog[storeName] = savedCatalog[storeName];
          } else {
            const savedItems = savedCatalog[storeName];
            savedItems.forEach(savedItem => {
              const defIdx = this.catalog[storeName].findIndex(it => it.id === savedItem.id);
              if (defIdx !== -1) {
                // Override with user's modified price, lastMonthPrice, discount, name, etc.
                this.catalog[storeName][defIdx] = {
                  ...this.catalog[storeName][defIdx],
                  ...savedItem
                };
              } else {
                // User added custom item
                this.catalog[storeName].push(savedItem);
              }
            });
          }
        }
      } catch (e) {
        console.warn("Error parsing saved catalog, using defaults with safe fallback:", e);
      }
    }

    // Save back to ensure consistency
    this.saveCatalogDatabase();
  }

  saveCatalogDatabase() {
    localStorage.setItem(this.STORAGE_CUSTOM_CATALOG, JSON.stringify(this.catalog));
  }

  // ==================== DOM ELEMENTS BINDING ====================
  initDOM() {
    // Header & Sub-bar
    this.displayStoreName = document.getElementById("displayStoreName");
    this.displayStoreCity = document.getElementById("displayStoreCity");
    this.headerRemainingBudget = document.getElementById("headerRemainingBudget");
    this.liveBudgetPill = document.getElementById("liveBudgetPill");
    this.btnLogout = document.getElementById("btnLogout");
    this.btnOpenAddProduct = document.getElementById("btnOpenAddProduct");

    // Top Tabs (Store, List, History di Kiri)
    this.topTabStore = document.getElementById("topTabStore");
    this.topTabList = document.getElementById("topTabList");
    this.topTabHistory = document.getElementById("topTabHistory");
    this.listBadgeCount = document.getElementById("listBadgeCount");

    // Views
    this.viewStore = document.getElementById("viewStore");
    this.viewList = document.getElementById("viewList");
    this.viewHistory = document.getElementById("viewHistory");

    // Store View Elements
    this.productTilesContainer = document.getElementById("productTilesContainer");
    this.categoryChipBar = document.getElementById("categoryChipBar");

    // List View Elements
    this.activeGroceryListContainer = document.getElementById("activeGroceryListContainer");
    this.emptyListCard = document.getElementById("emptyListCard");
    this.btnClearList = document.getElementById("btnClearList");
    this.btnGoToStore = document.getElementById("btnGoToStore");
    this.listBottomSummaryBar = document.getElementById("listBottomSummaryBar");
    this.listTotalPriceText = document.getElementById("listTotalPriceText");
    this.listBudgetStatusText = document.getElementById("listBudgetStatusText");
    this.btnCheckoutList = document.getElementById("btnCheckoutList");

    // History View Elements
    this.historyTilesContainer = document.getElementById("historyTilesContainer");
    this.emptyHistoryCard = document.getElementById("emptyHistoryCard");
    this.btnClearHistory = document.getElementById("btnClearHistory");

    // Floating Bottom Nav
    this.floatingBottomNav = document.getElementById("floatingBottomNav");
    this.bottomNavStore = document.getElementById("bottomNavStore");
    this.bottomNavList = document.getElementById("bottomNavList");
    this.bottomNavHistory = document.getElementById("bottomNavHistory");
    this.bottomNavListBadge = document.getElementById("bottomNavListBadge");

    // Setup Modal
    this.setupModalOverlay = document.getElementById("setupModalOverlay");
    this.selectCity = document.getElementById("selectCity");
    this.selectSupermarket = document.getElementById("selectSupermarket");
    this.inputInitialBudget = document.getElementById("inputInitialBudget");
    this.btnConfirmSetup = document.getElementById("btnConfirmSetup");
    this.btnConfirmText = document.getElementById("btnConfirmText");

    // Realtime Product Edit Modal Elements
    this.productEditModalBackdrop = document.getElementById("productEditModalBackdrop");
    this.modalProductTitle = document.getElementById("modalProductTitle");
    this.editProductId = document.getElementById("editProductId");
    this.editProductName = document.getElementById("editProductName");
    this.editProductPrice = document.getElementById("editProductPrice");
    this.editProductLastPrice = document.getElementById("editProductLastPrice");
    this.editProductDiscount = document.getElementById("editProductDiscount");
    this.editProductCategory = document.getElementById("editProductCategory");
    this.previewHarga2Text = document.getElementById("previewHarga2Text");
    this.previewFlucBadge = document.getElementById("previewFlucBadge");
    this.btnSaveProductChanges = document.getElementById("btnSaveProductChanges");
    this.btnCancelProductChanges = document.getElementById("btnCancelProductChanges");
    this.btnCloseProductModal = document.getElementById("btnCloseProductModal");

    // Receipt Modal
    this.receiptModalBackdrop = document.getElementById("receiptModalBackdrop");
    this.receiptStoreHeader = document.getElementById("receiptStoreHeader");
    this.receiptCityHeader = document.getElementById("receiptCityHeader");
    this.receiptTimestamp = document.getElementById("receiptTimestamp");
    this.receiptItemsListBody = document.getElementById("receiptItemsListBody");
    this.receiptInitialBudget = document.getElementById("receiptInitialBudget");
    this.receiptTotalDiscount = document.getElementById("receiptTotalDiscount");
    this.receiptFinalTotal = document.getElementById("receiptFinalTotal");
    this.receiptRemainingSafe = document.getElementById("receiptRemainingSafe");
    this.btnReceiptPrint = document.getElementById("btnReceiptPrint");
    this.btnReceiptClose = document.getElementById("btnReceiptClose");

    // Toast
    this.toastNotification = document.getElementById("toastNotification");
    this.toastIcon = document.getElementById("toastIcon");
    this.toastMessage = document.getElementById("toastMessage");
  }

  // ==================== EVENT LISTENERS ====================
  initEvents() {
    // 1. City selection dynamically filters supermarket options
    this.selectCity.addEventListener("change", () => {
      this.populateSupermarketsForCity(this.selectCity.value);
    });

    // 2. Preset Budget Chips in Setup Modal
    document.querySelectorAll(".preset-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const amt = chip.getAttribute("data-amount");
        this.inputInitialBudget.value = amt;
      });
    });

    this.inputInitialBudget.addEventListener("input", () => {
      const val = this.inputInitialBudget.value;
      document.querySelectorAll(".preset-chip").forEach(chip => {
        chip.classList.toggle("active", chip.getAttribute("data-amount") === val);
      });
    });

    // 3. Confirm Setup Button
    this.btnConfirmSetup.addEventListener("click", () => this.handleConfirmSetup());

    // 4. Logout / Ganti Toko & Budget
    this.btnLogout.addEventListener("click", () => this.handleLogout());

    // 5. Tab Navigation (Top Tabs & Floating Bottom Bar)
    this.topTabStore.addEventListener("click", () => this.switchTab("store"));
    this.topTabList.addEventListener("click", () => this.switchTab("list"));
    this.topTabHistory.addEventListener("click", () => this.switchTab("history"));

    this.bottomNavStore.addEventListener("click", () => this.switchTab("store"));
    this.bottomNavList.addEventListener("click", () => this.switchTab("list"));
    this.bottomNavHistory.addEventListener("click", () => this.switchTab("history"));

    if (this.btnGoToStore) {
      this.btnGoToStore.addEventListener("click", () => this.switchTab("store"));
    }

    // 6. Category Filter in Store
    this.categoryChipBar.querySelectorAll(".cat-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        this.categoryChipBar.querySelectorAll(".cat-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.currentCategory = chip.getAttribute("data-category");
        this.renderStoreProducts();
      });
    });

    // 7. Clear List & Checkout
    this.btnClearList.addEventListener("click", () => {
      if (this.cart.length === 0) return;
      if (confirm("Kosongkan troli belanja saat ini? Seluruh saldo akan dikembalikan ke budget.")) {
        this.cart = [];
        this.saveCart();
        this.updateBudgetAndCartUI();
        this.renderCartList();
        this.renderStoreProducts();
        this.showToast("🛒", "Troli belanja berhasil dikosongkan.");
      }
    });

    this.btnCheckoutList.addEventListener("click", () => this.handleCheckout());

    // 8. History Actions
    this.btnClearHistory.addEventListener("click", () => {
      if (this.history.length === 0) return;
      if (confirm("Hapus seluruh catatan riwayat belanja?")) {
        this.history = [];
        localStorage.removeItem(this.STORAGE_HISTORY);
        this.renderHistory();
        this.showToast("🗑️", "Riwayat belanja telah dibersihkan.");
      }
    });

    // 9. Receipt Modal actions
    this.btnReceiptPrint.addEventListener("click", () => window.print());
    this.btnReceiptClose.addEventListener("click", () => {
      this.receiptModalBackdrop.classList.add("hidden");
      this.switchTab("history");
    });

    // 10. Realtime Product Edit Modal Listeners
    this.btnOpenAddProduct.addEventListener("click", () => this.openAddProductModal());
    this.btnCloseProductModal.addEventListener("click", () => this.closeProductModal());
    this.btnCancelProductChanges.addEventListener("click", () => this.closeProductModal());

    this.editProductPrice.addEventListener("input", () => this.updateModalLivePreview());
    this.editProductLastPrice.addEventListener("input", () => this.updateModalLivePreview());
    this.editProductDiscount.addEventListener("input", () => this.updateModalLivePreview());

    document.getElementById("productEditForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveProductChanges();
    });
  }

  // ==================== STATE MANAGEMENT ====================
  loadState() {
    // 1. Check existing locked session
    const savedSession = localStorage.getItem(this.STORAGE_SESSION);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        this.city = session.city || "Jakarta Barat (Puri Indah)";
        this.supermarket = session.supermarket || "Lotte Mart Grocery - Puri Indah";
        this.initialBudget = parseFloat(session.initialBudget) || 300000;
        this.isSessionLocked = true;
        this.setupModalOverlay.classList.add("hidden");
      } catch (e) {
        this.openSetupModal();
      }
    } else {
      this.openSetupModal();
    }

    // 2. Load Cart
    const savedCart = localStorage.getItem(this.STORAGE_CART);
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }

    // 3. Load History
    const savedHistory = localStorage.getItem(this.STORAGE_HISTORY);
    if (savedHistory) {
      try {
        this.history = JSON.parse(savedHistory);
      } catch (e) {
        this.history = [];
      }
    }

    // 4. Update Header Displays
    this.updateHeaderStoreDisplay();

    // 5. Initial Render
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
    this.renderHistory();
    this.switchTab("store");
  }

  updateHeaderStoreDisplay() {
    this.displayStoreName.textContent = this.supermarket;
    this.displayStoreCity.textContent = `• ${this.city}`;
  }

  openSetupModal() {
    this.setupModalOverlay.classList.remove("hidden");
    this.populateSupermarketsForCity(this.selectCity.value);
  }

  populateSupermarketsForCity(city) {
    const list = CITY_SUPERMARKETS[city] || [
      "Lotte Mart Grocery - Puri Indah",
      "Indomaret",
      "Alfamart",
      "Alfamidi"
    ];
    this.selectSupermarket.innerHTML = "";
    list.forEach(sm => {
      const opt = document.createElement("option");
      opt.value = sm;
      opt.textContent = `🏬 ${sm}`;
      if (sm === "Lotte Mart Grocery - Puri Indah") {
        opt.selected = true;
      }
      this.selectSupermarket.appendChild(opt);
    });
  }

  handleConfirmSetup() {
    const city = this.selectCity.value;
    const supermarket = this.selectSupermarket.value;
    const budgetVal = parseFloat(this.inputInitialBudget.value);

    if (!budgetVal || budgetVal <= 0) {
      alert("Silakan masukkan nominal budget yang valid (minimal Rp 10.000)!");
      this.inputInitialBudget.focus();
      return;
    }

    // Feedback simulating fetching data from database
    this.btnConfirmText.textContent = `Mengunduh Data ${supermarket}...`;
    this.btnConfirmSetup.disabled = true;

    setTimeout(() => {
      this.city = city;
      this.supermarket = supermarket;
      this.initialBudget = budgetVal;
      this.isSessionLocked = true;

      // Ensure store has catalog
      if (!this.catalog[this.supermarket]) {
        this.catalog[this.supermarket] = buildDefaultCatalogForStore();
        this.saveCatalogDatabase();
      }

      // Persist session
      const session = {
        city: this.city,
        supermarket: this.supermarket,
        initialBudget: this.initialBudget,
        lockedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_SESSION, JSON.stringify(session));

      // Reset cart if store changed
      this.cart = [];
      this.saveCart();

      // UI updates
      this.updateHeaderStoreDisplay();

      this.btnConfirmText.textContent = "Confirm & Unduh Katalog";
      this.btnConfirmSetup.disabled = false;
      this.setupModalOverlay.classList.add("hidden");

      this.updateBudgetAndCartUI();
      this.renderStoreProducts();
      this.renderCartList();
      this.switchTab("store");

      this.showToast("✅", `Katalog ${this.supermarket} siap! Budget: ${this.formatRupiah(this.initialBudget)}`);
    }, 450);
  }

  handleLogout() {
    if (confirm("Keluar dari sesi belanja ini? Anda dapat memilih supermarket lain atau mengatur ulang batas budget.")) {
      localStorage.removeItem(this.STORAGE_SESSION);
      this.isSessionLocked = false;
      this.cart = [];
      this.saveCart();
      this.openSetupModal();
    }
  }

  // ==================== TAB SWITCHING ====================
  switchTab(tabName) {
    this.currentTab = tabName;

    // Toggle Tab Views
    const views = [
      { id: "viewStore", name: "store" },
      { id: "viewList", name: "list" },
      { id: "viewHistory", name: "history" }
    ];

    views.forEach(v => {
      const el = document.getElementById(v.id);
      if (el) el.classList.toggle("active-view", v.name === tabName);
    });

    // Toggle Top Nav Tab Buttons (di Kiri)
    const topButtons = [
      { el: this.topTabStore, name: "store" },
      { el: this.topTabList, name: "list" },
      { el: this.topTabHistory, name: "history" }
    ];
    topButtons.forEach(b => {
      if (b.el) b.el.classList.toggle("active", b.name === tabName);
    });

    // Toggle Floating Bottom Nav Buttons
    const bottomButtons = [
      { el: this.bottomNavStore, name: "store" },
      { el: this.bottomNavList, name: "list" },
      { el: this.bottomNavHistory, name: "history" }
    ];
    bottomButtons.forEach(b => {
      if (b.el) b.el.classList.toggle("active", b.name === tabName);
    });

    // On List view: show bottom summary bar with black border & checkout button!
    if (this.listBottomSummaryBar) {
      if (tabName === "list" && this.cart.length > 0) {
        this.listBottomSummaryBar.classList.remove("hidden");
        this.floatingBottomNav.style.display = "none";
      } else {
        this.listBottomSummaryBar.classList.add("hidden");
        this.floatingBottomNav.style.display = "flex";
      }
    }

    const mainArea = document.getElementById("mainContentArea");
    if (mainArea) mainArea.scrollTop = 0;
  }

  // ==================== CALCULATION & LIVE BUDGET ====================
  getTotalCartPrice() {
    return this.cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  }

  getTotalDiscountSaved() {
    return this.cart.reduce((sum, item) => {
      const discPerUnit = item.price - item.finalPrice;
      return sum + (discPerUnit * item.quantity);
    }, 0);
  }

  getRemainingBudget() {
    return this.initialBudget - this.getTotalCartPrice();
  }

  /**
   * Hitung transisi warna font dari Hijau -> Kuning/Oranye -> Merah Pekat
   * Sesuai ketentuan: semakin dekat total harga dengan budget, warna memudar transisi
   * sebelum menjadi full merah saat budget sudah habis!
   */
  getDynamicBudgetColor(totalSpent, budget) {
    if (budget <= 0) return "#DC2626";
    const ratio = Math.min(1.0, totalSpent / budget);

    let r, g, b;
    if (ratio <= 0.6) {
      // Interpolate from Green (22, 163, 74) to Amber (202, 138, 4)
      const t = ratio / 0.6;
      r = Math.round(22 + (202 - 22) * t);
      g = Math.round(163 + (138 - 163) * t);
      b = Math.round(74 + (4 - 74) * t);
    } else if (ratio <= 0.85) {
      // Interpolate from Amber (202, 138, 4) to Orange (234, 88, 12)
      const t = (ratio - 0.6) / 0.25;
      r = Math.round(202 + (234 - 202) * t);
      g = Math.round(138 + (88 - 138) * t);
      b = Math.round(4 + (12 - 4) * t);
    } else {
      // Interpolate from Orange (234, 88, 12) to Red (220, 38, 38)
      const t = (ratio - 0.85) / 0.15;
      r = Math.round(234 + (220 - 234) * t);
      g = Math.round(88 + (38 - 88) * t);
      b = Math.round(12 + (38 - 12) * t);
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  updateBudgetAndCartUI() {
    const totalSpent = this.getTotalCartPrice();
    const remaining = this.getRemainingBudget();
    const totalItems = this.cart.reduce((cnt, it) => cnt + it.quantity, 0);

    // 1. Live Remaining Budget in Top Header
    this.headerRemainingBudget.textContent = this.formatRupiah(remaining);
    if (remaining <= 0) {
      this.liveBudgetPill.style.background = "#FEE2E2";
      this.liveBudgetPill.style.borderColor = "#FCA5A5";
      this.headerRemainingBudget.style.color = "#DC2626";
    } else if (remaining < this.initialBudget * 0.2) {
      this.liveBudgetPill.style.background = "#FEF9C3";
      this.liveBudgetPill.style.borderColor = "#FDE047";
      this.headerRemainingBudget.style.color = "#B45309";
    } else {
      this.liveBudgetPill.style.background = "#FFFFFF";
      this.liveBudgetPill.style.borderColor = "#E8DFD4";
      this.headerRemainingBudget.style.color = "#8C6239";
    }

    // 2. Tab Badges
    this.listBadgeCount.textContent = totalItems;
    if (totalItems > 0) {
      this.bottomNavListBadge.classList.remove("hidden");
      this.bottomNavListBadge.textContent = totalItems;
    } else {
      this.bottomNavListBadge.classList.add("hidden");
    }

    // 3. List Bottom Summary Bar Styling & Fading Transition
    this.listTotalPriceText.textContent = this.formatRupiah(totalSpent);
    const dynamicColor = this.getDynamicBudgetColor(totalSpent, this.initialBudget);
    this.listTotalPriceText.style.color = dynamicColor;

    if (totalSpent >= this.initialBudget) {
      this.listBudgetStatusText.textContent = "🚨 Budget Habis! Hapus item untuk beli barang lain.";
      this.listBudgetStatusText.style.color = "#DC2626";
    } else if (totalSpent >= this.initialBudget * 0.8) {
      this.listBudgetStatusText.textContent = `⚠️ Mendekati limit saku (${Math.round((totalSpent / this.initialBudget) * 100)}% terpakai)`;
      this.listBudgetStatusText.style.color = "#B45309";
    } else {
      this.listBudgetStatusText.textContent = `✅ Aman (${Math.round((totalSpent / this.initialBudget) * 100)}% terpakai)`;
      this.listBudgetStatusText.style.color = "#16A34A";
    }

    // Checkout button enabled if cart has items
    this.btnCheckoutList.disabled = (this.cart.length === 0);

    // Refresh visibility of bottom summary bar if currently on list tab
    if (this.currentTab === "list") {
      if (this.cart.length > 0) {
        this.listBottomSummaryBar.classList.remove("hidden");
        this.floatingBottomNav.style.display = "none";
      } else {
        this.listBottomSummaryBar.classList.add("hidden");
        this.floatingBottomNav.style.display = "flex";
      }
    }
  }

  // ==================== TAB 1: RENDER STORE PRODUCTS ====================
  getCurrentStoreProducts() {
    if (!this.catalog[this.supermarket]) {
      this.catalog[this.supermarket] = buildDefaultCatalogForStore();
    }
    return this.catalog[this.supermarket];
  }

  renderStoreProducts() {
    const products = this.getCurrentStoreProducts();
    const filtered = products.filter(p => this.currentCategory === "ALL" || p.category === this.currentCategory);
    const remainingBudget = this.getRemainingBudget();

    let html = "";
    filtered.forEach(item => {
      // Rumus: Harga2 = Harga - (Diskon * Harga)
      const hasDiscount = item.discount > 0;
      const discountPercent = Math.round(item.discount * 100);
      const harga2 = hasDiscount ? Math.round(item.price * (1 - item.discount)) : item.price;

      // Emote Fluktuasi Harga vs Bulan Lalu:
      // a) ⬆ (Merah): jika harga produk meningkat dibanding bulan lalu
      // b) ⬇︎ (Hijau): jika harga produk menurun dibanding bulan lalu
      // c) = (Abu-abu): jika harga produk masih sama dengan bulan lalu
      let emoteSymbol = "=";
      let emoteClass = "emote-equal";
      const lastPrice = item.lastMonthPrice !== undefined ? item.lastMonthPrice : item.price;

      if (item.price > lastPrice) {
        emoteSymbol = "⬆";
        emoteClass = "emote-up";
      } else if (item.price < lastPrice) {
        emoteSymbol = "⬇︎";
        emoteClass = "emote-down";
      } else {
        emoteSymbol = "=";
        emoteClass = "emote-equal"; // Abu-abu
      }

      // Check if user has enough budget to add this item
      const canAfford = (remainingBudget >= harga2);

      html += `
        <div class="product-tile" data-id="${item.id}">
          <div class="product-image-wrap">
            <img src="${item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}" 
                 alt="${this.escapeHtml(item.name)}" class="product-tile-img" loading="lazy">
            
            ${hasDiscount ? `<span class="product-discount-pill">-${discountPercent}%</span>` : ''}

            <!-- Tombol Edit Cepat (✏️) pada kartu -->
            <button type="button" class="btn-tile-edit-quick" onclick="app.openEditProductModal('${item.id}')" title="Ubah harga atau detail barang ini">
              ✏️
            </button>
          </div>

          <div class="product-tile-name" title="${this.escapeHtml(item.name)}">
            ${this.escapeHtml(item.name)}
          </div>

          <!-- Format: Harga - Diskon - Harga2 - emote -->
          <div class="product-price-block">
            <div class="price-calculation-row">
              <span class="product-price-original ${hasDiscount ? 'has-discount' : ''}">
                ${this.formatRupiah(item.price)}
              </span>
              ${hasDiscount ? `<span class="product-price-final">${this.formatRupiah(harga2)}</span>` : ''}
              <span class="price-fluctuation-emote ${emoteClass}" title="Bulan lalu: ${this.formatRupiah(lastPrice)}">${emoteSymbol}</span>
            </div>
          </div>

          <button type="button" class="btn-add-to-list" 
                  onclick="app.addToCart('${item.id}')" 
                  ${!canAfford ? 'disabled title="Budget tidak mencukupi untuk membeli barang ini"' : ''}>
            <span>+ Add to list</span>
          </button>
        </div>
      `;
    });

    this.productTilesContainer.innerHTML = html;
  }

  // ==================== REALTIME PRODUCT EDIT & ADD SYSTEM ====================
  openEditProductModal(productId) {
    const products = this.getCurrentStoreProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    this.modalProductTitle.textContent = "✏️ Ubah Harga & Detail Produk";
    this.editProductId.value = product.id;
    this.editProductName.value = product.name;
    this.editProductPrice.value = product.price;
    this.editProductLastPrice.value = product.lastMonthPrice !== undefined ? product.lastMonthPrice : product.price;
    this.editProductDiscount.value = Math.round((product.discount || 0) * 100);
    this.editProductCategory.value = product.category || "Sembako";

    this.updateModalLivePreview();
    this.productEditModalBackdrop.classList.remove("hidden");
  }

  openAddProductModal() {
    this.modalProductTitle.textContent = "➕ Tambah Barang Baru ke Katalog";
    this.editProductId.value = "";
    this.editProductName.value = "";
    this.editProductPrice.value = "";
    this.editProductLastPrice.value = "";
    this.editProductDiscount.value = "0";
    this.editProductCategory.value = "Sembako";

    this.updateModalLivePreview();
    this.productEditModalBackdrop.classList.remove("hidden");
  }

  closeProductModal() {
    this.productEditModalBackdrop.classList.add("hidden");
  }

  updateModalLivePreview() {
    const price = parseFloat(this.editProductPrice.value) || 0;
    const lastPrice = parseFloat(this.editProductLastPrice.value) || price;
    const discountPct = parseFloat(this.editProductDiscount.value) || 0;

    const discountRate = Math.min(0.99, Math.max(0, discountPct / 100));
    const harga2 = Math.round(price * (1 - discountRate));

    this.previewHarga2Text.textContent = this.formatRupiah(harga2);

    if (price > lastPrice) {
      const diff = price - lastPrice;
      this.previewFlucBadge.className = "fluc-pill-preview fluc-up";
      this.previewFlucBadge.textContent = `⬆ Naik (+${this.formatRupiah(diff)})`;
    } else if (price < lastPrice) {
      const diff = lastPrice - price;
      this.previewFlucBadge.className = "fluc-pill-preview fluc-down";
      this.previewFlucBadge.textContent = `⬇︎ Turun (-${this.formatRupiah(diff)})`;
    } else {
      this.previewFlucBadge.className = "fluc-pill-preview fluc-equal";
      this.previewFlucBadge.textContent = `= Setara / Stabil (Abu-abu)`;
    }
  }

  saveProductChanges() {
    const id = this.editProductId.value.trim();
    const name = this.editProductName.value.trim();
    const price = parseFloat(this.editProductPrice.value);
    const lastPrice = parseFloat(this.editProductLastPrice.value) || price;
    const discountPct = parseFloat(this.editProductDiscount.value) || 0;
    const category = this.editProductCategory.value;

    if (!name) {
      alert("Nama barang wajib diisi!");
      this.editProductName.focus();
      return;
    }

    if (isNaN(price) || price < 0) {
      alert("Harga satuan saat ini harus valid!");
      this.editProductPrice.focus();
      return;
    }

    const discountRate = Math.min(0.99, Math.max(0, discountPct / 100));
    const products = this.getCurrentStoreProducts();

    if (id) {
      // Edit existing product
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index].name = name;
        products[index].price = price;
        products[index].lastMonthPrice = lastPrice;
        products[index].discount = discountRate;
        products[index].category = category;

        // If this item is currently in active cart, update its price & recalculate
        const cartItem = this.cart.find(it => it.id === id);
        if (cartItem) {
          cartItem.name = name;
          cartItem.price = price;
          cartItem.discount = discountRate;
          cartItem.finalPrice = Math.round(price * (1 - discountRate));
          this.saveCart();
        }
      }
    } else {
      // Add new custom product
      const newProd = {
        id: "custom-" + Date.now(),
        name: name,
        category: category,
        price: price,
        lastMonthPrice: lastPrice,
        discount: discountRate,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
      };
      products.unshift(newProd);
    }

    // Save to permanent Database (localStorage)
    this.saveCatalogDatabase();

    // Re-render UI in realtime
    this.closeProductModal();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();

    this.showToast("💾", `Perubahan "${name}" berhasil disimpan ke database!`);
  }

  // ==================== CART ACTIONS (Add, Stepper, Delete) ====================
  addToCart(productId) {
    const products = this.getCurrentStoreProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Rumus Harga2 = Harga - (Diskon * Harga)
    const hasDiscount = product.discount > 0;
    const finalPrice = hasDiscount ? Math.round(product.price * (1 - product.discount)) : product.price;

    const remainingBudget = this.getRemainingBudget();

    // Validasi Aturan Budget:
    // Bila budget habis maka tidak ada barang yang bisa ditambahkan ke list!
    if (remainingBudget < finalPrice) {
      this.showToast("⚠️", `Budget tidak cukup! Sisa budget ${this.formatRupiah(remainingBudget)}. Kurangi barang di List terlebih dahulu.`);
      return;
    }

    // Check if already in cart
    const existingIndex = this.cart.findIndex(it => it.id === product.id);
    if (existingIndex !== -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        finalPrice: finalPrice,
        quantity: 1,
        image: product.image,
        supermarket: this.supermarket
      });
    }

    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();

    this.showToast("🛒", `+1 "${product.name}" dimasukkan ke list.`);
  }

  updateItemQuantity(productId, newQty) {
    const index = this.cart.findIndex(it => it.id === productId);
    if (index === -1) return;

    const item = this.cart[index];
    const parsedQty = parseInt(newQty, 10);

    if (isNaN(parsedQty) || parsedQty <= 0) {
      // Hapus item
      this.removeItemFromCart(productId);
      return;
    }

    const currentQty = item.quantity;
    const diff = parsedQty - currentQty;

    if (diff > 0) {
      // Memerlukan tambahan biaya
      const costAddition = diff * item.finalPrice;
      const remainingBudget = this.getRemainingBudget();
      if (remainingBudget < costAddition) {
        this.showToast("⚠️", `Budget saku tidak cukup untuk menambah kuantitas!`);
        this.renderCartList();
        return;
      }
    }

    item.quantity = parsedQty;
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  incrementQuantity(productId) {
    const item = this.cart.find(it => it.id === productId);
    if (!item) return;

    const remainingBudget = this.getRemainingBudget();
    if (remainingBudget < item.finalPrice) {
      this.showToast("⚠️", `Budget saku tidak cukup untuk menambah "${item.name}"!`);
      return;
    }

    item.quantity += 1;
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  decrementQuantity(productId) {
    const index = this.cart.findIndex(it => it.id === productId);
    if (index === -1) return;

    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity -= 1;
    } else {
      // Jika dikurangi dari 1 -> hapus item
      this.cart.splice(index, 1);
    }

    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  removeItemFromCart(productId) {
    const item = this.cart.find(it => it.id === productId);
    if (!item) return;

    this.cart = this.cart.filter(it => it.id !== productId);
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();

    this.showToast("↩️", `"${item.name}" dihapus. Uang dikembalikan ke sisa budget.`);
  }

  saveCart() {
    localStorage.setItem(this.STORAGE_CART, JSON.stringify(this.cart));
  }

  // ==================== TAB 2: RENDER LIST VIEW ====================
  renderCartList() {
    if (this.cart.length === 0) {
      this.activeGroceryListContainer.innerHTML = "";
      this.emptyListCard.classList.remove("hidden");
      return;
    }

    this.emptyListCard.classList.add("hidden");

    let html = "";
    this.cart.forEach((item, index) => {
      const itemTotalPrice = item.finalPrice * item.quantity;

      /*
        Format barang di list sesuai instruksi:
        X --------------------
         |Gambar barang| Nama barang
         |             |
         |             | Hargatotal   quantity -[]+
          ---------------------
      */
      html += `
        <div class="list-item-card" data-id="${item.id}">
          
          <!-- Top bar with X delete button -->
          <div class="list-item-top-header">
            <span class="item-index-label">Item #${index + 1}</span>
            <button type="button" class="btn-remove-item" onclick="app.removeItemFromCart('${item.id}')" title="Hapus dari list">
              X
            </button>
          </div>

          <!-- Body: Gambar barang | Nama barang, Hargatotal, Stepper -[]+ -->
          <div class="list-item-body-row">
            <img src="${item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}" 
                 alt="${this.escapeHtml(item.name)}" class="list-item-thumb">
            
            <div class="list-item-details">
              <div class="list-item-name">${this.escapeHtml(item.name)}</div>
              <div class="list-item-unit-calc">
                ${this.formatRupiah(item.finalPrice)} x ${item.quantity}
              </div>

              <div class="list-item-action-bottom">
                <span class="list-item-total-price">${this.formatRupiah(itemTotalPrice)}</span>

                <!-- Stepper Kuantitas: quantity -[]+ -->
                <div class="quantity-stepper-box">
                  <button type="button" class="btn-stepper btn-minus" onclick="app.decrementQuantity('${item.id}')" aria-label="Kurangi kuantitas">−</button>
                  <input type="number" class="input-qty-box" min="1" max="99" 
                         value="${item.quantity}" 
                         onchange="app.updateItemQuantity('${item.id}', this.value)" 
                         aria-label="Kuantitas barang">
                  <button type="button" class="btn-stepper btn-plus" onclick="app.incrementQuantity('${item.id}')" aria-label="Tambah kuantitas">+</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
    });

    this.activeGroceryListContainer.innerHTML = html;
  }

  // ==================== CHECKOUT & HISTORY ARCHIVING ====================
  handleCheckout() {
    if (this.cart.length === 0) {
      alert("Troli belanja Anda masih kosong!");
      return;
    }

    const totalSpent = this.getTotalCartPrice();
    const remainingBudget = this.getRemainingBudget();
    const totalDiscountSaved = this.getTotalDiscountSaved();

    if (confirm(`Kunci list belanja dan selesaikan transaksi sebesar ${this.formatRupiah(totalSpent)}? Data akan otomatis diarsipkan ke History.`)) {
      const now = new Date();
      const transactionId = "trx-" + Date.now();

      const newHistoryEntry = {
        id: transactionId,
        date: now.toISOString(),
        store: this.supermarket,
        city: this.city,
        totalSpent: totalSpent,
        totalDiscountSaved: totalDiscountSaved,
        initialBudget: this.initialBudget,
        remainingBudget: remainingBudget,
        items: JSON.parse(JSON.stringify(this.cart))
      };

      // Simpan ke History (di paling atas)
      this.history.unshift(newHistoryEntry);
      localStorage.setItem(this.STORAGE_HISTORY, JSON.stringify(this.history));

      // Tampilkan Receipt Modal Printable
      this.showReceiptModal(newHistoryEntry);

      // Kosongkan Troli List Belanja (Sudah terkunci & selesai)
      this.cart = [];
      this.saveCart();

      // UI Update
      this.updateBudgetAndCartUI();
      this.renderCartList();
      this.renderHistory();
      this.renderStoreProducts();
    }
  }

  showReceiptModal(record) {
    this.receiptStoreHeader.textContent = record.store.toUpperCase();
    this.receiptCityHeader.textContent = `Cabang ${record.city}`;
    
    const d = new Date(record.date);
    this.receiptTimestamp.textContent = `${d.toLocaleDateString("id-ID")} ${d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`;

    let itemsHtml = "";
    record.items.forEach(it => {
      const gross = it.price * it.quantity;
      const net = it.finalPrice * it.quantity;
      const disc = gross - net;
      itemsHtml += `
        <div class="r-item-line">
          <div>
            <strong>${this.escapeHtml(it.name)}</strong><br>
            <small>${it.quantity}x @ ${this.formatRupiah(it.finalPrice)}${disc > 0 ? ` (Hemat: -${this.formatRupiah(disc)})` : ''}</small>
          </div>
          <div><strong>${this.formatRupiah(net)}</strong></div>
        </div>
      `;
    });

    this.receiptItemsListBody.innerHTML = itemsHtml;
    this.receiptInitialBudget.textContent = this.formatRupiah(record.initialBudget);
    this.receiptTotalDiscount.textContent = `-${this.formatRupiah(record.totalDiscountSaved || 0)}`;
    this.receiptFinalTotal.textContent = this.formatRupiah(record.totalSpent);
    this.receiptRemainingSafe.textContent = this.formatRupiah(record.remainingBudget);

    this.receiptModalBackdrop.classList.remove("hidden");
  }

  // ==================== TAB 3: RENDER HISTORY VIEW ====================
  renderHistory() {
    if (this.history.length === 0) {
      this.historyTilesContainer.innerHTML = "";
      this.emptyHistoryCard.classList.remove("hidden");
      return;
    }

    this.emptyHistoryCard.classList.add("hidden");

    let html = "";
    this.history.forEach(entry => {
      const d = new Date(entry.date);
      const dateTitle = this.formatRelativeDate(d);

      /*
        Format tiles history sesuai instruksi:
        Today/Yesterday/Tanggal - Harga
         --------------------
         |Gambar barang| Nama barang
         |             |
         |             | Hargatotal   [] quantity 
          ---------------------
      */
      let itemsHtml = "";
      entry.items.forEach(it => {
        const itemTotal = it.finalPrice * it.quantity;
        itemsHtml += `
          <div class="history-item-row">
            <img src="${it.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}" 
                 alt="${this.escapeHtml(it.name)}" class="history-item-thumb">
            <div class="history-item-details">
              <div class="history-item-name">${this.escapeHtml(it.name)}</div>
              <div class="history-item-bottom-info">
                <span class="history-item-price">${this.formatRupiah(itemTotal)}</span>
                <span class="history-qty-tag">[] ${it.quantity} pcs</span>
              </div>
            </div>
          </div>
        `;
      });

      html += `
        <div class="history-group-card">
          <div class="history-group-header">
            <div>
              <span class="history-group-date-title">${dateTitle} • ${entry.store}</span>
            </div>
            <strong class="history-group-total">${this.formatRupiah(entry.totalSpent)}</strong>
          </div>
          <div class="history-items-list">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    this.historyTilesContainer.innerHTML = html;
  }

  formatRelativeDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today (${date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })})`;
    } else if (diffDays === 1) {
      return `Yesterday (${date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })})`;
    } else {
      return date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  // ==================== UTILS ====================
  formatRupiah(num) {
    if (isNaN(num)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
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

  showToast(icon, message) {
    if (!this.toastNotification) return;
    this.toastIcon.textContent = icon;
    this.toastMessage.textContent = message;
    this.toastNotification.classList.remove("hidden");

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastNotification.classList.add("hidden");
    }, 2500);
  }
}

// Global Application Instance
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new SmartGroceryApp();
});
