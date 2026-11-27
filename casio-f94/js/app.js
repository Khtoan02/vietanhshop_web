/**
 * Bộ điều khiển tương tác tối giản cho Trang Sản Phẩm Casio F94 (Single-SKU Editorial PDP)
 */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  const UNIT_PRICE = (cfg.product && cfg.product.unitPrice) || 139000;
  const state = {
    activeGalleryIdx: 0,
    quantity: 1,
    lastOrderText: ""
  };

  const formatVND = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

  function bindStaticConfig() {
    document.querySelectorAll("[data-bind='brandName']").forEach((el) => {
      el.textContent = cfg.brandName;
    });
    document.querySelectorAll("[data-bind='address']").forEach((el) => {
      el.textContent = cfg.contact.address;
    });
  }

  function initGallery() {
    const mainImg = document.getElementById("gallery-main-img");
    const thumbsWrap = document.getElementById("gallery-thumbs");
    const prevBtn = document.getElementById("gallery-prev");
    const nextBtn = document.getElementById("gallery-next");

    if (!mainImg || !thumbsWrap || !Array.isArray(cfg.gallery)) return;

    function setSlide(idx, userTriggered) {
      const total = cfg.gallery.length;
      state.activeGalleryIdx = ((idx % total) + total) % total;
      const item = cfg.gallery[state.activeGalleryIdx];

      mainImg.src = item.image;
      mainImg.alt = item.alt;

      thumbsWrap.querySelectorAll("button[data-slide-idx]").forEach((btn) => {
        const isCurrent =
          Number(btn.getAttribute("data-slide-idx")) === state.activeGalleryIdx;
        btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
        btn.className = isCurrent
          ? "group relative aspect-square rounded-xl overflow-hidden bg-white ring-2 ring-[#111111] transition cursor-pointer"
          : "group relative aspect-square rounded-xl overflow-hidden bg-[#F7F7F5] border border-[#EAEAEA] opacity-70 hover:opacity-100 transition cursor-pointer";
      });

      if (userTriggered && window.VA_TRACKER) {
        window.VA_TRACKER.recordHeroPackView(item.label);
      }
    }

    thumbsWrap.innerHTML = cfg.gallery
      .map(
        (item, idx) => `
        <button
          type="button"
          role="option"
          data-slide-idx="${idx}"
          aria-label="Xem ảnh: ${item.label}"
          aria-selected="${idx === 0 ? "true" : "false"}"
          class="${
            idx === 0
              ? "group relative aspect-square rounded-xl overflow-hidden bg-white ring-2 ring-[#111111] transition cursor-pointer"
              : "group relative aspect-square rounded-xl overflow-hidden bg-[#F7F7F5] border border-[#EAEAEA] opacity-70 hover:opacity-100 transition cursor-pointer"
          }"
        >
          <img
            src="${item.image}"
            alt="${item.label}"
            width="160"
            height="160"
            loading="lazy"
            class="w-full h-full object-cover"
          />
        </button>
      `
      )
      .join("");

    thumbsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-slide-idx]");
      if (!btn) return;
      setSlide(Number(btn.getAttribute("data-slide-idx")), true);
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () =>
        setSlide(state.activeGalleryIdx - 1, true)
      );
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () =>
        setSlide(state.activeGalleryIdx + 1, true)
      );
    }
  }

  function updateOrderPricingUI() {
    const qtyEl = document.getElementById("summary-qty");
    const totalEl = document.getElementById("summary-total-price");
    const btnLabel = document.getElementById("order-submit-label");
    const total = UNIT_PRICE * state.quantity;

    if (qtyEl) qtyEl.textContent = String(state.quantity);
    if (totalEl) totalEl.textContent = formatVND(total);
    if (btnLabel) {
      btnLabel.textContent = `Hoàn tất đặt hàng · ${formatVND(total)}`;
    }
  }

  function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.classList.remove("hidden");
    } else {
      el.textContent = "";
      el.classList.add("hidden");
    }
  }

  function initOrderForm() {
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const form = document.getElementById("order-form");
    const successBox = document.getElementById("order-success-state");
    const newOrderBtn = document.getElementById("order-new-btn");

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        if (state.quantity > 1) {
          state.quantity -= 1;
          updateOrderPricingUI();
          if (window.VA_TRACKER) window.VA_TRACKER.recordQtyChange(state.quantity);
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        if (state.quantity < 10) {
          state.quantity += 1;
          updateOrderPricingUI();
          if (window.VA_TRACKER) window.VA_TRACKER.recordQtyChange(state.quantity);
        }
      });
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameVal = document.getElementById("customer-name").value.trim();
      const phoneVal = document
        .getElementById("customer-phone")
        .value.trim()
        .replace(/\s+/g, "");
      const addrVal = document.getElementById("customer-address").value.trim();
      const noteVal = document.getElementById("customer-note").value.trim();

      let valid = true;
      if (nameVal.length < 2) {
        setFieldError("err-name", "Vui lòng nhập họ tên người nhận.");
        valid = false;
      } else {
        setFieldError("err-name", "");
      }

      if (!VN_PHONE_REGEX.test(phoneVal)) {
        setFieldError(
          "err-phone",
          "Số điện thoại cần đủ 10 số hợp lệ (ví dụ: 0912345678)."
        );
        valid = false;
      } else {
        setFieldError("err-phone", "");
      }

      if (addrVal.length < 6) {
        setFieldError("err-address", "Vui lòng nhập địa chỉ nhận hàng cụ thể.");
        valid = false;
      } else {
        setFieldError("err-address", "");
      }

      if (!valid) return;

      const orderCode = "F94-" + Date.now().toString().slice(-6);
      const totalAmount = UNIT_PRICE * state.quantity;
      const itemLabel = `Đồng hồ Casio F-94WA-9 (${state.quantity} chiếc)`;

      const submitBtn = document.getElementById("order-submit-btn");
      if (submitBtn) submitBtn.disabled = true;

      if (window.VA_TRACKER) {
        await window.VA_TRACKER.submitCompletedOrder({
          orderCode,
          customerName: nameVal,
          phone: phoneVal,
          address: addrVal,
          note: noteVal,
          comboTitle: itemLabel,
          quantity: state.quantity,
          unitPrice: UNIT_PRICE,
          totalAmountVND: totalAmount
        });
      }

      if (submitBtn) submitBtn.disabled = false;

      state.lastOrderText = [
        `ĐƠN ĐẶT HÀNG CASIO F94 (${orderCode})`,
        `- Sản phẩm: ${itemLabel}`,
        `- Thanh toán khi nhận hàng: ${formatVND(totalAmount)} (Miễn phí ship)`,
        `- Người nhận: ${nameVal} - ${phoneVal}`,
        `- Địa chỉ: ${addrVal}`,
        noteVal ? `- Ghi chú: ${noteVal}` : ""
      ]
        .filter(Boolean)
        .join("\n");

      document.getElementById("success-order-code").textContent = orderCode;
      document.getElementById("success-customer").textContent =
        `${nameVal} (${phoneVal})`;
      document.getElementById("success-combo").textContent = itemLabel;
      document.getElementById("success-total").textContent =
        formatVND(totalAmount);

      form.classList.add("hidden");
      successBox.classList.remove("hidden");
    });

    if (newOrderBtn) {
      newOrderBtn.addEventListener("click", () => {
        form.reset();
        state.quantity = 1;
        updateOrderPricingUI();
        if (window.VA_TRACKER) window.VA_TRACKER.startNewOrderCycle();
        successBox.classList.add("hidden");
        form.classList.remove("hidden");
      });
    }
  }

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal-up");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindStaticConfig();
    initGallery();
    updateOrderPricingUI();
    initOrderForm();
    initScrollReveal();
  });
})();
