# Golden Sunflower IT

## Overview
Static single-page marketing website for Golden Sunflower IT built with plain HTML, CSS, and vanilla JavaScript. No build step or package dependencies are required.

## Project Structure
- `index.html` - Main page markup
- `styles.css` - Theme and responsive styling
- `script.js` - Theme switching, mobile nav, loading animation, and scroll effects
- `server.js` - Replit static file server for local preview on port 5000
- `favicon*`, `apple-touch-icon.png`, `logo.svg` - Site assets

## Runtime
- Development workflow runs `node server.js`
- Server binds to `0.0.0.0` and uses `PORT` when provided, defaulting to `5000`
- Deployment is configured as a static site served from the project root

## User Preferences
- Keep the site dependency-free unless a future feature clearly requires a build tool or package.
