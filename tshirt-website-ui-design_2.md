# T-Shirt Website — Premium 3D Product UI (Ciao Energy Style)

> This file is the full design brief for your T-shirt website. It is written for building in **Antigravity** (or any AI coding tool), in easy English, so it can be read directly and turned into code.
>
> The style is copied closely from **ciaoenergy.com** — a premium, cinematic, "floating 3D product" website. Instead of energy drink cans floating in the dark, your site will show **T-shirts floating and tilted in 3D**, with the same camera-like frame, the same loader, the same arrow-controlled product switcher, and the same big bold product-detail screen. The site must support both **Dark Mode** and **Light Mode**.

---

## 1. What Makes This Site Special (Core Concept)

This is not a normal scrolling shop page. It feels like a **short film**:

- A **3D floating product scene** is the hero — not flat photos, but tilted, slightly rotating, slightly moving 3D-rendered (or high-quality video/PNG) product shots, arranged like a fan/arc in space.
- The whole screen has a **camera viewfinder frame** — thin corner brackets `⌐ ⌐` in all 4 corners, and a thin progress line across the very top.
- Small **floating UI chips** (menu, contact, sound toggle) sit on top of the 3D scene like a HUD (heads-up display), not like a normal navbar.
- You move between products using **left/right arrows** (`<` `>`) instead of normal scrolling — like flipping through a deck of cards.
- Clicking one product zooms into a **full detail scene**: giant product name, one floating tilted T-shirt, a short description, and small circular icon buttons on the side that reveal extra info (fabric, fit, print, care).
- A **big bold full-screen statement** (like Ciao's "ZERO BULLSHIT" screen) appears between sections — huge background text with the product floating on top of it. For your brand this could be something like **"NO CHEAP FABRIC"** or **"ZERO COMPROMISE."**

---

## 2. Full Page Flow (Step by Step)

This is the exact order of what the user sees, from opening the site to buying a shirt:

### Step 1 — Loading Screen
- First thing shown when the site opens.
- Your logo animates in the center (simple fade + scale-up, or a small drawing/build-in animation of the logo).
- A thin progress bar (0% → 100%) plays at the very top of the screen, same place as Ciao's top line.
- Takes under 1.5 seconds. No skip button needed since it's short.
- When it hits 100%, it fades out and reveals the Home Scene underneath.

### Step 2 — Home Scene (3D Floating Arc)
This is your homepage hero, built exactly like Ciao Energy's can-arc screen:

- **Background:** deep dark (dark mode) or soft white/grey (light mode), with a soft spotlight glow behind the center product.
- **Center:** your featured T-shirt, large, tilted at an angle, gently floating up and down (slow, looping animation, like it's weightless).
- **Left and right of center:** more T-shirts, smaller, tilted, slightly dim/blurred, arranged in a fan/arc — like Ciao shows other flavor cans on the sides.
- **Top center:** your logo, with a small spinning ring/portal graphic underneath it (like Ciao's chrome ring) — this can just be a soft rotating circle graphic, purely decorative.
- **Top left:** a small toggle (Ciao uses "ON" + sound bars — for you this can be a "Sound" toggle for background audio/video, or repurpose it as a **Light/Dark mode toggle switch**).
- **Top right:** a dotted-grid "MENU" icon + text, and a solid pill-shaped "CONTACT" (or "CART") button.
- **All 4 corners:** thin bracket marks, like a camera viewfinder — pure decoration, stays fixed while the scene changes.
- **Left and right, mid-screen:** big `<` and `>` arrow buttons (thin, minimal, dotted style) to move to the previous/next T-shirt in the arc.
- **Below the arc, small stacked arrow icons** bottom-left and bottom-right (visual detail copied from Ciao) — decorative, matching the frame style.
- **Bottom center:** the current T-shirt's name in big bold two-line text (e.g. **"OVERSIZED / STREET TEE"**), under it a horizontal slider/scrubber bar with a gradient color dot — dragging or clicking this also switches products, and the dot's position shows how many products are in the arc.
- **Very bottom center:** small text **"Scroll to discover"** with a soft bouncing motion, telling the user to scroll or click an arrow.

**Interaction:** Clicking `<` or `>`, or dragging the bottom scrubber, smoothly rotates the whole arc — the side product becomes the center one, with a smooth 3D-feeling animation (rotate + scale + text crossfade). Scrolling down moves the user into Step 3.

### Step 3 — Product Detail Scene
When the user clicks on the centered/focused T-shirt (or scrolls past the Home Scene), the camera "zooms into" that one product:

- **One T-shirt only**, large, tilted, floating in the center or slightly off-center — this time with more detail visible (fabric texture, print close-up).
- **Big two-line product name** on the left side (e.g. **"OVERSIZED / STREET TEE"**), bold, large type — same visual weight as Ciao's flavor name.
- **Short description** under the name — one or two lines only, simple and punchy (e.g. *"Heavyweight cotton. Bold streetwear print. Made to be worn, not babied."*).
- **Right side:** a vertical stack of small circular icon buttons — each one is a quick-info toggle:
  - Fabric icon → shows fabric details (e.g. "240 GSM 100% cotton")
  - Fit icon → shows fit/size info
  - Print icon → shows print technique ("screen print, won't crack")
  - Care icon → shows wash/care instructions
  - Clicking an icon shows a small popup/tooltip with 1 short sentence — keep it light, don't open a big modal.
- **Faint background watermark:** the product name letters spread very lightly across the background (barely visible, decorative texture only — same trick Ciao uses with faint letters floating behind the can).
- Corner brackets and top progress line stay visible the whole time, so the "camera frame" feeling never breaks.

### Step 4 — Brand Statement Scene
A full-screen, bold, high-impact section between browsing and buying — same idea as Ciao's "ZERO BULLSHIT" screen:

- Huge background text filling most of the screen width, e.g. **"NO CHEAP FABRIC"** or **"ZERO COMPROMISE"**, very bold, slightly blurred/glowing.
- The current T-shirt floats on top of this text, centered, smaller than the background text.
- This screen has almost no other UI — just the statement, the product, and the frame. It's a breathing moment before the shop section.

### Step 5 — Shop / Buy Section
This is where the user actually buys:

- Product image on one side (can reuse the same tilted 3D shot, but calmer — less floating motion here, more "for sale" and steady).
- On the other side:
  - Product name + price (big, bold, clear)
  - Size selector (S / M / L / XL buttons)
  - Color selector (small circular swatches, if the shirt has color options)
  - Quantity stepper (− 1 +)
  - **Add to Cart** button (primary, full width)
  - **Buy Now** button (secondary, outline style)
  - Small delivery/return info line underneath
- This section can look calmer and more "normal e-commerce" than the earlier cinematic screens — it's the moment the user needs clarity and trust, not more spectacle.
- A small cart drawer slides in from the right when "Add to Cart" is clicked, same pattern as a normal online shop (item image, size, qty, price, checkout button).

### Step 6 — Footer
Simple, calm, same as any shop: links (Shop, Help, About), social icons, payment method icons (bKash, Nagad, Card, Cash on Delivery), copyright line.

---

## 3. Dark Mode & Light Mode

The site must work in both modes, switched with a toggle (place it in the top-left, where Ciao's "ON" control is).

| Token | Dark Mode | Light Mode |
|---|---|---|
| Background | `#0A0A0A` (near-black) | `#FAFAFA` (near-white) |
| Surface / panel | `#1A1A1A` | `#F0F0F0` |
| Primary text | `#FFFFFF` | `#111111` |
| Secondary text | `#B5B5B5` | `#6B6B6B` |
| Accent (buttons, highlights) | your brand color, e.g. `#FF3B30` or electric color per collection | same accent, adjusted slightly brighter/darker for contrast |
| Corner brackets, frame lines | soft white, low opacity (`rgba(255,255,255,0.4)`) | soft black, low opacity (`rgba(0,0,0,0.35)`) |
| Product spotlight glow | soft colored glow, more visible in the dark | very soft, subtle shadow instead of glow |

Rule: Dark mode is the "cinematic" default (closest to Ciao's mood). Light mode should keep the exact same layout and motion — only colors change. Never redesign the layout between modes.

---

## 4. Typography

| Level | Font | Size (desktop / mobile) | Weight |
|---|---|---|---|
| Giant background statement (Step 4) | Space Grotesk / Anton | 120px / 48px | 800 Extra Bold |
| Product name (Home + Detail) | Space Grotesk / Poppins | 56px / 32px | 700 Bold |
| Section headline | Poppins | 36px / 24px | 700 |
| Description text | Inter | 18px / 15px | 400–500 |
| Small labels (MENU, CONTACT, nav) | Inter | 13px, letter-spacing wide | 600, uppercase |
| Price | Inter / Space Grotesk | 22px | 700 |

Keep every line of copy short. This design lives or dies on restraint — one strong sentence per screen, never a paragraph.

---

## 5. Motion & Animation Rules

This is the most important part of the whole design — the site must **feel expensive and smooth**, never jumpy.

1. **Floating idle motion:** every product image gently moves up/down in a slow loop (about 3–4 seconds per cycle), even when nothing is being clicked. This is what makes it feel "alive" and premium.
2. **Arc rotation (Step 2):** clicking `<`/`>` smoothly rotates the arc — old center product shrinks and moves to the side, new one grows and moves to center. Duration: 500–700ms, smooth ease (not linear).
3. **Zoom transition into Detail Scene (Step 2 → Step 3):** the focused product scales up and the side products fade out, camera feels like it's pushing forward. Duration: 600–800ms.
4. **Text crossfade:** whenever the product changes, old text fades out + slides up slightly, new text fades in + slides up into place. Never let old and new text overlap awkwardly.
5. **Scroll-linked progress bar:** the thin top line fills left-to-right based on how far the user has scrolled/progressed through the whole product story (Home → Detail → Statement → Shop).
6. **Reduced motion mode:** if the user's device requests less motion, turn off the floating loops and zoom transitions — just crossfade normally. This is required for accessibility.
7. **Loading is quick:** never make the user wait more than ~1.5 seconds on the loader.

---

## 6. Components List

| Component | Notes |
|---|---|
| Loader | Logo animation + top progress line, under 1.5s |
| HUD Frame | 4 corner brackets + top thin progress line, always on top of every scene |
| Top HUD Bar | Sound/theme toggle (left), Logo (center), Menu + Contact/Cart (right) |
| 3D Floating Arc | Center product large, side products smaller/dimmer, arranged in a fan |
| Arrow Navigator | `<` `>` big minimal arrows, plus small decorative stacked arrow icons |
| Bottom Scrubber | Horizontal gradient slider showing position in the product list, draggable |
| Product Name Block | Big two-line bold text, changes with crossfade animation |
| Icon Info Rail | Vertical stack of circular icon buttons (Detail Scene), each opens a 1-line tooltip |
| Watermark Text | Faint background letters spelling the product name, very low opacity |
| Statement Screen | Giant bold background text + product floating on top |
| Size Selector | Button group S/M/L/XL, disabled state for out-of-stock |
| Color Swatch | Small circle, selected state = ring outline |
| Add to Cart / Buy Now | Primary + secondary button pair |
| Cart Drawer | Slide-in panel from the right, item list + checkout button |
| Theme Toggle | Switch between Dark/Light, smooth color transition (300ms) across the whole page |
| Footer | Simple links + payment icons |

---

## 7. Mobile Behavior

The 3D floating arc is a desktop-first showpiece. On mobile, simplify without losing the feeling:

- Home Scene: show only the center product (drop the side arc), with left/right swipe instead of arrow buttons to change products.
- Keep the corner brackets, top progress line, and floating idle animation — these are cheap to keep and carry the "premium" feeling.
- Detail Scene: icon info rail moves under the description instead of floating on the side, so it stays reachable by thumb.
- Statement Screen: shrink the giant text so it still fits without breaking to too many lines (use `clamp()` in CSS for responsive font size).
- Shop section: stack image on top, buy info below, sticky "Add to Cart" bar at the bottom of the screen.

---

## 8. Quick Build Notes (for Antigravity / AI coding tool)

- Use **Three.js** or a lightweight WebGL library (or even well-lit high-quality PNG/WebP product renders with CSS 3D transforms if full WebGL is too heavy) for the tilted floating product look.
- Use **GSAP + ScrollTrigger** (or Framer Motion if using React) to drive the scroll-linked progress bar and scene transitions.
- Keep all product renders as transparent PNG/WebP, pre-lit and pre-shadowed, so they drop into any background color (needed for Dark/Light mode switching).
- Use CSS variables for every color token in Section 3, so Dark/Light mode is a single class toggle on `<body>`, not a rebuild of styles.
- Lazy-load product images/videos not currently in view to keep the site fast.
- Respect `prefers-reduced-motion` everywhere floating/zoom animation happens.

---

*This is the complete cinematic, Ciao-Energy-style design for your T-shirt brand — loader, floating 3D product arc, detail scene, brand statement screen, and shop section, in both dark and light mode. If you want, I can also build a working HTML/CSS/JS demo of the Home Scene so you can see the floating arc and arrow navigation actually move before handing this to Antigravity.*
