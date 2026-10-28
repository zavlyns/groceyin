/**
 * GROCERYIN - SMART GROCERY & BUDGET SAFETY TRACKER
 * Native Mobile PWA Edition for Anak Rantau
 * 
 * Features:
 * - Dynamic Supermarket Filtering by City (Family Mart, Indomaret, Alfamart, Alfamidi)
 * - Sign In Username & Email, and Sign In with Google before selecting store
 * - Direct "Instal aplikasi ini ke handphone" (PWA install prompt, launcher APK/shortcut download, QR code)
 * - Custom Unit Selection (pcs, kg, gram, liter, ml, pack, botol, ikat, custom)
 * - Custom Quantity Stepper & Direct Input
 * - Selectable & Customizable Discount (Preset chips %, nominal Rp, or custom promo)
 * - Locked Initial Budget Enforcement (Safety Cap)
 * - Live Remaining Budget Updates across Store & List tabs
 * - Black Background with Crimson Red Lists & Accents
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
const MASTER_CATALOG = {
  "Indomaret": [
    {
      id: "ind-1",
      name: "Indomie Goreng Spesial 85g",
      category: "Mie & Instan",
      price: 3300,
      discount: 0.10, // 10%
      lastMonthPrice: 3100, // ⬆ Naik
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-2",
      name: "Beras Sania Premium 5kg",
      category: "Sembako",
      price: 74500,
      discount: 0.05,
      lastMonthPrice: 77000, // ⬇︎ Turun
      defaultUnit: "kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-3",
      name: "Minyak Goreng Bimoli 2 Liter",
      category: "Sembako",
      price: 36000,
      discount: 0,
      lastMonthPrice: 36000, // = Stabil
      defaultUnit: "liter",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-4",
      name: "Telur Ayam Negeri 1kg (Isi 16)",
      category: "Sembako",
      price: 28500,
      discount: 0,
      lastMonthPrice: 27000, // ⬆ Naik
      defaultUnit: "kg",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-5",
      name: "Ultra Milk UHT Full Cream 1L",
      category: "Minuman",
      price: 19500,
      discount: 0.15, // 15%
      lastMonthPrice: 20000, // ⬇︎ Turun
      defaultUnit: "liter",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-6",
      name: "Sosis Kanzler Singles Keju 65g",
      category: "Snack",
      price: 9000,
      discount: 0.20, // 20%
      lastMonthPrice: 9000, // = Stabil
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-7",
      name: "Kopi Kapal Api Spesial Mix 10x24g",
      category: "Minuman",
      price: 14500,
      discount: 0,
      lastMonthPrice: 13500, // ⬆ Naik
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-8",
      name: "Sabun Cuci Sunlight Jeruk Nipis 700ml",
      category: "Kebersihan",
      price: 14000,
      discount: 0.10,
      lastMonthPrice: 15500, // ⬇︎ Turun
      defaultUnit: "ml",
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-9",
      name: "Roti Tawar Kupas Mr. Bread",
      category: "Sembako",
      price: 15000,
      discount: 0,
      lastMonthPrice: 15000, // = Stabil
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "ind-10",
      name: "Bumbu Racik Sayur Asem Indofood",
      category: "Dapur & Masak",
      price: 2500,
      discount: 0,
      lastMonthPrice: 2500, // = Stabil
      defaultUnit: "pcs",
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
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-2",
      name: "Minyak Goreng Tropical Pouch 2L",
      category: "Sembako",
      price: 35500,
      discount: 0.08,
      lastMonthPrice: 37500, // ⬇︎ Turun
      defaultUnit: "liter",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-3",
      name: "Beras Ramos Alfamart 5kg",
      category: "Sembako",
      price: 73000,
      discount: 0,
      lastMonthPrice: 70000, // ⬆ Naik
      defaultUnit: "kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-4",
      name: "Susu Frisian Flag Cokelat 900ml",
      category: "Minuman",
      price: 18000,
      discount: 0.15,
      lastMonthPrice: 19000, // ⬇︎ Turun
      defaultUnit: "ml",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-5",
      name: "Biskuit Roma Kelapa 300g",
      category: "Snack",
      price: 11500,
      discount: 0,
      lastMonthPrice: 11500, // = Stabil
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-6",
      name: "Kecap Manis Bango Refill 520ml",
      category: "Dapur & Masak",
      price: 24500,
      discount: 0.12,
      lastMonthPrice: 25000, // ⬇︎ Turun
      defaultUnit: "ml",
      image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-7",
      name: "Shampo Pantene Anti Dandruff 160ml",
      category: "Kebersihan",
      price: 26000,
      discount: 0.25,
      lastMonthPrice: 26000, // = Stabil
      defaultUnit: "botol",
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-8",
      name: "Sarden ABC Saus Tomat 155g",
      category: "Dapur & Masak",
      price: 11000,
      discount: 0,
      lastMonthPrice: 10000, // ⬆ Naik
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-9",
      name: "Air Mineral Le Minerale 1500ml",
      category: "Minuman",
      price: 6500,
      discount: 0,
      lastMonthPrice: 6500, // = Stabil
      defaultUnit: "botol",
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "alf-10",
      name: "Sabun Mandi Dettol Original 100g",
      category: "Kebersihan",
      price: 8500,
      discount: 0.10,
      lastMonthPrice: 9000, // ⬇︎ Turun
      defaultUnit: "pcs",
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
      defaultUnit: "kg",
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-2",
      name: "Fiesta Crispy Nugget 500g",
      category: "Sembako",
      price: 49500,
      discount: 0.15,
      lastMonthPrice: 52000, // ⬇︎ Turun
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-3",
      name: "Beras Pandan Wangi 5kg",
      category: "Sembako",
      price: 78000,
      discount: 0,
      lastMonthPrice: 78000, // = Stabil
      defaultUnit: "kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-4",
      name: "Cimory Fresh Milk Full Cream 950ml",
      category: "Minuman",
      price: 21500,
      discount: 0.12,
      lastMonthPrice: 22000, // ⬇︎ Turun
      defaultUnit: "liter",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-5",
      name: "Sedaap Goreng Rasa Ayam Krispi 88g",
      category: "Mie & Instan",
      price: 3200,
      discount: 0,
      lastMonthPrice: 3200, // = Stabil
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-6",
      name: "Telur Puyuh Segar Pack 20 Butir",
      category: "Sembako",
      price: 12000,
      discount: 0,
      lastMonthPrice: 11000, // ⬆ Naik
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-7",
      name: "Bawang Merah Brebes Pack 250g",
      category: "Dapur & Masak",
      price: 13500,
      discount: 0.05,
      lastMonthPrice: 16000, // ⬇︎ Turun
      defaultUnit: "gram",
      image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "mid-8",
      name: "Deterjen Daia Putih 850g",
      category: "Kebersihan",
      price: 18500,
      discount: 0.20,
      lastMonthPrice: 18500, // = Stabil
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80"
    }
  ],

  "Family Mart": [
    {
      id: "fm-1",
      name: "FamiCafe Kopi Susu Keluarga",
      category: "Minuman",
      price: 15000,
      discount: 0.20,
      lastMonthPrice: 15000, // = Stabil
      defaultUnit: "cup",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-2",
      name: "FamilyMart Crispy Chicken Original",
      category: "Snack",
      price: 17000,
      discount: 0.15,
      lastMonthPrice: 16000, // ⬆ Naik
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-3",
      name: "Onigiri Salmon Mayo",
      category: "Sembako",
      price: 14000,
      discount: 0,
      lastMonthPrice: 14000, // = Stabil
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-4",
      name: "Oden Combo Set (Isi 4)",
      category: "Dapur & Masak",
      price: 24000,
      discount: 0.10,
      lastMonthPrice: 25000, // ⬇︎ Turun
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-5",
      name: "Samyang Hot Chicken Buldak Ramen",
      category: "Mie & Instan",
      price: 22000,
      discount: 0.10,
      lastMonthPrice: 20000, // ⬆ Naik
      defaultUnit: "pcs",
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-6",
      name: "Pocari Sweat Ion Supply 500ml",
      category: "Minuman",
      price: 8500,
      discount: 0,
      lastMonthPrice: 8500, // = Stabil
      defaultUnit: "botol",
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-7",
      name: "Chitato Sapi Panggang 68g",
      category: "Snack",
      price: 11000,
      discount: 0,
      lastMonthPrice: 11000, // = Stabil
      defaultUnit: "pack",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fm-8",
      name: "Tisu Basah Dettol Wipes 10s",
      category: "Kebersihan",
      price: 9500,
      discount: 0,
      lastMonthPrice: 9000, // ⬆ Naik
      defaultUnit: "pack",
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
    this.STORAGE_USER = "groceryin_rantau_user";

    // State
    this.city = "Bandung";
    this.supermarket = "Alfamart";
    this.initialBudget = 300000;
    this.isSessionLocked = false;
    this.userAccount = null; // { name, email, avatar, method }

    this.cart = []; // [{ id, cartItemId, name, price, unit, quantity, discountMode, discountValue, finalPrice, totalPrice, image, supermarket }]
    this.history = []; // [{ id, date, store, city, totalSpent, initialBudget, items: [] }]
    
    this.currentTab = "store"; // store, list, history
    this.currentCategory = "ALL";

    // Add/Edit Item Modal State
    this.modalProductId = null;
    this.editingCartItemId = null;
    this.modalUnit = "pcs";
    this.modalQuantity = 1;
    this.modalDiscountMode = "percent"; // "percent" | "nominal"
    this.modalDiscountValue = 0; // percent (0-100) or nominal rupiah

    // PWA deferred prompt
    this.deferredInstallPrompt = null;

    this.initDOM();
    this.initPWA();
    this.initEvents();
    this.loadState();
  }

  // ==================== PWA INITIALIZATION & INSTALL EVENT ====================
  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('📱 GroceryIn PWA SW Registered:', reg.scope))
          .catch(err => console.warn('PWA SW error:', err));
      });
    }

    // Capture native PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      console.log('📲 PWA beforeinstallprompt captured!');
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.showToast('🎉', 'GroceryIn berhasil dipasang di layar handphone Anda!');
    });
  }

  // ==================== DOM BINDING ====================
  initDOM() {
    // Header
    this.displayStoreName = document.getElementById("displayStoreName");
    this.displayStoreCity = document.getElementById("displayStoreCity");
    this.headerUserBadge = document.getElementById("headerUserBadge");
    this.headerUserName = document.getElementById("headerUserName");
    this.headerUserAvatar = document.getElementById("headerUserAvatar");
    this.btnHeaderInstall = document.getElementById("btnHeaderInstall");
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

    // Setup Modal & Lobby Auth
    this.setupModalOverlay = document.getElementById("setupModalOverlay");
    this.lobbyInstallBanner = document.getElementById("lobbyInstallBanner");
    this.btnLobbyInstallNow = document.getElementById("btnLobbyInstallNow");
    
    this.setupAuthBox = document.getElementById("setupAuthBox");
    this.authUnauthenticatedView = document.getElementById("authUnauthenticatedView");
    this.authAuthenticatedView = document.getElementById("authAuthenticatedView");
    this.inputAuthUsername = document.getElementById("inputAuthUsername");
    this.inputAuthEmail = document.getElementById("inputAuthEmail");
    this.btnSignInEmail = document.getElementById("btnSignInEmail");
    this.btnSignInGoogle = document.getElementById("btnSignInGoogle");
    this.userCardAvatar = document.getElementById("userCardAvatar");
    this.userAvatarText = document.getElementById("userAvatarText");
    this.userCardName = document.getElementById("userCardName");
    this.userCardEmail = document.getElementById("userCardEmail");
    this.btnSwitchAccount = document.getElementById("btnSwitchAccount");

    this.selectCity = document.getElementById("selectCity");
    this.selectSupermarket = document.getElementById("selectSupermarket");
    this.inputInitialBudget = document.getElementById("inputInitialBudget");
    this.btnConfirmSetup = document.getElementById("btnConfirmSetup");
    this.btnConfirmText = document.getElementById("btnConfirmText");

    // Add Item Modal Elements
    this.addItemModalOverlay = document.getElementById("addItemModalOverlay");
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

    // Install Modal Elements
    this.installModalOverlay = document.getElementById("installModalOverlay");
    this.btnCloseInstallModal = document.getElementById("btnCloseInstallModal");
    this.btnCloseInstallSuccess = document.getElementById("btnCloseInstallSuccess");
    this.btnTriggerNativeInstall = document.getElementById("btnTriggerNativeInstall");
    this.btnDownloadApkShortcut = document.getElementById("btnDownloadApkShortcut");
    this.tabGuideAndroid = document.getElementById("tabGuideAndroid");
    this.tabGuideIOS = document.getElementById("tabGuideIOS");
    this.tabGuideQR = document.getElementById("tabGuideQR");
    this.guideAndroidContent = document.getElementById("guideAndroidContent");
    this.guideIOSContent = document.getElementById("guideIOSContent");
    this.guideQRContent = document.getElementById("guideQRContent");
    this.qrContainer = document.getElementById("qrContainer");
    this.qrUrlText = document.getElementById("qrUrlText");

    // Google Auth Modal Elements
    this.googleAuthModalOverlay = document.getElementById("googleAuthModalOverlay");
    this.btnCancelGoogleAuth = document.getElementById("btnCancelGoogleAuth");
    this.btnCustomGoogleAccount = document.getElementById("btnCustomGoogleAccount");
    this.customGoogleForm = document.getElementById("customGoogleForm");
    this.inputGoogleName = document.getElementById("inputGoogleName");
    this.inputGoogleEmail = document.getElementById("inputGoogleEmail");
    this.btnSubmitCustomGoogle = document.getElementById("btnSubmitCustomGoogle");

    // Receipt Modal
    this.receiptModalBackdrop = document.getElementById("receiptModalBackdrop");
    this.receiptStoreHeader = document.getElementById("receiptStoreHeader");
    this.receiptCityHeader = document.getElementById("receiptCityHeader");
    this.receiptTimestamp = document.getElementById("receiptTimestamp");
    this.receiptUserName = document.getElementById("receiptUserName");
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
    // 1. Install App Triggers (Header & Lobby)
    if (this.btnHeaderInstall) {
      this.btnHeaderInstall.addEventListener("click", () => this.openInstallModal());
    }
    if (this.lobbyInstallBanner) {
      this.lobbyInstallBanner.addEventListener("click", () => this.openInstallModal());
    }
    if (this.btnLobbyInstallNow) {
      this.btnLobbyInstallNow.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openInstallModal();
      });
    }

    // 2. Install Modal Actions
    if (this.btnCloseInstallModal) {
      this.btnCloseInstallModal.addEventListener("click", () => this.closeInstallModal());
    }
    if (this.btnCloseInstallSuccess) {
      this.btnCloseInstallSuccess.addEventListener("click", () => this.closeInstallModal());
    }
    if (this.btnTriggerNativeInstall) {
      this.btnTriggerNativeInstall.addEventListener("click", () => this.triggerNativeInstallPrompt());
    }
    if (this.btnDownloadApkShortcut) {
      this.btnDownloadApkShortcut.addEventListener("click", () => this.downloadMobileLauncherFile());
    }

    // OS Guide Tab switches
    if (this.tabGuideAndroid) {
      this.tabGuideAndroid.addEventListener("click", () => this.switchInstallGuideTab("android"));
    }
    if (this.tabGuideIOS) {
      this.tabGuideIOS.addEventListener("click", () => this.switchInstallGuideTab("ios"));
    }
    if (this.tabGuideQR) {
      this.tabGuideQR.addEventListener("click", () => this.switchInstallGuideTab("qr"));
    }

    // 3. Lobby Sign In Events
    if (this.btnSignInEmail) {
      this.btnSignInEmail.addEventListener("click", () => this.handleEmailSignIn());
    }
    if (this.btnSignInGoogle) {
      this.btnSignInGoogle.addEventListener("click", () => this.openGoogleAuthModal());
    }
    if (this.btnSwitchAccount) {
      this.btnSwitchAccount.addEventListener("click", () => this.handleSwitchAccount());
    }
    if (this.headerUserBadge) {
      this.headerUserBadge.addEventListener("click", () => {
        this.openSetupModal();
      });
    }

    // Google Modal Actions
    if (this.btnCancelGoogleAuth) {
      this.btnCancelGoogleAuth.addEventListener("click", () => {
        this.googleAuthModalOverlay.classList.add("hidden");
      });
    }
    if (this.btnCustomGoogleAccount) {
      this.btnCustomGoogleAccount.addEventListener("click", () => {
        this.customGoogleForm.classList.toggle("hidden");
      });
    }
    if (this.btnSubmitCustomGoogle) {
      this.btnSubmitCustomGoogle.addEventListener("click", () => {
        const name = this.inputGoogleName.value.trim() || "Pengguna Google";
        const email = this.inputGoogleEmail.value.trim() || "user@gmail.com";
        this.selectGoogleAccount(name, email, null);
      });
    }

    // 4. Setup Modal City & Budget
    this.selectCity.addEventListener("change", () => {
      this.populateSupermarketsForCity(this.selectCity.value);
    });

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

    this.btnConfirmSetup.addEventListener("click", () => this.handleConfirmSetup());
    this.btnLogout.addEventListener("click", () => this.handleLogout());

    // 5. Navigation Tabs
    this.topTabStore.addEventListener("click", () => this.switchTab("store"));
    this.topTabList.addEventListener("click", () => this.switchTab("list"));
    this.topTabHistory.addEventListener("click", () => this.switchTab("history"));

    this.bottomNavStore.addEventListener("click", () => this.switchTab("store"));
    this.bottomNavList.addEventListener("click", () => this.switchTab("list"));
    this.bottomNavHistory.addEventListener("click", () => this.switchTab("history"));

    if (this.btnGoToStore) {
      this.btnGoToStore.addEventListener("click", () => this.switchTab("store"));
    }

    // 6. Category Filter
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

    // 9. Receipt Modal
    this.btnReceiptPrint.addEventListener("click", () => window.print());
    this.btnReceiptClose.addEventListener("click", () => {
      this.receiptModalBackdrop.classList.add("hidden");
      this.switchTab("history");
    });

    // 10. Add Item Modal Events (Satuan, Quantity & Diskon)
    this.initAddItemModalEvents();
  }

  // ==================== MODAL ADD TO LIST EVENTS ====================
  initAddItemModalEvents() {
    // Close modal
    this.btnCloseAddItemModal.addEventListener("click", () => this.closeAddItemModal());
    this.btnCancelAddItem.addEventListener("click", () => this.closeAddItemModal());

    // Unit selection chips
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

    // Discount Mode Toggle (Percent vs Nominal)
    this.btnModePercent.addEventListener("click", () => {
      this.modalDiscountMode = "percent";
      this.btnModePercent.classList.add("active");
      this.btnModeNominal.classList.remove("active");
      this.discountPrefixSymbol.textContent = "%";
      this.discountPresetsContainer.style.display = "flex";
      this.discountFieldHint.textContent = "Masukkan persentase diskon (0-100%).";
      this.inputModalDiscount.placeholder = "0";
      this.recalculateModalPricing();
    });

    this.btnModeNominal.addEventListener("click", () => {
      this.modalDiscountMode = "nominal";
      this.btnModeNominal.classList.add("active");
      this.btnModePercent.classList.remove("active");
      this.discountPrefixSymbol.textContent = "Rp";
      this.discountPresetsContainer.style.display = "none";
      this.discountFieldHint.textContent = "Masukkan potongan rupiah langsung per satuan.";
      this.inputModalDiscount.placeholder = "0";
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
          this.inputModalDiscount.value = val;
          this.modalDiscountValue = parseFloat(val) || 0;
          this.recalculateModalPricing();
        }
      });
    });

    this.inputModalDiscount.addEventListener("input", () => {
      const val = parseFloat(this.inputModalDiscount.value) || 0;
      this.modalDiscountValue = Math.max(0, val);
      
      // Update preset chips active state
      if (this.modalDiscountMode === "percent") {
        let matched = false;
        this.discountPresetsContainer.querySelectorAll(".disc-preset-chip").forEach(chip => {
          const disc = chip.getAttribute("data-disc");
          if (disc !== "custom" && parseFloat(disc) === this.modalDiscountValue) {
            chip.classList.add("active");
            matched = true;
          } else {
            chip.classList.remove("active");
          }
        });
        if (!matched) {
          const customChip = this.discountPresetsContainer.querySelector('[data-disc="custom"]');
          if (customChip) customChip.classList.add("active");
        }
      }
      this.recalculateModalPricing();
    });

    // Confirm button
    this.btnConfirmAddItem.addEventListener("click", () => this.handleConfirmAddItem());
  }

  // ==================== STATE MANAGEMENT & LOAD ====================
  loadState() {
    // 1. Load User Account
    this.loadUserState();

    // 2. Load Session (Store & Budget)
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

    // 3. Load Cart
    const savedCart = localStorage.getItem(this.STORAGE_CART);
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }

    // 4. Load History
    const savedHistory = localStorage.getItem(this.STORAGE_HISTORY);
    if (savedHistory) {
      try {
        this.history = JSON.parse(savedHistory);
      } catch (e) {
        this.history = [];
      }
    }

    // 5. Update Header Displays
    this.displayStoreName.textContent = this.supermarket;
    this.displayStoreCity.textContent = this.city;

    // 6. Initial Render
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
    this.renderHistory();
    this.switchTab("store");
  }

  // ==================== USER AUTH & PROFILE LOGIC ====================
  loadUserState() {
    const savedUser = localStorage.getItem(this.STORAGE_USER);
    if (savedUser) {
      try {
        this.userAccount = JSON.parse(savedUser);
      } catch (e) {
        this.userAccount = null;
      }
    }

    this.renderUserAccountUI();
  }

  renderUserAccountUI() {
    if (this.userAccount && this.userAccount.name) {
      // Authenticated view in Lobby
      this.authUnauthenticatedView.classList.add("hidden");
      this.authAuthenticatedView.classList.remove("hidden");
      this.userCardName.textContent = this.userAccount.name;
      this.userCardEmail.textContent = this.userAccount.email || "Akun Terhubung";

      if (this.userAccount.avatar && this.userAccount.avatar.startsWith("http")) {
        this.userCardAvatar.innerHTML = `<img src="${this.userAccount.avatar}" alt="Avatar">`;
        this.headerUserAvatar.innerHTML = `<img src="${this.userAccount.avatar}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
      } else {
        const initial = this.userAccount.name.charAt(0).toUpperCase();
        this.userCardAvatar.innerHTML = `<span>${initial}</span>`;
        this.headerUserAvatar.innerHTML = `<span>${initial}</span>`;
      }

      // Header User Badge
      this.headerUserName.textContent = this.userAccount.name.split(" ")[0];
    } else {
      // Unauthenticated view
      this.authUnauthenticatedView.classList.remove("hidden");
      this.authAuthenticatedView.classList.add("hidden");
      this.headerUserName.textContent = "Sign In";
      this.headerUserAvatar.textContent = "👤";
    }
  }

  handleEmailSignIn() {
    const username = this.inputAuthUsername.value.trim();
    const email = this.inputAuthEmail.value.trim();

    if (!username) {
      alert("Silakan masukkan username Anda terlebih dahulu.");
      this.inputAuthUsername.focus();
      return;
    }

    this.userAccount = {
      name: username,
      email: email || `${username.toLowerCase().replace(/\s+/g, '')}@rantau.id`,
      avatar: null,
      method: "email"
    };

    localStorage.setItem(this.STORAGE_USER, JSON.stringify(this.userAccount));
    this.renderUserAccountUI();
    this.showToast("👋", `Selamat datang, ${this.userAccount.name}!`);
  }

  openGoogleAuthModal() {
    this.googleAuthModalOverlay.classList.remove("hidden");
  }

  selectGoogleAccount(name, email, avatarUrl) {
    this.userAccount = {
      name: name,
      email: email,
      avatar: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      method: "google"
    };

    localStorage.setItem(this.STORAGE_USER, JSON.stringify(this.userAccount));
    this.googleAuthModalOverlay.classList.add("hidden");
    this.renderUserAccountUI();
    this.showToast("✅", `Sign in Google berhasil (${name})!`);
  }

  handleSwitchAccount() {
    if (confirm("Ganti atau keluar dari akun saat ini?")) {
      this.userAccount = null;
      localStorage.removeItem(this.STORAGE_USER);
      this.renderUserAccountUI();
      this.showToast("👋", "Silakan sign in kembali.");
    }
  }

  // ==================== PWA INSTALLATION TO PHONE ====================
  openInstallModal() {
    this.renderQRCodeForMobile();
    this.installModalOverlay.classList.remove("hidden");
  }

  closeInstallModal() {
    this.installModalOverlay.classList.add("hidden");
  }

  switchInstallGuideTab(os) {
    [this.tabGuideAndroid, this.tabGuideIOS, this.tabGuideQR].forEach(t => t.classList.remove("active"));
    [this.guideAndroidContent, this.guideIOSContent, this.guideQRContent].forEach(c => c.classList.add("hidden"));

    if (os === "android") {
      this.tabGuideAndroid.classList.add("active");
      this.guideAndroidContent.classList.remove("hidden");
    } else if (os === "ios") {
      this.tabGuideIOS.classList.add("active");
      this.guideIOSContent.classList.remove("hidden");
    } else if (os === "qr") {
      this.tabGuideQR.classList.add("active");
      this.guideQRContent.classList.remove("hidden");
    }
  }

  triggerNativeInstallPrompt() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast("📲", "Memasang GroceryIn ke layar handphone Anda...");
          this.closeInstallModal();
        } else {
          this.showToast("ℹ️", "Pemasangan dibatalkan.");
        }
        this.deferredInstallPrompt = null;
      });
    } else {
      // If native deferred prompt is not directly supported in this browser session,
      // trigger direct file download and show guided instructions!
      this.downloadMobileLauncherFile();
      this.showToast("📲", "File launcher terdownload langsung ke HP Anda! Ikuti panduan layar.");
    }
  }

  /**
   * Menghasilkan file launcher / WebAPK langsung untuk terdownload di HP pengguna
   */
  downloadMobileLauncherFile() {
    const appUrl = window.location.href;
    const shortcutHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GroceryIn</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <link rel="icon" href="${new URL('icons/icon-192.png', appUrl).href}">
  <style>
    body { background: #0D0D0D; color: #FFF; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .loader { border: 4px solid #222; border-top: 4px solid #DC2626; border-radius: 50%; width: 44px; height: 44px; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader"></div>
  <h2>Membuka GroceryIn di HP Anda...</h2>
  <script>
    window.location.href = "${appUrl}";
  </script>
</body>
</html>`;

    // 1. Download Mobile HTML Shortcut
    const blobHtml = new Blob([shortcutHtml], { type: "text/html" });
    const urlHtml = URL.createObjectURL(blobHtml);
    const linkHtml = document.createElement("a");
    linkHtml.href = urlHtml;
    linkHtml.download = "GroceryIn-Mobile.html";
    document.body.appendChild(linkHtml);
    linkHtml.click();
    document.body.removeChild(linkHtml);

    // 2. Also simulate Android WebAPK download
    const apkBlob = new Blob([shortcutHtml], { type: "application/vnd.android.package-archive" });
    const urlApk = URL.createObjectURL(apkBlob);
    const linkApk = document.createElement("a");
    linkApk.href = urlApk;
    linkApk.download = "GroceryIn-App.apk";
    document.body.appendChild(linkApk);
    linkApk.click();
    document.body.removeChild(linkApk);

    this.showToast("📥", "File launcher GroceryIn siap di HP! Buka dari folder Download HP.");
  }

  renderQRCodeForMobile() {
    const currentUrl = window.location.href;
    if (this.qrUrlText) {
      this.qrUrlText.textContent = currentUrl;
    }
    if (this.qrContainer) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
      this.qrContainer.innerHTML = `<img src="${qrApiUrl}" alt="Scan QR Code GroceryIn" onerror="this.outerHTML='<div style=\\'padding:20px;color:#000;background:#fff;border-radius:8px;font-size:12px;\\'>📱 Buka tautan berikut di HP Anda: <br><strong>${currentUrl}</strong></div>'">`;
    }
  }

  // ==================== SETUP MODAL LOBBY LOGIC ====================
  openSetupModal() {
    this.setupModalOverlay.classList.remove("hidden");
    this.populateSupermarketsForCity(this.selectCity.value);
    this.renderUserAccountUI();
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

      this.btnConfirmText.textContent = "Mulai Belanja & Unduh Katalog";
      this.btnConfirmSetup.disabled = false;
      this.setupModalOverlay.classList.add("hidden");

      this.updateBudgetAndCartUI();
      this.renderStoreProducts();
      this.renderCartList();
      this.switchTab("store");

      this.showToast("✅", `Katalog ${this.supermarket} (${this.city}) siap! Budget: ${this.formatRupiah(this.initialBudget)}`);
    }, 400);
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

  // ==================== CALCULATION & LIVE BUDGET ====================
  getTotalCartPrice() {
    return this.cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  }

  getTotalDiscountSaved() {
    return this.cart.reduce((sum, item) => {
      const gross = item.price * item.quantity;
      const net = item.finalPrice * item.quantity;
      return sum + Math.max(0, gross - net);
    }, 0);
  }

  getRemainingBudget() {
    return this.initialBudget - this.getTotalCartPrice();
  }

  getDynamicBudgetColor(totalSpent, budget) {
    if (budget <= 0) return "#EF4444";
    const ratio = Math.min(1.0, totalSpent / budget);

    let r, g, b;
    if (ratio <= 0.6) {
      // Interpolate from Green (34, 197, 94) to Amber (245, 158, 11)
      const t = ratio / 0.6;
      r = Math.round(34 + (245 - 34) * t);
      g = Math.round(197 + (158 - 197) * t);
      b = Math.round(94 + (11 - 94) * t);
    } else {
      // Interpolate from Amber (245, 158, 11) to Crimson Red (239, 68, 68)
      const t = (ratio - 0.6) / 0.4;
      r = Math.round(245 + (239 - 245) * t);
      g = Math.round(158 + (68 - 158) * t);
      b = Math.round(11 + (68 - 11) * t);
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
      this.liveBudgetPill.style.background = "rgba(220, 38, 38, 0.25)";
      this.liveBudgetPill.style.borderColor = "#DC2626";
      this.headerRemainingBudget.style.color = "#EF4444";
    } else if (remaining < this.initialBudget * 0.2) {
      this.liveBudgetPill.style.background = "rgba(245, 158, 11, 0.2)";
      this.liveBudgetPill.style.borderColor = "#F59E0B";
      this.headerRemainingBudget.style.color = "#F59E0B";
    } else {
      this.liveBudgetPill.style.background = "#1A1A1E";
      this.liveBudgetPill.style.borderColor = "#3F3F46";
      this.headerRemainingBudget.style.color = "#FFFFFF";
    }

    // 2. Tab Badges
    this.listBadgeCount.textContent = totalItems;
    if (totalItems > 0) {
      this.bottomNavListBadge.classList.remove("hidden");
      this.bottomNavListBadge.textContent = totalItems;
    } else {
      this.bottomNavListBadge.classList.add("hidden");
    }

    // 3. List Bottom Summary Bar Styling
    this.listTotalPriceText.textContent = this.formatRupiah(totalSpent);
    const dynamicColor = this.getDynamicBudgetColor(totalSpent, this.initialBudget);
    this.listTotalPriceText.style.color = dynamicColor;

    if (totalSpent >= this.initialBudget) {
      this.listBudgetStatusText.textContent = "🚨 Budget Habis! Hapus item untuk beli barang lain.";
      this.listBudgetStatusText.style.color = "#EF4444";
    } else if (totalSpent >= this.initialBudget * 0.8) {
      this.listBudgetStatusText.textContent = `⚠️ Mendekati limit saku (${Math.round((totalSpent / this.initialBudget) * 100)}% terpakai)`;
      this.listBudgetStatusText.style.color = "#F59E0B";
    } else {
      this.listBudgetStatusText.textContent = `✅ Aman (${Math.round((totalSpent / this.initialBudget) * 100)}% terpakai)`;
      this.listBudgetStatusText.style.color = "#22C55E";
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
  renderStoreProducts() {
    const products = MASTER_CATALOG[this.supermarket] || MASTER_CATALOG["Alfamart"];
    const filtered = products.filter(p => this.currentCategory === "ALL" || p.category === this.currentCategory);

    const remainingBudget = this.getRemainingBudget();

    let html = "";
    filtered.forEach(item => {
      const hasDiscount = item.discount > 0;
      const discountPercent = Math.round(item.discount * 100);
      const harga2 = hasDiscount ? Math.round(item.price * (1 - item.discount)) : item.price;

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

          <div class="product-price-block">
            <div class="price-calculation-row">
              <span class="product-price-original ${hasDiscount ? 'has-discount' : ''}">
                ${this.formatRupiah(item.price)}
              </span>
              ${hasDiscount ? `<span class="product-price-final">${this.formatRupiah(harga2)}</span>` : ''}
              <span class="price-fluctuation-emote ${emoteClass}" title="Dibanding bulan lalu ${this.formatRupiah(item.lastMonthPrice)}">${emoteSymbol}</span>
            </div>
          </div>

          <!-- Klik + Add to list: sekarang membuka modal penentuan satuan, qty, dan diskon! -->
          <button type="button" class="btn-add-to-list" 
                  onclick="app.openAddItemModal('${item.id}')" 
                  ${!canAfford ? 'disabled title="Budget tidak mencukupi untuk membeli barang ini"' : ''}>
            <span>+ Add to list</span>
          </button>
        </div>
      `;
    });

    this.productTilesContainer.innerHTML = html;
  }

  // ==================== ADD TO LIST MODAL (SATUAN, QUANTITY, DISKON) ====================
  openAddItemModal(productId, editCartItem = null) {
    const products = MASTER_CATALOG[this.supermarket] || MASTER_CATALOG["Alfamart"];
    const product = products.find(p => p.id === productId);
    if (!product && !editCartItem) return;

    const targetItem = product || editCartItem;
    this.modalProductId = productId;
    this.editingCartItemId = editCartItem ? editCartItem.cartItemId : null;

    // Header info
    this.modalProductName.textContent = targetItem.name;
    this.modalProductImg.src = targetItem.image;
    this.modalProductCategory.textContent = targetItem.category || "Grocery";
    this.modalProductBasePrice.textContent = `${this.formatRupiah(targetItem.price)} / satuan`;

    // 1. Initial Satuan
    let initialUnit = editCartItem ? editCartItem.unit : (targetItem.defaultUnit || "pcs");
    this.modalUnit = initialUnit;

    const commonUnits = ["pcs", "kg", "gram", "liter", "ml", "pack", "botol", "ikat"];
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
      this.modalDiscountValue = editCartItem.discountValue !== undefined ? editCartItem.discountValue : Math.round((editCartItem.discount || 0) * 100);
    } else {
      this.modalDiscountMode = "percent";
      this.modalDiscountValue = Math.round((targetItem.discount || 0) * 100);
    }

    // Discount mode tab UI
    if (this.modalDiscountMode === "percent") {
      this.btnModePercent.classList.add("active");
      this.btnModeNominal.classList.remove("active");
      this.discountPrefixSymbol.textContent = "%";
      this.discountPresetsContainer.style.display = "flex";
      this.discountFieldHint.textContent = "Masukkan persentase diskon (0-100%).";

      let matchedPreset = false;
      this.discountPresetsContainer.querySelectorAll(".disc-preset-chip").forEach(chip => {
        const disc = chip.getAttribute("data-disc");
        if (disc !== "custom" && parseFloat(disc) === this.modalDiscountValue) {
          chip.classList.add("active");
          matchedPreset = true;
        } else {
          chip.classList.remove("active");
        }
      });
      if (!matchedPreset) {
        const customChip = this.discountPresetsContainer.querySelector('[data-disc="custom"]');
        if (customChip) customChip.classList.add("active");
      }
    } else {
      this.btnModeNominal.classList.add("active");
      this.btnModePercent.classList.remove("active");
      this.discountPrefixSymbol.textContent = "Rp";
      this.discountPresetsContainer.style.display = "none";
      this.discountFieldHint.textContent = "Masukkan potongan rupiah langsung per satuan.";
    }

    this.inputModalDiscount.value = this.modalDiscountValue;

    // Modal Title & Confirm Button Text
    if (editCartItem) {
      this.addItemModalTitle.textContent = "Ubah Rincian Barang";
      this.btnConfirmAddItemText.textContent = "💾 Simpan Perubahan";
    } else {
      this.addItemModalTitle.textContent = "Tambah ke List Belanja";
      this.btnConfirmAddItemText.textContent = "🛒 Masukkan ke List";
    }

    this.recalculateModalPricing();
    this.addItemModalOverlay.classList.remove("hidden");
  }

  closeAddItemModal() {
    this.addItemModalOverlay.classList.add("hidden");
    this.modalProductId = null;
    this.editingCartItemId = null;
  }

  recalculateModalPricing() {
    const products = MASTER_CATALOG[this.supermarket] || MASTER_CATALOG["Alfamart"];
    let product = products.find(p => p.id === this.modalProductId);
    if (!product && this.editingCartItemId) {
      product = this.cart.find(it => it.cartItemId === this.editingCartItemId);
    }
    if (!product) return;

    const basePrice = product.price;
    const qty = Math.max(1, this.modalQuantity);

    // Calculate discount per unit
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

    // Calculate budget check
    // If editing existing item, temporarily refund its current cost
    let availableBudget = this.getRemainingBudget();
    if (this.editingCartItemId) {
      const existingItem = this.cart.find(it => it.cartItemId === this.editingCartItemId);
      if (existingItem) {
        availableBudget += (existingItem.finalPrice * existingItem.quantity);
      }
    }

    const remainingAfter = availableBudget - subtotal;
    const canAfford = remainingAfter >= 0;

    // Update UI elements
    this.discountCalculatedPreview.textContent = `-${this.formatRupiah(discountPerUnit)} / ${this.modalUnit}`;
    this.modalSummaryOriginalPrice.textContent = `${this.formatRupiah(totalOriginal)} (${this.formatRupiah(basePrice)} x ${qty} ${this.modalUnit})`;
    this.modalSummaryDiscountAmount.textContent = totalDiscountSaved > 0 ? `-${this.formatRupiah(totalDiscountSaved)}` : "Rp 0";
    this.modalSummaryFinalTotal.textContent = this.formatRupiah(subtotal);
    this.modalSummaryRemainingBudget.textContent = this.formatRupiah(Math.max(0, remainingAfter));

    if (!canAfford) {
      this.modalBudgetWarningBanner.classList.remove("hidden");
      this.modalBudgetWarningBanner.textContent = `⚠️ Melebihi sisa budget saku! Sisa saat ini: ${this.formatRupiah(availableBudget)}.`;
      this.btnConfirmAddItem.disabled = true;
    } else {
      this.modalBudgetWarningBanner.classList.add("hidden");
      this.btnConfirmAddItem.disabled = false;
    }

    if (this.editingCartItemId) {
      this.btnConfirmAddItemText.textContent = `💾 Simpan (${this.formatRupiah(subtotal)})`;
    } else {
      this.btnConfirmAddItemText.textContent = `🛒 Masukkan ke List (${this.formatRupiah(subtotal)})`;
    }
  }

  handleConfirmAddItem() {
    const products = MASTER_CATALOG[this.supermarket] || MASTER_CATALOG["Alfamart"];
    let product = products.find(p => p.id === this.modalProductId);
    if (!product && this.editingCartItemId) {
      product = this.cart.find(it => it.cartItemId === this.editingCartItemId);
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

    // Check affordability
    let availableBudget = this.getRemainingBudget();
    if (this.editingCartItemId) {
      const existing = this.cart.find(it => it.cartItemId === this.editingCartItemId);
      if (existing) availableBudget += (existing.finalPrice * existing.quantity);
    }

    if (availableBudget < subtotal) {
      this.showToast("⚠️", `Budget tidak cukup! Sisa budget hanya ${this.formatRupiah(availableBudget)}.`);
      return;
    }

    if (this.editingCartItemId) {
      // Edit existing item
      const itemIndex = this.cart.findIndex(it => it.cartItemId === this.editingCartItemId);
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
      // Add new item to cart
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
        image: product.image,
        supermarket: this.supermarket
      });
      this.showToast("🛒", `+${qty} ${this.modalUnit} "${product.name}" dimasukkan ke list.`);
    }

    this.saveCart();
    this.closeAddItemModal();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  // ==================== CART ACTIONS (Stepper, Direct Edit, Delete) ====================
  updateItemQuantity(cartItemId, newQty) {
    const index = this.cart.findIndex(it => it.cartItemId === cartItemId || it.id === cartItemId);
    if (index === -1) return;

    const item = this.cart[index];
    const parsedQty = parseInt(newQty, 10);

    if (isNaN(parsedQty) || parsedQty <= 0) {
      this.removeItemFromCart(cartItemId);
      return;
    }

    const currentQty = item.quantity;
    const diff = parsedQty - currentQty;

    if (diff > 0) {
      const costAddition = diff * item.finalPrice;
      const remainingBudget = this.getRemainingBudget();
      if (remainingBudget < costAddition) {
        this.showToast("⚠️", `Budget saku tidak cukup untuk menambah kuantitas!`);
        this.renderCartList();
        return;
      }
    }

    item.quantity = parsedQty;
    item.totalPrice = item.finalPrice * parsedQty;
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  incrementQuantity(cartItemId) {
    const item = this.cart.find(it => it.cartItemId === cartItemId || it.id === cartItemId);
    if (!item) return;

    const remainingBudget = this.getRemainingBudget();
    if (remainingBudget < item.finalPrice) {
      this.showToast("⚠️", `Budget saku tidak cukup untuk menambah "${item.name}"!`);
      return;
    }

    item.quantity += 1;
    item.totalPrice = item.finalPrice * item.quantity;
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  decrementQuantity(cartItemId) {
    const index = this.cart.findIndex(it => it.cartItemId === cartItemId || it.id === cartItemId);
    if (index === -1) return;

    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity -= 1;
      this.cart[index].totalPrice = this.cart[index].finalPrice * this.cart[index].quantity;
    } else {
      this.cart.splice(index, 1);
    }

    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();
  }

  removeItemFromCart(cartItemId) {
    const item = this.cart.find(it => it.cartItemId === cartItemId || it.id === cartItemId);
    if (!item) return;

    this.cart = this.cart.filter(it => it.cartItemId !== cartItemId && it.id !== cartItemId);
    this.saveCart();
    this.updateBudgetAndCartUI();
    this.renderStoreProducts();
    this.renderCartList();

    this.showToast("↩️", `"${item.name}" dihapus. Sisa uang dikembalikan.`);
  }

  saveCart() {
    localStorage.setItem(this.STORAGE_CART, JSON.stringify(this.cart));
  }

  // ==================== TAB 2: RENDER LIST VIEW (LIST2 ITU WARNA MERAH) ====================
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
      const unit = item.unit || "pcs";
      const hasDiscount = (item.price > item.finalPrice);
      const discountSaved = (item.price - item.finalPrice) * item.quantity;

      const discountLabel = item.discountMode === "nominal"
        ? `Hemat ${this.formatRupiah(item.discountValue)}/satuan`
        : `Diskon ${Math.round((item.discount || 0) * 100)}%`;

      html += `
        <div class="list-item-card" data-id="${item.cartItemId || item.id}">
          
          <!-- Top bar with Index, Edit button & X delete button -->
          <div class="list-item-top-header">
            <span class="item-index-label">Item #${index + 1}</span>

            <div class="list-item-actions-top">
              <button type="button" class="btn-edit-item-config" 
                      onclick="app.openAddItemModal('${item.id}', app.cart[${index}])" 
                      title="Ubah Satuan, Qty atau Diskon">
                <span>✏️ Atur</span>
              </button>
              <button type="button" class="btn-remove-item" 
                      onclick="app.removeItemFromCart('${item.cartItemId || item.id}')" 
                      title="Hapus dari list">
                ✕
              </button>
            </div>
          </div>

          <!-- Body: Gambar | Nama, Satuan/Diskon Tags, Harga Total, Stepper -->
          <div class="list-item-body-row">
            <img src="${item.image}" alt="${this.escapeHtml(item.name)}" class="list-item-thumb">
            
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

                <!-- Stepper Kuantitas -->
                <div class="quantity-stepper-box">
                  <button type="button" class="btn-stepper btn-minus" 
                          onclick="app.decrementQuantity('${item.cartItemId || item.id}')" 
                          aria-label="Kurangi kuantitas">−</button>
                  <input type="number" class="input-qty-box" min="1" max="999" 
                         value="${item.quantity}" 
                         onchange="app.updateItemQuantity('${item.cartItemId || item.id}', this.value)" 
                         aria-label="Kuantitas barang">
                  <button type="button" class="btn-stepper btn-plus" 
                          onclick="app.incrementQuantity('${item.cartItemId || item.id}')" 
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
        customerName: this.userAccount ? this.userAccount.name : "Tamu Rantau",
        items: JSON.parse(JSON.stringify(this.cart))
      };

      this.history.unshift(newHistoryEntry);
      localStorage.setItem(this.STORAGE_HISTORY, JSON.stringify(this.history));

      this.showReceiptModal(newHistoryEntry);

      this.cart = [];
      this.saveCart();

      this.updateBudgetAndCartUI();
      this.renderCartList();
      this.renderHistory();
      this.renderStoreProducts();
    }
  }

  showReceiptModal(record) {
    this.receiptStoreHeader.textContent = record.store.toUpperCase();
    this.receiptCityHeader.textContent = `Cabang ${record.city}`;
    if (this.receiptUserName) {
      this.receiptUserName.textContent = record.customerName || (this.userAccount ? this.userAccount.name : "Tamu Rantau");
    }
    
    const d = new Date(record.date);
    this.receiptTimestamp.textContent = `${d.toLocaleDateString("id-ID")} ${d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`;

    let itemsHtml = "";
    record.items.forEach(it => {
      const gross = it.price * it.quantity;
      const net = it.finalPrice * it.quantity;
      const disc = Math.max(0, gross - net);
      const unit = it.unit || "pcs";
      itemsHtml += `
        <div class="r-item-line">
          <div>
            <strong>${this.escapeHtml(it.name)}</strong><br>
            <small>${it.quantity} ${unit} @ ${this.formatRupiah(it.finalPrice)}${disc > 0 ? ` (Hemat: -${this.formatRupiah(disc)})` : ''}</small>
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

      let itemsHtml = "";
      entry.items.forEach(it => {
        const itemTotal = it.finalPrice * it.quantity;
        const unit = it.unit || "pcs";
        itemsHtml += `
          <div class="history-item-row">
            <img src="${it.image}" alt="${this.escapeHtml(it.name)}" class="history-item-thumb">
            <div class="history-item-details">
              <div class="history-item-name">${this.escapeHtml(it.name)}</div>
              <div class="history-item-bottom-info">
                <span class="history-item-price">${this.formatRupiah(itemTotal)}</span>
                <span class="history-qty-tag">[] ${it.quantity} ${unit}</span>
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
    }, 2800);
  }
}

// Global Application Instance
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new SmartGroceryApp();
});
