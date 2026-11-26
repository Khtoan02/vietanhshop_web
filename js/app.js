/**
 * Logic tương tác, tính toán Combo & GSAP Choreography
 * Kẹo Lạc Nam Định - Việt Anh Shop
 */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG;
  if (!CFG) return;

  // Helpers
  const formatVND = (num) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(num)) + "đ";

  const formatKg = (grams) => {
    const kg = grams / 1000;
    return kg.toLocaleString("vi-VN", {
      minimumFractionDigits: kg % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 2
    }) + " kg";
  };

  // State
  let selectedComboId =
    (CFG.combos.find((c) => c.featured) || CFG.combos[0]).id;
  let orderQty = 1;
  let activeProductId = CFG.products[0].id;

  // Official Phosphor SVG Icon Snippets (Regular weight, 256x256 viewBox, uniform stroke)
  const ICONS = {
    arrowUpRight:
      '<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><line x1="64" y1="192" x2="192" y2="64"></line><polyline points="88 64 192 64 192 168"></polyline></svg>',
    check:
      '<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0" aria-hidden="true"><polyline points="40 144 96 200 224 72"></polyline></svg>',
    gift:
      '<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 shrink-0" aria-hidden="true"><rect x="32" y="80" width="192" height="48" rx="8"></rect><path d="M208,128v72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V128"></path><line x1="128" y1="80" x2="128" y2="208"></line><path d="M176,80H128V52a28,28,0,0,1,56,0C184,68,176,80,176,80Z"></path><path d="M80,80h48V52a28,28,0,0,0-56,0C72,68,80,80,80,80Z"></path></svg>',
    truck:
      '<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0" aria-hidden="true"><path d="M176,80h42.6a7.9,7.9,0,0,1,7.4,5l14,35v60a8,8,0,0,1-8,8H208"></path><circle cx="184" cy="188" r="24"></circle><circle cx="72" cy="188" r="24"></circle><line x1="160" y1="188" x2="96" y2="188"></line><path d="M48,188H24a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H176V169.4"></path></svg>'
  };

  // 1. Bind Brand & Contact Info across DOM
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
    document.querySelectorAll("[data-bind='workingHours']").forEach((el) => {
      el.textContent = CFG.contact.workingHours;
    });

    const protoNotice = document.getElementById("prototype-price-banner");
    if (protoNotice) {
      protoNotice.style.display = CFG.isPrototypePricing ? "flex" : "none";
    }
  }

  // 2. Theme Toggle (Light / Dark Mode Parity)
  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem("va_theme");
    if (saved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    document.querySelectorAll("[data-action='toggle-theme']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        localStorage.setItem("va_theme", isDark ? "dark" : "light");
      });
    });
  }

  // 3. Mobile Fluid Island Menu
  function initMobileMenu() {
    const toggleBtn = document.getElementById("mobile-menu-btn");
    const overlay = document.getElementById("mobile-menu-overlay");
    const lineTop = document.getElementById("burger-top");
    const lineBot = document.getElementById("burger-bot");
    if (!toggleBtn || !overlay) return;

    let open = false;
    const setMenu = (state) => {
      open = state;
      toggleBtn.setAttribute("aria-expanded", String(open));
      if (open) {
        overlay.classList.remove("pointer-events-none", "opacity-0");
        overlay.classList.add("pointer-events-auto", "opacity-100");
        lineTop.classList.add("translate-y-[4px]", "rotate-45");
        lineBot.classList.add("-translate-y-[4px]", "-rotate-45");
        document.body.style.overflow = "hidden";
        overlay.querySelectorAll(".mobile-nav-item").forEach((item, idx) => {
          item.style.transitionDelay = `${80 + idx * 55}ms`;
          item.classList.remove("translate-y-6", "opacity-0");
          item.classList.add("translate-y-0", "opacity-100");
        });
      } else {
        overlay.classList.add("pointer-events-none", "opacity-0");
        overlay.classList.remove("pointer-events-auto", "opacity-100");
        lineTop.classList.remove("translate-y-[4px]", "rotate-45");
        lineBot.classList.remove("-translate-y-[4px]", "-rotate-45");
        document.body.style.overflow = "";
        overlay.querySelectorAll(".mobile-nav-item").forEach((item) => {
          item.style.transitionDelay = "0ms";
          item.classList.add("translate-y-6", "opacity-0");
          item.classList.remove("translate-y-0", "opacity-100");
        });
      }
    };

    toggleBtn.addEventListener("click", () => setMenu(!open));
    overlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setMenu(false);
    });
  }

  // 4. Hero Pack Quick Switcher
  function initHeroShowcase() {
    const heroImg = document.getElementById("hero-main-pack");
    const heroCaption = document.getElementById("hero-pack-caption");
    const buttons = document.querySelectorAll("[data-hero-pack]");
    if (!heroImg || !buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-img");
        const caption = btn.getAttribute("data-caption");
        buttons.forEach((b) => {
          b.classList.remove(
            "bg-[#9E1B1B]",
            "text-white",
            "border-[#9E1B1B]"
          );
          b.classList.add(
            "bg-white/90",
            "dark:bg-zinc-800/90",
            "text-zinc-700",
            "dark:text-zinc-200",
            "border-zinc-200/80",
            "dark:border-zinc-700"
          );
        });
        btn.classList.add("bg-[#9E1B1B]", "text-white", "border-[#9E1B1B]");
        btn.classList.remove(
          "bg-white/90",
          "dark:bg-zinc-800/90",
          "text-zinc-700",
          "dark:text-zinc-200",
          "border-zinc-200/80",
          "dark:border-zinc-700"
        );

        heroImg.style.opacity = "0";
        heroImg.style.transform = "scale(0.96)";
        setTimeout(() => {
          heroImg.src = src;
          if (heroCaption) heroCaption.textContent = caption;
          heroImg.style.opacity = "1";
          heroImg.style.transform = "scale(1)";
        }, 180);
      });
    });
  }

  // 5. Interactive Product Trilogy Stage
  function renderProductTrilogy() {
    const tabsEl = document.getElementById("product-tabs");
    const stageImg = document.getElementById("trilogy-pack-img");
    const stageSubImg = document.getElementById("trilogy-sub-img");
    const stageTag = document.getElementById("trilogy-tag");
    const stageName = document.getElementById("trilogy-name");
    const stageWeight = document.getElementById("trilogy-weight");
    const stageSummary = document.getElementById("trilogy-summary");
    const stageNotes = document.getElementById("trilogy-notes");
    if (!tabsEl || !stageImg) return;

    const updateStage = (productId) => {
      activeProductId = productId;
      const prod =
        CFG.products.find((p) => p.id === productId) || CFG.products[0];

      tabsEl.querySelectorAll("button[data-prod-id]").forEach((btn) => {
        const isActive = btn.getAttribute("data-prod-id") === prod.id;
        btn.setAttribute("aria-selected", String(isActive));
        if (isActive) {
          btn.className =
            "w-full text-left p-5 rounded-2xl border transition-all duration-500 ease-fluid bg-white dark:bg-zinc-900 border-[#9E1B1B] shadow-[0_12px_28px_-10px_rgba(158,27,27,0.16)]";
        } else {
          btn.className =
            "w-full text-left p-5 rounded-2xl border transition-all duration-500 ease-fluid bg-[#F3EFEA]/60 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700";
        }
      });

      const panel = document.getElementById("trilogy-panel");
      if (panel) {
        panel.style.opacity = "0.35";
        panel.style.transform = "translateY(6px)";
      }

      setTimeout(() => {
        stageImg.src = prod.image;
        stageImg.alt = prod.name;
        if (stageSubImg) {
          stageSubImg.src = prod.secondaryImage;
          stageSubImg.alt = prod.tag;
        }
        if (stageTag) stageTag.textContent = prod.tag;
        if (stageName) stageName.textContent = prod.name;
        if (stageWeight) stageWeight.textContent = prod.weight;
        if (stageSummary) stageSummary.textContent = prod.summary;
        if (stageNotes) {
          stageNotes.innerHTML = prod.tasteNotes
            .map(
              (n) => `
              <div class="pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <dt class="text-xs font-medium text-zinc-500 dark:text-zinc-400">${n.label}</dt>
                <dd class="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">${n.value}</dd>
              </div>
            `
            )
            .join("");
        }
        if (panel) {
          panel.style.opacity = "1";
          panel.style.transform = "translateY(0)";
        }
      }, 150);
    };

    tabsEl.innerHTML = CFG.products
      .map(
        (p) => `
        <button type="button" role="tab" data-prod-id="${p.id}" aria-selected="${
          p.id === activeProductId
        }">
          <div class="flex items-center justify-between gap-3">
            <span class="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">${
              p.name
            }</span>
            <span class="font-mono text-xs px-2.5 py-1 rounded-full bg-[#FEF2F2] dark:bg-red-950/60 text-[#9E1B1B] dark:text-red-300 font-semibold shrink-0">${
              p.weight
            }</span>
          </div>
          <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">${
            p.tag
          }</p>
        </button>
      `
      )
      .join("");

    tabsEl.querySelectorAll("button[data-prod-id]").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateStage(btn.getAttribute("data-prod-id"))
      );
    });

    updateStage(activeProductId);
  }

  // 6. Combo Cards & Live Checkout Synchronization
  function renderCombosAndSyncCheckout() {
    const gridEl = document.getElementById("combo-cards-grid");
    const radioGroupEl = document.getElementById("checkout-combo-radios");
    if (!gridEl) return;

    gridEl.innerHTML = CFG.combos
      .map((combo) => {
        const saving = Math.max(0, combo.originalPrice - combo.salePrice);
        const savingPct =
          combo.originalPrice > 0
            ? Math.round((saving / combo.originalPrice) * 100)
            : 0;

        return `
        <article class="combo-card bezel-shell flex flex-col justify-between transition-transform duration-500 ease-fluid ${
          combo.featured
            ? "ring-2 ring-[#9E1B1B] lg:-translate-y-3"
            : ""
        }" data-combo-card="${combo.id}">
          <div class="bezel-core p-6 md:p-7 flex flex-col h-full justify-between relative overflow-hidden">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  combo.featured
                    ? "bg-[#9E1B1B] text-white"
                    : "bg-[#F3EFEA] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }">${combo.badge}</span>
                ${
                  savingPct > 0
                    ? `<span class="font-mono text-xs font-semibold text-[#9E1B1B] dark:text-red-400 bg-[#FEF2F2] dark:bg-red-950/50 px-2.5 py-1 rounded-full">Tiết kiệm ${savingPct}%</span>`
                    : ""
                }
              </div>

              <div class="mt-5 relative rounded-2xl bg-[#FAF9F6] dark:bg-zinc-950/70 p-4 border border-zinc-200/70 dark:border-zinc-800/80">
                <div class="grid grid-cols-12 items-center gap-3">
                  <div class="col-span-8 flex items-center justify-center">
                    <img src="${combo.mainImage}" alt="${combo.title}" width="320" height="220" loading="lazy" class="h-36 w-auto object-contain transition-transform duration-500 ease-fluid hover:scale-105" />
                  </div>
                  <div class="col-span-4 flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 p-2.5 border border-amber-300/70 dark:border-amber-700/50 text-center">
                    <span class="text-[11px] font-bold text-[#B45309] dark:text-amber-400">QUÀ TẶNG</span>
                    <img src="${combo.giftImage}" alt="${combo.giftText}" width="120" height="96" loading="lazy" class="h-14 w-auto object-contain my-1" />
                    <span class="text-[11px] font-semibold leading-tight text-zinc-800 dark:text-zinc-200">${combo.giftShort}</span>
                  </div>
                </div>
              </div>

              <h3 class="mt-5 font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">${combo.title}</h3>
              <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">${combo.subtitle}</p>

              <div class="mt-4 p-3 rounded-xl bg-[#FEF2F2]/80 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/50 flex items-center gap-2.5 text-[#9E1B1B] dark:text-red-300">
                ${ICONS.gift}
                <span class="text-sm font-semibold">${combo.giftText}</span>
              </div>

              <ul class="mt-4 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                ${combo.perks
                  .map(
                    (perk) => `
                  <li class="flex items-start gap-2.5">
                    <span class="mt-0.5 text-[#9E1B1B] dark:text-red-400">${ICONS.check}</span>
                    <span>${perk}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div class="mt-6 pt-5 border-t border-zinc-200/80 dark:border-zinc-800">
              <div class="flex items-baseline justify-between gap-2">
                <div>
                  <span class="block text-xs text-zinc-500 dark:text-zinc-400">${combo.totalPacksText}</span>
                  <div class="mt-1 flex items-baseline gap-2.5">
                    <span class="font-mono text-2xl md:text-3xl font-bold text-[#9E1B1B] dark:text-red-400">${formatVND(
                      combo.salePrice
                    )}</span>
                    <span class="font-mono text-sm text-zinc-400 line-through">${formatVND(
                      combo.originalPrice
                    )}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                data-select-combo="${combo.id}"
                class="group mt-5 w-full rounded-full pl-6 pr-2 py-2 font-display text-sm font-semibold transition-all duration-500 ease-fluid active:scale-[0.98] flex items-center justify-between ${
                  combo.featured
                    ? "bg-[#9E1B1B] hover:bg-[#7F1515] text-white"
                    : "bg-zinc-900 hover:bg-[#9E1B1B] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-[#9E1B1B] dark:hover:text-white"
                }"
              >
                <span>Chọn combo ưu đãi</span>
                <span class="w-9 h-9 rounded-full bg-white/15 dark:bg-black/10 flex items-center justify-center transition-transform duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ${ICONS.arrowUpRight}
                </span>
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    if (radioGroupEl) {
      radioGroupEl.innerHTML = CFG.combos
        .map(
          (combo) => `
          <label class="cursor-pointer block rounded-2xl border p-3.5 transition-all duration-300 ease-fluid" data-radio-card="${
            combo.id
          }">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <input type="radio" name="comboId" value="${
                  combo.id
                }" class="w-4 h-4 accent-[#9E1B1B]" ${
            combo.id === selectedComboId ? "checked" : ""
          } />
                <div>
                  <span class="block font-display text-sm font-bold text-zinc-900 dark:text-zinc-100">${
                    combo.title
                  }</span>
                  <span class="block text-xs text-[#9E1B1B] dark:text-red-400 font-medium">${
                    combo.giftText
                  }</span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="block font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">${formatVND(
                  combo.salePrice
                )}</span>
                <span class="block font-mono text-[11px] text-zinc-400 line-through">${formatVND(
                  combo.originalPrice
                )}</span>
              </div>
            </div>
          </label>
        `
        )
        .join("");

      radioGroupEl.querySelectorAll("input[name='comboId']").forEach((inp) => {
        inp.addEventListener("change", () => {
          selectedComboId = inp.value;
          updateCheckoutSummary();
        });
      });
    }

    gridEl.querySelectorAll("button[data-select-combo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedComboId = btn.getAttribute("data-select-combo");
        updateCheckoutSummary();
        const target = document.getElementById("dat-hang");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Quantity buttons
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => {
        if (orderQty > 1) {
          orderQty -= 1;
          updateCheckoutSummary();
        }
      });
      plusBtn.addEventListener("click", () => {
        if (orderQty < 20) {
          orderQty += 1;
          updateCheckoutSummary();
        }
      });
    }

    updateCheckoutSummary();
  }

  function updateCheckoutSummary() {
    const combo =
      CFG.combos.find((c) => c.id === selectedComboId) || CFG.combos[0];

    // Sync radio styling
    document.querySelectorAll("[data-radio-card]").forEach((lbl) => {
      const id = lbl.getAttribute("data-radio-card");
      const inp = lbl.querySelector("input[type='radio']");
      const active = id === combo.id;
      if (inp) inp.checked = active;
      if (active) {
        lbl.className =
          "cursor-pointer block rounded-2xl border p-3.5 transition-all duration-300 ease-fluid border-[#9E1B1B] bg-[#FEF2F2]/60 dark:bg-red-950/30";
      } else {
        lbl.className =
          "cursor-pointer block rounded-2xl border p-3.5 transition-all duration-300 ease-fluid border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300";
      }
    });

    const totalSale = combo.salePrice * orderQty;
    const totalOrig = combo.originalPrice * orderQty;
    const totalSave = Math.max(0, totalOrig - totalSale);
    const totalGrams = combo.totalWeightGrams * orderQty;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const sumMainImg = document.getElementById("summary-main-img");
    const sumGiftImg = document.getElementById("summary-gift-img");
    if (sumMainImg) sumMainImg.src = combo.mainImage;
    if (sumGiftImg) sumGiftImg.src = combo.giftImage;

    setTxt("summary-combo-title", combo.title);
    setTxt("summary-main-pack", `${orderQty} x ${combo.mainPackText}`);
    setTxt("summary-gift-pack", `${orderQty} x (${combo.giftText})`);
    setTxt("summary-qty", String(orderQty));
    setTxt("summary-weight", formatKg(totalGrams));
    setTxt("summary-orig-price", formatVND(totalOrig));
    setTxt("summary-saving", "-" + formatVND(totalSave));
    setTxt("summary-total-price", formatVND(totalSale));
    setTxt("mobile-bar-price", formatVND(combo.salePrice));
    setTxt("mobile-bar-title", combo.title);
  }

  // 7. Accessible Order Form Validation & Submission
  function initOrderForm() {
    const form = document.getElementById("order-form");
    const submitBtn = document.getElementById("order-submit-btn");
    const submitText = document.getElementById("order-submit-label");
    const successBox = document.getElementById("order-success-state");
    const resetBtn = document.getElementById("order-new-btn");
    if (!form) return;

    const showError = (fieldId, errId, msg) => {
      const input = document.getElementById(fieldId);
      const err = document.getElementById(errId);
      if (input) {
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        if (msg) {
          input.classList.add("border-red-600");
        } else {
          input.classList.remove("border-red-600");
        }
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

      let valid = true;
      if (fullName.length < 2) {
        showError(
          "customer-name",
          "err-name",
          "Vui lòng nhập họ và tên người nhận hàng."
        );
        valid = false;
      } else {
        showError("customer-name", "err-name", "");
      }

      const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      if (!vnPhoneRegex.test(phone)) {
        showError(
          "customer-phone",
          "err-phone",
          "Vui lòng nhập số điện thoại 10 số hợp lệ tại Việt Nam."
        );
        valid = false;
      } else {
        showError("customer-phone", "err-phone", "");
      }

      if (address.length < 8) {
        showError(
          "customer-address",
          "err-address",
          "Vui lòng ghi rõ số nhà, thôn/phố, phường/xã, quận/huyện, tỉnh/thành."
        );
        valid = false;
      } else {
        showError("customer-address", "err-address", "");
      }

      if (!valid) return;

      // Loading Skeletal Shimmer State
      submitBtn.disabled = true;
      submitBtn.classList.add("skeleton-shimmer", "opacity-90");
      if (submitText) submitText.textContent = "Đang ghi nhận đơn đặt hàng...";

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
        comboCode: combo.code,
        comboTitle: combo.title,
        giftText: combo.giftText,
        quantity: orderQty,
        totalWeightKg: (combo.totalWeightGrams * orderQty) / 1000,
        totalAmountVND: combo.salePrice * orderQty
      };

      // Optional Webhook Dispatch
      if (CFG.contact.orderWebhookUrl) {
        try {
          await fetch(CFG.contact.orderWebhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } catch (_) {
          // Fallback gracefully to local confirmation + Zalo copy
        }
      } else {
        await new Promise((r) => setTimeout(r, 650));
      }

      try {
        const prev = JSON.parse(localStorage.getItem("va_orders") || "[]");
        prev.unshift(payload);
        localStorage.setItem("va_orders", JSON.stringify(prev.slice(0, 10)));
      } catch (_) {}

      submitBtn.disabled = false;
      submitBtn.classList.remove("skeleton-shimmer", "opacity-90");
      if (submitText) submitText.textContent = "Đặt giao tận nhà";

      // Populate Success State
      document.getElementById("success-order-code").textContent = orderCode;
      document.getElementById("success-customer").textContent =
        fullName + " (" + phone + ")";
      document.getElementById("success-combo").textContent =
        orderQty + " x " + combo.title + " (" + combo.giftShort + ")";
      document.getElementById("success-total").textContent = formatVND(
        payload.totalAmountVND
      );

      const copyBtn = document.getElementById("copy-order-zalo");
      if (copyBtn) {
        copyBtn.onclick = async () => {
          const summaryText = `Đơn hàng ${orderCode} - ${CFG.brandName}\nKhách hàng: ${fullName} - ${phone}\nSản phẩm: ${orderQty} x ${combo.title} (${combo.giftText})\nTổng thanh toán: ${formatVND(payload.totalAmountVND)} (Miễn phí ship)\nĐịa chỉ: ${address}`;
          try {
            await navigator.clipboard.writeText(summaryText);
            copyBtn.textContent = "Đã sao chép nội dung đơn - Đang mở Zalo...";
          } catch (_) {}
          setTimeout(() => {
            window.open(CFG.contact.zaloUrl, "_blank", "noopener");
          }, 350);
        };
      }

      form.classList.add("hidden");
      successBox.classList.remove("hidden");
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        orderQty = 1;
        updateCheckoutSummary();
        successBox.classList.add("hidden");
        form.classList.remove("hidden");
      });
    }
  }

  // 8. FAQ Accordion
  function initFaqAccordion() {
    document.querySelectorAll(".faq-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const content = btn.nextElementSibling;
        const icon = btn.querySelector(".faq-plus-icon");

        document.querySelectorAll(".faq-trigger").forEach((other) => {
          other.setAttribute("aria-expanded", "false");
          if (other.nextElementSibling) {
            other.nextElementSibling.classList.add("hidden");
          }
          const oIcon = other.querySelector(".faq-plus-icon");
          if (oIcon) oIcon.classList.remove("rotate-45");
        });

        if (!expanded) {
          btn.setAttribute("aria-expanded", "true");
          if (content) content.classList.remove("hidden");
          if (icon) icon.classList.add("rotate-45");
        }
      });
    });
  }

  // 9. GSAP + ScrollTrigger Motion Choreography (Zero window.onscroll, Reduced-Motion Safe)
  function initMotion() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || typeof window.gsap === "undefined") return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Entry Choreography
    gsap.fromTo(
      ".hero-stagger",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out"
      }
    );

    if (!ScrollTrigger) return;

    // Scroll Reveal Sections
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true
          }
        }
      );
    });

    // Desktop-only Pinned Craft & Tea Story Section
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const pinWrap = document.getElementById("craft-pin-section");
      const pinCol = document.getElementById("craft-pin-col");
      if (pinWrap && pinCol) {
        ScrollTrigger.create({
          trigger: pinWrap,
          start: "top 110px",
          end: "bottom bottom",
          pin: pinCol,
          pinSpacing: false
        });
      }
    });

    // Sticky Mobile Conversion Bar visibility via ScrollTrigger (no scroll event listener)
    const mobileBar = document.getElementById("mobile-sticky-cta");
    const heroSec = document.getElementById("hero-section");
    const orderSec = document.getElementById("dat-hang");
    if (mobileBar && heroSec && orderSec) {
      const showBar = (visible) => {
        mobileBar.classList.toggle("translate-y-full", !visible);
        mobileBar.classList.toggle("opacity-0", !visible);
        mobileBar.classList.toggle("pointer-events-none", !visible);
      };

      ScrollTrigger.create({
        trigger: heroSec,
        start: "bottom 20%",
        onEnter: () => showBar(true),
        onLeaveBack: () => showBar(false)
      });

      ScrollTrigger.create({
        trigger: orderSec,
        start: "top 85%",
        end: "bottom top",
        onEnter: () => showBar(false),
        onLeaveBack: () => showBar(true)
      });
    }
  }

  // Boot
  document.addEventListener("DOMContentLoaded", () => {
    hydrateBrandAndContact();
    initTheme();
    initMobileMenu();
    initHeroShowcase();
    renderProductTrilogy();
    renderCombosAndSyncCheckout();
    initOrderForm();
    initFaqAccordion();
    initMotion();
  });
})();
