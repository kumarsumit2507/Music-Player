# 🎵 Responsive Web Music Player

A sleek, modern, and fully responsive web-based music player built with semantic HTML5, CSS3 (following BEM architecture principles), and vanilla JavaScript. Features animated UI feedback, custom controls, timeline synchronization, and smooth visual states.

---

## ✨ Features

- **Responsive Design**: Fluid layout styled using modern CSS (`clamp()`, Flexbox) that adapts seamlessly to desktop, tablet, and mobile viewports.
- **BEM Architectural Structure**: Clean, modular, and maintainable CSS structure.
- **Animated Audio Visuals**:
  - **Dynamic Background**: Vibrant 400% ambient animated gradient.
  - **Spinning Vinyl Cover**: Smooth 360° rotating album art synchronized with playback states (`animation-play-state`).
- **Full Player Controls**:
  - Play / Pause toggling with icon state updates.
  - Interactive track timeline progress slider with drag-to-seek functionality.
  - Automated track completion handling (resets controls when song ends).
- **Accessible & Clean Code**: Zero external JavaScript frameworks or bloated dependencies.

---

## 🛠️ Built With

- **HTML5**: Semantic tags (`<main>`, `<article>`, `<nav>`, `<section>`, `<audio>`).
- **CSS3**: BEM architecture, `@keyframes` animations, CSS Glassmorphism (`backdrop-filter`), CSS Grid/Flexbox, Custom Range Sliders.
- **Vanilla JavaScript (ES6+)**: Event listeners, HTML5 Audio API management, DOM manipulation.

---

## 📁 File Structure

```text
├── index.html       # Application HTML structure
├── style.css        # CSS stylesheets & animations (BEM structured)
├── script.js        # Audio playback logic & UI state management
└── README.md        # Project documentation