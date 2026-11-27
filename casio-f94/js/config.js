/**
 * ============================================================================
 * CẤU HÌNH SẢN PHẨM ĐƠN LẺ (SINGLE-SKU TECH) - ĐỒNG HỒ CASIO F94
 * Giá bán: 139.000 đ (Miễn phí vận chuyển toàn quốc - Bảo hành 1 đổi 1 30 ngày)
 * Google Sheet 40 cột riêng:
 * https://docs.google.com/spreadsheets/d/1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac/edit#gid=0
 * ============================================================================
 */
window.SITE_CONFIG = {
  isPrototypePricing: false,
  brandName: "Việt Anh Shop",
  productName: "Đồng Hồ Điện Tử Casio F94",
  productVariant: "Phiên bản Vàng - Đen Cổ Điển (F-94WA-8)",
  unitPrice: 139000,
  freeShip: true,
  warrantyText: "Bảo hành đổi mới 1 đổi 1 trong 30 ngày nếu lỗi nhà sản xuất",

  googleSheet: {
    spreadsheetId: "1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac/edit#gid=0",
    // Dán URL Web App Apps Script của file Sheet CASIO F94 tại đây:
    webhookUrl: ""
  },

  contact: {
    hotlineDisplay: "0988.686.868",
    hotlineTel: "0988686868",
    zaloUrl: "https://zalo.me/0988686868",
    address: "Việt Anh Shop - Mở hộp kiểm tra & đeo thử trước khi thanh toán",
    workingHours: "07:30 - 22:00 (Tất cả các ngày trong tuần)",
    orderWebhookUrl: ""
  },

  // Giữ tương thích cấu trúc 1 sản phẩm duy nhất cho bộ đo lường tracker.js
  combos: [
    {
      id: "casio-f94-single",
      code: "CASIO-F94",
      title: "Đồng Hồ Điện Tử Casio F94 (Vàng - Đen)",
      productName: "F-94WA-8",
      salePrice: 139000
    }
  ],

  gallery: [
    {
      id: "studio-front",
      thumbLabel: "Chính diện",
      caption: "Thiết kế mặt vuông cổ điển phối hai đường kẻ vàng thể thao đặc trưng của dòng F-94WA-8",
      src: "/casio-f94/assets/images/f94-01-studio-front.webp"
    },
    {
      id: "lcd-closeup",
      thumbLabel: "Màn hình LCD",
      caption: "Màn hình LCD tương phản cao hiển thị Thứ, Ngày, Giờ, Phút, Giây và vòng tròn Radar góc phải",
      src: "/casio-f94/assets/images/f94-02-lcd-closeup.webp"
    },
    {
      id: "night-led",
      thumbLabel: "Đèn LED đêm",
      caption: "Đèn nền LED xanh cổ điển bật sáng bằng nút LIGHT góc trái giúp xem giờ rõ ràng trong bóng tối",
      src: "/casio-f94/assets/images/f94-03-night-led.webp"
    },
    {
      id: "wrist-daylight",
      thumbLabel: "Khi lên tay",
      caption: "Kiểu dáng Unisex gọn gàng, ôm sát cổ tay, dễ phối cùng áo sơ mi đi làm lẫn trang phục đi học",
      src: "/casio-f94/assets/images/f94-04-wrist-daylight.webp"
    },
    {
      id: "slim-desk",
      thumbLabel: "Độ mỏng 8.5mm",
      caption: "Thân vỏ mỏng chỉ 8.5mm và siêu nhẹ 21g - gõ bàn phím, viết bài cả ngày không vướng cộm",
      src: "/casio-f94/assets/images/f94-05-slim-desk.webp"
    },
    {
      id: "caseback-steel",
      thumbLabel: "Nắp đáy thép",
      caption: "Mặt lưng thép không gỉ (Stainless Steel Back) cố định 4 vít chắc chắn, bền bỉ trước mồ hôi tay",
      src: "/casio-f94/assets/images/f94-07-caseback-steel.webp"
    }
  ],

  anatomyCallouts: [
    {
      num: "01",
      pos: "Nút Trái Trên (LIGHT)",
      title: "Đèn nền LED xem giờ ban đêm",
      desc: "Bấm nhẹ để bật đèn LED xanh chiếu sáng màn hình khi xem giờ trong phòng tối hoặc ngoài trời tối.",
      showNightPreview: true
    },
    {
      num: "02",
      pos: "Nút Trái Dưới (MODE)",
      title: "Chuyển nhanh 4 chế độ thông minh",
      desc: "Bấm tuần tự để chuyển giữa: Xem giờ chuẩn -> Báo thức hằng ngày -> Bấm giờ thể thao 1/100s -> Chỉnh giờ/lịch.",
      showNightPreview: false
    },
    {
      num: "03",
      pos: "Nút Phải (24HR / START-STOP)",
      title: "Đổi định dạng 12H/24H & Bấm giờ",
      desc: "Ở màn hình chính, bấm để đổi giữa giờ 12H (AM/PM) và giờ quân đội 24H. Ở chế độ thể thao, dùng để Bắt đầu/Dừng.",
      showNightPreview: false
    },
    {
      num: "04",
      pos: "Vòng Tròn Radar Góc Phải",
      title: "Bảng báo trạng thái trực quan độc bản",
      desc: "Điểm khác biệt ăn tiền nhất của F94 so với F-91W: báo trực quan Báo thức (AL), Báo giờ chẵn (SIG), Giờ chiều (PM), 24H & Tách vòng (SPL).",
      showNightPreview: false
    },
    {
      num: "05",
      pos: "Màn Hình LCD Phản Quang",
      title: "Nhìn rõ nét ngay dưới nắng gắt",
      desc: "Khác màn hình điện thoại bị lóa ngoài nắng, tấm nền LCD phản quang càng ra ngoài trời sáng càng hiển thị sắc nét trong 0.5 giây.",
      showNightPreview: false
    },
    {
      num: "06",
      pos: "Vỏ Resin 21g & Đáy Thép 4 Vít",
      title: "Nhẹ như không đeo, bền tới ~7 năm pin",
      desc: "Dây nhựa Resin mềm dẻo 9 nấc khóa đi kèm nắp đáy thép không gỉ bảo vệ viên pin CR2016 hoạt động bền bỉ nhiều năm.",
      showNightPreview: false
    }
  ]
};
