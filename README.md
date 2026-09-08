# Modern Spotify Music Player 🎵

A sleek, glassmorphic music player web application built with **HTML5, CSS3, and Vanilla JavaScript**. This app connects directly to Spotify via the **Spotify Web Playback SDK** and **Spotify Web API**, enabling real-time track searches, dynamic UI updates, spinning record artwork, and full-track audio streaming right from your browser.

![Music Player Preview](https://via.placeholder.com/800x400.png?text=Modern+Spotify+Music+Player+UI)

---

## ✨ Key Features

* **⚡ Real-Time Search with Debouncing:** Instantly search Spotify's catalog for tracks or artists with an auto-suggest dropdown.
* **🎧 Full Track Streaming:** Built-in web streaming device using Spotify's official Web Playback SDK.
* **💿 Animated Vinyl Cover:** Album art smooth-rotates while music is playing and pauses when track playback stops.
* **🎛️ Interactive Controls:** Play/pause, fast rewind (10s), fast forward (10s), and a draggable position timeline range slider.
* **🎨 Glassmorphism Design:** Modern translucent UI created using CSS backdrop-filters and smooth gradients.
* **♿ Accessible Markup:** Fully configured with ARIA attributes and keyboard-navigable search results.

---

## 🛠️ Built With

* **HTML5** - Semantic structure and ARIA accessibility labels
* **CSS3** - Glassmorphism effects, flexbox layout, and CSS keyframe animations
* **JavaScript (ES6+)** - Modular IIFE architecture, Async/Await APIs, and DOM manipulation
* **Spotify Web API & SDK** - Search endpoint & real-time Web SDK audio playback

---

## 📋 Prerequisites

Before running this app locally, make sure you have:

1. A **Spotify Premium Account** *(Required by Spotify's Web Playback SDK to stream full audio tracks)*.
2. A **Spotify Developer Account**.
3. A local server extension (like VS Code **Live Server**).

---

## 🚀 Quick Start Guide

### 1. Clone or Download the Project
```bash
git clone [https://github.com/your-username/spotify-music-player.git](https://github.com/your-username/spotify-music-player.git)
cd spotify-music-player
