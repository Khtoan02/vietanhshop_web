/**
 * ============================================================================
 * BỘ ĐO LƯỜNG HÀNH VI KHÁCH HÀNG & NGUỒN MARKETING (FIRST-PARTY TELEMETRY)
 * Dự án: Landing Page Kẹo Lạc Nam Định - Việt Anh Shop
 * Mục tiêu:
 *  1. Tự động phân tích nguồn tới (UTM, fbclid, ttclid, gclid, In-App Browser, Referrer)
 *  2. Đo lường chiều sâu đọc trang (% cuộn, đã đọc hết chưa, thời gian dừng từng phần)
 *  3. Đo thời gian thực sự tương tác (Active Time) & tốc độ ra quyết định để lại SĐT
 *  4. Ghi nhận hành vi mua sắm (xem gói kẹo nào, đổi ý Combo nào, tăng giảm số lượng, bấm nút nào)
 *  5. Bắt trọn cả 2 nhóm khách có SĐT:
 *     - ĐỂ LẠI SĐT NHƯNG CHƯA BẤM ĐẶT (Abandoned Phone Lead - khi rời ô SĐT / đóng tab)
 *     - ĐẶT HÀNG THÀNH CÔNG (Completed Order - tự động cập nhật nâng cấp cùng dòng trên Sheet)
 * ============================================================================
 */
(function () {
  "use strict";

  const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

  const SECTION_LABELS = {
    "trang-chu": "Đầu trang (Hero)",
    "diem-khac-biet": "Điểm khác biệt",
    "combo-uu-dai": "3 Vị kẹo & Bảng giá Combo",
    "nguyen-lieu": "Nguyên liệu & Chỉ tiêu",
    "dat-hang": "Khu vực Đặt hàng"
  };

  const ALL_KEY_SECTIONS = [
    "trang-chu",
    "diem-khac-biet",
    "combo-uu-dai",
    "nguyen-lieu",
    "dat-hang"
  ];

  // Tạo hoặc khôi phục Visitor ID & Session ID
  function randomId(prefix) {
    return (
      prefix +
      "-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 7).toUpperCase()
    );
  }

  let visitorId = "";
  let visitCount = 1;
  try {
    visitorId = localStorage.getItem("va_visitor_id") || "";
    if (!visitorId) {
      visitorId = randomId("VIS");
      localStorage.setItem("va_visitor_id", visitorId);
    }
    const lastSessionMark = sessionStorage.getItem("va_session_counted");
    const prevCount = parseInt(localStorage.getItem("va_visit_count") || "0", 10);
    if (!lastSessionMark) {
      visitCount = prevCount + 1;
      localStorage.setItem("va_visit_count", String(visitCount));
      sessionStorage.setItem("va_session_counted", "1");
    } else {
      visitCount = Math.max(1, prevCount);
    }
  } catch (_) {
    visitorId = randomId("VIS");
  }

  let baseSessionId = "";
  try {
    baseSessionId = sessionStorage.getItem("va_session_id") || "";
    if (!baseSessionId) {
      baseSessionId = randomId("SES");
      sessionStorage.setItem("va_session_id", baseSessionId);
    }
  } catch (_) {
    baseSessionId = randomId("SES");
  }

  let orderCycle = 1;
  const getCurrentSessionKey = () =>
    orderCycle === 1 ? baseSessionId : `${baseSessionId}#${orderCycle}`;

  // Phân tích nguồn truy cập & UTM (giữ cả First-Touch trong phiên)
  function parseAttribution() {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    const ua = navigator.userAgent || "";
    const ref = document.referrer || "";

    let refHost = "";
    try {
      if (ref) refHost = new URL(ref).hostname.replace(/^www\./, "");
    } catch (_) {}

    const current = {
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
      utm_content: p.get("utm_content") || "",
      utm_term: p.get("utm_term") || "",
      fbclid: p.get("fbclid") || "",
      ttclid: p.get("ttclid") || "",
      gclid: p.get("gclid") || "",
      zarsrc: p.get("zarsrc") || "",
      referrer: ref,
      referrerHost: refHost,
      landingUrl: window.location.href
    };

    try {
      const savedRaw = sessionStorage.getItem("va_attribution");
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        Object.keys(current).forEach((k) => {
          if (!current[k] && saved[k]) current[k] = saved[k];
        });
      }
      sessionStorage.setItem("va_attribution", JSON.stringify(current));
    } catch (_) {}

    // Nhận diện In-App Browser & Trình duyệt
    let browserApp = "Trình duyệt Web";
    if (/FBAN|FBAV|FB_IAB/i.test(ua)) browserApp = "Facebook App (In-App)";
    else if (/BytedanceWebview|musical_ly|TikTok/i.test(ua))
      browserApp = "TikTok App (In-App)";
    else if (/Zalo/i.test(ua)) browserApp = "Zalo App (In-App)";
    else if (/Instagram/i.test(ua)) browserApp = "Instagram App (In-App)";
    else if (/Shopee/i.test(ua)) browserApp = "Shopee App";
    else if (/Edg\//i.test(ua)) browserApp = "Microsoft Edge";
    else if (/CriOS|Chrome/i.test(ua)) browserApp = "Google Chrome";
    else if (/Safari/i.test(ua)) browserApp = "Apple Safari";
    else if (/Firefox/i.test(ua)) browserApp = "Firefox";

    // Phân loại kênh Marketing chuẩn
    const srcLower = (current.utm_source || "").toLowerCase();
    const medLower = (current.utm_medium || "").toLowerCase();
    const refLower = (current.referrerHost || "").toLowerCase();

    let channel = "Truy cập trực tiếp (Direct)";
    if (
      current.fbclid ||
      srcLower.includes("fb") ||
      srcLower.includes("facebook") ||
      srcLower.includes("meta") ||
      browserApp.startsWith("Facebook")
    ) {
      channel =
        current.fbclid || medLower.includes("cpc") || medLower.includes("paid") || medLower.includes("ads")
          ? "Facebook Ads"
          : "Facebook (Tự nhiên / Share)";
    } else if (
      current.ttclid ||
      srcLower.includes("tiktok") ||
      refLower.includes("tiktok") ||
      browserApp.startsWith("TikTok")
    ) {
      channel =
        current.ttclid || medLower.includes("cpc") || medLower.includes("paid") || medLower.includes("ads")
          ? "TikTok Ads"
          : "TikTok (Bio / Video)";
    } else if (
      current.gclid ||
      srcLower.includes("google") ||
      refLower.includes("google.")
    ) {
      channel =
        current.gclid || medLower.includes("cpc") || medLower.includes("ppc")
          ? "Google Ads"
          : "Google Tìm kiếm (SEO)";
    } else if (
      current.zarsrc ||
      srcLower.includes("zalo") ||
      refLower.includes("zalo") ||
      browserApp.startsWith("Zalo")
    ) {
      channel = "Zalo (Tin nhắn / OA)";
    } else if (srcLower.includes("youtube") || refLower.includes("youtube") || refLower.includes("youtu.be")) {
      channel = "YouTube";
    } else if (current.utm_source) {
      channel = `Chiến dịch (${current.utm_source})`;
    } else if (current.referrerHost && current.referrerHost !== window.location.hostname) {
      channel = `Giới thiệu từ ${current.referrerHost}`;
    }

    const clickId = current.fbclid
      ? `fbclid:${current.fbclid.slice(0, 32)}`
      : current.ttclid
      ? `ttclid:${current.ttclid.slice(0, 32)}`
      : current.gclid
      ? `gclid:${current.gclid.slice(0, 32)}`
      : "";

    return {
      ...current,
      channel,
      browserApp,
      clickId
    };
  }

  function detectDeviceInfo() {
    const ua = navigator.userAgent || "";
    const w = window.innerWidth || screen.width || 0;
    const h = window.innerHeight || screen.height || 0;

    let os = "Khác";
    if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/Mac OS X/i.test(ua)) os = "macOS";
    else if (/Windows/i.test(ua)) os = "Windows";
    else if (/Linux/i.test(ua)) os = "Linux";

    const deviceType =
      /Mobi|Android|iPhone/i.test(ua) || w < 768
        ? "Điện thoại"
        : w < 1024
        ? "Máy tính bảng"
        : "Máy tính (Desktop)";

    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const netType = conn && conn.effectiveType ? conn.effectiveType.toUpperCase() : "Không rõ";

    return {
      deviceSummary: `${deviceType} - ${os}`,
      screenAndNet: `${w}x${h} | Mạng ${netType}`
    };
  }

  function getDaypartVN() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return `Buổi sáng (${hour}h)`;
    if (hour >= 11 && hour < 14) return `Buổi trưa (${hour}h)`;
    if (hour >= 14 && hour < 18) return `Buổi chiều (${hour}h)`;
    if (hour >= 18 && hour < 22) return `Buổi tối (${hour}h)`;
    return `Đêm khuya (${hour}h)`;
  }

  function formatVNTime(date) {
    try {
      return new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(date);
    } catch (_) {
      return date.toISOString();
    }
  }

  // Trạng thái đo lường thời gian thực trong phiên
  const pageEnterTs = Date.now();
  let lastActivityTs = Date.now();
  let activeTimeMs = 0;
  let maxScrollPct = 0;
  let timeToPhoneSec = null;
  let tabSwitchCount = 0;

  const sectionVisibleSince = {};
  const sectionDwellMs = {
    "trang-chu": 0,
    "diem-khac-biet": 0,
    "combo-uu-dai": 0,
    "nguyen-lieu": 0,
    "dat-hang": 0
  };
  const sectionsReadSet = new Set(["trang-chu"]);

  const heroPacksClicked = ["Trọn bộ"];
  const comboHistory = [];
  const ctaClicks = [];
  const microEvents = new Set();
  let qtyChangeCount = 0;
  let maxQtyTested = 1;

  // Trạng thái đồng bộ Lead SĐT bỏ dở
  let lastDraftSignature = "";
  let currentOrderCompleted = false;
  let draftTimer = null;

  const attr = parseAttribution();
  const device = detectDeviceInfo();

  // 1. Đo lường độ sâu cuộn trang (Passive + rAF)
  let scrollTicking = false;
  function updateScrollDepth() {
    scrollTicking = false;
    lastActivityTs = Date.now();
    const docEl = document.documentElement;
    const scrollTop = window.scrollY || docEl.scrollTop || 0;
    const winH = window.innerHeight || docEl.clientHeight || 0;
    const docH = Math.max(
      docEl.scrollHeight || 0,
      document.body ? document.body.scrollHeight : 0,
      1
    );
    const pct = Math.min(100, Math.round(((scrollTop + winH) / docH) * 100));
    if (pct > maxScrollPct) maxScrollPct = pct;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollDepth);
      }
    },
    { passive: true }
  );

  ["pointerdown", "keydown", "touchstart"].forEach((evt) => {
    window.addEventListener(
      evt,
      () => {
        lastActivityTs = Date.now();
      },
      { passive: true }
    );
  });

  // 2. Đo Active Time (mỗi 1s khi tab đang mở và có tương tác trong 30s gần nhất)
  setInterval(() => {
    const now = Date.now();
    if (
      document.visibilityState === "visible" &&
      now - lastActivityTs < 30000
    ) {
      activeTimeMs += 1000;
      // Cộng dồn thời gian dừng ở từng section đang hiển thị trên màn hình
      Object.keys(sectionVisibleSince).forEach((secId) => {
        if (sectionVisibleSince[secId]) {
          sectionDwellMs[secId] = (sectionDwellMs[secId] || 0) + 1000;
          if (sectionDwellMs[secId] >= 1500) {
            sectionsReadSet.add(secId);
          }
        }
      });
    }
  }, 1000);

  // 3. IntersectionObserver theo dõi từng Section khách đọc
  function initSectionObserver() {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            sectionVisibleSince[id] = Date.now();
          } else {
            sectionVisibleSince[id] = null;
          }
        });
      },
      { threshold: [0, 0.25, 0.6] }
    );

    ALL_KEY_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  // 4. Tính toán mức độ đọc hết Landing & Điểm Lead Score (/100)
  function computeReadStatus() {
    const readCount = sectionsReadSet.size;
    if (maxScrollPct >= 90 && readCount >= 4) {
      return `Đã đọc hết bài (${maxScrollPct}% - ${readCount}/5 phần)`;
    }
    if (maxScrollPct >= 75 || readCount >= 4) {
      return `Đọc phần lớn (${maxScrollPct}% - ${readCount}/5 phần)`;
    }
    if (maxScrollPct >= 50 || readCount >= 3) {
      return `Đọc khoảng một nửa (${maxScrollPct}% - ${readCount}/5 phần)`;
    }
    return `Mới xem đầu trang (${maxScrollPct}% - ${readCount}/5 phần)`;
  }

  function computeDwellSummary() {
    let topId = "trang-chu";
    let topMs = -1;
    const parts = [];

    ALL_KEY_SECTIONS.forEach((id) => {
      const sec = Math.round((sectionDwellMs[id] || 0) / 1000);
      if (sectionDwellMs[id] > topMs) {
        topMs = sectionDwellMs[id];
        topId = id;
      }
      parts.push(`${SECTION_LABELS[id]}: ${sec}s`);
    });

    const topSec = Math.max(1, Math.round(Math.max(0, topMs) / 1000));
    return {
      topSection: `${SECTION_LABELS[topId]} (${topSec}s)`,
      breakdown: parts.join(" | ")
    };
  }

  function computeLeadScore(leadType, activeSec, quantity) {
    let score = leadType === "COMPLETED_ORDER" ? 60 : 35;
    if (activeSec >= 45) score += 12;
    else if (activeSec >= 20) score += 7;
    if (maxScrollPct >= 85) score += 10;
    else if (maxScrollPct >= 55) score += 5;
    if (comboHistory.length >= 1) score += 8;
    if (quantity >= 2 || maxQtyTested >= 2) score += 5;
    if (visitCount >= 2) score += 5;
    score = Math.min(100, score);

    let tier = "Ấm - Quan tâm";
    if (leadType === "COMPLETED_ORDER" && score >= 80) {
      tier = `Rất nóng (${score}/100) - Ưu tiên xác nhận`;
    } else if (leadType === "COMPLETED_ORDER") {
      tier = `Nóng (${score}/100) - Đơn đặt mới`;
    } else if (score >= 60) {
      tier = `SĐT Tiềm năng cao (${score}/100) - Gọi tư vấn ngay`;
    } else {
      tier = `Có SĐT (${score}/100) - Cần gọi hỗ trợ`;
    }
    return tier;
  }

  // 5. Đóng gói trọn bộ 38 trường dữ liệu gửi về Google Sheet
  function buildTelemetryPayload(leadType, formSnapshot) {
    updateScrollDepth();
    const now = new Date();
    const totalSec = Math.max(1, Math.round((Date.now() - pageEnterTs) / 1000));
    const activeSec = Math.max(1, Math.round(activeTimeMs / 1000));
    const dwell = computeDwellSummary();

    const sectionsViewedList = ALL_KEY_SECTIONS.filter((id) =>
      sectionsReadSet.has(id)
    )
      .map((id) => SECTION_LABELS[id])
      .join(" -> ");

    const rawPhone = (formSnapshot.phone || "").trim().replace(/\s+/g, "");
    const qty = formSnapshot.quantity || 1;
    const unitPrice = formSnapshot.unitPrice || 0;
    const totalAmount =
      leadType === "COMPLETED_ORDER"
        ? formSnapshot.totalAmountVND || unitPrice * qty
        : unitPrice * qty;

    return {
      // Định danh & Loại Lead
      timestampVN: formatVNTime(now),
      leadStatusLabel:
        leadType === "COMPLETED_ORDER"
          ? "ĐẶT HÀNG THÀNH CÔNG"
          : "ĐỂ LẠI SĐT (CHƯA BẤM ĐẶT)",
      leadType,
      orderCode: formSnapshot.orderCode || "CHƯA BẤM ĐẶT",
      customerName: formSnapshot.customerName || "(Chưa nhập tên)",
      phone: rawPhone,
      address: formSnapshot.address || "(Chưa nhập địa chỉ)",
      note: formSnapshot.note || "",
      comboTitle: formSnapshot.comboTitle || "",
      quantity: qty,
      totalAmountVND: totalAmount,

      // Nguồn Marketing & Attribution
      channel: attr.channel,
      utmSourceOrRef: attr.utm_source || attr.referrerHost || "direct",
      utmMedium: attr.utm_medium || (attr.clickId ? "paid" : "organic_or_direct"),
      utmCampaign: attr.utm_campaign || "",
      utmContent: attr.utm_content || "",
      utmTerm: attr.utm_term || "",
      clickId: attr.clickId || "",
      visitorStatus:
        visitCount === 1
          ? "Khách mới (Lần 1)"
          : `Khách quay lại (Lần ${visitCount})`,
      landingUrl: attr.landingUrl,

      // Mức độ đọc & Thời gian trên trang
      readCompletionStatus: computeReadStatus(),
      maxScrollPct: `${maxScrollPct}%`,
      totalTimeSec: totalSec,
      activeTimeSec: activeSec,
      timeToPhoneSec:
        timeToPhoneSec !== null ? timeToPhoneSec : totalSec,
      sectionsViewed: sectionsViewedList,
      topDwellSection: dwell.topSection,
      dwellBreakdown: dwell.breakdown,

      // Hành vi tương tác mua sắm & Tín hiệu phân vân
      heroPacksInspected: heroPacksClicked.join(" -> "),
      comboHistory:
        comboHistory.length > 0
          ? comboHistory.join(" -> ")
          : formSnapshot.comboTitle || "Mặc định",
      qtyBehavior:
        qtyChangeCount > 0
          ? `Chỉnh ${qtyChangeCount} lần (Cao nhất: ${maxQtyTested} combo)`
          : "Giữ mặc định (1 combo)",
      ctaClicksLog:
        ctaClicks.length > 0 ? ctaClicks.slice(-6).join(" -> ") : "Cuộn thẳng tới Form",
      microConversions:
        microEvents.size > 0
          ? Array.from(microEvents).join(" | ")
          : "Không có",
      leadScoreLabel: computeLeadScore(leadType, activeSec, qty),

      // Thiết bị, Trình duyệt & Khung giờ
      deviceSummary: device.deviceSummary,
      browserApp: attr.browserApp,
      screenAndNet: device.screenAndNet,
      daypartVN: getDaypartVN(),
      sessionId: getCurrentSessionKey(),
      spreadsheetId:
        (window.SITE_CONFIG && window.SITE_CONFIG.googleSheet && window.SITE_CONFIG.googleSheet.spreadsheetId) ||
        ""
    };
  }

  // 6. Gửi dữ liệu an toàn CORS-proof (text/plain Simple Request + sendBeacon fallback)
  async function dispatchToSheet(payload, useBeaconOnly) {
    const cfg = window.SITE_CONFIG || {};
    const isLocalPreview =
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost";
    const webhookUrl =
      (cfg.googleSheet && cfg.googleSheet.webhookUrl) ||
      (cfg.contact && cfg.contact.orderWebhookUrl) ||
      (isLocalPreview ? "/__local_sheet_sync" : "");

    // Luôn lưu bản ghi cục bộ để chủ shop kiểm tra nhanh & dự phòng mất mạng
    try {
      const logs = JSON.parse(
        localStorage.getItem("va_telemetry_leads") || "[]"
      );
      const existingIdx = logs.findIndex(
        (item) => item.sessionId === payload.sessionId
      );
      if (existingIdx >= 0) {
        logs[existingIdx] = payload;
      } else {
        logs.unshift(payload);
      }
      localStorage.setItem(
        "va_telemetry_leads",
        JSON.stringify(logs.slice(0, 50))
      );
    } catch (_) {}

    if (!webhookUrl) {
      return { sent: false, reason: "missing_webhook_url", payload };
    }

    const bodyStr = JSON.stringify(payload);

    if (useBeaconOnly && navigator.sendBeacon) {
      try {
        const blob = new Blob([bodyStr], {
          type: "text/plain;charset=utf-8"
        });
        const queued = navigator.sendBeacon(webhookUrl, blob);
        if (queued) return { sent: true, mode: "beacon", payload };
      } catch (_) {}
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: bodyStr
      });
      return { sent: true, mode: "fetch", payload };
    } catch (err) {
      return { sent: false, reason: String(err), payload };
    }
  }

  // 7. Theo dõi tự động ô nhập Số điện thoại để bắt SĐT bỏ dở (Abandoned Phone Lead)
  function getFormSnapshotFromDOM() {
    const cfg = window.SITE_CONFIG || { combos: [] };
    const nameEl = document.getElementById("customer-name");
    const phoneEl = document.getElementById("customer-phone");
    const addrEl = document.getElementById("customer-address");
    const noteEl = document.getElementById("customer-note");
    const qtyEl = document.getElementById("summary-qty");
    const checkedRadio = document.querySelector(
      "input[name='comboId']:checked"
    );

    const comboId = checkedRadio ? checkedRadio.value : "";
    const combo =
      cfg.combos.find((c) => c.id === comboId) || cfg.combos[0] || {};
    const qty = Math.max(1, parseInt((qtyEl && qtyEl.textContent) || "1", 10));

    return {
      customerName: nameEl ? nameEl.value.trim() : "",
      phone: phoneEl ? phoneEl.value.trim().replace(/\s+/g, "") : "",
      address: addrEl ? addrEl.value.trim() : "",
      note: noteEl ? noteEl.value.trim() : "",
      comboTitle: combo.title
        ? `${combo.title} - ${combo.productName || ""}`.replace(/ - $/, "")
        : "",
      quantity: qty,
      unitPrice: combo.salePrice || 0,
      totalAmountVND: (combo.salePrice || 0) * qty
    };
  }

  function trySendDraftPhoneLead(useBeaconOnly) {
    if (currentOrderCompleted) return;
    const snap = getFormSnapshotFromDOM();
    if (!VN_PHONE_REGEX.test(snap.phone)) return;

    const sig = `${snap.phone}|${snap.customerName}|${snap.address}|${snap.comboTitle}|${snap.quantity}`;
    if (sig === lastDraftSignature && !useBeaconOnly) return;
    lastDraftSignature = sig;

    const payload = buildTelemetryPayload("ABANDONED_PHONE", snap);
    dispatchToSheet(payload, Boolean(useBeaconOnly));
  }

  function bindAutoListeners() {
    updateScrollDepth();
    initSectionObserver();

    const phoneEl = document.getElementById("customer-phone");
    const nameEl = document.getElementById("customer-name");
    const addrEl = document.getElementById("customer-address");

    if (phoneEl) {
      phoneEl.addEventListener("input", () => {
        const cleaned = phoneEl.value.trim().replace(/\s+/g, "");
        if (VN_PHONE_REGEX.test(cleaned)) {
          if (timeToPhoneSec === null) {
            timeToPhoneSec = Math.max(
              1,
              Math.round((Date.now() - pageEnterTs) / 1000)
            );
          }
          clearTimeout(draftTimer);
          draftTimer = setTimeout(() => trySendDraftPhoneLead(false), 3500);
        }
      });

      phoneEl.addEventListener("blur", () => {
        clearTimeout(draftTimer);
        trySendDraftPhoneLead(false);
      });
    }

    [nameEl, addrEl].forEach((el) => {
      if (!el) return;
      el.addEventListener("blur", () => {
        trySendDraftPhoneLead(false);
      });
    });

    // Theo dõi bấm nút CTA toàn trang
    document.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        const label = (link.textContent || "").trim().replace(/\s+/g, " ");
        if (label) ctaClicks.push(label.slice(0, 36));
      });
    });

    // Theo dõi bấm gọi điện, nhắn Zalo, sao chép SĐT
    document.querySelectorAll("[data-bind='hotlineHref']").forEach((el) => {
      el.addEventListener("click", () => microEvents.add("Bấm gọi Hotline"));
    });
    document.querySelectorAll("[data-bind='zaloHref']").forEach((el) => {
      el.addEventListener("click", () => microEvents.add("Bấm mở Zalo"));
    });
    document.addEventListener("copy", () => {
      microEvents.add("Sao chép nội dung trên trang");
    });

    // Bắt sự kiện ẩn tab / thoát trang để kịp đẩy SĐT khách điền dở về Sheet
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        tabSwitchCount += 1;
        microEvents.add(`Chuyển/ẩn tab (${tabSwitchCount} lần)`);
        trySendDraftPhoneLead(true);
      }
    });

    window.addEventListener("pagehide", () => {
      trySendDraftPhoneLead(true);
    });
  }

  // Public API cho app.js gọi trực tiếp
  window.VA_TRACKER = {
    recordHeroPackView(label) {
      if (label && heroPacksClicked[heroPacksClicked.length - 1] !== label) {
        heroPacksClicked.push(label);
      }
    },
    recordComboSelect(comboTitle, sourceLabel) {
      if (sourceLabel) ctaClicks.push(sourceLabel);
      if (
        comboTitle &&
        comboHistory[comboHistory.length - 1] !== comboTitle
      ) {
        comboHistory.push(comboTitle);
      }
    },
    recordQtyChange(newQty) {
      qtyChangeCount += 1;
      if (newQty > maxQtyTested) maxQtyTested = newQty;
    },
    async submitCompletedOrder(orderDetails) {
      clearTimeout(draftTimer);
      currentOrderCompleted = true;
      if (timeToPhoneSec === null) {
        timeToPhoneSec = Math.max(
          1,
          Math.round((Date.now() - pageEnterTs) / 1000)
        );
      }
      const payload = buildTelemetryPayload("COMPLETED_ORDER", orderDetails);
      return await dispatchToSheet(payload, false);
    },
    startNewOrderCycle() {
      orderCycle += 1;
      currentOrderCompleted = false;
      lastDraftSignature = "";
    },
    getDebugSnapshot() {
      return buildTelemetryPayload("PREVIEW", getFormSnapshotFromDOM());
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindAutoListeners);
  } else {
    bindAutoListeners();
  }
})();
