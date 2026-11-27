/**
 * ============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK - ĐỔ ĐƠN HÀNG & HÀNH VI MARKETING VỀ GOOGLE SHEET
 * Đã cấu hình sẵn cho Google Sheet:
 * https://docs.google.com/spreadsheets/d/1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac/edit#gid=0
 *
 * HƯỚNG DẪN CÀI ĐẶT (CHỈ MẤT 1 PHÚT):
 * 1. Mở file Google Sheet trên -> Trên thanh menu chọn: Tiện ích mở rộng (Extensions) -> Apps Script
 * 2. Xóa đoạn mã trống mặc định, dán toàn bộ nội dung file này vào rồi bấm biểu tượng Lưu (Ctrl+S)
 * 3. Chọn hàm `setupSheetStructure` trên thanh công cụ -> Bấm "Chạy" (Run) -> Cấp quyền truy cập Sheet
 *    (Hàm này sẽ tự tạo sẵn 38 cột tiêu đề màu sắc rõ ràng + Tab "Báo Cáo Marketing" tự động tính KPI!)
 * 4. Bấm nút "Triển khai" (Deploy) góc phải trên -> "Tùy chọn triển khai mới" (New deployment):
 *    - Chọn loại: "Ứng dụng web" (Web app)
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone) -> Bấm Triển khai (Deploy)
 * 5. Copy đường link URL Ứng dụng Web (có dạng https://script.google.com/macros/s/.../exec)
 *    dán vào biến `webhookUrl` trong file `js/config.js` của Website là hoàn tất 100%!
 * ============================================================================
 */

const SPREADSHEET_ID = "1NeACCbWUcqyiP3MAI61wM9i2bsO1lqWsZunQIiBatac";
const TARGET_GID = 0; // Ghi đúng vào trang tính gid=0 theo link của bạn
const SUMMARY_SHEET_NAME = "Báo Cáo Marketing";

const HEADERS = [
  // Nhóm 1: Thông tin Khách hàng & Đơn hàng (Cột A -> K: 11 cột)
  "Thời gian ghi nhận",
  "Trạng thái Lead",
  "Mã đơn hàng",
  "Họ và tên",
  "Số điện thoại",
  "Địa chỉ nhận hàng",
  "Ghi chú khách hàng",
  "Combo lựa chọn",
  "Số lượng",
  "Giá trị đơn (VNĐ)",
  "Đánh giá nhiệt độ Lead",

  // Nhóm 2: Nguồn Marketing & Quảng cáo Attribution (Cột L -> T: 9 cột)
  "Kênh nguồn (Channel)",
  "Nguồn chi tiết (utm_source / Referrer)",
  "Phương thức (utm_medium)",
  "Chiến dịch (utm_campaign)",
  "Mẫu QC / Nội dung (utm_content)",
  "Từ khóa / Nhóm (utm_term)",
  "Mã Click Quảng cáo (fbclid/ttclid/gclid)",
  "Loại khách truy cập",
  "Link đích lúc vào (Landing URL)",

  // Nhóm 3: Mức độ Đọc hiểu & Thời gian sử dụng Landing (Cột U -> AB: 8 cột)
  "Đã đọc hết Landing chưa?",
  "Cuộn trang tối đa (%)",
  "Tổng thời gian mở trang (giây)",
  "Thời gian tương tác thực (Active giây)",
  "Thời gian tới lúc nhập SĐT (giây)",
  "Các phần đã đọc qua",
  "Phần dừng lại đọc lâu nhất",
  "Chi tiết thời gian đọc từng phần",

  // Nhóm 4: Hành vi Tương tác Sản phẩm & Phân vân (Cột AC -> AG: 5 cột)
  "Các gói kẹo đã bấm xem ảnh",
  "Lịch sử chọn / đổi ý Combo",
  "Hành vi chỉnh số lượng",
  "Các nút CTA đã bấm",
  "Hành vi phụ (Gọi / Zalo / Ẩn tab)",

  // Nhóm 5: Thiết bị, Môi trường & Định danh Phiên (Cột AH -> AL: 5 cột)
  "Thiết bị & Hệ điều hành",
  "Ứng dụng / Trình duyệt mở link",
  "Màn hình & Mạng",
  "Khung giờ truy cập",
  "Mã phiên (Session ID)"
];

function getTargetSheet_(ss) {
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      return sheets[i];
    }
  }
  return sheets[0];
}

/**
 * Chạy hàm này 1 lần đầu để tự động kẻ bảng 38 cột + tạo Dashboard Báo Cáo Marketing
 */
function setupSheetStructure() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getTargetSheet_(ss);

  // Mở rộng đủ số cột nếu trang tính mặc định chỉ có 26 cột (A-Z)
  const currentMaxCols = sheet.getMaxColumns();
  if (currentMaxCols < HEADERS.length) {
    sheet.insertColumnsAfter(currentMaxCols, HEADERS.length - currentMaxCols);
  }

  // Ghi dòng tiêu đề
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setWrap(true);
  sheet.setRowHeight(1, 44);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(5);

  // Tô màu phân nhóm chuyên nghiệp cho 5 nhóm dữ liệu Marketing
  sheet.getRange(1, 1, 1, 11).setBackground("#432312");  // Nhóm 1: Đơn & SĐT (Nâu đậm)
  sheet.getRange(1, 12, 1, 9).setBackground("#1E40AF");  // Nhóm 2: Nguồn Traffic & Ads (Xanh dương đậm)
  sheet.getRange(1, 21, 1, 8).setBackground("#065F46");  // Nhóm 3: Mức độ đọc & Thời gian (Xanh lá đậm)
  sheet.getRange(1, 29, 1, 5).setBackground("#9A3412");  // Nhóm 4: Hành vi mua & Phân vân (Cam đất)
  sheet.getRange(1, 34, 1, 5).setBackground("#374151");  // Nhóm 5: Thiết bị & Phiên (Xám than)

  // Định dạng cột Tiền tệ (Cột J = 10)
  sheet.getRange(2, 10, 500, 1).setNumberFormat("#,##0\" đ\"");

  // Tô màu tự động cột Trạng thái Lead (Cột B)
  const statusRange = sheet.getRange("B2:B1000");
  const ruleCompleted = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("ĐẶT HÀNG THÀNH CÔNG")
    .setBackground("#D1FAE5")
    .setFontColor("#065F46")
    .setBold(true)
    .setRanges([statusRange])
    .build();
  const ruleAbandoned = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("ĐỂ LẠI SĐT")
    .setBackground("#FEF3C7")
    .setFontColor("#92400E")
    .setBold(true)
    .setRanges([statusRange])
    .build();
  sheet.setConditionalFormatRules([ruleCompleted, ruleAbandoned]);

  // Tạo hoặc cập nhật Tab "Báo Cáo Marketing" tự động tổng hợp số liệu
  const dataSheetName = sheet.getName().replace(/'/g, "''");
  let dash = ss.getSheetByName(SUMMARY_SHEET_NAME);
  if (!dash) {
    dash = ss.insertSheet(SUMMARY_SHEET_NAME);
  } else {
    dash.clear();
  }

  const dashRows = [
    ["BÁO CÁO ĐO LƯỜNG HIỆU QUẢ MARKETING & CHUYỂN ĐỔI LANDING PAGE", "", ""],
    ["Chỉ số đo lường", "Giá trị hiện tại", "Ý nghĩa tối ưu Marketing & Telesale"],
    ["1. Tổng khách đã để lại SĐT", `=COUNTA('${dataSheetName}'!E2:E)`, "Tổng Lead thu được (gồm cả khách đặt xong & khách điền SĐT dở)"],
    ["2. Số đơn Đặt Hàng Thành Công", `=COUNTIF('${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`, "Khách đã điền đủ Địa chỉ & bấm nút Đặt Mua Ngay"],
    ["3. Số khách Để Lại SĐT Chưa Bấm Đặt", `=COUNTIF('${dataSheetName}'!B2:B, "ĐỂ LẠI SĐT (CHƯA BẤM ĐẶT)")`, "Cần Telesale gọi hỗ trợ chốt đơn ngay để tránh rơi rớt"],
    ["4. Tỷ lệ hoàn tất Form sau khi nhập SĐT", `=IFERROR(B4/B3, 0)`, "Nếu thấp hơn 60%: cần kiểm tra lại bước nhập địa chỉ hoặc ưu đãi"],
    ["5. Doanh thu COD từ đơn hoàn tất (VNĐ)", `=SUMIF('${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG", '${dataSheetName}'!J2:J)`, "Tổng doanh thu đặt hàng trên Landing"],
    ["6. Doanh thu tiềm năng đang bỏ dở (VNĐ)", `=SUMIF('${dataSheetName}'!B2:B, "ĐỂ LẠI SĐT (CHƯA BẤM ĐẶT)", '${dataSheetName}'!J2:J)`, "Doanh thu có thể cứu thêm nếu Telesale gọi lại thành công"],
    ["7. Thời gian tương tác thực trung bình (giây)", `=IFERROR(ROUND(AVERAGE('${dataSheetName}'!X2:X), 1), 0)`, "Thời gian thực khách đọc bài (đã trừ lúc treo tab)"],
    ["8. Tỷ lệ khách đọc hết Landing (>=90%)", `=IFERROR(COUNTIF('${dataSheetName}'!U2:U, "Đã đọc hết*")/B3, 0)`, "Đo sức hút nội dung từ đầu trang tới cuối trang"],
    ["", "", ""],
    ["PHÂN BỔ LEAD THEO KÊNH NGUỒN (CHANNEL)", "Số SĐT thu được", "Số đơn hoàn tất"],
    ["Facebook Ads", `=COUNTIF('${dataSheetName}'!L2:L, "Facebook Ads")`, `=COUNTIFS('${dataSheetName}'!L2:L, "Facebook Ads", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`],
    ["Facebook (Tự nhiên / Share)", `=COUNTIF('${dataSheetName}'!L2:L, "Facebook (Tự nhiên / Share)")`, `=COUNTIFS('${dataSheetName}'!L2:L, "Facebook (Tự nhiên / Share)", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`],
    ["TikTok Ads", `=COUNTIF('${dataSheetName}'!L2:L, "TikTok Ads")`, `=COUNTIFS('${dataSheetName}'!L2:L, "TikTok Ads", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`],
    ["TikTok (Bio / Video)", `=COUNTIF('${dataSheetName}'!L2:L, "TikTok (Bio / Video)")`, `=COUNTIFS('${dataSheetName}'!L2:L, "TikTok (Bio / Video)", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`],
    ["Zalo (Tin nhắn / OA)", `=COUNTIF('${dataSheetName}'!L2:L, "Zalo (Tin nhắn / OA)")`, `=COUNTIFS('${dataSheetName}'!L2:L, "Zalo (Tin nhắn / OA)", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`],
    ["Google Ads / Tìm kiếm", `=COUNTIF('${dataSheetName}'!L2:L, "Google*")`, `=COUNTIFS('${dataSheetName}'!L2:L, "Google*", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`],
    ["Truy cập trực tiếp (Direct)", `=COUNTIF('${dataSheetName}'!L2:L, "Truy cập trực tiếp*")`, `=COUNTIFS('${dataSheetName}'!L2:L, "Truy cập trực tiếp*", '${dataSheetName}'!B2:B, "ĐẶT HÀNG THÀNH CÔNG")`]
  ];

  dash.getRange(1, 1, dashRows.length, 3).setValues(dashRows);
  dash.getRange("A1:C1").merge().setBackground("#432312").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13);
  dash.getRange("A2:C2").setBackground("#EEAA43").setFontColor("#432312").setFontWeight("bold");
  dash.getRange("A12:C12").setBackground("#1E40AF").setFontColor("#FFFFFF").setFontWeight("bold");
  dash.getRange("B6").setNumberFormat("0.0%");
  dash.getRange("B10").setNumberFormat("0.0%");
  dash.getRange("B7:B8").setNumberFormat("#,##0\" đ\"");
  dash.setColumnWidth(1, 340);
  dash.setColumnWidth(2, 180);
  dash.setColumnWidth(3, 420);
}

function buildRowFromPayload_(d) {
  // Giữ số 0 ở đầu số điện thoại bằng dấu nháy đơn dẫn đầu trong Google Sheet
  const safePhone = d.phone ? "'" + String(d.phone).replace(/^'+/, "") : "";

  return [
    d.timestampVN || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    d.leadStatusLabel || "",
    d.orderCode || "",
    d.customerName || "",
    safePhone,
    d.address || "",
    d.note || "",
    d.comboTitle || "",
    Number(d.quantity || 1),
    Number(d.totalAmountVND || 0),
    d.leadScoreLabel || "",

    d.channel || "",
    d.utmSourceOrRef || "",
    d.utmMedium || "",
    d.utmCampaign || "",
    d.utmContent || "",
    d.utmTerm || "",
    d.clickId || "",
    d.visitorStatus || "",
    d.landingUrl || "",

    d.readCompletionStatus || "",
    d.maxScrollPct || "",
    Number(d.totalTimeSec || 0),
    Number(d.activeTimeSec || 0),
    Number(d.timeToPhoneSec || 0),
    d.sectionsViewed || "",
    d.topDwellSection || "",
    d.dwellBreakdown || "",

    d.heroPacksInspected || "",
    d.comboHistory || "",
    d.qtyBehavior || "",
    d.ctaClicksLog || "",
    d.microConversions || "",

    d.deviceSummary || "",
    d.browserApp || "",
    d.screenAndNet || "",
    d.daypartVN || "",
    d.sessionId || ""
  ];
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      service: "VietAnhShop Keo Lac Nam Dinh Telemetry Webhook",
      spreadsheetId: SPREADSHEET_ID
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getTargetSheet_(ss);

    // Tự động khởi tạo tiêu đề nếu dòng 1 đang trống
    if (sheet.getLastRow() === 0 || !sheet.getRange(1, 1).getValue()) {
      setupSheetStructure();
    } else if (sheet.getMaxColumns() < HEADERS.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
    }

    const rowValues = buildRowFromPayload_(data);
    const lastRow = sheet.getLastRow();
    const sessionColIndex = HEADERS.length; // Cột 38 (AL): Mã phiên (Session ID)
    let updatedExistingRow = false;

    // Smart Upsert: Nếu cùng Session ID đã từng lưu SĐT nháp trước đó thì cập nhật thẳng vào dòng đó!
    if (data.sessionId && lastRow >= 2) {
      const checkCount = Math.min(200, lastRow - 1);
      const startRow = lastRow - checkCount + 1;
      const sessionValues = sheet
        .getRange(startRow, sessionColIndex, checkCount, 1)
        .getValues();
      const statusValues = sheet
        .getRange(startRow, 2, checkCount, 1)
        .getValues();

      for (let i = sessionValues.length - 1; i >= 0; i--) {
        if (String(sessionValues[i][0]) === String(data.sessionId)) {
          const targetRow = startRow + i;
          const prevStatus = String(statusValues[i][0] || "");
          // Không ghi đè ngược từ ĐẶT HÀNG THÀNH CÔNG về ĐỂ LẠI SĐT
          if (
            prevStatus === "ĐẶT HÀNG THÀNH CÔNG" &&
            data.leadType !== "COMPLETED_ORDER"
          ) {
            updatedExistingRow = true;
            break;
          }
          // Chỉ cập nhật 38 cột dữ liệu tự động (A..AL), giữ nguyên cột AM..AN của Telesale!
          sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
          updatedExistingRow = true;
          break;
        }
      }
    }

    if (!updatedExistingRow) {
      sheet.appendRow(rowValues);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, upserted: updatedExistingRow })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
