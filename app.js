/**
 * GROCERYIN - SMART GROCERY & BUDGET SAFETY TRACKER
 * Native Mobile PWA Edition - Velvet Obsidian & Ruby Crimson Theme
 * 
 * Features:
 * - Dynamic Supermarket Filtering by City (Lotte Mart Grocery - Puri Indah, Indomaret, Alfamart, Alfamidi, Family Mart)
 * - Locked Initial Budget Enforcement (Safety Cap)
 * - Three-Tier Budget Status Indicators:
 *   * HIJAU: Masih aman (pengeluaran < 75%, sisa budget > 25%)
 *   * KUNING: Warning, artinya sudah mau habis (pengeluaran 75% - 99%, sisa budget <= 25%)
 *   * MERAH: Sudah habis dan kelewatan (pengeluaran >= 100%, over-budget)
 * - Modal Penentuan Satuan (kg, pcs, liter, pack, botol, gram, ml, ikat, custom)
 * - Modal Pemilihan Diskon Fleksibel (Preset %, Custom %, atau Nominal Rp) dengan kalkulasi harga otomatis
 * - Pilihan Metode Pembayaran Kasir (Cash, QRIS, BCA, Mandiri, BRI, Kartu Debit)
 * - Checkout Instan Langsung Tanpa Popup: tidak ada confirm() atau pop-up struk yang menutupi layar
 * - Interactive Quantity Stepper (-[]+) & X delete with budget refund
 * - Riwayat Transaksi Lengkap dengan Badge Metode Pembayaran
 * - Realtime Product & Price Editor with Permanent Database Persistence
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

// ==================== 2. DEFAULT COMMODITY PRODUCTS (14 ITEMS) ====================
const DEFAULT_COMMODITIES = [
  {
    id: "prod-beras-5kg-74",
    name: "Beras 5kg",
    category: "Sembako",
    defaultUnit: "kg",
    price: 74000,
    lastMonthPrice: 68000, // ⬆ Merah (Naik dari 68rb jadi 74rb)
    discount: 0,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-telur-1kg",
    name: "Telur 1kg (Tanpa Diskon)",
    category: "Sembako",
    defaultUnit: "kg",
    price: 28000,
    lastMonthPrice: 32000, // ⬇︎ Hijau (Turun dari 32rb jadi 28rb)
    discount: 0,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-garam-500g",
    name: "Garam 500g",
    category: "Dapur & Masak",
    defaultUnit: "pack",
    price: 5000,
    lastMonthPrice: 5000, // = Abu-abu (Setara / Sama dengan bulan lalu)
    discount: 0,
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-beras-5kg-745",
    name: "Beras 5kg (Premium)",
    category: "Sembako",
    defaultUnit: "pack",
    price: 74500,
    lastMonthPrice: 74500, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-minyak-2l",
    name: "Minyak Goreng 2L",
    category: "Sembako",
    defaultUnit: "liter",
    price: 42000,
    lastMonthPrice: 42000, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-indomie-goreng-5",
    name: "Indomie Goreng 5 pcs",
    category: "Mie & Instan",
    defaultUnit: "pack",
    price: 16500,
    lastMonthPrice: 15500, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-indomie-kuah-5",
    name: "Indomie Kuah 5 pcs",
    category: "Mie & Instan",
    defaultUnit: "pack",
    price: 16000,
    lastMonthPrice: 15000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-terigu-1kg",
    name: "Tepung Terigu 1kg",
    category: "Dapur & Masak",
    defaultUnit: "kg",
    price: 15500,
    lastMonthPrice: 15500, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-gula-1kg",
    name: "Gula Pasir 1kg",
    category: "Sembako",
    defaultUnit: "kg",
    price: 19500,
    lastMonthPrice: 18000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-ultra-milk-1l",
    name: "Susu Ultra Milk 1L",
    category: "Minuman",
    defaultUnit: "liter",
    price: 22500,
    lastMonthPrice: 22000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-aqua-6",
    name: "Aqua 6 Botol",
    category: "Minuman",
    defaultUnit: "botol",
    price: 24000,
    lastMonthPrice: 24000, // = Abu-abu
    discount: 0,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-daging-300g",
    name: "Daging Sapi 300g",
    category: "Sembako",
    defaultUnit: "pack",
    price: 55000,
    lastMonthPrice: 52000, // ⬆ Merah
    discount: 0,
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-sabun-cuci",
    name: "Sabun Cuci",
    category: "Kebersihan",
    defaultUnit: "pack",
    price: 20000,
    lastMonthPrice: 21000, // ⬇︎ Hijau
    discount: 0,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "prod-sabun-mandi",
    name: "Sabun Mandi",
    category: "Kebersihan",
    defaultUnit: "pcs",
    price: 29500,
    lastMonthPrice: 32000, // ⬇︎ Hijau
    discount: 0,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=500&q=80"
  }
];

function buildDefaultCatalogForStore() {
  return JSON.parse(JSON.stringify(DEFAULT_COMMODITIES));
}

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
    this.STORAGE_SESSION = "groceryin_rantau_session";
    this.STORAGE_CART = "groceryin_rantau_cart";
    this.STORAGE_HISTORY = "groceryin_rantau_history";
    this.STORAGE_CUSTOM_CATALOG = "groceryin_catalog_db_v2";

    // State
    this.city = "Jakarta Barat (Puri Indah)";
    this.supermarket = "Lotte Mart Grocery - Puri Indah";
    this.initialBudget = 300000;
    this.originalBudget = 300000;
    this.isSessionLocked = false;

    this.catalog = {};
    this.cart = [];
    this.history = [];

    this.currentTab = "store";
    this.currentCategory = "ALL";

    // State untuk Add/Edit Item to List Modal (Satuan, Qty, Diskon)
    this.modalProductId = null;
    this.editingCartItemId = null;
    this.modalUnit = "pcs";
    this.modalQuantity = 1;
    this.modalDiscountMode = "percent"; // "percent" atau "nominal"
    this.modalDiscountValue = 0;

    // State Metode Pembayaran Kasir (QRIS, Cash, BCA, Mandiri, BRI, Kartu Debit)
    this.selectedPaymentMethod = "QRIS";

    this.initDOM();
    this.initPWA();
    this.loadCatalogDatabase();
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

  // ==================== DATABASE CATALOG LOADER ====================
  loadCatalogDatabase() {
    this.catalog = JSON.parse(JSON.stringify(INITIAL_MASTER_CATALOG));

    const savedCatalogJson = localStorage.getItem(this.STORAGE_CUSTOM_CATALOG);
    if (savedCatalogJson) {
      try {
        const savedCatalog = JSON.parse(savedCatalogJson);
        for (const storeName of Object.keys(savedCatalog)) {
          if (!this.catalog[storeName]) {
            this.catalog[storeName] = savedCatalog[storeName];
          } else {
            const savedItems = savedCatalog[storeName];
            savedItems.forEach(savedItem => {
              const defIdx = this.catalog[storeName].findIndex(it => it.id === savedItem.id);
              if (defIdx !== -1) {
                const freshDefault = this.catalog[storeName][defIdx];
                this.catalog[storeName][defIdx] = {
                  ...freshDefault,
                  ...savedItem,
                  // Pastikan gambar default terbaru diterapkan
                  image: freshDefault.image || savedItem.image
                };
              } else {
                this.catalog[storeName].push(savedItem);
              }
            });
          }
        }
      } catch (e) {
        console.warn("Error parsing saved catalog, fallback to defaults:", e);
      }
    }

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
    this.summaryPaymentMethodLabel = document.getElementById("summaryPaymentMethodLabel");
    this.btnCheckoutLabelText = document.getElementById("btnCheckoutLabelText");

    // Payment Section Elements in List View
    this.checkoutPaymentBox = document.getElementById("checkoutPaymentBox");
    this.activePaymentBadge = document.getElementById("activePaymentBadge");
    this.paymentChipsGrid = document.getElementById("paymentChipsGrid");

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

    // Realtime Product Edit Modal Elements (Katalog Editor)
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

    // Modal Add / Edit Item to List (Satuan, Quantity, Diskon)
    this.addItemModalOverlay = document.getElementById("addItemModalOverlay");
    this.addItemModal = document.getElementById("addItemModal");
    this.addItemModalTitle = document.getElementById("addItemModalTitle");
    this.btnCloseAddItemModal = document.getElementById("btnCloseAddItemModal");
    this.modalProductImg = document.getElementById("modalProductImg");
    this.modalProductName = document.getElementById("modalProductName");
    this.modalProductCategory = document.getElementById("modalProductCategory");
    this.modalProductBasePrice = document.getElementById("modalProductBasePrice");
    this.unitChipsContainer = document.getElementById("unitChipsContainer");
    this.customUnitWrap = document.getElementById("customUnitWrap");
    this.customUnitInput = document.getElementById("customUnitInput");
    this.currentSelectedUnitDisplay = document.getElementById("currentSelectedUnitDisplay");
    this.btnModalQtyMinus = document.getElementById("btnModalQtyMinus");
    this.inputModalQuantity = document.getElementById("inputModalQuantity");
    this.btnModalQtyPlus = document.getElementById("btnModalQtyPlus");
    this.discountCalculatedPreview = document.getElementById("discountCalculatedPreview");
    this.btnModePercent = document.getElementById("btnModePercent");
    this.btnModeNominal = document.getElementById("btnModeNominal");
    this.discountPresetsContainer = document.getElementById("discountPresetsContainer");
    this.discountPrefixSymbol = document.getElementById("discountPrefixSymbol");
    this.inputModalDiscount = document.getElementById("inputModalDiscount");
    this.discountFieldHint = document.getElementById("discountFieldHint");
    this.modalSummaryOriginalPrice = document.getElementById("modalSummaryOriginalPrice");
    this.modalSummaryDiscountAmount = document.getElementById("modalSummaryDiscountAmount");
    this.modalSummaryFinalTotal = document.getElementById("modalSummaryFinalTotal");
    this.modalSummaryRemainingBudget = document.getElementById("modalSummaryRemainingBudget");
    this.modalBudgetWarningBanner = document.getElementById("modalBudgetWarningBanner");
    this.btnCancelAddItem = document.getElementById("btnCancelAddItem");
    this.btnConfirmAddItem = document.getElementById("btnConfirmAddItem");
    this.btnConfirmAddItemText = document.getElementById("btnConfirmAddItemText");

    // Receipt Modal (diakses opsional via tab History)
    this.receiptModalBackdrop = document.getElementById("receiptModalBackdrop");
    this.receiptStoreHeader = document.getElementById("receiptStoreHeader");
    this.receiptCityHeader = document.getElementById("receiptCityHeader");
    this.receiptTimestamp = document.getElementById("receiptTimestamp");
    this.receiptPaymentMethod = document.getElementById("receiptPaymentMethod");
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

    // 5. Tab Navigation
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

    // 7. Clear List (Langsung kosongkan troli tanpa dialog popup browser)
    this.btnClearList.addEventListener("click", () => {
      if (this.cart.length === 0) return;
      this.cart = [];
      this.saveCart();
      this.updateBudgetAndCartUI();
      this.renderCartList();
      this.renderStoreProducts();
      this.showToast("🛒", "Troli belanja berhasil dikosongkan.");
    });

    // 8. Checkout Action Button (Transaksi Langsung Tanpa Popup)
    this.btnCheckoutList.addEventListener("click", () => this.handleCheckout());

    // 9. Payment Method Selection Chips (Cash, QRIS, BCA, Mandiri, BRI, Kartu Debit)
    if (this.paymentChipsGrid) {
      this.paymentChipsGrid.querySelectorAll(".payment-chip-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.paymentChipsGrid.querySelectorAll(".payment-chip-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.selectedPaymentMethod = btn.getAttribute("data-method") || "QRIS";
          if (this.activePaymentBadge) this.activePaymentBadge.textContent = this.selectedPaymentMethod;
          if (this.summaryPaymentMethodLabel) this.summaryPaymentMethodLabel.textContent = `Bayar via ${this.selectedPaymentMethod}:`;
          if (this.btnCheckoutLabelText) this.btnCheckoutLabelText.textContent = `Bayar via ${this.selectedPaymentMethod}`;
        });
      });
    }

    // 10. History Actions (Bersihkan riwayat langsung tanpa dialog popup browser)
    this.btnClearHistory.addEventListener("click", () => {
      if (this.history.length === 0) return;
      this.history = [];
      localStorage.removeItem(this.STORAGE_HISTORY);
      this.renderHistory();
      this.showToast("🗑️", "Riwayat belanja telah dibersihkan.");
    });

    // 11. Receipt Modal Actions (Hanya dibuka saat user klik "Lihat Struk" di riwayat)
    this.btnReceiptPrint.addEventListener("click", () => window.print());
    this.btnReceiptClose.addEventListener("click", () => {
      this.receiptModalBackdrop.classList.add("hidden");
    });

    // 12. Realtime Product Edit Modal Listeners (Katalog Editor)
    if (this.btnOpenAddProduct) {
      this.btnOpenAddProduct.addEventListener("click", () => this.openAddProductModal());
    }
    this.btnCloseProductModal.addEventListener("click", () => this.closeProductModal());
    this.btnCancelProductChanges.addEventListener("click", () => this.closeProductModal());

    this.editProductPrice.addEventListener("input", () => this.updateModalLivePreview());
    this.editProductLastPrice.addEventListener("input", () => this.updateModalLivePreview());
    this.editProductDiscount.addEventListener("input", () => this.updateModalLivePreview());

    document.getElementById("productEditForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveProductChanges();
    });

    // 13. Modal Add / Edit to List Events (Satuan, Quantity, Diskon)
    this.initAddItemModalEvents();
  }

  // ==================== MODAL ADD / EDIT ITEM TO LIST EVENTS ====================
  initAddItemModalEvents() {
    this.btnCloseAddItemModal.addEventListener("click", () => this.closeAddItemModal());
    this.btnCancelAddItem.addEventListener("click", () => this.closeAddItemModal());

    // Unit selection chips (pcs, kg, liter, pack, botol, gram, ml, ikat, custom)
    this.unitChipsContainer.querySelectorAll(".unit-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        this.unitChipsContainer.querySelectorAll(".unit-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const unitVal = chip.getAttribute("data-unit");

        if (unitVal === "custom") {
          this.customUnitWrap.classList.remove("hidden");
          this.customUnitInput.focus();
          this.modalUnit = this.customUnitInput.value.trim() || "unit";
        } else {
          this.customUnitWrap.classList.add("hidden");
          this.modalUnit = unitVal;
        }

        this.currentSelectedUnitDisplay.textContent = this.modalUnit;
        this.recalculateModalPricing();
      });
    });

    this.customUnitInput.addEventListener("input", () => {
      this.modalUnit = this.customUnitInput.value.trim() || "unit";
      this.currentSelectedUnitDisplay.textContent = this.modalUnit;
      this.recalculateModalPricing();
    });

    // Quantity Stepper
    this.btnModalQtyMinus.addEventListener("click", () => {
      if (this.modalQuantity > 1) {
        this.modalQuantity -= 1;
        this.inputModalQuantity.value = this.modalQuantity;
        this.recalculateModalPricing();
      }
    });

    this.btnModalQtyPlus.addEventListener("click", () => {
      this.modalQuantity += 1;
      this.inputModalQuantity.value = this.modalQuantity;
      this.recalculateModalPricing();
    });

    this.inputModalQuantity.addEventListener("input", () => {
      let val = parseInt(this.inputModalQuantity.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      this.modalQuantity = val;
      this.recalculateModalPricing();
    });

    // Quick quantity chips (+1, +2, +5)
    document.querySelectorAll(".btn-quick-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const add = parseInt(btn.getAttribute("data-add"), 10) || 1;
        this.modalQuantity += add;
        this.inputModalQuantity.value = this.modalQuantity;
        this.recalculateModalPricing();
      });
    });

    // Discount Mode Toggle: Persen (%) vs Nominal (Rp)
    this.btnModePercent.addEventListener("click", () => {
      this.modalDiscountMode = "percent";
      this.btnModePercent.classList.add("active");
      this.btnModeNominal.classList.remove("active");
      this.discountPrefixSymbol.textContent = "%";
      this.discountPresetsContainer.style.display = "flex";
      this.discountFieldHint.textContent = "Pilih preset diskon di atas atau ketik persentase diskon (0-100%).";
      this.inputModalDiscount.placeholder = "0";
      this.inputModalDiscount.value = this.modalDiscountValue;
      this.recalculateModalPricing();
    });

    this.btnModeNominal.addEventListener("click", () => {
      this.modalDiscountMode = "nominal";
      this.btnModeNominal.classList.add("active");
      this.btnModePercent.classList.remove("active");
      this.discountPrefixSymbol.textContent = "Rp";
      this.discountPresetsContainer.style.display = "none";
      this.discountFieldHint.textContent = "Ketik potongan rupiah langsung per satuan (misal: 5000).";
      this.inputModalDiscount.placeholder = "0";
      this.inputModalDiscount.value = this.modalDiscountValue;
      this.recalculateModalPricing();
    });

    // Discount Presets Chips
    this.discountPresetsContainer.querySelectorAll(".disc-preset-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        this.discountPresetsContainer.querySelectorAll(".disc-preset-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const val = chip.getAttribute("data-disc");

        if (val === "custom") {
          this.inputModalDiscount.focus();
        } else {
          this.modalDiscountValue = parseFloat(val) || 0;
          this.inputModalDiscount.value = this.modalDiscountValue;
          this.recalculateModalPricing();
        }
      });
    });

    this.inputModalDiscount.addEventListener("input", () => {
      const val = parseFloat(this.inputModalDiscount.value) || 0;
      this.modalDiscountValue = val;

      if (this.modalDiscountMode === "percent") {
        this.discountPresetsContainer.querySelectorAll(".disc-preset-chip").forEach(chip => {
          const chipVal = chip.getAttribute("data-disc");
          if (chipVal !== "custom") {
            chip.classList.toggle("active", parseFloat(chipVal) === val);
          } else {
            const hasMatch = Array.from(this.discountPresetsContainer.querySelectorAll(".disc-preset-chip"))
              .some(c => c.getAttribute("data-disc") !== "custom" && parseFloat(c.getAttribute("data-disc")) === val);
            chip.classList.toggle("active", !hasMatch && val > 0);
          }
        });
      }

      this.recalculateModalPricing();
    });

    // Confirm button inside modal
    this.btnConfirmAddItem.addEventListener("click", () => this.handleConfirmAddItem());
  }

  // ==================== STATE MANAGEMENT ====================
  loadState() {
    const savedSession = localStorage.getItem(this.STORAGE_SESSION);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        this.city = session.city || "Jakarta Barat (Puri Indah)";
        this.supermarket = session.supermarket || "Lotte Mart Grocery - Puri Indah";
        this.initialBudget = parseFloat(session.initialBudget) || 300000;
        this.originalBudget = parseFloat(session.originalBudget) || this.initialBudget;
        this.isSessionLocked = true;
        this.setupModalOverlay.classList.add("hidden");
      } catch (e) {
        this.openSetupModal();
      }
    } else {
      this.openSetupModal();
    }

    const savedCart = localStorage.getItem(this.STORAGE_CART);
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }

    const savedHistory = localStorage.getItem(this.STORAGE_HISTORY);
    if (savedHistory) {
      try {
        this.history = JSON.parse(savedHistory);
      } catch (e) {
        this.history = [];
      }
    }

    this.updateHeaderStoreDisplay();
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
      this.showToast("⚠️", "Silakan masukkan nominal budget yang valid (minimal Rp 10.000)!");
      this.inputInitialBudget.focus();
      return;
    }

    this.btnConfirmText.textContent = `Mengunduh Data ${supermarket}...`;
    this.btnConfirmSetup.disabled = true;

    setTimeout(() => {
      this.city = city;
      this.supermarket = supermarket;
      this.initialBudget = budgetVal;
      this.originalBudget = budgetVal;
      this.isSessionLocked = true;

      if (!this.catalog[this.supermarket]) {
        this.catalog[this.supermarket] = buildDefaultCatalogForStore();
        this.saveCatalogDatabase();
      }

      const session = {
        city: this.city,
        supermarket: this.supermarket,
        initialBudget: this.initialBudget,
        originalBudget: this.originalBudget,
        lockedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_SESSION, JSON.stringify(session));

      this.cart = [];
      this.saveCart();

      this.updateHeaderStoreDisplay();
      this.btnConfirmText.textContent = "Confirm & Unduh Katalog";
      this.btnConfirmSetup.disabled = false;
      this.setupModalOverlay.classList.add("hidden");

      this.updateBudgetAndCartUI();
      this.renderStoreProducts();
      this.renderCartList();
      this.switchTab("store");

      this.showToast("✅", `Katalog ${this.supermarket} siap! Budget: ${this.formatRupiah(this.initialBudget)}`);
    }, 350);
  }

  handleLogout() {
    // Keluar langsung tanpa pop up browser native confirm
    localStorage.removeItem(this.STORAGE_SESSION);
    this.isSessionLocked = false;
    this.cart = [];
    this.saveCart();
    this.openSetupModal();
    this.showToast("👋", "Keluar dari sesi belanja. Silakan pilih supermarket atau atur budget.");
  }

  // ==================== TAB SWITCHING ====================
  switchTab(tabName) {
    this.currentTab = tabName;

    const views = [
      { id: "viewStore", name: "store" },
      { id: "viewList", name: "list" },
      { id: "viewHistory", name: "history" }
    ];

    views.forEach(v => {
      const el = document.getElementById(v.id);
      if (el) el.classList.toggle("active-view", v.name === tabName);
    });

    const topButtons = [
      { el: this.topTabStore, name: "store" },
      { el: this.topTabList, name: "list" },
      { el: this.topTabHistory, name: "history" }
    ];
    topButtons.forEach(b => {
      if (b.el) b.el.classList.toggle("active", b.name === tabName);
    });

    const bottomButtons = [
      { el: this.bottomNavStore, name: "store" },
      { el: this.bottomNavList, name: "list" },
      { el: this.bottomNavHistory, name: "history" }
    ];
    bottomButtons.forEach(b => {
      if (b.el) b.el.classList.toggle("active", b.name === tabName);
    });

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

  // ==================== CALCULATION & THREE-TIER BUDGET LOGIC ====================
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
   * Status Warna Budget:
   * - HIJAU: Masih aman (sisa > 25% batas krisis)
   * - KUNING: Krisis / Warning (sisa <= 25% dari budget acuan)
   * - MERAH: Habis atau lebih (sisa <= 0 atau over-budget)
   */
  getDynamicBudgetColor(totalSpent, budget) {
    if (budget <= 0) return "#F43F5E"; // Merah Ruby: Habis / 0
    const remaining = budget - totalSpent;
    if (remaining <= 0) {
      return "#F43F5E"; // Merah: Habis atau lebih
    }
    const criticalThreshold = Math.max(30000, (this.originalBudget || budget) * 0.25);
    if (remaining <= criticalThreshold) {
      return "#F59E0B"; // Kuning: Krisis / hampir habis
    }
    return "#10B981"; // Hijau: Masih aman
  }

  updateBudgetAndCartUI() {
    const totalSpent = this.getTotalCartPrice();
    const remaining = this.getRemainingBudget();
    const totalItems = this.cart.reduce((cnt, it) => cnt + it.quantity, 0);

    // 1. Live Remaining Budget in Top Header
    this.headerRemainingBudget.textContent = this.formatRupiah(remaining);

    const criticalThreshold = Math.max(30000, (this.originalBudget || this.initialBudget) * 0.25);

    if (remaining <= 0) {
      // MERAH: Habis atau lebih (over-budget)
      this.liveBudgetPill.style.background = "rgba(244, 63, 94, 0.22)";
      this.liveBudgetPill.style.borderColor = "rgba(244, 63, 94, 0.65)";
      this.headerRemainingBudget.style.color = "#FDA4AF";
    } else if (remaining <= criticalThreshold) {
      // KUNING: Krisis / warning (budget hampir habis)
      this.liveBudgetPill.style.background = "rgba(245, 158, 11, 0.20)";
      this.liveBudgetPill.style.borderColor = "rgba(245, 158, 11, 0.65)";
      this.headerRemainingBudget.style.color = "#FBBF24";
    } else {
      // HIJAU: Masih aman
      this.liveBudgetPill.style.background = "rgba(16, 185, 129, 0.16)";
      this.liveBudgetPill.style.borderColor = "rgba(16, 185, 129, 0.5)";
      this.headerRemainingBudget.style.color = "#34D399";
    }

    // 2. Tab Badges
    this.listBadgeCount.textContent = totalItems;
    if (totalItems > 0) {
      this.bottomNavListBadge.classList.remove("hidden");
      this.bottomNavListBadge.textContent = totalItems;
    } else {
      this.bottomNavListBadge.classList.add("hidden");
    }

    // 3. List Bottom Summary Bar Styling & Payment Label
    this.listTotalPriceText.textContent = this.formatRupiah(totalSpent);
    const dynamicColor = this.getDynamicBudgetColor(totalSpent, this.initialBudget);
    this.listTotalPriceText.style.color = dynamicColor;

    const currentMethod = this.selectedPaymentMethod || "QRIS";
    if (this.summaryPaymentMethodLabel) {
      this.summaryPaymentMethodLabel.textContent = `Bayar via ${currentMethod}:`;
    }
    if (this.btnCheckoutLabelText) {
      this.btnCheckoutLabelText.textContent = `Bayar via ${currentMethod}`;
    }

    if (this.initialBudget <= 0) {
      this.listBudgetStatusText.textContent = `🚨 Budget Habis (Rp 0 tersisa)!`;
      this.listBudgetStatusText.style.color = "#F43F5E";
    } else if (totalSpent >= this.initialBudget) {
      const overAmount = totalSpent - this.initialBudget;
      this.listBudgetStatusText.textContent = overAmount > 0
        ? `🚨 Budget Habis & Kelewatan (+${this.formatRupiah(overAmount)})!`
        : `🚨 Budget Habis (100% terpakai)!`;
      this.listBudgetStatusText.style.color = "#F43F5E";
    } else if (remaining <= criticalThreshold) {
      this.listBudgetStatusText.textContent = `⚠️ Krisis: Budget hampir habis! (Sisa ${this.formatRupiah(remaining)})`;
      this.listBudgetStatusText.style.color = "#F59E0B";
    } else {
      this.listBudgetStatusText.textContent = `✅ Masih Aman (Sisa ${this.formatRupiah(remaining)})`;
      this.listBudgetStatusText.style.color = "#10B981";
    }

    this.btnCheckoutList.disabled = (this.cart.length === 0);

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
    if (!this.catalog[this.supermarket] || !Array.isArray(this.catalog[this.supermarket]) || this.catalog[this.supermarket].length === 0) {
      this.catalog[this.supermarket] = buildDefaultCatalogForStore();
      this.saveCatalogDatabase();
    }
    return this.catalog[this.supermarket];
  }

  renderStoreProducts() {
    if (!this.productTilesContainer) {
      this.productTilesContainer = document.getElementById("productTilesContainer");
      if (!this.productTilesContainer) return;
    }

    const products = this.getCurrentStoreProducts();
    const filtered = products.filter(p => this.currentCategory === "ALL" || p.category === this.currentCategory);
    const remainingBudget = this.getRemainingBudget();

    if (filtered.length === 0) {
      this.productTilesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <p style="font-size: 2rem; margin-bottom: 8px;">🛒</p>
          <p style="font-weight: 600;">Tidak ada barang di kategori ini.</p>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(item => {
      const hasDiscount = item.discount > 0;
      const discountPercent = Math.round(item.discount * 100);
      const harga2 = hasDiscount ? Math.round(item.price * (1 - item.discount)) : item.price;

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
        emoteClass = "emote-equal";
      }

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

          <!-- Tombol Add to list: membuka modal pemilihan satuan (kg/pcs/liter) & diskon -->
          <button type="button" class="btn-add-to-list" 
                  onclick="app.openAddItemModal('${item.id}')" 
                  title="Pilih satuan dan diskon sebelum dimasukkan ke list">
            <span>+ Add to list</span>
          </button>
        </div>
      `;
    });

    this.productTilesContainer.innerHTML = html;
  }

  // ==================== ADD / EDIT ITEM MODAL (SATUAN, QUANTITY, DISKON) ====================
  openAddItemModal(productId, editCartItem = null) {
    const products = this.getCurrentStoreProducts();
    const product = products.find(p => p.id === productId);
    if (!product && !editCartItem) return;

    const targetItem = product || editCartItem;
    this.modalProductId = productId;
    this.editingCartItemId = editCartItem ? (editCartItem.cartItemId || editCartItem.id) : null;

    // Header info
    this.modalProductName.textContent = targetItem.name;
    this.modalProductImg.src = targetItem.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
    this.modalProductCategory.textContent = targetItem.category || "Grocery";
    this.modalProductBasePrice.textContent = `${this.formatRupiah(targetItem.price)} / satuan`;

    // 1. Initial Satuan
    let initialUnit = editCartItem ? editCartItem.unit : (targetItem.defaultUnit || "pcs");
    this.modalUnit = initialUnit;

    const commonUnits = ["pcs", "kg", "liter", "pack", "botol", "gram", "ml", "ikat"];
    let isCommon = commonUnits.includes(initialUnit);

    this.unitChipsContainer.querySelectorAll(".unit-chip").forEach(chip => {
      const u = chip.getAttribute("data-unit");
      if (isCommon && u === initialUnit) {
        chip.classList.add("active");
      } else if (!isCommon && u === "custom") {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });

    if (!isCommon) {
      this.customUnitWrap.classList.remove("hidden");
      this.customUnitInput.value = initialUnit;
    } else {
      this.customUnitWrap.classList.add("hidden");
    }
    this.currentSelectedUnitDisplay.textContent = this.modalUnit;

    // 2. Initial Quantity
    this.modalQuantity = editCartItem ? editCartItem.quantity : 1;
    this.inputModalQuantity.value = this.modalQuantity;

    // 3. Initial Discount
    if (editCartItem) {
      this.modalDiscountMode = editCartItem.discountMode || "percent";
      this.modalDiscountValue = editCartItem.discountValue !== undefined ? editCartItem.discountValue : (editCartItem.discount ? Math.round(editCartItem.discount * 100) : 0);
    } else {
      this.modalDiscountMode = "percent";
      this.modalDiscountValue = targetItem.discount ? Math.round(targetItem.discount * 100) : 0;
    }

    if (this.modalDiscountMode === "nominal") {
      this.btnModeNominal.classList.add("active");
      this.btnModePercent.classList.remove("active");
      this.discountPrefixSymbol.textContent = "Rp";
      this.discountPresetsContainer.style.display = "none";
      this.discountFieldHint.textContent = "Ketik potongan rupiah langsung per satuan.";
    } else {
      this.btnModePercent.classList.add("active");
      this.btnModeNominal.classList.remove("active");
      this.discountPrefixSymbol.textContent = "%";
      this.discountPresetsContainer.style.display = "flex";
      this.discountFieldHint.textContent = "Pilih preset diskon di atas atau ketik persentase diskon (0-100%).";
    }

    this.inputModalDiscount.value = this.modalDiscountValue;

    if (this.modalDiscountMode === "percent") {
      this.discountPresetsContainer.querySelectorAll(".disc-preset-chip").forEach(chip => {
        const val = chip.getAttribute("data-disc");
        if (val !== "custom") {
          chip.classList.toggle("active", parseFloat(val) === this.modalDiscountValue);
        }
      });
    }

    // Modal title
    if (this.editingCartItemId) {
      this.addItemModalTitle.textContent = "✏️ Ubah Satuan & Diskon";
      this.btnConfirmAddItemText.textContent = "💾 Simpan Perubahan";
    } else {
      this.addItemModalTitle.textContent = "🛒 Tambah ke List Belanja";
      this.btnConfirmAddItemText.textContent = "🛒 Masukkan ke List";
    }

    this.recalculateModalPricing();
    this.addItemModalOverlay.classList.remove("hidden");
  }

  closeAddItemModal() {
    this.addItemModalOverlay.classList.add("hidden");
  }

  recalculateModalPricing() {
    const products = this.getCurrentStoreProducts();
    let product = products.find(p => p.id === this.modalProductId);
    if (!product && this.editingCartItemId) {
      product = this.cart.find(it => (it.cartItemId || it.id) === this.editingCartItemId);
    }
    if (!product) return;

    const basePrice = product.price;
    const qty = Math.max(1, this.modalQuantity);

    let discountPerUnit = 0;
    let discountFraction = 0;

    if (this.modalDiscountMode === "percent") {
      const pct = Math.min(100, Math.max(0, this.modalDiscountValue));
      discountFraction = pct / 100;
      discountPerUnit = Math.round(basePrice * discountFraction);
    } else {
      discountPerUnit = Math.min(basePrice, Math.max(0, this.modalDiscountValue));
      discountFraction = basePrice > 0 ? (discountPerUnit / basePrice) : 0;
    }

    const netPricePerUnit = Math.max(0, basePrice - discountPerUnit);
    const subtotal = netPricePerUnit * qty;
    const totalOriginal = basePrice * qty;
    const totalDiscountSaved = discountPerUnit * qty;

    let availableBudget = this.getRemainingBudget();
    if (this.editingCartItemId) {
      const existingItem = this.cart.find(it => (it.cartItemId || it.id) === this.editingCartItemId);
      if (existingItem) {
        availableBudget += (existingItem.finalPrice * existingItem.quantity);
      }
    }

    const remainingAfter = availableBudget - subtotal;
    const isOverBudget = remainingAfter < 0;

    this.discountCalculatedPreview.textContent = `-${this.formatRupiah(discountPerUnit)} / ${this.modalUnit}`;
    this.modalSummaryOriginalPrice.textContent = `${this.formatRupiah(totalOriginal)} (${this.formatRupiah(basePrice)} x ${qty} ${this.modalUnit})`;
    this.modalSummaryDiscountAmount.textContent = totalDiscountSaved > 0 ? `-${this.formatRupiah(totalDiscountSaved)}` : "Rp 0";
    this.modalSummaryFinalTotal.textContent = this.formatRupiah(subtotal);
    this.modalSummaryRemainingBudget.textContent = this.formatRupiah(remainingAfter);

    if (isOverBudget) {
      this.modalBudgetWarningBanner.classList.remove("hidden");
      this.modalBudgetWarningBanner.textContent = `🚨 Over-budget! Melebihi sisa uang saku (${this.formatRupiah(Math.abs(remainingAfter))}).`;
    } else {
      this.modalBudgetWarningBanner.classList.add("hidden");
    }

    if (this.editingCartItemId) {
      this.btnConfirmAddItemText.textContent = `💾 Simpan (${this.formatRupiah(subtotal)})`;
    } else {
      this.btnConfirmAddItemText.textContent = `🛒 Masukkan ke List (${this.formatRupiah(subtotal)})`;
    }
  }

  handleConfirmAddItem() {
    const products = this.getCurrentStoreProducts();
    let product = products.find(p => p.id === this.modalProductId);
    if (!product && this.editingCartItemId) {
      product = this.cart.find(it => (it.cartItemId || it.id) === this.editingCartItemId);
    }
    if (!product) return;

    const basePrice = product.price;
    const qty = Math.max(1, this.modalQuantity);

    let discountPerUnit = 0;
    let discountFraction = 0;
    if (this.modalDiscountMode === "percent") {
      const pct = Math.min(100, Math.max(0, this.modalDiscountValue));
      discountFraction = pct / 100;
      discountPerUnit = Math.round(basePrice * discountFraction);
    } else {
      discountPerUnit = Math.min(basePrice, Math.max(0, this.modalDiscountValue));
      discountFraction = basePrice > 0 ? (discountPerUnit / basePrice) : 0;
    }

    const netPrice = Math.max(0, basePrice - discountPerUnit);
    const subtotal = netPrice * qty;

    if (this.editingCartItemId) {
      const itemIndex = this.cart.findIndex(it => (it.cartItemId || it.id) === this.editingCartItemId);
      if (itemIndex !== -1) {
        this.cart[itemIndex].unit = this.modalUnit;
        this.cart[itemIndex].quantity = qty;
        this.cart[itemIndex].discountMode = this.modalDiscountMode;
        this.cart[itemIndex].discountValue = this.modalDiscountValue;
        this.cart[itemIndex].discount = discountFraction;
        this.cart[itemIndex].finalPrice = netPrice;
        this.cart[itemIndex].totalPrice = subtotal;
      }
      this.showToast("✏️", `Rincian "${product.name}" (${qty} ${this.modalUnit}) diperbarui.`);
    } else {
      const cartItemId = `${product.id}_${Date.now()}`;
      this.cart.push({
        id: product.id,
        cartItemId: cartItemId,
        name: product.name,
        price: product.price,
        unit: this.modalUnit,
        quantity: qty,
        discountMode: this.modalDiscountMode,
        discountValue: this.modalDiscountValue,
        discount: discountFraction,
        finalPrice: netPrice,
        totalPrice: subtotal,
        image: product.image
      });
      this.showToast("🛒", `"${product.name}" (${qty} ${this.modalUnit}) masuk ke troli.`);
    }

    this.saveCart();
    this.closeAddItemModal();
    this.updateBudgetAndCartUI();
    this.renderCartList();
    this.renderStoreProducts();
  }

  // ==================== REALTIME PRODUCT EDIT MODAL (KATALOG) ====================
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

    const discountDec = discountPct / 100;
    const harga2 = Math.round(price * (1 - discountDec));

    this.previewHarga2Text.textContent = this.formatRupiah(harga2);

    const diff = price - lastPrice;
    if (diff > 0) {
      this.previewFlucBadge.className = "fluc-pill-preview fluc-up";
      this.previewFlucBadge.textContent = `⬆ Naik (+${this.formatRupiah(diff)})`;
    } else if (diff < 0) {
      this.previewFlucBadge.className = "fluc-pill-preview fluc-down";
      this.previewFlucBadge.textContent = `⬇︎ Turun (-${this.formatRupiah(Math.abs(diff))})`;
    } else {
      this.previewFlucBadge.className = "fluc-pill-preview fluc-equal";
      this.previewFlucBadge.textContent = `= Sama dengan bulan lalu`;
    }
  }

  saveProductChanges() {
    const id = this.editProductId.value.trim();
    const name = this.editProductName.value.trim();
    const price = parseFloat(this.editProductPrice.value);
    const lastPrice = parseFloat(this.editProductLastPrice.value) || price;
    const discountPct = parseFloat(this.editProductDiscount.value) || 0;
    const category = this.editProductCategory.value;

    if (!name || isNaN(price) || price < 0) {
      this.showToast("⚠️", "Harap isi nama dan harga yang valid!");
      return;
    }

    const discountDec = Math.max(0, Math.min(0.99, discountPct / 100));
    const storeProducts = this.getCurrentStoreProducts();

    if (id) {
      const idx = storeProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        storeProducts[idx] = {
          ...storeProducts[idx],
          name: name,
          price: price,
          lastMonthPrice: lastPrice,
          discount: discountDec,
          category: category
        };
        this.showToast("💾", `Data "${name}" berhasil diperbarui.`);
      }
    } else {
      const newId = `custom-prod-${Date.now()}`;
      storeProducts.unshift({
        id: newId,
        name: name,
        category: category,
        defaultUnit: "pcs",
        price: price,
        lastMonthPrice: lastPrice,
        discount: discountDec,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
      });
      this.showToast("🎉", `Barang baru "${name}" berhasil ditambahkan.`);
    }

    this.saveCatalogDatabase();
    this.closeProductModal();
    this.renderStoreProducts();
  }

  // ==================== TAB 2: CART / LIST (RUBY ACCENT CARDS) ====================
  updateItemQuantity(cartItemId, newQty) {
    const itemIndex = this.cart.findIndex(i => (i.cartItemId || i.id) === cartItemId);
    if (itemIndex === -1) return;

    if (newQty <= 0) {
      this.removeItemFromCart(cartItemId);
      return;
    }

    this.cart[itemIndex].quantity = newQty;
    this.cart[itemIndex].totalPrice = this.cart[itemIndex].finalPrice * newQty;
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderCartList();
  }

  incrementQuantity(cartItemId) {
    const item = this.cart.find(i => (i.cartItemId || i.id) === cartItemId);
    if (!item) return;
    this.updateItemQuantity(cartItemId, item.quantity + 1);
  }

  decrementQuantity(cartItemId) {
    const item = this.cart.find(i => (i.cartItemId || i.id) === cartItemId);
    if (!item) return;
    this.updateItemQuantity(cartItemId, item.quantity - 1);
  }

  removeItemFromCart(cartItemId) {
    const itemIndex = this.cart.findIndex(i => (i.cartItemId || i.id) === cartItemId);
    if (itemIndex === -1) return;

    const removedItem = this.cart[itemIndex];
    this.cart.splice(itemIndex, 1);
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderCartList();
    this.renderStoreProducts();
    this.showToast("🗑️", `"${removedItem.name}" dihapus dari troli.`);
  }

  saveCart() {
    localStorage.setItem(this.STORAGE_CART, JSON.stringify(this.cart));
  }

  renderCartList() {
    if (this.cart.length === 0) {
      this.activeGroceryListContainer.innerHTML = "";
      this.emptyListCard.classList.remove("hidden");
      if (this.checkoutPaymentBox) this.checkoutPaymentBox.classList.add("hidden");
      return;
    }

    this.emptyListCard.classList.add("hidden");
    if (this.checkoutPaymentBox) this.checkoutPaymentBox.classList.remove("hidden");

    let html = "";
    this.cart.forEach((item, index) => {
      const itemTotalPrice = item.finalPrice * item.quantity;
      const unit = item.unit || "pcs";
      const hasDiscount = (item.price > item.finalPrice);
      const discountSaved = (item.price - item.finalPrice) * item.quantity;

      const discountLabel = item.discountMode === "nominal"
        ? `Hemat ${this.formatRupiah(item.discountValue || (item.price - item.finalPrice))}/satuan`
        : `Diskon ${Math.round((item.discount || 0) * 100)}%`;

      const itemIdKey = item.cartItemId || item.id;

      html += `
        <div class="list-item-card" data-id="${itemIdKey}">
          
          <!-- Top Header: Item Index + Edit Button + Delete Button -->
          <div class="list-item-top-header">
            <span class="item-index-label">Item #${index + 1}</span>

            <div class="list-item-actions-top">
              <button type="button" class="btn-edit-item-config" 
                      onclick="app.openAddItemModal('${item.id}', app.cart[${index}])" 
                      title="Ubah Satuan, Qty atau Diskon">
                <span>✏️ Atur</span>
              </button>
              <button type="button" class="btn-remove-item" 
                      onclick="app.removeItemFromCart('${itemIdKey}')" 
                      title="Hapus dari troli">
                ✕
              </button>
            </div>
          </div>

          <!-- Body: Gambar | Nama, Satuan/Diskon Tags, Harga, Stepper -->
          <div class="list-item-body-row">
            <img src="${item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}" 
                 alt="${this.escapeHtml(item.name)}" class="list-item-thumb">
            
            <div class="list-item-details">
              <div class="list-item-name">${this.escapeHtml(item.name)}</div>
              
              <!-- Badges for Unit & Discount -->
              <div class="list-item-meta-tags">
                <span class="unit-badge-pill">${item.quantity} ${unit}</span>
                ${hasDiscount ? `<span class="discount-badge-pill">${discountLabel} (-${this.formatRupiah(discountSaved)})</span>` : ''}
              </div>

              <div class="list-item-unit-calc">
                ${this.formatRupiah(item.finalPrice)} / ${unit}
              </div>

              <div class="list-item-action-bottom">
                <span class="list-item-total-price">${this.formatRupiah(itemTotalPrice)}</span>

                <!-- Stepper Kuantitas: - [ ] + -->
                <div class="quantity-stepper-box">
                  <button type="button" class="btn-stepper btn-minus" 
                          onclick="app.decrementQuantity('${itemIdKey}')" 
                          aria-label="Kurangi kuantitas">−</button>
                  <input type="number" class="input-qty-box" value="${item.quantity}" min="1" max="999"
                         onchange="app.updateItemQuantity('${itemIdKey}', parseInt(this.value, 10))" 
                         aria-label="Jumlah item">
                  <button type="button" class="btn-stepper btn-plus" 
                          onclick="app.incrementQuantity('${itemIdKey}')" 
                          aria-label="Tambah kuantitas">+</button>
                </div>
              </div>

            </div>
          </div>

        </div>
      `;
    });

    this.activeGroceryListContainer.innerHTML = html;
  }

  // ==================== CHECKOUT (TRANSAKSI LANGSUNG TANPA POPUP) ====================
  handleCheckout() {
    if (this.cart.length === 0) {
      this.showToast("🛒", "Troli belanja masih kosong!");
      return;
    }

    const totalSpent = this.getTotalCartPrice();
    const remainingBudget = this.getRemainingBudget();
    const paymentMethod = this.selectedPaymentMethod || "QRIS";

    const record = {
      id: `rcpt-${Date.now()}`,
      date: new Date().toISOString(),
      supermarket: this.supermarket,
      city: this.city,
      initialBudget: this.initialBudget,
      totalSpent: totalSpent,
      totalDiscountSaved: this.getTotalDiscountSaved(),
      remainingBudget: remainingBudget,
      paymentMethod: paymentMethod,
      items: JSON.parse(JSON.stringify(this.cart))
    };

    // 1. Simpan transaksi ke riwayat
    this.history.unshift(record);
    localStorage.setItem(this.STORAGE_HISTORY, JSON.stringify(this.history));

    // 2. Potong/kurangi saldo budget setelah checkout barang
    this.initialBudget = Math.max(0, this.initialBudget - totalSpent);
    const savedSession = localStorage.getItem(this.STORAGE_SESSION);
    if (savedSession) {
      try {
        const sess = JSON.parse(savedSession);
        sess.initialBudget = this.initialBudget;
        localStorage.setItem(this.STORAGE_SESSION, JSON.stringify(sess));
      } catch (e) {}
    }

    // 3. Kosongkan keranjang
    this.cart = [];
    this.saveCart();

    // 4. Perbarui seluruh UI state
    this.updateBudgetAndCartUI();
    this.renderCartList();
    this.renderHistory();
    this.renderStoreProducts();

    // 5. Feedback instan tanpa popup (langsung switch ke tab History)
    this.showToast("🎉", `Transaksi ${this.formatRupiah(totalSpent)} via ${paymentMethod} Berhasil! Sisa budget dompet: ${this.formatRupiah(this.initialBudget)}`);
    this.switchTab("history");
  }

  showReceiptModal(record) {
    if (!record) return;
    this.receiptStoreHeader.textContent = record.supermarket.toUpperCase();
    this.receiptCityHeader.textContent = `Cabang ${record.city}`;
    
    const d = new Date(record.date);
    this.receiptTimestamp.textContent = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) + " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    if (this.receiptPaymentMethod) {
      this.receiptPaymentMethod.textContent = record.paymentMethod || "QRIS";
    }

    let itemsHtml = "";
    record.items.forEach(it => {
      const unit = it.unit || "pcs";
      itemsHtml += `
        <div class="receipt-item-row">
          <div class="r-item-left">
            <span>${this.escapeHtml(it.name)}</span>
            <small>${it.quantity} ${unit} x ${this.formatRupiah(it.finalPrice)}</small>
          </div>
          <div class="r-item-right">
            <strong>${this.formatRupiah(it.finalPrice * it.quantity)}</strong>
          </div>
        </div>
      `;
    });

    this.receiptItemsListBody.innerHTML = itemsHtml;
    this.receiptInitialBudget.textContent = this.formatRupiah(record.initialBudget);
    this.receiptTotalDiscount.textContent = `-${this.formatRupiah(record.totalDiscountSaved)}`;
    this.receiptFinalTotal.textContent = this.formatRupiah(record.totalSpent);
    this.receiptRemainingSafe.textContent = this.formatRupiah(record.remainingBudget);

    this.receiptModalBackdrop.classList.remove("hidden");
  }

  // ==================== TAB 3: HISTORY ====================
  renderHistory() {
    if (this.history.length === 0) {
      this.historyTilesContainer.innerHTML = "";
      this.emptyHistoryCard.classList.remove("hidden");
      return;
    }

    this.emptyHistoryCard.classList.add("hidden");

    let html = "";
    this.history.forEach(record => {
      const recordDate = new Date(record.date);
      const relativeDate = this.formatRelativeDate(recordDate);
      const payment = record.paymentMethod || "QRIS";

      let paymentIcon = "📱";
      if (payment === "Cash") paymentIcon = "💵";
      else if (payment === "BCA" || payment === "Kartu Debit") paymentIcon = "💳";
      else if (payment === "Mandiri" || payment === "BRI") paymentIcon = "🏦";

      let itemsSummaryHtml = "";
      record.items.forEach(it => {
        const unit = it.unit || "pcs";
        itemsSummaryHtml += `
          <div class="history-item-row">
            <img src="${it.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}" alt="" class="history-item-thumb">
            <div class="history-item-info">
              <span class="history-item-name">${this.escapeHtml(it.name)}</span>
              <span class="history-item-calc">${this.formatRupiah(it.finalPrice * it.quantity)} &bull; ${it.quantity} ${unit}</span>
            </div>
          </div>
        `;
      });

      html += `
        <div class="history-record-card">
          <div class="history-record-header">
            <div class="history-meta">
              <span class="history-date-badge">${relativeDate}</span>
              <span class="history-payment-badge">${paymentIcon} ${payment}</span>
              <small class="history-store-tag">🏬 ${this.escapeHtml(record.supermarket)}</small>
            </div>
            <strong class="history-total-price">${this.formatRupiah(record.totalSpent)}</strong>
          </div>

          <div class="history-items-list">
            ${itemsSummaryHtml}
          </div>

          <div class="history-card-footer">
            <button type="button" class="btn-history-view-receipt" onclick="app.showReceiptModal(app.history.find(h => h.id === '${record.id}'))">
              📄 Lihat Rincian Struk
            </button>
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
    }, 2800);
  }
}

// Global Application Instance
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new SmartGroceryApp();
});
