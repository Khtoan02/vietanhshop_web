/**
 * Logic tương tác & đồng bộ bộ đo lường 38 chỉ số (VA_TRACKER)
 * Đồng hồ Casio F94 - Giá 139.000đ Miễn phí ship - Việt Anh Shop
 */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG;
  if (!CFG) return;

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(num)) + " đ";

  const formatShortK = (num) => Math.round(num / 1000) + "K";

  let selectedComboId =
    (CFG.combos.find((c) => c.featured) || CFG.combos[0]).id;
  let orderQty = 1;

  function hydrateBrandAndContact() {
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

  function initHeroPackSwitcher() {
    const heroImg = document.getElementById("hero-cutout-img");
    const btns = document.querySelectorAll("[data-hero-switch]");
    if (!heroImg || !btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextSrc = btn.getAttribute("data-hero-switch");
        const label = (btn.textContent || "").trim();
        if (window.VA_TRACKER) {
          window.VA_TRACKER.recordHeroPackView(label);
        }

        btns.forEach((b) => {
          b.className =
            "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#141619] border border-zinc-300 hover:border-[#141619] transition-colors";
        });
        btn.className =
          "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#141619] text-white transition-colors";

        heroImg.style.opacity = "0";
        heroImg.style.transform = "scale(0.96)";
        setTimeout(() => {
          heroImg.src = nextSrc;
          heroImg.style.opacity = "1";
          heroImg.style.transform = "scale(1)";
        }, 140);
      });
    });
  }

  function renderCombos() {
    const gridEl = document.getElementById("combo-cards-grid");
    const radioGroupEl = document.getElementById("checkout-combo-radios");
    if (!gridEl) return;

    gridEl.innerHTML = CFG.combos
      .map((combo) => {
        const isFeatured = combo.featured;
        const cardBg = isFeatured ? "bg-[#F2C230]" : "bg-[#ECEEF2]";
        const bodyText = isFeatured ? "text-[#141619]" : "text-zinc-600";
        const btnStyle = isFeatured
          ? "bg-[#141619] hover:bg-zinc-800 text-[#F2C230]"
          : "bg-[#F2C230] hover:bg-[#E0AF1B] text-[#141619]";

        return `
        <article class="relative rounded-[2.2rem] ${cardBg} pt-24 pb-7 px-6 sm:px-7 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <!-- Pop-Out Cutout Watch -->
          <div class="absolute -top-14 left-6 right-28 flex items-end pointer-events-none">
            <img
              src="${combo.mainImage}"
              alt="${combo.title}"
              width="180"
              height="180"
              loading="lazy"
              class="h-32 w-auto object-contain cutout-shadow"
            />
          </div>

          <!-- Circular White Price Stamp on Top-Right -->
          <div class="price-stamp-white absolute -top-7 right-5 w-24 h-24 flex flex-col items-center justify-center text-center p-2">
            <span class="text-[10px] font-display font-bold uppercase tracking-wider text-zinc-500">TRỌN GÓI</span>
            <span class="font-mono text-xl font-extrabold text-[#141619] leading-tight">${formatShortK(
              combo.salePrice
            )}</span>
            <span class="text-[10px] font-extrabold text-emerald-700">Freeship</span>
          </div>

          <div>
            <p class="font-mono text-[11px] uppercase tracking-wider font-bold ${
              isFeatured ? "text-[#141619]/80" : "text-zinc-500"
            }">
              ${combo.badge}
            </p>
            <h3 class="mt-1 font-display text-2xl font-extrabold text-[#141619] leading-snug">
              ${combo.title}
            </h3>
            <p class="text-xs font-bold ${
              isFeatured ? "text-[#141619]/85" : "text-zinc-600"
            } mt-0.5">
              ${combo.productName}
            </p>

            <p class="mt-2.5 inline-block rounded-full ${
              isFeatured ? "bg-white/90" : "bg-white"
            } px-3.5 py-1 text-xs font-extrabold text-[#141619]">
              ${combo.giftText}
            </p>

            <p class="mt-3 text-xs sm:text-sm ${bodyText} leading-relaxed">
              ${combo.mainPackText}. ${combo.totalPacksText}.
            </p>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3 pt-4 border-t ${
            isFeatured ? "border-[#141619]/15" : "border-[#141619]/10"
          }">
            <span class="font-mono text-lg font-extrabold text-[#141619]">${formatVND(
              combo.salePrice
            )}</span>
            <button
              type="button"
              data-select-combo="${combo.id}"
              class="${btnStyle} rounded-full px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              ĐẶT MUA NGAY
            </button>
          </div>
        </article>
      `;
      })
      .join("");

    if (radioGroupEl) {
      radioGroupEl.innerHTML = CFG.combos
        .map(
          (combo) => `
          <label class="cursor-pointer block rounded-xl border p-3 transition-colors" data-radio-card="${
            combo.id
          }">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <input type="radio" name="comboId" value="${
                  combo.id
                }" class="w-4 h-4 accent-[#141619]" ${
            combo.id === selectedComboId ? "checked" : ""
          } />
                <div>
                  <span class="block font-display text-sm font-bold text-[#141619]">${
                    combo.title
                  }</span>
                  <span class="block text-xs text-emerald-700 font-semibold">${
                    combo.giftText
                  }</span>
                </div>
              </div>
              <span class="font-mono text-sm font-extrabold text-[#141619] shrink-0">${formatVND(
                combo.salePrice
              )}</span>
            </div>
          </label>
        `
        )
        .join("");

      radioGroupEl.querySelectorAll("input[name='comboId']").forEach((inp) => {
        inp.addEventListener("change", () => {
          selectedComboId = inp.value;
          const chosen = CFG.combos.find((c) => c.id === selectedComboId);
          if (chosen && window.VA_TRACKER) {
            window.VA_TRACKER.recordComboSelect(
              chosen.title,
              `Đổi ở Form: ${chosen.title}`
            );
          }
          updateSummary();
        });
      });
    }

    gridEl.querySelectorAll("button[data-select-combo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedComboId = btn.getAttribute("data-select-combo");
        const chosen = CFG.combos.find((c) => c.id === selectedComboId);
        if (chosen && window.VA_TRACKER) {
          window.VA_TRACKER.recordComboSelect(
            chosen.title,
            `Bấm Card: ${chosen.title}`
          );
        }
        updateSummary();
        const target = document.getElementById("dat-hang");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => {
        if (orderQty > 1) {
          orderQty -= 1;
          if (window.VA_TRACKER) window.VA_TRACKER.recordQtyChange(orderQty);
          updateSummary();
        }
      });
      plusBtn.addEventListener("click", () => {
        if (orderQty < 20) {
          orderQty += 1;
          if (window.VA_TRACKER) window.VA_TRACKER.recordQtyChange(orderQty);
          updateSummary();
        }
      });
    }

    updateSummary();
  }

  function updateSummary() {
    const combo =
      CFG.combos.find((c) => c.id === selectedComboId) || CFG.combos[0];

    document.querySelectorAll("[data-radio-card]").forEach((lbl) => {
      const active = lbl.getAttribute("data-radio-card") === combo.id;
      const inp = lbl.querySelector("input[type='radio']");
      if (inp) inp.checked = active;
      lbl.className = active
        ? "cursor-pointer block rounded-xl border p-3 transition-colors border-[#141619] bg-[#FEFCE8]"
        : "cursor-pointer block rounded-xl border p-3 transition-colors border-zinc-200 bg-white hover:border-zinc-300";
    });

    const totalSale = combo.salePrice * orderQty;
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const mImg = document.getElementById("summary-main-img");
    if (mImg) mImg.src = combo.mainImage;

    setTxt("summary-combo-title", `${combo.title} - ${combo.productName}`);
    setTxt("summary-main-pack", `${orderQty} x ${combo.mainPackText}`);
    setTxt("summary-gift-pack", combo.giftText);
    setTxt("summary-qty", String(orderQty));
    setTxt("summary-total-price", formatVND(totalSale));
    setTxt("mobile-bar-title", `${combo.title} (${combo.giftShort})`);
    setTxt("mobile-bar-price", formatVND(totalSale));
    const submitLabel = document.getElementById("order-submit-label");
    if (submitLabel) {
      submitLabel.textContent = `ĐẶT MUA NGAY - ${formatVND(totalSale)} (FREESHIP)`;
    }
  }

  function initOrderForm() {
    const form = document.getElementById("order-form");
    const submitBtn = document.getElementById("order-submit-btn");
    const submitLabel = document.getElementById("order-submit-label");
    const successBox = document.getElementById("order-success-state");
    const resetBtn = document.getElementById("order-new-btn");
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
      if (submitLabel) submitLabel.textContent = "ĐANG GHI NHẬN ĐƠN HÀNG...";

      const combo =
        CFG.combos.find((c) => c.id === selectedComboId) || CFG.combos[0];
      const orderCode =
        "F94-" + String(Math.floor(100000 + Math.random() * 900000));
      const totalAmountVND = combo.salePrice * orderQty;

      if (window.VA_TRACKER) {
        await window.VA_TRACKER.submitCompletedOrder({
          orderCode,
          customerName: fullName,
          phone,
          address,
          note,
          comboTitle: `${combo.title} (${combo.productName})`,
          quantity: orderQty,
          unitPrice: combo.salePrice,
          totalAmountVND
        });
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }

      submitBtn.disabled = false;
      if (submitLabel) {
        submitLabel.textContent = `ĐẶT MUA NGAY - ${formatVND(totalAmountVND)} (FREESHIP)`;
      }

      document.getElementById("success-order-code").textContent = orderCode;
      document.getElementById("success-customer").textContent =
        `${fullName} (${phone})`;
      document.getElementById("success-combo").textContent =
        `${orderQty} x ${combo.title}`;
      document.getElementById("success-total").textContent =
        formatVND(totalAmountVND);

      const copyBtn = document.getElementById("copy-order-zalo");
      if (copyBtn) {
        copyBtn.onclick = async () => {
          const text = `Đơn ${orderCode} - Đồng hồ Casio F94\nKhách: ${fullName} (${phone})\nSL: ${orderQty} x ${combo.title}\nTổng COD: ${formatVND(totalAmountVND)} (Miễn phí ship)\nĐ/c: ${address}`;
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
        updateSummary();
        successBox.classList.add("hidden");
        form.classList.remove("hidden");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateBrandAndContact();
    initHeroPackSwitcher();
    renderCombos();
    initOrderForm();
  });
})();
