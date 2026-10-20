# AuraLMS — Themes & Design System Specification
**Version:** 2.0  
**Status:** Canonical Design Reference  
**Visual Style:** Modern EdTech SaaS with CodeByGaurav Interactive Signatures  

---

## 1. Design Philosophy & Visual Identity

AuraLMS adheres to a **modern, elevated SaaS aesthetic** designed for clarity, high readability, and effortless role-based navigation. Its signature design features — inspired by high-conversion interactive developer reels ("CodeByGaurav" style) — add delightful ambient interactivity without distracting from the educational content.

### Core Principles
1. **Content First, Interface Second**: Generous whitespace, clean contrast ratios, and scannable card hierarchies ensure students and staff focus on learning and operations.
2. **Ambient Sophistication**: Subtle radial mouse-following glows (`PointerLight`) and smooth vector physics (`VerificationSpinner`) provide a premium feel.
3. **Strict Dual-Theme Parity**: Every screen, card, modal, and state is explicitly styled for both **Light Mode** and **Dark Mode** with 100% WCAG AA contrast compliance.
4. **Micro-Interactions**: Hover scales (`scale-[1.01]`), live pulse dots, and segmented OTP controls give instant tactile feedback to user actions.

---

## 2. Color Palette & Token System

### 2.1 Theme Tokens & Hex Values

| Token Name | Light Mode Value | Dark Mode Value | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` | `#020617` | `bg-slate-50` / `dark:bg-slate-950` | Full-screen app background |
| **Card Surface** | `#FFFFFF` | `#0F172A` | `bg-white` / `dark:bg-slate-900` | Cards, panels, modals, dropdowns |
| **Elevated Surface** | `#F1F5F9` | `#1E293B` | `bg-slate-100` / `dark:bg-slate-800` | Input backgrounds, table headers |
| **Subtle Border** | `#E2E8F0` | `#334155` | `border-slate-200` / `dark:border-slate-800` | Dividers, card outlines |
| **Interactive Border** | `#CBD5E1` | `#475569` | `border-slate-300` / `dark:border-slate-700` | Unfocused inputs, hover borders |
| **Text Primary** | `#0F172A` | `#F8FAFC` | `text-slate-900` / `dark:text-slate-50` | Primary headings, titles, active text |
| **Text Secondary** | `#475569` | `#94A3B8` | `text-slate-600` / `dark:text-slate-400` | Subtitles, descriptions, captions |
| **Text Muted** | `#94A3B8` | `#64748B` | `text-slate-400` / `dark:text-slate-500` | Placeholders, inactive icons, timestamps |
| **Brand Primary** | `#4F46E5` | `#6366F1` | `bg-indigo-600` / `bg-indigo-500` | Primary CTA buttons, brand badges |
| **Brand Secondary** | `#2563EB` | `#3B82F6` | `bg-blue-600` / `bg-blue-500` | Links, progress bars, active highlights |
| **Accent Glow** | `rgba(99,102,241,0.25)` | `rgba(99,102,241,0.15)` | `from-blue-500 via-indigo-500 to-purple-500` | Ambient PointerLight radial mesh |
| **Success / Green** | `#16A34A` | `#22C55E` | `text-emerald-600` / `dark:text-emerald-400` | Passed quizzes, paid orders, certificates |
| **Warning / Amber** | `#D97706` | `#F59E0B` | `text-amber-600` / `dark:text-amber-400` | Pending reviews, live session starting |
| **Danger / Red** | `#DC2626` | `#F87171` | `text-rose-600` / `dark:text-rose-400` | Failed attempts, refund requests, bans |

### 2.2 Contrast & Accessibility (WCAG 2.1 AA)
- Normal text (`14px`–`16px`): Minimum contrast ratio of **4.5:1** against underlying surface.
  - Light mode: `#0F172A` on `#FFFFFF` = **15.8:1** (Pass AAA).
  - Dark mode: `#F8FAFC` on `#0F172A` = **15.2:1** (Pass AAA).
- Large text (`18px+` bold, `24px+` regular): Minimum ratio of **3.0:1**.
- Focus indicators: `focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900`.

---

## 3. Typography & Hierarchy

### 3.1 Font Family
- **Primary Font**: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Font**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace` (Used for Order IDs, Certificate IDs, Webhook Payloads, and OTP fields).

### 3.2 Type Scale

| Level | Size | Weight | Line Height | Tailwind Classes | Typical Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 36px–48px | 800 (Extrabold) | 1.15 | `text-4xl md:text-5xl font-extrabold tracking-tight` | Landing page hero header |
| **H1 Heading** | 28px–32px | 700 (Bold) | 1.25 | `text-2xl md:text-3xl font-bold tracking-tight` | Dashboard titles, Course player title |
| **H2 Heading** | 20px–24px | 600 (Semibold) | 1.3 | `text-xl md:text-2xl font-semibold` | Section headers, Modal titles |
| **H3 Heading** | 16px–18px | 600 (Semibold) | 1.4 | `text-base md:text-lg font-semibold` | Card titles, Module headers |
| **Body Large** | 16px | 400 (Regular) | 1.5 | `text-base text-slate-700 dark:text-slate-300` | Hero subtext, Blog / lesson descriptions |
| **Body Regular** | 14px | 400 (Regular) | 1.5 | `text-sm text-slate-600 dark:text-slate-400` | Standard UI content, table rows, form inputs |
| **Small / Label** | 12px | 500 (Medium) | 1.4 | `text-xs font-medium text-slate-500 dark:text-slate-400` | Form labels, helper text, breadcrumbs |
| **Micro / Badge** | 10px–11px | 600 (Semibold) | 1.2 | `text-[11px] font-semibold tracking-wider uppercase` | Role pills, status badges, counter bubbles |

---

## 4. CodeByGaurav Interactive Signatures

The application incorporates four signature visual features inspired by viral interactive web reels:

### 4.1 Ambient PointerLight (`PointerLight.tsx`)
A smooth, mouse-following radial gradient glow that follows the cursor across the canvas, illuminating dark cards with subtle depth.

```tsx
// Core implementation structure
<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
  <div
    className="absolute rounded-full blur-3xl transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 opacity-25 dark:opacity-15 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500"
    style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: '450px', height: '450px' }}
  />
</div>
```
- **Behavior**: Reads `window.addEventListener('mousemove')` and updates smooth XY coordinates.
- **Opt-out**: Disabled or reduced on low-power devices; `pointer-events-none` prevents blocking clicks.

### 4.2 Animated Verification Spinner (`VerificationSpinner.tsx`)
Used during registration, certificate verification, and payment confirmation. Provides a vector-sharp animated circular progress gauge with an ease-out curve.

```tsx
// Physics: Ease-Out Quad with dynamic SVG stroke-dashoffset
const fraction = Math.min(elapsed / durationMs, 1);
const eased = 1 - (1 - fraction) * (1 - fraction);
const strokeDashoffset = circumference - (progress / 100) * circumference;
```
- **Visuals**: Centered animated SVG circle with glowing gradient `from-indigo-500 to-blue-500`, animated checkmark upon reaching 100%, and status subtitle.

### 4.3 Segmented OTP Input Boxes (`OtpInputBoxes.tsx`)
A 6-digit segmented PIN entry component with auto-focus, arrow-key navigation, backspace rewinding, and automatic paste detection.

- **Design**: 6 rounded square inputs (`w-12 h-14 sm:w-14 sm:h-16`) with `text-2xl font-bold font-mono text-center`.
- **States**: Inactive (`border-slate-200 dark:border-slate-700`), Active (`ring-2 ring-indigo-500 border-indigo-500 shadow-md scale-105`), Filled (`border-indigo-400 dark:border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20`).

### 4.4 Glassmorphism & Micro-Interactions
- **Glass Panel**: `backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm`.
- **Button Hover Feedback**: `transition-all duration-150 active:scale-[0.98] hover:shadow-md`.
- **Live Pulsing Dot**: Dual ring indicator with `animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75` and solid center dot `relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500`.

---

## 5. UI Component Catalog

### 5.1 Buttons
- **Primary CTA**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all`
- **Secondary / Outline**: `border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 rounded-xl transition-all`
- **Ghost / Subtle**: `text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors`
- **Destructive**: `bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all`

### 5.2 Status Badges & Pills
- **Role Badges**:
  - `STUDENT`: `bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800`
  - `MENTOR`: `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800`
  - `CONTENT_MANAGER`: `bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800`
  - `FINANCE_SUPPORT`: `bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800`
  - `MODERATOR`: `bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800`
  - `SUPER_ADMIN`: `bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800`
- **Order Status Badges**:
  - `COMPLETED`: Green badge with check icon
  - `PENDING`: Amber badge with clock icon
  - `REFUNDED`: Slate badge with reverse arrow icon
  - `FAILED`: Red badge with alert icon

### 5.3 Form Inputs
- **Text & Email Inputs**: `w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`
- **Dropdowns / Select**: Matching input styling with chevron icon and dark mode option item styling.
- **Bilingual Content Toggles**: Segmented tab button group `(EN English | HI हिन्दी)` with `bg-indigo-600 text-white` for active state.

---

## 6. Theme Engine & State Persistence

### 6.1 Theme Provider Architecture
```mermaid
flowchart TD
    Init[App Startup] --> ReadStorage{localStorage.getItem('theme')}
    ReadStorage -- 'dark' --> SetDark[Add .dark to html tag]
    ReadStorage -- 'light' --> SetLight[Remove .dark from html tag]
    ReadStorage -- null --> ReadOS{matchMedia '(prefers-color-scheme: dark)'}
    ReadOS -- Matches --> SetDark
    ReadOS -- No Match --> SetLight
    UserClick[User Clicks Theme Toggle] --> Toggle[Invert State & Write to localStorage]
    Toggle --> UpdateDOM[Update html element classList]
```

### 6.2 Implementation Snippet
```ts
// In ThemeContext.tsx
const toggleTheme = () => {
  const next = theme === 'light' ? 'dark' : 'light';
  setTheme(next);
  localStorage.setItem('theme', next);
  if (next === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
```
