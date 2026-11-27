/**
 * Giao diện Tech PDP chuyên biệt cho sản phẩm đơn lẻ: Đồng Hồ Điện Tử Casio F94
 * - Gallery 6 góc ảnh tương tác + chuyển ảnh mượt
 * - Sơ đồ giải phẫu 6 điểm kỹ thuật + Công tắc bật thử đèn LED ban đêm
 * - Đặt mua đơn lẻ 139.000đ Miễn phí ship + Đồng bộ 38 chỉ số hành vi vào Google Sheet
 */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG;
  if (!CFG) return;

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(num)) + " đ";

  let activeGalleryIdx = 0;
  let isNightLedOn = false;
  let activeAnatomyIdx = 0;
  let orderQty = 1;

  function hydrateContact() {
    document.querySelectorAll("[data-bind='brandName']").forEach((el) => {
      el.textContent = CFG.brandName;
    });
    document.querySelectorAll("[data-bind='hotlineDisplay']").forEach((el) => {
      el.textContent = CFG.contact.hotlineDisplay;
    });
    document.querySelectorAll("[data-bind='hotlineHref']").forEach((el) => {
      el.setAttribute("href", "tel:" + CFG.contact.hotlineTel);
    });
    document.querySelectorAll("[data-bind='zaloHref']").forEach((el) => {
      el.setAttribute("href", CFG.contact.zaloUrl);
    });
    document.querySelectorAll("[data-bind='address']").forEach((el) => {
      el.textContent = CFG.contact.address;
    });
  }

  // 1. Interactive 6-Image Studio Gallery
  function initGallery() {
    const mainImg = document.getElementById("gallery-main-img");
    const captionEl = document.getElementById("gallery-caption");
    const counterEl = document.getElementById("gallery-counter");
    const thumbsEl = document.getElementById("gallery-thumbs");
    const prevBtn = document.getElementById("gallery-prev");
    const nextBtn = document.getElementById("gallery-next");
    if (!mainImg || !thumbsEl || !CFG.gallery) return;

    const selectSlide = (idx, trackEvent) => {
      activeGalleryIdx = (idx + CFG.gallery.length) % CFG.gallery.length;
      const item = CFG.gallery[activeGalleryIdx];

      if (trackEvent && window.VA_TRACKER) {
        window.VA_TRACKER.recordHeroPackView(item.thumbLabel);
      }

      mainImg.style.opacity = "0.25";
      setTimeout(() => {
        mainImg.src = item.src;
        mainImg.alt = item.caption;
        if (captionEl) captionEl.textContent = item.caption;
        if (counterEl) {
          counterEl.textContent = `GÓC XEM ${activeGalleryIdx + 1} / ${
            CFG.gallery.length
          }`;
        }
        mainImg.style.opacity = "1";
      }, 110);

      thumbsEl.querySelectorAll("button[data-thumb-idx]").forEach((btn) => {
        const bIdx = parseInt(btn.getAttribute("data-thumb-idx"), 10);
        const active = bIdx === activeGalleryIdx;
        btn.setAttribute("aria-selected", String(active));
        btn.className = active
          ? "group rounded-2xl border-2 border-[#141619] bg-white p-1.5 text-center transition-all cursor-pointer shadow-xs"
          : "group rounded-2xl border border-zinc-200 bg-[#F6F7F9] hover:border-zinc-400 p-1.5 text-center transition-all cursor-pointer opacity-80 hover:opacity-100";
      });
    };

    thumbsEl.innerHTML = CFG.gallery
      .map(
        (g, idx) => `
        <button type="button" role="option" data-thumb-idx="${idx}" aria-selected="${
          idx === 0
        }">
          <div class="aspect-square w-full rounded-xl overflow-hidden bg-white mb-1">
            <img src="${g.src}" alt="${
          g.thumbLabel
        }" width="120" height="120" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <span class="block text-[11px] font-semibold text-[#141619] truncate">${
            g.thumbLabel
          }</span>
        </button>
      `
      )
      .join("");

    thumbsEl.querySelectorAll("button[data-thumb-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectSlide(parseInt(btn.getAttribute("data-thumb-idx"), 10), true);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () =>
        selectSlide(activeGalleryIdx - 1, true)
      );
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () =>
        selectSlide(activeGalleryIdx + 1, true)
      );
    }

    selectSlide(0, false);
  }

  // 2. Interactive Watch Anatomy & Night LED Switch
  function initAnatomy() {
    const leftEl = document.getElementById("anatomy-left");
    const rightEl = document.getElementById("anatomy-right");
    const watchImg = document.getElementById("anatomy-watch-img");
    const stageNote = document.getElementById("anatomy-stage-note");
    const ledBtn = document.getElementById("toggle-led-demo");
    const ledLabel = document.getElementById("led-btn-label");
    if (!leftEl || !rightEl || !CFG.anatomyCallouts) return;

    const setLedMode = (nightState) => {
      isNightLedOn = nightState;
      if (watchImg) {
        watchImg.src = isNightLedOn
          ? "/casio-f94/assets/images/f94-03-night-led.webp"
          : "/casio-f94/assets/images/f94-02-lcd-closeup.webp";
      }
      if (stageNote) {
        stageNote.textContent = isNightLedOn
          ? "Chế độ đèn LED đêm: Sáng xanh rõ nét khi bấm nút LIGHT góc trái"
          : "Chế độ ban ngày: Màn LCD phản quang rõ nét dưới ánh sáng tự nhiên";
      }
      if (ledLabel) {
        ledLabel.textContent = isNightLedOn
          ? "Đang bật đèn LED đêm (Bấm để về ban ngày)"
          : "Bấm thử đèn LIGHT ban đêm";
      }
    };

    const renderCard = (item, idx) => `
      <button
        type="button"
        data-anatomy-idx="${idx}"
        class="w-full text-left rounded-2xl p-4 border transition-all cursor-pointer"
      >
        <div class="flex items-center gap-2.5">
          <span class="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-[#F2C230] text-[#141619]">${item.num}</span>
          <span class="font-mono text-xs font-semibold text-zinc-400">${item.pos}</span>
        </div>
        <h3 class="mt-2 font-display text-base font-bold text-white">${item.title}</h3>
        <p class="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed">${item.desc}</p>
      </button>
    `;

    leftEl.innerHTML = CFG.anatomyCallouts
      .slice(0, 3)
      .map((it, i) => renderCard(it, i))
      .join("");
    rightEl.innerHTML = CFG.anatomyCallouts
      .slice(3, 6)
      .map((it, i) => renderCard(it, i + 3))
      .join("");

    const allBtns = document.querySelectorAll("button[data-anatomy-idx]");
    const highlightCallout = (idx, fromUser) => {
      activeAnatomyIdx = idx;
      const item = CFG.anatomyCallouts[idx];
      allBtns.forEach((b) => {
        const bIdx = parseInt(b.getAttribute("data-anatomy-idx"), 10);
        b.className =
          bIdx === idx
            ? "w-full text-left rounded-2xl p-4 border border-[#F2C230] bg-zinc-900 transition-all cursor-pointer"
            : "w-full text-left rounded-2xl p-4 border border-zinc-800 bg-zinc-900/45 hover:border-zinc-700 transition-all cursor-pointer";
      });
      if (fromUser && item) {
        setLedMode(Boolean(item.showNightPreview));
        if (window.VA_TRACKER) {
          window.VA_TRACKER.recordComboSelect(
            `Xem chi tiết: ${item.pos}`,
            `Giải phẫu: ${item.pos}`
          );
        }
      }
    };

    allBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        highlightCallout(
          parseInt(btn.getAttribute("data-anatomy-idx"), 10),
          true
        );
      });
    });

    if (ledBtn) {
      ledBtn.addEventListener("click", () => {
        setLedMode(!isNightLedOn);
        if (window.VA_TRACKER) {
          window.VA_TRACKER.recordHeroPackView(
            isNightLedOn ? "Bật thử đèn LED" : "Tắt đèn LED"
          );
        }
      });
    }

    highlightCallout(0, false);
  }

  // 3. Single-Item Fast Checkout (139.000đ Freeship)
  function initSingleCheckout() {
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const form = document.getElementById("order-form");
    const submitBtn = document.getElementById("order-submit-btn");
    const submitLabel = document.getElementById("order-submit-label");
    const successBox = document.getElementById("order-success-state");
    const resetBtn = document.getElementById("order-new-btn");

    const syncTotals = () => {
      const total = CFG.unitPrice * orderQty;
      const qtyEl = document.getElementById("summary-qty");
      const totalEl = document.getElementById("summary-total-price");
      const mobPrice = document.getElementById("mobile-bar-price");
      if (qtyEl) qtyEl.textContent = String(orderQty);
      if (totalEl) totalEl.textContent = formatVND(total);
      if (mobPrice) mobPrice.textContent = formatVND(total);
      if (submitLabel) {
        submitLabel.textContent = `HOÀN TẤT ĐẶT MUA - ${formatVND(
          total
        )} (FREESHIP)`;
      }
    };

    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => {
        if (orderQty > 1) {
          orderQty -= 1;
          if (window.VA_TRACKER) window.VA_TRACKER.recordQtyChange(orderQty);
          syncTotals();
        }
      });
      plusBtn.addEventListener("click", () => {
        if (orderQty < 10) {
          orderQty += 1;
          if (window.VA_TRACKER) window.VA_TRACKER.recordQtyChange(orderQty);
          syncTotals();
        }
      });
    }

    syncTotals();
    if (!form) return;

    const showErr = (inId, errId, msg) => {
      const inp = document.getElementById(inId);
      const err = document.getElementById(errId);
      if (inp) inp.classList.toggle("border-red-500", Boolean(msg));
      if (err) {
        err.textContent = msg || "";
        err.classList.toggle("hidden", !msg);
      }
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullName = document.getElementById("customer-name").value.trim();
      const phone = document
        .getElementById("customer-phone")
        .value.trim()
        .replace(/\s+/g, "");
      const address = document.getElementById("customer-address").value.trim();
      const note = document.getElementById("customer-note").value.trim();

      let ok = true;
      if (fullName.length < 2) {
        showErr("customer-name", "err-name", "Vui lòng nhập họ tên người nhận.");
        ok = false;
      } else showErr("customer-name", "err-name", "");

      if (!/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(phone)) {
        showErr(
          "customer-phone",
          "err-phone",
          "Vui lòng nhập số điện thoại 10 số hợp lệ."
        );
        ok = false;
      } else showErr("customer-phone", "err-phone", "");

      if (address.length < 8) {
        showErr(
          "customer-address",
          "err-address",
          "Vui lòng nhập rõ địa chỉ nhận hàng."
        );
        ok = false;
      } else showErr("customer-address", "err-address", "");

      if (!ok) return;

      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = "ĐANG GỬI ĐƠN ĐẶT HÀNG...";

      const orderCode =
        "F94-" + String(Math.floor(100000 + Math.random() * 900000));
      const totalAmountVND = CFG.unitPrice * orderQty;

      if (window.VA_TRACKER) {
        await window.VA_TRACKER.submitCompletedOrder({
          orderCode,
          customerName: fullName,
          phone,
          address,
          note,
          comboTitle: `${CFG.productName} - ${CFG.productVariant}`,
          quantity: orderQty,
          unitPrice: CFG.unitPrice,
          totalAmountVND
        });
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }

      submitBtn.disabled = false;
      syncTotals();

      document.getElementById("success-order-code").textContent = orderCode;
      document.getElementById("success-customer").textContent =
        `${fullName} (${phone})`;
      document.getElementById("success-combo").textContent =
        `${orderQty} chiếc x ${CFG.productName} (Vàng - Đen)`;
      document.getElementById("success-total").textContent =
        formatVND(totalAmountVND);

      const copyBtn = document.getElementById("copy-order-zalo");
      if (copyBtn) {
        copyBtn.onclick = async () => {
          const text = `Đơn ${orderCode} - ${CFG.productName} (F-94WA-8)\nKhách: ${fullName} (${phone})\nSố lượng: ${orderQty} chiếc\nTổng COD: ${formatVND(totalAmountVND)} (Miễn phí ship)\nĐ/c: ${address}`;
          try {
            await navigator.clipboard.writeText(text);
          } catch (_) {}
          window.open(CFG.contact.zaloUrl, "_blank", "noopener");
        };
      }

      form.classList.add("hidden");
      successBox.classList.remove("hidden");
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        orderQty = 1;
        if (window.VA_TRACKER) window.VA_TRACKER.startNewOrderCycle();
        syncTotals();
        successBox.classList.add("hidden");
        form.classList.remove("hidden");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateContact();
    initGallery();
    initAnatomy();
    initSingleCheckout();
  });
})();
