# Design System & Conversion Architecture: Kẹo Lạc Nam Định - Việt Anh Shop

## 0. Design Read & Pre-Flight Verification
- **Design Read:** *"Reading this as: Heritage artisan food D2C conversion landing page for Vietnamese tea-lovers & gift buyers, with a Heritage Craft Editorial language (Silk Porcelain & Nam Định Lacquer Vermilion), leaning toward Tailwind v4 + Plus Jakarta Sans / Be Vietnam Pro + GSAP ScrollTrigger."*
- **Dials:** `DESIGN_VARIANCE: 7` | `MOTION_INTENSITY: 6` | `VISUAL_DENSITY: 4`
- **Python Deterministic RNG (`gpt-taste`):**
  - Prompt seed: `278 % 3 = 2` -> **Editorial Asymmetric Split Hero** (`max-w-3xl` left H1 in 2-3 lines + inline pill image, Double-Bezel visual stage on right)
  - Typography Stack: **`Plus Jakarta Sans`** (Display) + **`Be Vietnam Pro`** (Body) + **`JetBrains Mono`** (Specs & Pricing) - zero `Inter`
  - Component Arsenal: Inline Typography Micro-Image, Single Kinetic Marquee, Gapless `grid-flow-dense` Bento Grid, Tabbed Product Trilogy Stage, GSAP Sticky-Split Craft Section
- **AIDA Verification:**
  1. **Navigation:** Floating Fluid Island Pill (`<= 72px` height, single-line desktop, morphing hamburger on `< 768px`, dark-mode switch)
  2. **Attention (Hero):** `min-h-[100dvh]`, `pt-24` cap, max 4 text elements, button-in-button pill CTA visible above fold, trust strip placed cleanly *below* hero
  3. **Interest (Bento + Trilogy):** 5-cell gapless `grid-flow-dense` asymmetric grid + interactive 3-SKU showcase (`Kẹo Lạc Vừng 500g`, `Kẹo Dồi Lạc Vừng 200g`, `Kẹo Sìu Châu Đặc Biệt 200g`)
  4. **Desire (GSAP Pinned Story + Ingredients):** Pinned tea-ritual column (`5.jpg`) paired with verified ingredient & lab metrics (`50 - 60%` sugar, `2 - 5%` protein, `3 - 9%` moisture, `0%` preservatives)
  5. **Action (Combo Selector + Split Checkout):** 3 verified gift combos wired live to quantity/gift/weight calculator and WCAG AA checkout form
- **Strict Bans Enforced:**
  - Zero em-dashes or en-dashes anywhere in markup, scripts, or copy
  - Zero emojis anywhere (100% crisp Phosphor SVG icons with uniform stroke weight)
  - Eyebrow count: 2 across 8 sections (`2 <= ceil(8/3) = 3`)
  - Single locked primary accent (`#9E1B1B` Lacquer Vermilion) across all sections, with dual light/dark theme parity

## 1. Data Lineage (Verified vs. Prototype)
- **Verified Source Data (from `kẹo lạc/` & `kẹo lạc/landing/`):**
  - Producer: Cơ sở sản xuất bánh kẹo Lê Giáp / Lạc Giáp (Nam Định)
  - SKUs: Kẹo Lạc Vừng (500g), Kẹo Dồi Lạc Vừng (200g), Kẹo Sìu Châu Loại Đặc Biệt (200g)
  - Ingredients & Lab Specs (from `3.jpg` label & `landing/` PNGs): Lạc rang, Đường kính trắng (`50 - 60%`), Vani mạch nha, Vừng bóc (`Protein 2 - 5%`, `Độ ẩm 3 - 9%`), HSD 6 tháng, không chất bảo quản
  - Combo Structures: 5 gói 200g tặng 1 gói 200g | 3 gói 500g tặng 2 gói 200g | 6 gói 500g tặng 3 gói 200g
  - Guarantees: 100% rõ nguồn gốc chính hãng, Đủ cân đủ số lượng, Miễn phí ship toàn quốc
- **Prototype Configuration (`js/config.js`):**
  - Combo VNĐ prices, Hotline/Zalo number, and Webhook URL are isolated in `window.SITE_CONFIG` at the top of `js/config.js` with `isPrototypePricing: true` for instant owner customization.
