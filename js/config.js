/**
 * ============================================================================
 * CẤU HÌNH TRUNG TÂM LANDING PAGE KẸO LẠC NAM ĐỊNH - VIỆT ANH SHOP
 * ============================================================================
 * Bảng giá 3 Combo đã được cập nhật chuẩn 100% theo bảng giá chính thức.
 * Bạn có thể chỉnh sửa thêm Số điện thoại, Zalo và Webhook nhận đơn tại mục [contact].
 * ============================================================================
 */

window.SITE_CONFIG = {
  isPrototypePricing: false,
  brandName: "Việt Anh Shop",
  producerName: "Cơ sở Bánh kẹo Truyền thống Lê Giáp - Lạc Giáp",
  originLabel: "Nam Định",

  contact: {
    hotlineDisplay: "0988.686.868",
    hotlineTel: "0988686868",
    zaloUrl: "https://zalo.me/0988686868",
    address: "Đặc sản Kẹo Lạc Nam Định chính gốc Lê Giáp",
    workingHours: "07:30 - 22:00 (Tất cả các ngày trong tuần)",
    // Dán URL Google Apps Script Web App nếu muốn tự động đổ đơn về Google Sheet:
    orderWebhookUrl: ""
  },

  // Bảng giá 3 Combo chính thức (Thứ tự đúng theo ảnh bảng giá: Combo 3 gói -> Combo 6 gói -> Combo 5 gói)
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
