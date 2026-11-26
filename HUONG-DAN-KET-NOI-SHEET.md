# Hướng Dẫn Kết Nối Tự Động Đổ Đơn & 38 Chỉ Số Marketing Về Google Sheet

Hệ thống đo lường hành vi (`js/tracker.js`) trên Landing Page đã được lập trình sẵn để thu thập **38 trường dữ liệu** mỗi khi khách hàng để lại Số điện thoại (bao gồm cả **khách đặt hoàn tất** lẫn **khách mới gõ SĐT nhưng thoát trang chưa kịp bấm Đặt mua**) và đổ trực tiếp về file Google Sheet của bạn:

- **Google Sheet đích:** https://docs.google.com/spreadsheets/d/1p5P49tqsOqDQteAplpgLwfa1algZjIwAzbxGa0BNArI/edit#gid=0

## Cách kích hoạt Webhook nhận đơn 24/7 (Chỉ mất 60 giây, miễn phí 100%)

1. **Mở Apps Script trong Google Sheet của bạn:**
   - Mở link Google Sheet ở trên.
   - Trên thanh menu trên cùng, bấm **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
2. **Dán mã kết nối & Tạo bảng tiêu chuẩn:**
   - Xóa vài dòng trống mặc định trong trình soạn thảo, mở file `google-sheets-webhook.gs` trong thư mục Website này, copy toàn bộ nội dung dán vào rồi bấm **Lưu (`Ctrl + S` / `Cmd + S`)**.
   - Trên thanh công cụ Apps Script, chọn hàm `setupSheetStructure` -> Bấm **Chạy (Run)** -> Cấp quyền cho tài khoản Google của bạn.
   - *Ngay lập tức Sheet `gid=0` của bạn sẽ tự động được kẻ bảng 38 cột phân màu 5 nhóm chuyên nghiệp, kèm thêm 1 Tab mới tên là **`Báo Cáo Marketing`** tự động tính Tỷ lệ chốt, Doanh thu, Thời gian đọc trung bình và Thống kê theo từng kênh Facebook / TikTok / Google / Zalo!*
3. **Lấy Link Webhook dán vào Website:**
   - Ở góc trên bên phải Apps Script, bấm nút màu xanh **Triển khai (Deploy)** -> **Tùy chọn triển khai mới (New deployment)**.
   - Bấm biểu tượng bánh răng chọn loại: **Ứng dụng web (Web app)**.
   - Mục *Thực thi dưới dạng (Execute as)*: chọn **Tôi (Me)**.
   - Mục *Ai có quyền truy cập (Who has access)*: bắt buộc chọn **Bất kỳ ai (Anyone)** -> Bấm **Triển khai (Deploy)**.
   - Copy đường dẫn **URL ứng dụng web** (có dạng `https://script.google.com/macros/s/.../exec`), mở file `js/config.js` dán vào dòng `webhookUrl: "DÁN_VÀO_ĐÂY"` (hoặc gửi link đó cho Antigravity để mình dán và push lên GitHub giúp bạn ngay lập tức!).

## Danh sách 38 chỉ số tự động đổ về Google Sheet

1. **Nhóm Đơn hàng & Liên hệ (11 cột):** Thời gian VN, Trạng thái (`ĐẶT HÀNG THÀNH CÔNG` hoặc `ĐỂ LẠI SĐT (CHƯA BẤM ĐẶT)`), Mã đơn, Họ tên, SĐT (giữ nguyên số `0` đầu), Địa chỉ, Ghi chú, Combo chọn, Số lượng, Giá trị đơn, Điểm nhiệt độ Lead (`/100`).
2. **Nhóm Nguồn Marketing & Quảng cáo (9 cột):** Kênh nguồn tự động (`Facebook Ads`, `TikTok Ads`, `Zalo`, `Google`, `Direct`...), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, Mã Click (`fbclid`/`ttclid`/`gclid`), Khách mới hay Khách quay lại (lần mấy), Link đầy đủ lúc vào trang.
3. **Nhóm Mức độ đọc hiểu & Thời gian (8 cột):** Đã đọc hết Landing chưa, % cuộn trang tối đa, Tổng thời gian mở trang, Thời gian tương tác thực tế (Active Time), Số giây từ lúc vào đến lúc gõ SĐT, Các phần đã đọc, Phần dừng lại đọc lâu nhất, Chi tiết số giây đọc từng phần.
4. **Nhóm Hành vi mua sắm & Phân vân (5 cột):** Các gói kẹo đã bấm xem ảnh ở đầu trang, Lịch sử chọn/đổi ý giữa các Combo, Số lần chỉnh số lượng `+/-`, Các nút CTA đã bấm, Hành vi phụ (bấm gọi, mở Zalo, ẩn tab).
5. **Nhóm Thiết bị & Bối cảnh (5 cột):** Thiết bị & Hệ điều hành, App mở link (`Facebook App`, `TikTok App`, `Zalo App`, `Safari`, `Chrome`...), Kích thước màn hình & tốc độ mạng, Khung giờ truy cập (Sáng/Trưa/Chiều/Tối/Đêm), Mã phiên (`Session ID` chống trùng dòng khi khách gõ SĐT trước rồi bấm Đặt mua sau).
