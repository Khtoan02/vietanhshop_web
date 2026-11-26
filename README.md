# Landing Page Kẹo Lạc Nam Định - Việt Anh Shop

Landing Page chuyển đổi cao giới thiệu bộ 3 đặc sản truyền thống Nam Định từ cơ sở sản xuất bánh kẹo **Lê Giáp - Lạc Giáp**:
1. **Kẹo Lạc Vừng Lạc Giáp (Gói 500g)**
2. **Kẹo Dồi Lạc Vừng Lê Giáp (Gói 200g)**
3. **Kẹo Sìu Châu Loại Đặc Biệt Lê Giáp (Gói 200g)**

## Triển khai đa nền tảng (Zero-Build Ready)
Toàn bộ tài nguyên giao diện (`index.html`, CSS đã biên dịch sẵn từ Tailwind v4 tại `assets/css/styles.css`, font tiếng Việt tự lưu trữ tại `assets/fonts/`, GSAP tại `assets/vendor/`, và bộ ảnh sản phẩm nén chuẩn WebP tại `assets/images/`) nằm ngay tại thư mục gốc.

Tương thích tự động khi liên kết Git với mọi Host:
- **cPanel / DirectAdmin / Hostinger Git Deployment** (trỏ thẳng về thư mục gốc)
- **Vercel / Netlify / Cloudflare Pages** (Publish directory: `.`, Build command: để trống hoặc `npm run build:css`)
- **GitHub Pages** (Deploy from branch `main` / `/ (root)`)

## Cách cập nhật Giá bán, Số điện thoại, Zalo & Google Sheet nhận đơn
Mở file `js/config.js` và chỉnh sửa mục `1. THÔNG TIN CẦN THAY THẾ`:
- `isPrototypePricing`: đổi thành `false` sau khi cập nhật bảng giá chính thức.
- `contact.hotlineDisplay`, `contact.hotlineTel`, `contact.zaloUrl`, `contact.address`.
- `contact.orderWebhookUrl`: dán link Google Apps Script Web App để tự động ghi đơn hàng vào Google Sheet.
- `combos`: chỉnh sửa `salePrice` và `originalPrice` của từng Combo, giao diện toàn trang và bộ tính tổng tiền sẽ tự động đồng bộ.

## Phát triển cục bộ (Nếu chỉnh sửa thêm giao diện Tailwind)
```bash
npm install
npm run build:css
```
