/**
 * ============================================================================
 * CẤU HÌNH TRUNG TÂM LANDING PAGE ĐỒNG HỒ CASIO F94 - VIỆT ANH SHOP
 * Giá chính thức: 139.000 đ + Miễn phí vận chuyển toàn quốc
 * Google Sheet riêng đã khởi tạo sẵn 40 cột + Báo Cáo Marketing:
 * https://docs.google.com/spreadsheets/d/1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac/edit#gid=0
 * ============================================================================
 */
window.SITE_CONFIG = {
  isPrototypePricing: false,
  brandName: "Việt Anh Shop",
  productCode: "CASIO F-94WA-8",
  slogan: "Nhẹ Tênh 21g - Bền Bỉ 7 Năm Pin",

  googleSheet: {
    spreadsheetId: "1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac/edit#gid=0",
    // Dán URL Web App Apps Script của file Sheet CASIO F94 tại đây để nhận đơn 24/7:
    webhookUrl: ""
  },

  contact: {
    hotlineDisplay: "0988.686.868",
    hotlineTel: "0988686868",
    zaloUrl: "https://zalo.me/0988686868",
    address: "Phân phối toàn quốc bởi Việt Anh Shop - Kiểm hàng trước khi thanh toán",
    workingHours: "07:30 - 22:00 (Tất cả các ngày trong tuần)",
    orderWebhookUrl: ""
  },

  combos: [
    {
      id: "goi-1-chiec",
      code: "F94-01",
      badge: "Được Chọn Nhiều Nhất",
      featured: true,
      title: "1 Chiếc Casio F94",
      productName: "Phiên bản Vàng - Đen Cổ Điển",
      mainPackText: "01 Đồng hồ điện tử Casio F94 mới nguyên hộp",
      giftText: "Miễn phí ship tận nhà + Pin sẵn theo máy",
      giftShort: "Freeship toàn quốc",
      totalPacksText: "Mở hộp kiểm tra, đeo thử lên tay ưng ý mới thanh toán",
      unitWeightGrams: 21,
      salePrice: 139000,
      originalPrice: null,
      freeShip: true,
      mainImage: "/casio-f94/assets/images/casio-f94-cutout.webp"
    },
    {
      id: "combo-doi-2-chiec",
      code: "F94-02",
      badge: "Combo Đôi Unisex Nam & Nữ",
      featured: false,
      title: "Combo 2 Chiếc",
      productName: "Đeo Cặp - 139.000 đ / chiếc",
      mainPackText: "02 Đồng hồ điện tử Casio F94 Unisex",
      giftText: "Miễn phí ship nhanh + Đóng hộp đôi lịch sự",
      giftShort: "2 chiếc Freeship",
      totalPacksText: "Phù hợp đeo cặp bạn thân, người yêu hoặc anh chị em",
      unitWeightGrams: 42,
      salePrice: 278000,
      originalPrice: null,
      freeShip: true,
      mainImage: "/casio-f94/assets/images/casio-f94-pair.webp"
    },
    {
      id: "combo-nhom-3-chiec",
      code: "F94-03",
      badge: "Combo Gia Đình & Quà Tặng",
      featured: false,
      title: "Combo 3 Chiếc",
      productName: "Nhóm Bạn - 139.000 đ / chiếc",
      mainPackText: "03 Đồng hồ điện tử Casio F94 bền nhẹ",
      giftText: "Miễn phí ship ưu tiên toàn quốc",
      giftShort: "3 chiếc Freeship",
      totalPacksText: "Mua chung nhóm bạn học, đồng nghiệp hoặc làm quà tặng",
      unitWeightGrams: 63,
      salePrice: 417000,
      originalPrice: null,
      freeShip: true,
      mainImage: "/casio-f94/assets/images/casio-f94-trio.webp"
    }
  ]
};
