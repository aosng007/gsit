# Golden Sunflower IT (GSIT)

A single-page marketing website for **Golden Sunflower**, a Brisbane-based elite IT consultancy connecting Government and Enterprise clients with world-class talent across Australia and New Zealand.

## Overview

- **Stack**: Pure HTML, CSS, and vanilla JavaScript (no frameworks or build tools)
- **Themes**: Four switchable themes — `dark`, `light`, `blueprint`, and `editorial` — persisted in `localStorage`
- **Sections**: Hero, Talent, Industries, Partner Ecosystem, Contact/Footer
- **Partner Ecosystem Diagram**: Radial SVG/HTML network diagram showing Golden Sunflower at the centre with five partner nodes arranged in a pentagon at a 130 px radius

## Files

| File | Description |
|------|-------------|
| `index.html` | Single HTML page with all section markup |
| `styles.css` | All styling: CSS custom properties for theming, layout, responsive breakpoints |
| `script.js` | Theme toggle, mobile nav, scroll-reveal, terminal typing animation |
| `logo.svg` | Company logomark |

## Development

No build step required. Open `index.html` directly in a browser, or serve locally:

```bash
npx serve .
# or
python3 -m http.server
```

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `≤ 1100px` | Hero layout adjusts |
| `≤ 900px` | Hero decorations hidden; partners stack vertically |
| `≤ 700px` | Mobile navigation drawer; footer grid collapses |
| `≤ 480px` | Single-column talent grid; partner diagram scales to 300 px |

## Partner Ecosystem Diagram

The diagram is a CSS/SVG hybrid:
- The center node (Golden Sunflower) and five partner nodes are absolutely-positioned `<div>` elements with `min-width`, `max-width: 90px`, and `white-space: normal` so text wraps to two lines rather than overflowing.
- An `<svg>` overlay draws the dashed connecting lines from the center (180, 180) to each partner node's radial coordinate.
- On screens ≤ 480 px the diagram container shrinks from 360 px to 300 px and node positions are rescaled accordingly.
