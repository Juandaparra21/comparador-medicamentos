---
name: Luminous Health
colors:
  surface: '#faf9fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#6ffb85'
  on-secondary-container: '#00732a'
  tertiary: '#4c4aca'
  on-tertiary: '#ffffff'
  tertiary-container: '#6664e4'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#72fe88'
  secondary-fixed-dim: '#53e16f'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c2c1ff'
  on-tertiary-fixed: '#0c006a'
  on-tertiary-fixed-variant: '#3631b4'
  background: '#faf9fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 25px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  price-display:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 20px
  stack-gap-lg: 24px
  stack-gap-md: 16px
  stack-gap-sm: 8px
  glass-padding: 16px
---

## Brand & Style

This design system is built on a **Glassmorphic** aesthetic, tailored for a high-trust healthcare environment. It prioritizes clarity and a sense of "digital lightness," using translucency to create depth without visual clutter. The goal is to make medication price comparison feel effortless and transparent—matching the physical property of glass itself.

The personality is **Clinical yet Empathetic**. It avoids the heavy, sterile feel of traditional medical software in favor of a modern, airy interface that feels like a premium utility. By using frosted layers and vibrant ambient glows, the UI guides the user's eye toward savings and essential health data through light and contrast rather than heavy borders.

## Colors

The palette utilizes **Sanitas Blue** (`#0058bc`) as the primary driver for trust and action, and **Vitality Green** (`#006e28`) for price drops, savings, and "in-stock" indicators.

The color system relies heavily on **Alpha Channels**. Backgrounds are not solid; they are dynamic meshes of the primary and secondary colors with high Gaussian blurs (60px–100px).

- **Surfaces:** Use a white base with 70% opacity and `backdrop-filter: blur(20px)`.
- **Contrast:** High-contrast charcoal (`#1a1b1f`) for primary text to ensure readability over varying translucent backgrounds.
- **Accents:** Tertiary Purple (`#4c4aca`) for specialized medication categories or refill reminders.

## Typography

The system uses **Hanken Grotesk** to emulate the clean, neo-grotesque efficiency of SF Pro while providing a slightly more modern, open character.

- **Hierarchy:** Price data is always prioritized using the `price-display` token (28px / 700), paired with the secondary color to highlight savings.
- **Readability:** Minimum weight of 400 for body text. Light weights are avoided to prevent "bleeding" into blurred backgrounds.
- **Mobile scaling:** `display-lg` scales down to 28px on mobile to prevent awkward line breaks in long medication names.

## Layout & Spacing

Follows a **Fluid Mobile Grid** based on a 4-column structure for phone screens.

- **Rhythm:** 8px linear scale governs all spatial relationships.
- **Safe Zones:** Content is inset from the glass edge by a minimum of `glass-padding` (16px).
- **Floating Containers:** Cards and search bars do not touch screen edges; they float with a 20px horizontal margin, allowing background ambient glows to leak around corners.

## Elevation & Depth

Elevation is communicated through **Optical Thickness**, not traditional black shadows.

| Level | Description |
|-------|-------------|
| 0 — Base | Mesh gradient background with ambient color blurs |
| 1 — Standard Card | 70% white opacity, 20px backdrop blur, 1px inner border (white 30%) |
| 2 — Active/Floating | 85% white opacity, 40px backdrop blur, soft colored shadow matching the underlying glow |

Avoid drop shadows with any black value. Depth should feel like stacked physical lenses.

## Shapes

- **Standard Cards:** `rounded-lg` (16px) — friendly, approachable.
- **Input Fields:** `rounded-xl` (24px) — pill-like, differentiates interactive from static.
- **Icon Enclosures:** Small circular backdrops maintaining the "pill/tablet" visual metaphor.

## Components

### Buttons
- **Primary:** Solid-to-vibrant gradient (Primary Blue → Tertiary Purple), white text.
- **Secondary:** Glass style — 1px border, colored text, no fill.

### Price Chips
Small high-contrast capsules. Lowest price uses a solid Vitality Green background with white text.

### Input Fields
Search bars use 30px backdrop blur and an inset search icon. Placeholder text uses a medium neutral to maintain legibility against the frost.

### Medication Cards
"Glass-on-Glass" stack: the main card is standard glass (Level 1); the "Savings" callout inside uses a slightly more opaque sub-layer for internal hierarchy.

### Iconography
- Consistent 2pt stroke weight with rounded terminals.
- Two-tone style: primary color for main shape, 40% opacity of that same color for secondary areas.
