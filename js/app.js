/**
 * Giao diện tối giản, sáng thoáng theo chuẩn mẫu Bakery & Pop-out Food Cards
 * Bảng giá chính thức: Combo 3 gói 500g (165.000đ) | Combo 6 gói 500g (295.000đ) | Combo 5 gói 200g (165.000đ)
 */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG;
  if (!CFG) return;

  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(num)) + " đ";

  const formatShortK = (num) => Math.round(num / 1000) + "K";

  const formatKg = (grams) => {
    const kg = grams / 1000;
    return (
      kg.toLocaleString("vi-VN", {
        minimumFractionDigits: kg % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 2
      }) + " kg"
    );
  };

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

    const lowest = [...CFG.combos].sort((a, b) => a.salePrice - b.salePrice)[0];
    if (lowest) {
      const sPrice = document.getElementById("hero-stamp-price");
      const sSub = document.getElementById("hero-stamp-old");
      if (sPrice) sPrice.textContent = formatShortK(lowest.salePrice);
      if (sSub) {
        if (lowest.originalPrice) {
          sSub.textContent = formatShortK(lowest.originalPrice);
          sSub.classList.add("line-through");
        } else {
          sSub.textContent = "+ Quà tặng";
          sSub.classList.remove("line-through");
        }
      }
    }

    const protoNotice = document.getElementById("prototype-price-banner");
    if (protoNotice) {
      protoNotice.style.display = CFG.isPrototypePricing ? "block" : "none";
    }
  }

  function initHeroPackSwitcher() {
    const heroImg = document.getElementById("hero-cutout-img");
    const btns = document.querySelectorAll("[data-hero-switch]");
    if (!heroImg || !btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextSrc = btn.getAttribute("data-hero-switch");
        btns.forEach((b) => {
          b.className =
            "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#432312] border border-stone-300/80 hover:border-[#432312] transition-colors";
        });
        btn.className =
          "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#432312] text-white transition-colors";

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

  // Render Pop-Out Combo Cards (Exact Reference 1 Bottom Card Layout!)
  function renderCombos() {
    const gridEl = document.getElementById("combo-cards-grid");
    const radioGroupEl = document.getElementById("checkout-combo-radios");
    if (!gridEl) return;

    gridEl.innerHTML = CFG.combos
      .map((combo) => {
        const isGold = combo.featured;
        const cardBg = isGold ? "bg-[#EEB04E]" : "bg-[#EAE6E1]";
        const bodyText = isGold ? "text-[#432312]" : "text-[#5C4332]";
        const btnStyle = isGold
          ? "bg-white hover:bg-stone-50 text-[#432312]"
          : "bg-[#EEAA43] hover:bg-[#DF982E] text-[#432312]";

        const stampBottom = combo.originalPrice
          ? `<span class="font-mono text-[11px] text-stone-400 line-through">${formatShortK(
              combo.originalPrice
            )}</span>`
          : `<span class="text-[10px] font-bold text-[#C2742F]">Freeship</span>`;

        return `
        <article class="relative rounded-[2.2rem] ${cardBg} pt-24 pb-7 px-6 sm:px-7 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
          <!-- Floating Pop-Out Cutout Packshot + Free Gift -->
          <div class="absolute -top-14 left-5 right-28 flex items-end gap-1.5 pointer-events-none">
            <img
              src="${combo.mainImage}"
              alt="${combo.title} - ${combo.productName}"
              width="240"
              height="165"
              loading="lazy"
              class="h-28 sm:h-32 w-auto object-contain cutout-shadow"
            />
            <img
              src="${combo.giftImage}"
              alt="${combo.giftText}"
              width="95"
              height="76"
              loading="lazy"
              class="h-16 w-auto object-contain cutout-shadow-sm -ml-3 mb-1"
            />
          </div>

          <!-- Circular White Price Stamp on Top-Right -->
          <div class="price-stamp-white absolute -top-7 right-5 w-24 h-24 flex flex-col items-center justify-center text-center p-2">
            <span class="text-[10px] font-display font-bold uppercase tracking-wider text-[#6E4730]">GIÁ CHỈ</span>
            <span class="font-mono text-xl font-extrabold text-[#432312] leading-tight">${formatShortK(
              combo.salePrice
            )}</span>
            ${stampBottom}
          </div>

          <div>
            <p class="font-script text-xl font-bold ${
              isGold ? "text-[#432312]" : "text-[#C2742F]"
            }">
              ${combo.badge}
            </p>
            <h3 class="font-display text-2xl font-extrabold text-[#432312] leading-snug">
              ${combo.title}
            </h3>
            <p class="text-xs font-bold uppercase tracking-wide ${
              isGold ? "text-[#432312]/80" : "text-[#6E4730]"
            } mt-0.5">
              ${combo.productName}
            </p>

            <p class="mt-2.5 inline-block rounded-full ${
              isGold ? "bg-white/85" : "bg-white"
            } px-3.5 py-1 text-xs font-extrabold text-[#432312]">
              + ${combo.giftText}
            </p>

            <p class="mt-3 text-xs sm:text-sm ${bodyText} leading-relaxed">
              ${combo.mainPackText}. ${combo.totalPacksText}, miễn phí giao hàng toàn quốc, mở thùng kiểm hàng trước khi thanh toán.
            </p>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3 pt-4 border-t ${
            isGold ? "border-[#432312]/15" : "border-[#432312]/10"
          }">
            <span class="font-mono text-lg font-extrabold text-[#432312]">${formatVND(
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
                }" class="w-4 h-4 accent-[#C2742F]" ${
            combo.id === selectedComboId ? "checked" : ""
          } />
                <div>
                  <span class="block font-display text-sm font-bold text-[#432312]">${
                    combo.title
                  } - ${combo.productName}</span>
                  <span class="block text-xs text-[#C2742F] font-semibold">+ ${
                    combo.giftText
                  } (Miễn phí ship)</span>
                </div>
              </div>
              <span class="font-mono text-sm font-extrabold text-[#432312] shrink-0">${formatVND(
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
          updateSummary();
        });
      });
    }

    gridEl.querySelectorAll("button[data-select-combo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedComboId = btn.getAttribute("data-select-combo");
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
          updateSummary();
        }
      });
      plusBtn.addEventListener("click", () => {
        if (orderQty < 20) {
          orderQty += 1;
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
        ? "cursor-pointer block rounded-xl border p-3 transition-colors border-[#EEAA43] bg-[#FFF9EF]"
        : "cursor-pointer block rounded-xl border p-3 transition-colors border-stone-200 bg-white hover:border-stone-300";
    });

    const totalSale = combo.salePrice * orderQty;
    const totalGrams = combo.totalWeightGrams * orderQty;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const mImg = document.getElementById("summary-main-img");
    const gImg = document.getElementById("summary-gift-img");
    if (mImg) mImg.src = combo.mainImage;
    if (gImg) gImg.src = combo.giftImage;

    setTxt("summary-combo-title", `${combo.title} - ${combo.productName}`);
    setTxt("summary-main-pack", `${orderQty} x ${combo.mainPackText}`);
    setTxt("summary-gift-pack", `${orderQty} x (${combo.giftText})`);
    setTxt("summary-qty", String(orderQty));
    setTxt("summary-weight", formatKg(totalGrams));
    setTxt("summary-total-price", formatVND(totalSale));
    setTxt("mobile-bar-title", `${combo.title} (${combo.giftShort})`);
    setTxt("mobile-bar-price", formatVND(combo.salePrice));
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
      if (inp) {
        inp.classList.toggle("border-red-500", Boolean(msg));
      }
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
      if (submitLabel) submitLabel.textContent = "ĐANG GỬI ĐƠN HÀNG...";

      const combo =
        CFG.combos.find((c) => c.id === selectedComboId) || CFG.combos[0];
      const orderCode =
        "VA-" + String(Math.floor(100000 + Math.random() * 900000));
      const payload = {
        orderCode,
        createdAt: new Date().toISOString(),
        customerName: fullName,
        phone,
        address,
        note,
        comboTitle: `${combo.title} - ${combo.productName}`,
        giftText: combo.giftText,
        quantity: orderQty,
        totalAmountVND: combo.salePrice * orderQty
      };

      if (CFG.contact.orderWebhookUrl) {
        try {
          await fetch(CFG.contact.orderWebhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } catch (_) {}
      } else {
        await new Promise((r) => setTimeout(r, 450));
      }

      submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = "ĐẶT MUA NGAY (MIỄN PHÍ SHIP)";

      document.getElementById("success-order-code").textContent = orderCode;
      document.getElementById("success-customer").textContent =
        `${fullName} (${phone})`;
      document.getElementById("success-combo").textContent =
        `${orderQty} x ${combo.title} - ${combo.productName} (${combo.giftShort})`;
      document.getElementById("success-total").textContent = formatVND(
        payload.totalAmountVND
      );

      const copyBtn = document.getElementById("copy-order-zalo");
      if (copyBtn) {
        copyBtn.onclick = async () => {
          const text = `Đơn ${orderCode} - ${fullName} (${phone})\n${orderQty} x ${combo.title} - ${combo.productName} (${combo.giftText})\nTổng COD: ${formatVND(payload.totalAmountVND)} (Freeship)\nĐ/c: ${address}`;
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
