/**
 * ============================================================================
 * CẤU HÌNH TRUNG TÂM LANDING PAGE KẸO LẠC NAM ĐỊNH - VIỆT ANH SHOP
 * ============================================================================
 * Bạn chỉ cần sửa thông tin ở mục [1. THÔNG TIN CẦN THAY THẾ] bên dưới
 * (Giá bán, Số điện thoại, Zalo, Địa chỉ, Webhook nhận đơn).
 * Giao diện toàn trang và Form đặt hàng sẽ tự động cập nhật theo!
 * ============================================================================
 */

window.SITE_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. THÔNG TIN CẦN THAY THẾ (ĐANG ĐỂ MẪU PROTOTYPE - HÃY CẬP NHẬT SỐ THẬT)
  // --------------------------------------------------------------------------
  isPrototypePricing: true, // Đổi thành false sau khi bạn đã điền giá & SĐT thật
  brandName: "Việt Anh Shop",
  producerName: "Cơ sở Bánh kẹo Truyền thống Lê Giáp - Lạc Giáp",
  originLabel: "Nam Định",

  contact: {
    hotlineDisplay: "0988.686.868",
    hotlineTel: "0988686868",
    zaloUrl: "https://zalo.me/0988686868",
    address: "Làng nghề truyền thống Nam Định - Phân phối toàn quốc bởi Việt Anh Shop",
    workingHours: "07:30 - 22:00 (Tất cả các ngày trong tuần)",
    // Dán URL Google Apps Script Web App hoặc Make/Zapier Webhook để tự động đổ đơn về Google Sheet:
    orderWebhookUrl: ""
  },

  // Bảng giá 3 Combo (Cấu trúc gói & quà tặng lấy chuẩn 100% từ bộ ảnh gốc; Giá tiền đang để mẫu hợp lý)
  combos: [
    {
      id: "combo-5-goi-200g",
      code: "CB5-200",
      badge: "Combo Thử Vị Quà Quê",
      featured: false,
      title: "Combo 5 Gói Kẹo Sìu Châu 200g",
      subtitle: "Tinh hoa Sìu Châu giòn tan quyện mạch nha trong vắt",
      mainPackText: "5 gói Kẹo Sìu Châu Loại Đặc Biệt (200g/gói)",
      giftText: "Tặng ngay 1 gói Kẹo Dồi Lạc Vừng 200g",
      giftShort: "+ Tặng 1 gói 200g",
      totalPacksText: "Tổng nhận: 6 gói (1,2 kg kẹo đặc sản)",
      totalWeightGrams: 1200,
      salePrice: 165000,
      originalPrice: 210000,
      freeShip: true,
      mainImage: "./assets/images/combo-5-goi-200g.webp",
      giftImage: "./assets/images/gift-1-goi-200g.webp",
      perks: [
        "5 gói Sìu Châu Đặc Biệt 200g mới ra lò",
        "Tặng kèm 1 gói Kẹo Dồi Lạc Vừng 200g",
        "Miễn phí giao hàng tận nhà toàn quốc"
      ]
    },
    {
      id: "combo-3-goi-500g",
      code: "CB3-500",
      badge: "Được Chọn Nhiều Nhất",
      featured: true,
      title: "Combo 3 Gói Kẹo Lạc Vừng 500g",
      subtitle: "Gói lớn gia đình thưởng trà, quà tặng đầy đặn tròn vị",
      mainPackText: "3 gói lớn Kẹo Lạc Vừng Lạc Giáp (500g/gói)",
      giftText: "Tặng ngay 2 gói Kẹo Dồi Lạc Vừng 200g",
      giftShort: "+ Tặng 2 gói 200g",
      totalPacksText: "Tổng nhận: 5 gói (1,9 kg kẹo đặc sản)",
      totalWeightGrams: 1900,
      salePrice: 225000,
      originalPrice: 295000,
      freeShip: true,
      mainImage: "./assets/images/combo-3-goi-500g.webp",
      giftImage: "./assets/images/gift-2-goi-200g.webp",
      perks: [
        "3 túi lớn Kẹo Lạc Vừng 500g đóng gói lẻ từng thanh",
        "Tặng kèm 2 gói Kẹo Dồi Lạc Vừng 200g dẻo thơm",
        "Miễn phí ship toàn quốc - Kiểm hàng trước khi nhận"
      ]
    },
    {
      id: "combo-6-goi-500g",
      code: "CB6-500",
      badge: "Tiết Kiệm Nhất Cho Biếu Tặng",
      featured: false,
      title: "Combo 6 Gói Kẹo Lạc Vừng 500g",
      subtitle: "Trọn bộ quà biếu họ hàng, cơ quan và tiếp khách quý",
      mainPackText: "6 gói lớn Kẹo Lạc Vừng Lạc Giáp (500g/gói)",
      giftText: "Tặng ngay 3 gói Kẹo Dồi Lạc Vừng 200g",
      giftShort: "+ Tặng 3 gói 200g",
      totalPacksText: "Tổng nhận: 9 gói (3,6 kg kẹo đặc sản)",
      totalWeightGrams: 3600,
      salePrice: 420000,
      originalPrice: 585000,
      freeShip: true,
      mainImage: "./assets/images/combo-6-goi-500g.webp",
      giftImage: "./assets/images/gift-3-goi-200g.webp",
      perks: [
        "6 túi lớn Kẹo Lạc Vừng 500g chuẩn vị truyền thống",
        "Tặng kèm 3 gói Kẹo Dồi Lạc Vừng 200g cao cấp",
        "Ưu tiên đóng thùng chống sốc & Miễn phí ship toàn quốc"
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 2. DỮ LIỆU SẢN PHẨM ĐÃ XÁC THỰC TỪ BAO BÌ & BỘ ẢNH GỐC (VERIFIED DATA)
  // --------------------------------------------------------------------------
  products: [
    {
      id: "keo-lac-vung",
      name: "Kẹo Lạc Vừng Lạc Giáp",
      weight: "Gói lớn 500g",
      tag: "Đậm đà hương vị truyền thống",
      image: "./assets/images/pack-keo-lac-vung-500g.webp",
      secondaryImage: "./assets/images/macro-keo-lac-gion.webp",
      summary: "Từng thanh kẹo vàng óng kết từ lạc đỏ rang củi thơm bùi, áo đều vừng trắng bóc vỏ và mạch nha nấu khéo. Cắn giòn rụm, ngọt dịu thanh, tuyệt đối không dính răng.",
      tasteNotes: [
        { label: "Cấu trúc", value: "Giòn tan, ráo mặt, bọc túi bóng kính từng thanh" },
        { label: "Hương vị", value: "Bùi béo lạc rang quyện vừng trắng thơm lừng" },
        { label: "Thưởng thức", value: "Tuyệt hảo khi nhâm nhi cùng trà mạn, trà xanh nóng" }
      ]
    },
    {
      id: "keo-doi-lac-vung",
      name: "Kẹo Dồi Lạc Vừng Lê Giáp",
      weight: "Gói tiêu chuẩn 200g",
      tag: "Đặc sản truyền thống Nam Định",
      image: "./assets/images/pack-keo-doi-200g.webp",
      secondaryImage: "./assets/images/thuong-tra-phu-day.webp",
      summary: "Vỏ đường kéo thủ công trắng ngần, xốp mềm thoảng hương vani thanh nhã, ôm trọn phần nhân lạc rang và vừng giòn rụm bên trong. Món quà tuổi thơ gắn liền ký ức quê nhà.",
      tasteNotes: [
        { label: "Cấu trúc", value: "Vỏ đường kéo xốp dẻo, nhân lạc vừng bùi giòn" },
        { label: "Hương vị", value: "Thơm dịu vani mạch nha, ngọt thanh dễ ăn cho cả người lớn tuổi" },
        { label: "Quà tặng kèm", value: "Sản phẩm tặng kèm miễn phí trong cả 3 gói Combo ưu đãi" }
      ]
    },
    {
      id: "keo-siu-chau",
      name: "Kẹo Sìu Châu Loại Đặc Biệt",
      weight: "Gói đặc biệt 200g",
      tag: "Danh bất hư truyền xứ Thành Nam",
      image: "./assets/images/pack-keo-siu-chau-200g.webp",
      secondaryImage: "./assets/images/thanh-keo-cam-tay.webp",
      summary: "Dòng kẹo danh tiếng bậc nhất Nam Định của cơ sở Lê Giáp. Tỷ lệ lạc tuyển chọn hạt mẩy cao vượt trội, phủ lớp mạch nha mỏng trong suốt như hổ phách, giòn tan ngay đầu lưỡi.",
      tasteNotes: [
        { label: "Cấu trúc", value: "Mạch nha mỏng trong vắt, tỷ lệ hạt lạc rang dày đặc" },
        { label: "Hương vị", value: "Đậm vị lạc quê nguyên bản, hậu ngọt sắc nét" },
        { label: "Phù hợp", value: "Làm quà biếu tinh tế, sang trọng chuẩn vị cổ truyền" }
      ]
    }
  ],

  verifiedSpecs: [
    { label: "Hàm lượng Đường", value: "50 - 60%", detail: "Đường kính trắng & mạch nha thanh ngọt tự nhiên" },
    { label: "Hàm lượng Protein", value: "2 - 5%", detail: "Đạm thực vật lành mạnh từ lạc đỏ và vừng trắng" },
    { label: "Độ ẩm tiêu chuẩn", value: "3 - 9%", detail: "Giữ thanh kẹo ráo giòn lâu, không ỉu chảy" },
    { label: "Hạn sử dụng", value: "06 tháng", detail: "Kể từ ngày sản xuất in trên bao bì, không chất bảo quản" }
  ]
};
