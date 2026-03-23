# Magie Deals Presentation — Design Style Guide

> This document is the single source of truth for all visual decisions in the Magie Deals Presentation project. Every component, color, spacing, and typography choice should reference this file. It is intended to be used alongside `.cursorrules` in Cursor.

---

## 1. Brand & Identity

|Property|Value|
|---|---|
|Product name|Magie Deals Presentation|
|Brand font|**Figtree** (Google Fonts)|
|Brand color|`#4ADE80` (green)|
|Visual tone|Dark, clean, corporate-premium|
|Target display|1920 × 1080 desktop (fullscreen)|

### Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

Tailwind config:

```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['Figtree', 'system-ui', 'sans-serif'],
}
```

---

## 2. Color System

### 2.1. Core Palette

|Token|Hex|Usage|
|---|---|---|
|`--bg-page`|`#141414`|Page background (outermost)|
|`--bg-surface`|`#1C1C1C`|Card / content surface (cover card, board)|
|`--bg-elevated`|`#262626`|Elevated elements (column header bar, overlay)|
|`--bg-input`|`#FFFFFF`|Text input background|
|`--bg-badge`|`#1E1E1E`|Score badge background|
|`--border-subtle`|`#2E2E2E`|Column dividers, card separation|
|`--border-badge`|`#3A3A3A`|Badge pill borders|
|`--border-input`|`#DADADA`|Input field border|

### 2.2. Text Colors

|Token|Hex|Usage|
|---|---|---|
|`--text-primary`|`#FFFFFF`|Headings, deal names, score counts|
|`--text-secondary`|`#999999`|Subtitle ("ALL HANDS • date"), labels|
|`--text-muted`|`#666666`|Disabled states, placeholder text|
|`--text-on-input`|`#111111`|Text typed inside the date input|
|`--text-on-green-btn`|`#FFFFFF`|Button text on green background|
|`--text-on-disabled`|`#888888`|"Let's go!" text when disabled|

### 2.3. Accent & Interactive Colors

|Token|Hex|Usage|
|---|---|---|
|`--green-primary`|`#4ADE80`|Active buttons, stage badge in overlay|
|`--green-hover`|`#3ECF71`|Button hover state|
|`--green-pressed`|`#34B863`|Button active/pressed state|
|`--disabled-bg`|`#3A3A3A`|"Let's go!" button when disabled|
|`--disabled-text`|`#888888`|"Let's go!" text when disabled|
|`--overlay-backdrop`|`rgba(0,0,0,0.4)`|Optional backdrop behind overlay|

### 2.4. Tailwind Custom Colors

```typescript
// tailwind.config.ts → theme.extend.colors
colors: {
  page:       '#141414',
  surface:    '#1C1C1C',
  elevated:   '#262626',
  subtle:     '#2E2E2E',
  badge:      '#1E1E1E',
  'badge-border': '#3A3A3A',
  green: {
    primary:  '#4ADE80',
    hover:    '#3ECF71',
    pressed:  '#34B863',
  },
  text: {
    primary:   '#FFFFFF',
    secondary: '#999999',
    muted:     '#666666',
  },
}
```

---

## 3. Typography

All text uses the **Figtree** font family. No other fonts are used in this product.

### 3.1. Type Scale

|Element|Weight|Size|Line Height|Tracking|Transform|
|---|---|---|---|---|---|
|**Board title ("DEALS")**|900 Black|72px|1.0|-2px|uppercase|
|**Cover title ("B2B Deal...")**|700 Bold|28px|1.2|-0.5px|none|
|**Subtitle ("ALL HANDS •...")**|500 Medium|14px|1.4|1px|uppercase|
|**Column header**|700 Bold|13px|1.0|1.5px|uppercase|
|**Score badge label**|600 Semi|14px|1.0|0.5px|uppercase|
|**Score badge count**|700 Bold|18px|1.0|0|none|
|**Cover label ("Presentation Date")**|500 Medium|13px|1.4|0|none|
|**Input text**|400 Regular|14px|1.4|0|none|
|**Input placeholder**|400 Regular|14px|1.4|0|none|
|**Upload button text**|600 Semi|14px|1.0|0|none|
|**"Let's go!" button text**|600 Semi|14px|1.0|0|none|
|**Filename below upload**|400 Regular|12px|1.4|0|none|
|**Overlay stage badge**|600 Semi|11px|1.0|1px|uppercase|
|**Overlay client name**|700 Bold|22px|1.2|-0.3px|none|
|**Overlay field label**|400 Regular|11px|1.4|0|uppercase|
|**Overlay field value**|600 Semi|15px|1.4|0|none|

### 3.2. Font Weight Reference

|Weight Name|CSS Value|Usage|
|---|---|---|
|Regular|400|Body text, labels, placeholders|
|Medium|500|Subtitles, small labels|
|Semi Bold|600|Buttons, badge labels, field values|
|Bold|700|Headings, column headers, counts|
|Black|900|"DEALS" title only|

---

## 4. Layout & Grid

### 4.1. Viewport Strategy

The entire application is designed for **1920 × 1080** fullscreen desktop presentation. The layout must fill the browser viewport without scrolling on the presentation board.

```css
/* Root */
min-width: 1280px;
height: 100vh;
overflow: hidden; /* on presentation board only */
```

### 4.2. Cover Page Layout

```
┌────────────────────────────── Page (100vw × 100vh, bg: #141414) ──────────────────────────┐
│                                                                                            │
│     ┌───────────────────────── Card (max-w: 960px, bg: #1C1C1C, r: 24px) ──────────────┐  │
│     │                                                                                    │  │
│     │   ┌─────── Left (55%) ────────┐    ┌────────── Right (45%) ──────────┐            │  │
│     │   │                            │    │                                  │            │  │
│     │   │  🎩 magie logo (h:32px)    │    │     3D green hat illustration   │            │  │
│     │   │                            │    │     (cover_magie_logo.png)       │            │  │
│     │   │  B2B Deal Presentation     │    │     centered, ~300px wide       │            │  │
│     │   │                            │    │                                  │            │  │
│     │   │  ┌── Date Input ────────┐  │    │                                  │            │  │
│     │   │  │ 📅  dd/mm/yyyy       │  │    │                                  │            │  │
│     │   │  └──────────────────────┘  │    │                                  │            │  │
│     │   │                            │    │                                  │            │  │
│     │   │  ┌── Upload Button ─────┐  │    │                                  │            │  │
│     │   │  │ ⬆  Upload Hubspot.. │  │    │                                  │            │  │
│     │   │  └──────────────────────┘  │    │                                  │            │  │
│     │   │  filename.csv (optional)   │    │                                  │            │  │
│     │   │                            │    │                                  │            │  │
│     │   │  ─────── divider ───────   │    │                                  │            │  │
│     │   │                            │    │                                  │            │  │
│     │   │  ┌── Let's go! ────────┐   │    │                                  │            │  │
│     │   │  │   Let's go!         │   │    │                                  │            │  │
│     │   │  └─────────────────────┘   │    │                                  │            │  │
│     │   └────────────────────────────┘    └──────────────────────────────────┘            │  │
│     └────────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

|Element|Spec|
|---|---|
|Card container|`max-width: 960px`, centered, `border-radius: 24px`, `bg: #1C1C1C`|
|Card padding|`64px` horizontal, `56px` vertical|
|Left column|~55% of card width|
|Right column|~45% of card width, center the 3D hat image|
|Magie logo|Height: `32px`, white, top of left column|
|Title|`margin-top: 24px` from logo|
|Date input|`margin-top: 32px` from title|
|Upload button|`margin-top: 16px` from input|
|Filename text|`margin-top: 8px` from button, `color: #999999`|
|Divider line|`margin-top: 24px`, `1px solid #3A3A3A`, full left-column width|
|"Let's go!" button|`margin-top: 24px` from divider|

### 4.3. Presentation Board Layout

```
┌───────────────────────────────── Board (100vw × 100vh, bg: #141414) ──────────────────────┐
│                                                                                             │
│  ┌── Header (h: ~120px, px: 40px) ───────────────────────────────────────────────────────┐ │
│  │  🎩 DEALS                                              [DEALS|96] [CUSTOMERS|32] [CH] │ │
│  │      ALL HANDS • 20.03.2026                                                            │ │
│  └────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│  ┌── Column Headers (h: 40px, bg: #262626, border-bottom: 1px #2E2E2E) ─────────────────┐ │
│  │ FIRST OUTREACH │ CALL SCHEDULED │ QUALIFYING │ CLIENT INT.. │ SCOPE DEF │ PROP.. │ CW │ │
│  └────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│  ┌── Logo Grid Area (remaining height, px: 40px) ───────────────────────────────────────┐  │
│  │  ┌─col─┐  ┌─col─┐  ┌─col─┐  ┌─col─┐  ┌─col─┐  ┌─col─┐  ┌─col─┐                   │  │
│  │  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│                   │  │
│  │  │ 🔲🔲🔲│  │ 🔲🔲 │  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │            │                   │  │
│  │  │ 🔲🔲🔲│  │      │  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │ 🔲🔲🔲│  │            │                   │  │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘                   │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

|Element|Spec|
|---|---|
|Board padding|`40px` horizontal, `32px` top|
|Header height|Auto, approximately `120px`|
|Magie glass logo|`64px × 64px`, `border-radius: 16px`, slightly rounded|
|"DEALS" title|Adjacent to logo, vertically centered, `72px Black`|
|Subtitle|Below "DEALS", `14px Medium`, `color: #999999`|
|Score badges|Right-aligned in header, horizontal row, `gap: 16px`|
|Column header bar|Full width, `height: 40px`, `bg: #262626`|
|Column header text|Centered within each column, `13px Bold uppercase`|
|Column dividers|`1px solid #2E2E2E` between columns (vertical lines)|
|Logo grid area|Remaining viewport height, no scrolling|
|Columns|7 equal-width columns, evenly distributed|
|Grid within column|Wrapping grid: `grid-template-columns: repeat(auto-fill, 56px)`|
|Grid gap|`8px` between logo tiles|
|Grid padding|`16px` top, `12px` horizontal within each column|

---

## 5. Components

### 5.1. Logo Tile (Deal Card)

The primary visual element of the board. Each tile shows a company logo as a square.

|Property|Value|
|---|---|
|Size|`56px × 56px`|
|Border radius|`10px`|
|Background|Transparent (the logo image fills it)|
|Border|None by default|
|Overflow|`hidden` (clip the image to the radius)|
|Cursor|`pointer`|

**States:**

|State|Effect|
|---|---|
|Default|`opacity: 1`, no border|
|Hover|`transform: scale(1.08)`, `box-shadow: 0 0 0 2px #4ADE80`, `transition: 150ms ease`|
|Active|`transform: scale(1.02)`|
|Selected|`box-shadow: 0 0 0 2px #4ADE80` (when overlay is open for this deal)|

**Image handling:**

```
1. Try: GitHub raw URL → /logos/{slug}.png
2. Fallback: https://www.google.com/s2/favicons?domain={domain}&sz=128
3. Final fallback: Letter avatar (see 5.2)
```

The logo image should use `object-fit: cover` and fill the entire 56×56 tile.

### 5.2. Letter Avatar (Final Fallback)

When no logo image is found, render a colored tile with the company initial(s).

|Property|Value|
|---|---|
|Size|`56px × 56px` (same as logo tile)|
|Border radius|`10px`|
|Background|Deterministic color based on company name hash|
|Text|First 1–2 characters, `20px Bold`, `color: #FFFFFF`|
|Text alignment|Centered vertically and horizontally|

**Color palette for avatars** (cycle through using hash):

```typescript
const AVATAR_COLORS = [
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#14B8A6', // teal
  '#3B82F6', // blue
  '#A855F7', // purple
];
```

### 5.3. Score Badge

Three badges appear in the top-right of the board: **DEALS**, **CUSTOMERS**, **CHANNELS**.

```
┌─────────────────────────────────┐
│  [icon]   LABEL   │   COUNT     │
└─────────────────────────────────┘
```

|Property|Value|
|---|---|
|Height|`44px`|
|Padding|`0 20px`|
|Border radius|`12px`|
|Background|`#1E1E1E`|
|Border|`1px solid #3A3A3A`|
|Gap between badges|`16px`|
|Icon size|`24px × 24px`, white, left-aligned|
|Label|`14px SemiBold uppercase`, `color: #FFFFFF`|
|Divider|`1px solid #3A3A3A`, `height: 20px`, vertical, between label and count|
|Count|`18px Bold`, `color: #FFFFFF`|
|Internal gap|`10px` between icon → label → divider → count|

**Icons** (use SVG files from `public/icons/`):

|Badge|Icon file|
|---|---|
|DEALS|`deals.svg`|
|CUSTOMERS|`customers.svg`|
|CHANNELS|`channels.svg`|

### 5.4. Column Header

|Property|Value|
|---|---|
|Background|`#262626`|
|Height|`40px`|
|Text|`13px Bold`, `letter-spacing: 1.5px`, `uppercase`, `color: #FFFFFF`|
|Text alignment|Center (horizontal and vertical)|
|Column dividers|`1px solid #2E2E2E` between columns|
|Bottom border|None|
|Top border|None|

### 5.5. Client Detail Overlay

A right-side panel that slides in when a logo tile is clicked.

```
┌──────────────────────── 320px ─┐
│  ┌─ Stage Badge ─┐        [✕] │
│  │ FIRST OUTREACH │            │
│  └────────────────┘            │
│                                │
│  [Logo 48px]  Client Name      │
│                                │
│  ── thin divider line ──────── │
│                                │
│  Category                      │
│  Fintech                       │
│                                │
│  Type                          │
│  Customer                      │
│                                │
│  Deal Owner                    │
│  Leonardo Rosa                 │
│                                │
└────────────────────────────────┘
```

|Property|Value|
|---|---|
|Width|`320px`|
|Height|Full viewport height|
|Position|`fixed`, `top: 0`, `right: 0`|
|Background|`#1C1C1C`|
|Box shadow|`-8px 0 24px rgba(0,0,0,0.5)`|
|Padding|`32px 28px`|
|Z-index|`50`|
|Animation|Slide from right: `transform: translateX(100%) → translateX(0)`, `200ms ease-out`|
|Backdrop|Optional: `rgba(0,0,0,0.4)` over the rest of the board|

**Close button (✕):**

|Property|Value|
|---|---|
|Position|`absolute top-28px right-28px`|
|Size|`32px × 32px` clickable area|
|Icon|Thin `×` or Lucide `X` icon, `20px`|
|Color|`#999999`|
|Hover color|`#FFFFFF`|

**Stage badge:**

|Property|Value|
|---|---|
|Background|`#262626`|
|Text|`11px SemiBold`, `letter-spacing: 1px`, `uppercase`, `color: #FFFFFF`|
|Padding|`6px 12px`|
|Border radius|`6px`|
|Margin bottom|`24px`|

**Client name row:**

|Property|Value|
|---|---|
|Logo size|`48px × 48px`, `border-radius: 8px`|
|Gap|`14px` between logo and name|
|Name text|`22px Bold`, `color: #FFFFFF`|
|Alignment|Vertically centered (logo + name)|
|Margin bottom|`24px`|

**Divider:**

|Property|Value|
|---|---|
|Height|`1px`|
|Color|`#2E2E2E`|
|Margin|`0 0 24px 0`|

**Detail fields (Category, Type, Deal Owner):**

|Property|Value|
|---|---|
|Label|`11px Regular`, `uppercase`, `letter-spacing: 0.5px`, `color: #666666`|
|Value|`15px SemiBold`, `color: #FFFFFF`|
|Spacing|`4px` between label and value|
|Gap between fields|`20px`|

### 5.6. Cover Page — Date Input

|Property|Value|
|---|---|
|Width|`100%` of left column (~380px)|
|Height|`44px`|
|Background|`#FFFFFF`|
|Border|`1px solid #DADADA`|
|Border radius|`8px`|
|Padding|`0 14px`|
|Font|`14px Regular`, `color: #111111`|
|Placeholder|`"Presentation Date"`, `color: #999999`|
|Icon|`calendar.svg` (`16px`), positioned left inside input with `12px` gap|

### 5.7. Cover Page — Upload Button

|Property|Value|
|---|---|
|Width|`100%` of left column (~380px)|
|Height|`44px`|
|Background|`#4ADE80`|
|Border radius|`24px` (fully rounded / pill)|
|Text|`14px SemiBold`, `color: #FFFFFF`|
|Icon|`upload.svg` (`16px`), `color: #FFFFFF`, left of text, `8px` gap|
|Hover|`background: #3ECF71`|
|Active|`background: #34B863`|
|Cursor|`pointer`|

### 5.8. Cover Page — "Let's go!" Button

**Disabled state** (date or file missing):

|Property|Value|
|---|---|
|Background|`#3A3A3A`|
|Text|`14px SemiBold`, `color: #888888`|
|Border radius|`24px` (pill)|
|Cursor|`not-allowed`|

**Active state** (both date and file provided):

|Property|Value|
|---|---|
|Background|`#4ADE80`|
|Text|`14px SemiBold`, `color: #FFFFFF`|
|Hover|`background: #3ECF71`|
|Cursor|`pointer`|

---

## 6. Static Assets

All static assets live in the `public/` directory. These are **bundled with the project** to avoid external dependency issues.

### 6.1. Asset Inventory

```
public/
├── icons/
│   ├── deals.svg           # Score badge icon — 32×32, white fill
│   ├── customers.svg       # Score badge icon — 32×32, white fill
│   ├── channels.svg        # Score badge icon — 32×32, white fill
│   ├── calendar.svg        # Date input icon — 16×16, black fill (#010101)
│   └── upload.svg          # Upload button icon — 16×16, white fill
├── images/
│   ├── logo_magie_glass.png    # Magie hat logo — 128×128, dark bg, for board header
│   └── cover_magie_logo.png    # 3D green hat — 430×429, for cover page right side
└── magie-wordmark.svg          # "magie" wordmark with hat icon (white, for cover page top-left)
```

### 6.2. Icon Specifications

|Icon|File|Native Size|Display Size|Fill Color|Notes|
|---|---|---|---|---|---|
|Deals|`deals.svg`|32×32|24×24|`#FFFFFF`|Used in score badge|
|Customers|`customers.svg`|32×32|24×24|`#FFFFFF`|Used in score badge|
|Channels|`channels.svg`|32×32|24×24|`#FFFFFF`|Used in score badge|
|Calendar|`calendar.svg`|16×16|16×16|`#010101`|Used inside date input (dark on white)|
|Upload|`upload.svg`|16×16|16×16|`#FFFFFF`|Used inside green upload button|

### 6.3. Image Specifications

|Image|File|Native Size|Display Context|
|---|---|---|---|
|Magie glass logo|`logo_magie_glass.png`|128×128|Board header, rendered at `64px × 64px`, `border-radius: 16px`|
|3D green hat|`cover_magie_logo.png`|430×429|Cover page right side, rendered at ~`300px` wide, centered|

### 6.4. Magie Wordmark (Cover Page)

The cover page shows the Magie logo at top-left: a small white hat icon followed by the "magie" wordmark in white. This should be stored as `public/magie-wordmark.svg` or composed from the hat icon + text in Figtree Bold italic.

If creating from text:

- Hat icon: simplified white hat, ~`20px` tall
- "magie" text: `20px`, `Figtree`, `weight: 700`, `style: italic`, `color: #FFFFFF`
- Gap between hat and text: `8px`

---

## 7. Client Logo Resolution

### 7.1. Resolution Order

```
1. GitHub Repository (primary)
   URL: https://raw.githubusercontent.com/{OWNER}/{REPO}/main/logos/{slug}.png

2. Google Favicons API (fallback)
   URL: https://www.google.com/s2/favicons?domain={domain}&sz=128

3. Letter Avatar (final fallback)
   Generated client-side with initial + deterministic color
```

### 7.2. Slug Generation Rules

Convert `Deal Name` from CSV to a logo filename slug:

```
1. Take content before any: ( / + : —
   "Natura / Emana Pay"       → "Natura"
   "UY3 (canal BaaS)"        → "UY3"
   "CRM Bonus + Havan: ..."  → "CRM Bonus"

2. Remove common prefixes: "Banco", "Banco de", "Banco do"
   "Banco BV"                → "BV"
   "Banco BS2"               → "BS2"
   "Banco Pine"              → "Pine"
   "Banco do Brasil"         → "Brasil"
   Exception: "Banco Inter"  → "Inter" (not "Banco-Inter")

3. Lowercase + replace spaces with hyphens + remove special chars
   "Porto Seguro"            → "porto-seguro"
   "BV"                      → "bv"
   "180 Seguros"             → "180-seguros"
   "QI Tech"                 → "qi-tech"
   "MercadoBitcoin (MB)"     → "mercadobitcoin"

4. Final slug becomes: {slug}.png
```

### 7.3. Implementation Pattern

```typescript
async function resolveLogoUrl(dealName: string): Promise<string> {
  const slug = generateSlug(dealName);
  const githubUrl = `https://raw.githubusercontent.com/{OWNER}/{REPO}/main/logos/${slug}.png`;

  // Try GitHub first
  try {
    const res = await fetch(githubUrl, { method: 'HEAD' });
    if (res.ok) return githubUrl;
  } catch {}

  // Try Favicon
  const domain = DOMAIN_MAP[dealName];
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  // Return empty — component will render letter avatar
  return '';
}
```

### 7.4. Image Error Handling in Components

```tsx
<img
  src={deal.logoUrl}
  alt={deal.dealName}
  className="w-14 h-14 rounded-[10px] object-cover"
  onError={(e) => {
    e.currentTarget.style.display = 'none';
    // Show letter avatar sibling
  }}
/>
```

---

## 8. Spacing & Sizing Reference

### 8.1. Common Spacing Scale (in px)

|Token|Value|Usage examples|
|---|---|---|
|`xs`|4px|Label to value gap in overlay|
|`sm`|8px|Logo grid gap, icon-to-text gap|
|`md`|12px|Internal column padding|
|`base`|16px|Section gaps, grid top padding, badge gap|
|`lg`|20px|Between detail fields in overlay|
|`xl`|24px|Section separations, margins in overlay/cover|
|`2xl`|32px|Cover padding, overlay padding, board top pad|
|`3xl`|40px|Board horizontal padding|
|`4xl`|56px|Cover vertical padding|
|`5xl`|64px|Cover horizontal padding|

### 8.2. Border Radius Scale

|Element|Radius|
|---|---|
|Logo tiles|`10px`|
|Score badges|`12px`|
|Cover card|`24px`|
|Buttons (pill)|`24px`|
|Input field|`8px`|
|Stage badge (overlay)|`6px`|
|Magie glass logo|`16px`|
|Overlay logo|`8px`|

---

## 9. Motion & Animation

|Animation|Property|Duration|Easing|Trigger|
|---|---|---|---|---|
|Logo hover scale|`transform`|`150ms`|`ease`|Mouse enter on tile|
|Logo hover glow|`box-shadow`|`150ms`|`ease`|Mouse enter on tile|
|Overlay slide in|`transform`|`200ms`|`ease-out`|Click on logo tile|
|Overlay slide out|`transform`|`150ms`|`ease-in`|Click close / backdrop|
|Backdrop fade in|`opacity`|`200ms`|`ease`|With overlay|
|Backdrop fade out|`opacity`|`150ms`|`ease`|With overlay close|
|Button hover|`background`|`150ms`|`ease`|Mouse enter on button|

**Tailwind transition classes:**

```html
<!-- Logo tile -->
<div class="transition-all duration-150 ease-in-out hover:scale-[1.08]">

<!-- Overlay -->
<div class="transition-transform duration-200 ease-out translate-x-full data-[open=true]:translate-x-0">

<!-- Backdrop -->
<div class="transition-opacity duration-200 ease opacity-0 data-[open=true]:opacity-100">
```

---

## 10. Accessibility & Interaction Notes

- **Logo tiles** must have `role="button"`, `tabIndex={0}`, and respond to `Enter`/`Space` key
- **Overlay close** must also work with `Escape` key
- All interactive elements need visible focus states: `focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page`
- **Alt text** for logo images: company name (e.g., `alt="99 Pay"`)
- Score badge icons are decorative: use `aria-hidden="true"` on the SVGs
- Overlay must trap focus when open (first focusable: close button)

---

## 11. Do's and Don'ts

### ✅ DO

- Always use **Figtree** — no fallback to Inter or other fonts
- Keep all backgrounds dark — no white backgrounds except inside form inputs
- Use `#4ADE80` as the only accent color
- Render logos as perfect squares with consistent `10px` radius
- Keep the board at exactly **7 columns** even if some are empty
- Store all icons/images in `public/` — never load from external CDNs for static assets
- Use the exact SVG files provided for score badge icons
- Handle image load errors gracefully with the fallback chain

### ❌ DON'T

- Don't use any color outside the defined palette
- Don't show company names on the board grid — logos only
- Don't add scroll to the presentation board
- Don't use different icon sets (no Lucide, no Heroicons for score badges — use the custom SVGs)
- Don't modify the SVG icon files (they are the exact exports from Figma)
- Don't apply filters or color changes to client logos
- Don't use shadows on logo tiles (only on hover, and only the green glow ring)
- Don't use rounded-full on any element except buttons (pills are `24px` radius, not full circles)