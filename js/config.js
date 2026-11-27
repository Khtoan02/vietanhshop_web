/**
 * ============================================================================
 * CẤU HÌNH TRUNG TÂM LANDING PAGE KẸO LẠC NAM ĐỊNH - VIỆT ANH SHOP
 * ============================================================================
 * 1. Bảng giá 3 Combo & Slogan đã được cập nhật chuẩn chính thức.
 * 2. Kết nối Google Sheet:
 *    - File đích: https://docs.google.com/spreadsheets/d/1p5P49tqsOqDQteAplpgLwfa1algZjIwAzbxGa0BNArI/edit#gid=0
 *    - Dán link Web App Apps Script (https://script.google.com/macros/s/.../exec)
 *      vào biến `googleSheet.webhookUrl` ngay bên dưới để đơn & hành vi khách tự đổ về Sheet 24/7.
 * ============================================================================
 */

window.SITE_CONFIG = {
  isPrototypePricing: false,
  brandName: "Việt Anh Shop",
  slogan: "Tết đến cùng chúc nhau Thịnh Vượng",
  producerName: "Cơ sở Bánh kẹo Truyền thống Lê Giáp - Lạc Giáp",
  originLabel: "Nam Định",

  googleSheet: {
    spreadsheetId: "1p5P49tqsOqDQteAplpgLwfa1algZjIwAzbxGa0BNArI",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1p5P49tqsOqDQteAplpgLwfa1algZjIwAzbxGa0BNArI/edit#gid=0",
    webhookUrl:
      "https://script.google.com/macros/s/AKfycbywsLyCuWR2BtJpMLRT_Za3MKBSL9Ouu4Optx6LqAhKOHjCaAzcLKKgwdEoIS9ftRyXvg/exec"
  },

  contact: {
    address: "Đặc sản Kẹo Lạc Nam Định chính gốc Lê Giáp",
    orderWebhookUrl:
      "https://script.google.com/macros/s/AKfycbywsLyCuWR2BtJpMLRT_Za3MKBSL9Ouu4Optx6LqAhKOHjCaAzcLKKgwdEoIS9ftRyXvg/exec"
  },

  // Bảng giá 3 Combo chính thức
  combos: [
    {
      id: "combo-3-goi-500g",
      code: "CB3-500",
      badge: "Combo Gia Đình Thưởng Trà",
      featured: false,
      title: "Combo 3 Gói (500g/gói)",
      productName: "Kẹo Lạc Vừng Lạc Giáp",
      mainPackText: "3 gói Kẹo Lạc Vừng Lạc Giáp (500g/gói)",
      giftText: "Tặng 2 gói Kẹo Dồi 200g",
      giftDetail: "Tặng 2 gói 200g / 1 gói quà",
      giftShort: "+ Tặng 2 gói 200g",
      totalPacksText: "Tổng nhận: 5 gói (1,9 kg kẹo đặc sản)",
      totalWeightGrams: 1900,
      salePrice: 165000,
      originalPrice: null,
      freeShip: true,
      mainImage: "./assets/images/combo-3-goi-500g.webp",
      giftImage: "./assets/images/gift-2-goi-200g.webp"
    },
    {
      id: "combo-6-goi-500g",
      code: "CB6-500",
      badge: "Tiết Kiệm Nhất - Bán Chạy",
      featured: true,
      title: "Combo 6 Gói (500g/gói)",
      productName: "Kẹo Lạc Vừng Lạc Giáp",
      mainPackText: "6 gói Kẹo Lạc Vừng Lạc Giáp (500g/gói)",
      giftText: "Tặng 3 gói Kẹo Dồi 200g",
      giftDetail: "Tặng 3 gói 200g / 1 gói quà",
      giftShort: "+ Tặng 3 gói 200g",
      totalPacksText: "Tổng nhận: 9 gói (3,6 kg) - Lợi hơn 35.000đ",
      totalWeightGrams: 3600,
      salePrice: 295000,
      originalPrice: null,
      freeShip: true,
      mainImage: "./assets/images/combo-6-goi-500g.webp",
      giftImage: "./assets/images/gift-3-goi-200g.webp"
    },
    {
      id: "combo-5-goi-200g",
      code: "CB5-200",
      badge: "Đặc Sản Sìu Châu Loại Đặc Biệt",
      featured: false,
      title: "Combo 5 Gói (200g/gói)",
      productName: "Kẹo Sìu Châu Lê Giáp",
      mainPackText: "5 gói Kẹo Sìu Châu Loại Đặc Biệt (200g/gói)",
      giftText: "Tặng 1 gói Kẹo Dồi 200g",
      giftDetail: "Tặng 1 gói 200g",
      giftShort: "+ Tặng 1 gói 200g",
      totalPacksText: "Tổng nhận: 6 gói (1,2 kg kẹo đặc sản)",
      totalWeightGrams: 1200,
      salePrice: 165000,
      originalPrice: null,
      freeShip: true,
      mainImage: "./assets/images/combo-5-goi-200g.webp",
      giftImage: "./assets/images/gift-1-goi-200g.webp"
    }
  ]
};
