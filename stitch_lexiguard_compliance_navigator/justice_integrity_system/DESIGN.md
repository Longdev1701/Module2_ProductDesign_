---
name: Justice & Integrity System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434653'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#2559bd'
  primary: '#00327d'
  on-primary: '#ffffff'
  primary-container: '#0047ab'
  on-primary-container: '#a5bdff'
  inverse-primary: '#b1c5ff'
  secondary: '#515f78'
  on-secondary: '#ffffff'
  secondary-container: '#d2e0fe'
  on-secondary-container: '#55637d'
  tertiary: '#01401e'
  on-tertiary: '#ffffff'
  tertiary-container: '#205833'
  on-tertiary-container: '#92cd9d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#00419e'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#b9c7e4'
  on-secondary-fixed: '#0d1c32'
  on-secondary-fixed-variant: '#39475f'
  tertiary-fixed: '#b5f1bf'
  tertiary-fixed-dim: '#99d4a4'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#18512c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar_width: 280px
  container_max_width: 1440px
  gutter: 24px
  margin_mobile: 16px
  margin_desktop: 40px
  stack_sm: 8px
  stack_md: 16px
  stack_lg: 32px
---

## Brand & Style

The brand personality is **Authoritative, Precise, and Visionary**. It is designed for high-level legal professionals and compliance officers who require absolute reliability combined with cutting-edge analytical power. The emotional response should be one of "calm confidence"—knowing that complex legal data is being synthesized and monitored with unerring accuracy.

The visual style is **Corporate / Modern with a touch of Editorial Sophistication**. It utilizes high-contrast typography and a structured grid to establish a sense of law and order, while leveraging modern UI patterns like subtle tonal layering and crisp iconography to represent its innovative AI core. This design system avoids the "playfulness" of typical SaaS platforms in favor of a sturdy, institutional aesthetic that commands respect.

## Colors

The palette is built on a foundation of "Trust Blue" and "Pure White." 

- **Primary Blue (#0047AB):** Used for primary actions, active navigation states, and key interactive elements. It represents the "innovative" side of the consulting platform.
- **Deep Navy (#0A192F):** Reserved for the persistent sidebar and high-level headers. This provides the "authoritative" anchor for the UI.
- **Compliance Green (#1E5631):** A deep forest green used exclusively for positive status indicators, "Passed" compliance marks, and growth metrics.
- **System Neutrals:** A range of cool grays (from #F8FAFC to #334155) provides the necessary structure for data-heavy tables and complex forms without introducing visual clutter.

## Typography

This system employs a **Serif/Sans-Serif pairing** to balance tradition with modernity. 

- **Playfair Display** is used for all major headlines and section titles. Its high contrast and elegant serifs evoke the feeling of classic legal documents and institutional authority.
- **Inter** is the workhorse for all body text, data visualizations, and functional labels. Its high legibility and neutral character ensure that dense legal information remains readable at all sizes.
- **Functional Hierarchy:** Use `label-bold` for table headers and small metadata tags to maintain a disciplined, organized feel.

## Layout & Spacing

The layout follows a **Fixed Grid with a Persistent Sidebar**. 

1. **Persistent Sidebar:** A 280px deep navy sidebar houses the primary navigation. It remains fixed to the left to provide constant orientation.
2. **The Content Canvas:** A 12-column grid with generous 24px gutters. Use wide 40px margins on desktop to allow the content to "breathe," reinforcing a premium, high-trust feel.
3. **Data Density:** While the overall layout is spacious, internal card components and tables should use tighter vertical rhythm (`stack_sm`) to ensure large datasets are visible without excessive scrolling.
4. **Mobile Reflow:** On mobile, the sidebar collapses into a hamburger menu. The 12-column grid transitions to a single-column stack with 16px margins.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers and Low-Contrast Outlines**.

- **Surface Levels:** The background uses the base neutral (#F8FAFC). Primary content cards use a pure white surface.
- **Outlines over Shadows:** To maintain a "clean and corporate" look, avoid heavy drop shadows. Instead, use 1px solid borders in a light gray (#E2E8F0).
- **Subtle Elevation:** For "Risk Alert Cards" or "AI Search" results that require immediate attention, use a very soft, highly diffused ambient shadow (Color: Primary Blue at 5% opacity, Blur: 20px) to make them appear slightly lifted.
- **Depth in Data:** Use the Deep Navy (#0A192F) for the sidebar and page headers to create a definitive "top layer" of navigation that sits above the content canvas.

## Shapes

The shape language is **Conservative and Structured**.

A `Soft (1)` roundedness setting (0.25rem / 4px) is applied to buttons, input fields, and small cards. This keeps the interface feeling modern without losing the "sharpness" and "seriousness" expected of a legal platform. 

Large dashboard containers and the persistent sidebar should remain completely sharp (0px) to reinforce the grid-based, institutional structure of the system.

## Components

### AI Search Bar
The most prominent element in the header. It should feature a 2px Primary Blue border when focused, a "Sparkle" icon to denote AI capabilities, and a large, clear search prompt in Inter Medium.

### Risk Alert Cards
Cards that indicate legal risks should use a thick 4px left-border accent in Primary Blue (or Red for high risk). The headline uses Playfair Display 18pt to ensure the "alert" feels authoritative.

### Buttons
- **Primary:** Solid Primary Blue with White text. Sharp 4px corners.
- **Secondary:** Transparent background with a 1px Navy border.
- **Compliance Action:** Forest Green background, used only for "Confirm Compliance" or "Approve" actions.

### Interactive Charts
Use a palette of Blue, Navy, and Green. Avoid "hot" colors like bright red or orange unless indicating a critical legal failure. Grid lines should be minimal and low-contrast (#F1F5F9).

### Checkboxes & Radios
Standard square/circle forms with a Primary Blue fill when active. These should feel "tactile" and precise to reflect the nature of checking off legal requirements.

### Sidebar Navigation
Icons should be thin-stroke (1.5px) and accompanied by Inter 14px Medium labels. The "Active" state features a subtle Blue vertical bar on the far left.