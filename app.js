/**
 * GROCERYIN - SMART GROCERY & BUDGET SAFETY TRACKER
 * Native Mobile PWA Edition for Anak Rantau
 * 
 * Features:
 * - Dynamic Supermarket Filtering by City (Family Mart, Indomaret, Alfamart, Alfamidi)
 * - Locked Initial Budget Enforcement (Safety Cap)
 * - Live Remaining Budget Updates across Store & List tabs
 * - Fading Color Transition (Green -> Yellow/Orange -> Full Red as budget exhausts)
 * - Add to list with automatic budget check & block when out of budget
 * - Interactive Quantity Stepper (-[]+) & X delete with budget refund
 * - Checkout locking list & archiving to History with printable receipt
 * - LocalStorage Offline Persistence & PWA Service Worker
 */

// ==================== 1. CITY & SUPERMARKET MAPPING ====================
const CITY_SUPERMARKETS = {
  "Bandung": ["Indomaret", "Alfamart", "Alfamidi"],
  "Jabodetabek / Jakarta": ["Indomaret", "Alfamart", "Alfamidi", "Family Mart"],
  "Yogyakarta": ["Indomaret", "Alfamart", "Alfamidi"],
  "Surabaya": ["Indomaret", "Alfamart", "Alfamidi", "Family Mart"],
  "Malang": ["Indomaret", "Alfamart", "Alfamidi"],
  "Semarang": ["Indomaret", "Alfamart"],
  "Medan": ["Indomaret", "Alfamart", "Alfamidi"],
  "Bali": ["Indomaret", "Alfamart", "Family Mart"]
};

// ==================== 2. MASTER PRODUCT DATABASE ====================
// Authentic goods tailored for anak rantau across Indonesian supermarkets
const MASTER_CATALOG = {
  "Indomaret": [
    {
      id: "ind-1",
      name: "Indomie Goreng Spesial 85g",
      category: "Mie & Instan",
      price: 3300,
      discount: 0.10, // 10%
      lastMonthPrice: 3100, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-2",
      name: "Beras Sania Premium 5kg",
      category: "Sembako",
      price: 74500,
      discount: 0.05,
      lastMonthPrice: 77000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-3",
      name: "Minyak Goreng Bimoli 2 Liter",
      category: "Sembako",
      price: 36000,
      discount: 0,
      lastMonthPrice: 36000, // = Stabil
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-4",
      name: "Telur Ayam Negeri 1kg (Isi 16)",
      category: "Sembako",
      price: 28500,
      discount: 0,
      lastMonthPrice: 27000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-5",
      name: "Ultra Milk UHT Full Cream 1L",
      category: "Minuman",
      price: 19500,
      discount: 0.15, // 15%
      lastMonthPrice: 20000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-6",
      name: "Sosis Kanzler Singles Keju 65g",
      category: "Snack",
      price: 9000,
      discount: 0.20, // 20%
      lastMonthPrice: 9000, // = Stabil
      image: "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-7",
      name: "Kopi Kapal Api Spesial Mix 10x24g",
      category: "Minuman",
      price: 14500,
      discount: 0,
      lastMonthPrice: 13500, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-8",
      name: "Sabun Cuci Sunlight Jeruk Nipis 700ml",
      category: "Kebersihan",
      price: 14000,
      discount: 0.10,
      lastMonthPrice: 15500, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-9",
      name: "Roti Tawar Kupas Mr. Bread",
      category: "Sembako",
      price: 15000,
      discount: 0,
      lastMonthPrice: 15000, // = Stabil
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-10",
      name: "Bumbu Racik Sayur Asem Indofood",
      category: "Dapur & Masak",
      price: 2500,
      discount: 0,
      lastMonthPrice: 2500, // = Stabil
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80"
    }
  ],

  "Alfamart": [
    {
      id: "alf-1",
      name: "Indomie Kuah Ayam Bawang 69g",
      category: "Mie & Instan",
      price: 3200,
      discount: 0.10,
      lastMonthPrice: 3000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-2",
      name: "Minyak Goreng Tropical Pouch 2L",
      category: "Sembako",
      price: 35500,
      discount: 0.08,
      lastMonthPrice: 37500, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-3",
      name: "Beras Ramos Alfamart 5kg",
      category: "Sembako",
      price: 73000,
      discount: 0,
      lastMonthPrice: 70000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-4",
      name: "Susu Frisian Flag Cokelat 900ml",
      category: "Minuman",
      price: 18000,
      discount: 0.15,
      lastMonthPrice: 19000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-5",
      name: "Biskuit Roma Kelapa 300g",
      category: "Snack",
      price: 11500,
      discount: 0,
      lastMonthPrice: 11500, // = Stabil
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-6",
      name: "Kecap Manis Bango Refill 520ml",
      category: "Dapur & Masak",
      price: 24500,
      discount: 0.12,
      lastMonthPrice: 25000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-7",
      name: "Shampo Pantene Anti Dandruff 160ml",
      category: "Kebersihan",
      price: 26000,
      discount: 0.25, // Promo JSM 25%
      lastMonthPrice: 26000, // = Stabil
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-8",
      name: "Sarden ABC Saus Tomat 155g",
      category: "Dapur & Masak",
      price: 11000,
      discount: 0,
      lastMonthPrice: 10000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-9",
      name: "Air Mineral Le Minerale 1500ml",
      category: "Minuman",
      price: 6500,
      discount: 0,
      lastMonthPrice: 6500, // = Stabil
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-10",
      name: "Sabun Mandi Dettol Original 100g",
      category: "Kebersihan",
      price: 8500,
      discount: 0.10,
      lastMonthPrice: 9000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1607006314644-77a834b6b669?auto=format&fit=crop&w=400&q=80"
    }
  ],

  "Alfamidi": [
    {
      id: "mid-1",
      name: "Daging Ayam Broiler Segar 1 Ekor",
      category: "Sembako",
      price: 38000,
      discount: 0.10,
      lastMonthPrice: 35000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-2",
      name: "Fiesta Crispy Nugget 500g",
      category: "Sembako",
      price: 49500,
      discount: 0.15,
      lastMonthPrice: 52000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-3",
      name: "Beras Pandan Wangi 5kg",
      category: "Sembako",
      price: 78000,
      discount: 0,
      lastMonthPrice: 78000, // = Stabil
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-4",
      name: "Cimory Fresh Milk Full Cream 950ml",
      category: "Minuman",
      price: 21500,
      discount: 0.12,
      lastMonthPrice: 22000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-5",
      name: "Sedaap Goreng Rasa Ayam Krispi 88g",
      category: "Mie & Instan",
      price: 3200,
      discount: 0,
      lastMonthPrice: 3200, // = Stabil
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-6",
      name: "Telur Puyuh Segar Pack 20 Butir",
      category: "Sembako",
      price: 12000,
      discount: 0,
      lastMonthPrice: 11000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-7",
      name: "Bawang Merah Brebes Pack 250g",
      category: "Dapur & Masak",
      price: 13500,
      discount: 0.05,
      lastMonthPrice: 16000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-8",
      name: "Deterjen Daia Putih 850g",
      category: "Kebersihan",
      price: 18500,
      discount: 0.20,
      lastMonthPrice: 18500, // = Stabil
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    }
  ],

  "Family Mart": [
    {
      id: "fm-1",
      name: "FamiCafe Kopi Susu Keluarga",
      category: "Minuman",
      price: 15000,
      discount: 0.20, // Diskon promo 20%
      lastMonthPrice: 15000, // = Stabil
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-2",
      name: "Onigiri Salmon Mayo",
      category: "Snack",
      price: 13000,
      discount: 0.10,
      lastMonthPrice: 12000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-3",
      name: "Crispy Chicken Dada Bento",
      category: "Sembako",
      price: 24000,
      discount: 0.15,
      lastMonthPrice: 25000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-4",
      name: "Samyang Hot Chicken Ramen Bowl",
      category: "Mie & Instan",
      price: 22500,
      discount: 0,
      lastMonthPrice: 21000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-5",
      name: "Green Tea FamiCafe Ice",
      category: "Minuman",
      price: 15000,
      discount: 0.20,
      lastMonthPrice: 15000, // = Stabil
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-6",
      name: "Sandwich Telur Mayo Soft Bread",
      category: "Snack",
      price: 16000,
      discount: 0,
      lastMonthPrice: 17000, // ⬇︎ Turun
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-7",
      name: "Pocky Cokelat Glico 47g",
      category: "Snack",
      price: 8500,
      discount: 0.10,
      lastMonthPrice: 8500, // = Stabil
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-8",
      name: "Tisu Basah Dettol Wipes 10s",
      category: "Kebersihan",
      price: 9500,
      discount: 0,
      lastMonthPrice: 9000, // ⬆ Naik
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    }
  ]
};

// ==================== 3. GROCERYIN APP CLASS ====================
class SmartGroceryApp {
  constructor() {
    // Storage keys
    this.STORAGE_SESSION = "groceryin_rantau_session";
    this.STORAGE_CART = "groceryin_rantau_cart";
    this.STORAGE_HISTORY = "groceryin_rantau_history";

    // State
    this.city = "Bandung";
    this.supermarket = "Alfamart";
    this.initialBudget = 300000;
    this.isSessionLocked = false;

    this.cart = []; // [{ id, name, price, discount, finalPrice, quantity, image, supermarket }]
    this.history = []; // [{ id, date, store, city, totalSpent, initialBudget, items: [] }]
    
    this.currentTab = "store"; // store, list, history
    this.currentCategory = "ALL";

    this.initDOM();
    this.initPWA();
    this.initEvents();
    this.loadState();
  }

  // ==================== PWA INITIALIZATION ====================
  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('📱 GroceryIn PWA SW Registered:', reg.scope))
          .catch(err => console.warn('PWA SW error:', err));
      });
    }
  }

  // ==================== DOM BINDING ====================
  initDOM() {
    // Header
    this.displayStoreName = document.getElementById("displayStoreName");
    this.displayStoreCity = document.getElementById("displayStoreCity");
    this.headerRemainingBudget = document.getElementById("headerRemainingBudget");
    this.liveBudgetPill = document.getElementById("liveBudgetPill");
    this.btnLogout = document.getElementById("btnLogout");

    // Top Tabs
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
    this.promoStoreTitle = document.getElementById("promoStoreTitle");
    this.promoStoreSubtitle = document.getElementById("promoStoreSubtitle");

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
    // 1. City selection changes supermarket options
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

    // 5. Tab Navigation (Top Segment & Floating Bottom Bar)
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
  }

  // ==================== STATE MANAGEMENT ====================
  loadState() {
    // 1. Check existing locked session
    const savedSession = localStorage.getItem(this.STORAGE_SESSION);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        this.city = session.city || "Bandung";
        this.supermarket = session.supermarket || "Alfamart";
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
    this.displayStoreName.textContent = this.supermarket;
    this.displayStoreCity.textContent = this.city;

    // 5. Initial Render
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
    this.renderHistory();
    this.switchTab("store");
  }

  openSetupModal() {
    this.setupModalOverlay.classList.remove("hidden");
    this.populateSupermarketsForCity(this.selectCity.value);
  }

  populateSupermarketsForCity(city) {
    const list = CITY_SUPERMARKETS[city] || ["Indomaret", "Alfamart"];
    this.selectSupermarket.innerHTML = "";
    list.forEach(sm => {
      const opt = document.createElement("option");
      opt.value = sm;
      opt.textContent = `🏬 ${sm}`;
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
    this.btnConfirmText.textContent = `Mengunduh Promo ${supermarket}...`;
    this.btnConfirmSetup.disabled = true;

    setTimeout(() => {
      this.city = city;
      this.supermarket = supermarket;
      this.initialBudget = budgetVal;
      this.isSessionLocked = true;

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
      this.displayStoreName.textContent = this.supermarket;
      this.displayStoreCity.textContent = this.city;
      this.promoStoreTitle.textContent = `Katalog & Promo Spesial ${this.supermarket}`;
      this.promoStoreSubtitle.textContent = `Cabang ${this.city} • Update Fluktuasi Harga Realtime`;

      this.btnConfirmText.textContent = "Confirm & Unduh Katalog";
      this.btnConfirmSetup.disabled = false;
      this.setupModalOverlay.classList.add("hidden");

      this.updateBudgetAndCartUI();
      this.renderStoreProducts();
      this.renderCartList();
      this.switchTab("store");

      this.showToast("✅", `Katalog ${this.supermarket} (${this.city}) siap! Budget: ${this.formatRupiah(this.initialBudget)}`);
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

    // Toggle Top Segment Buttons
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
    // On Store & History views: hide summary bar so floating nav has clean view
    if (this.listBottomSummaryBar) {
      if (tabName === "list" && this.cart.length > 0) {
        this.listBottomSummaryBar.classList.remove("hidden");
        this.floatingBottomNav.style.display = "none";
      } else {
        this.listBottomSummaryBar.classList.add("hidden");
        this.floatingBottomNav.style.display = "flex";
      }
    }

    // Scroll to top
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

    // Color checkpoints:
    // Ratio 0.0 -> Green #16A34A (rgb(22, 163, 74))
    // Ratio 0.6 -> Amber/Yellow #CA8A04 (rgb(202, 138, 4))
    // Ratio 0.85 -> Orange #EA580C (rgb(234, 88, 12))
    // Ratio 1.0 -> Red #DC2626 (rgb(220, 38, 38))

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
  renderStoreProducts() {
    const products = MASTER_CATALOG[this.supermarket] || MASTER_CATALOG["Alfamart"];
    const filtered = products.filter(p => this.currentCategory === "ALL" || p.category === this.currentCategory);

    const remainingBudget = this.getRemainingBudget();

    let html = "";
    filtered.forEach(item => {
      // Rumus: Harga2 = Harga - (Diskon * Harga)
      const hasDiscount = item.discount > 0;
      const discountPercent = Math.round(item.discount * 100);
      const harga2 = hasDiscount ? Math.round(item.price * (1 - item.discount)) : item.price;

      // Emote Fluktuasi Harga vs Bulan Lalu:
      // a) ⬆ (merah): jika harga meningkat
      // b) ⬇︎ (hijau): jika harga menurun
      // c) = (kuning): jika harga masih sama
      let emoteSymbol = "=";
      let emoteClass = "emote-equal";
      if (item.price > item.lastMonthPrice) {
        emoteSymbol = "⬆";
        emoteClass = "emote-up";
      } else if (item.price < item.lastMonthPrice) {
        emoteSymbol = "⬇︎";
        emoteClass = "emote-down";
      } else {
        emoteSymbol = "=";
        emoteClass = "emote-equal";
      }

      // Check if user has enough budget to add this item
      const canAfford = (remainingBudget >= harga2);

      html += `
        <div class="product-tile" data-id="${item.id}">
          <div class="product-image-wrap">
            <img src="${item.image}" alt="${this.escapeHtml(item.name)}" class="product-tile-img" loading="lazy">
            ${hasDiscount ? `<span class="product-discount-pill">-${discountPercent}%</span>` : ''}
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
              <span class="price-fluctuation-emote ${emoteClass}" title="Dibanding bulan lalu ${this.formatRupiah(item.lastMonthPrice)}">${emoteSymbol}</span>
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

  // ==================== CART ACTIONS (Add, Stepper, Delete) ====================
  addToCart(productId) {
    const products = MASTER_CATALOG[this.supermarket] || MASTER_CATALOG["Alfamart"];
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
            <img src="${item.image}" alt="${this.escapeHtml(item.name)}" class="list-item-thumb">
            
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
            <img src="${it.image}" alt="${this.escapeHtml(it.name)}" class="history-item-thumb">
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
