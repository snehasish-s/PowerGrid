---
version: alpha
name: Tata Power Dark Grid
description: A dark, high-contrast sustainability system with bright electric accents and editorial typography.
colors:
  primary: "#03FFAB"
  secondary: "#F8F5EC"
  tertiary: "#8FE7C9"
  neutral: "#121212"
  surface: "#0B0F0D"
  on-surface: "#F8F5EC"
  error: "#FF6B6B"
  border: "#374151"
  text-muted: "#B8B2A6"
  overlay: "#011210"
typography:
  headline-display:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: 600
    lineHeight: 38.4px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 26px
    fontWeight: 600
    lineHeight: 36px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Outfit
    fontSize: 21px
    fontWeight: 500
    lineHeight: 28px
    letterSpacing: 0.04em
  title-md:
    fontFamily: Helvetica Neue
    fontSize: 17px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0px
  body-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Helvetica Neue
    fontSize: 14px
    fontWeight: 300
    lineHeight: 20px
    letterSpacing: 0px
  caption:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 2px
  sm: 10px
  md: 18px
  lg: 30px
  xl: 40px
  gutter: 32px
  section: 64px
  page: 80px
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: "15px 35px"
    height: "54px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: "15px 35px"
    height: "54px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "0px"
    height: "auto"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Tata Power Dark Grid

## Overview
This system feels civic, modern, and technologically optimistic, with a strong environmental undertone. It uses deep dark surfaces to frame bright electric green accents, giving the interface a serious foundation with moments of energy and hope. The overall tone is spacious and cinematic rather than dense, suited to a brand that wants to communicate infrastructure, sustainability, and scale.

## Colors
- **Primary (#03FFAB):** A vivid electric green used for key calls to action, emphasis, active states, and brand moments that need to feel energized and future-facing.
- **Secondary (#F8F5EC):** A warm off-white used for major headlines, body copy on dark backgrounds, and high-contrast UI text.
- **Tertiary (#8FE7C9):** A softer mint tone that can support secondary highlights, subtle success states, and layered green-on-green imagery.
- **Neutral (#121212):** The dominant dark canvas that anchors the layout and lets content panels, typography, and illustration shine.
- **Surface (#0B0F0D):** An even deeper near-black for overlays, hero framing, and inset zones that need extra separation from the main background.
- **On-surface (#F8F5EC):** The primary text color for readable content placed on dark surfaces.
- **Border (#374151):** A restrained cool border tone used for cards, dividers, and subtle structural boundaries.
- **Text-muted (#B8B2A6):** A softer neutral for supportive copy, legal text, and de-emphasized labels.
- **Overlay (#011210):** A very dark teal-black used for button shells and shadowed UI elements where transparency is part of the look.
- **Error (#FF6B6B):** A clear alert color reserved for validation and destructive states; it should remain rare in this system.

## Typography
The system combines Syne for headlines with Outfit and Helvetica Neue for supporting text, creating a blend of editorial sharpness and utility. Syne is used for large, expressive headings with medium-heavy weights, while Outfit handles most body and label usage with a clean geometric feel. Helvetica Neue appears in smaller utility contexts and lighter label treatments, helping maintain a slightly technical, brand-neutral tone.

Headline styles should stay bold but not overly compressed; the source uses generous line heights and modest letter spacing, especially in larger display text. Labels and navigation often lean uppercase or all-caps in practice, with increased tracking for clarity and a premium, information-dense feel. Body copy stays compact and highly readable, typically around 14px to 18px depending on emphasis.

## Layout
The layout is built as a wide, fixed-max-width editorial hero with large negative space and strong horizontal breathing room. Sections use deep full-bleed backgrounds and inset content blocks, creating a layered presentation that feels immersive rather than grid-heavy. Spacing follows a simple rhythm from 2px micro adjustments up to 40px section gaps, with 64px and 80px reserved for page-scale separation.

Padding should be generous around major sections and restrained inside utility components. Cards and panels favor 16px internal padding, while primary hero content should remain visually open and anchored with clear margins. The system works best when content is aligned in broad columns with deliberate offsets, not tight multi-column densification.

## Elevation & Depth
Elevation is intentionally subtle and mostly achieved through tonal contrast rather than shadows. The screenshot shows very little shadow usage, so depth comes from darker overlays, layered surface values, and illustration brightness rather than floating cards. Borders and contrast are preferred over blur or heavy drop shadows.

This approach keeps the interface calm and premium while allowing the hero artwork and accent color to carry the visual energy. When separation is needed, use a thin border or a slightly lighter/darker surface step before introducing shadow.

## Shapes
The shape language is crisp and mostly angular, with strong rectangular forms and minimal rounding. Interactive elements and cards can use small radii, but the overall impression should stay architectural and precise. Full pill shapes are acceptable for chips or small status treatments, but primary buttons and larger containers should remain square-edged or nearly square.

## Components
Buttons are highly restrained and text-forward. `button-primary` and `button-secondary` both use transparent backgrounds, 54px height, 15px 35px padding, and uppercase-feeling label treatment; the difference is color emphasis rather than structure. Primary actions should use the electric green accent for text or directional cues, while secondary actions stay in the off-white family with a thin border. `button-tertiary` should behave like a simple text link or minimal action, with no container chrome.

Cards should be dark, bordered, and low-elevation, following `card` with an 8px radius and 16px padding. They should not feel glossy or shadowed; the border and surface contrast are enough. Inputs should also be minimal and square-edged, using dark surfaces, light text, and compact internal padding.

Chips and small tags should be lightweight and highly legible, preferably using `rounded.full` only when they represent status or navigation filters. Icons and utility controls should use the same clear line-based language seen in the header, with simple outlines and ample touch targets. Links should remain understated by default, with accent color reserved for hover or emphasis.

## Do's and Don'ts
- Do use `#03FFAB` sparingly for the most important calls to action and active emphasis.
- Do keep main text on dark backgrounds in `#F8F5EC` for strong contrast and readability.
- Do preserve the spacious, cinematic feel with large margins and broad section spacing.
- Do prefer borders and tonal shifts over heavy shadows or glassmorphism.
- Don't introduce bright secondary colors that compete with the electric green accent.
- Don't round primary UI surfaces heavily; avoid pill buttons and soft, bubbly cards.
- Don't compress typography too tightly; maintain the generous line heights seen in the source.
- Don't overbuild component chrome; keep buttons, inputs, and links clean and functional.