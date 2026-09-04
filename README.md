# PassVault 3D - Modern Glassmorphism Password Generator

An interactive, cryptographically secure password generator web application built with pure Vanilla HTML5, CSS3, and JavaScript (no frameworks or external dependencies required).

![PassVault 3D](https://img.shields.io/badge/Status-Complete-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Built%20With](https://img.shields.io/badge/Built%20With-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange)

---

## 🌟 Key Features

- 🔐 **Cryptographically Secure Randomness**: Uses native `window.crypto.getRandomValues()` to generate robust passwords resistant to prediction.
- 🎛️ **Customizable Character Criteria**:
  - Length Slider (4 – 32 characters) with floating tooltip position tracking.
  - Toggle switches for **Uppercase (A-Z)**, **Lowercase (a-z)**, **Numbers (0-9)**, and **Special Symbols (!@#$%^&*)**.
- 🛡️ **Validation Enforcement**: Ensures at least one character set is selected before generating, with dynamic warning alerts.
- 📊 **Live Password Strength Meter**: Evaluates mathematical entropy based on pool size and length, displaying an animated colored progress bar (Weak $\rightarrow$ Medium $\rightarrow$ Strong $\rightarrow$ Very Secure).
- 📋 **One-Click Copy with Toast Notification**: Instant clipboard copying with icon feedback state and a floating glass toast popup.
- ⚡ **Matrix Character Scramble Animation**: Dynamic typewriter / slot-machine character animation on generation.
- 🎨 **Modern 3D Glassmorphism UI**:
  - Interactive 3D Card Parallax tilt following mouse movements.
  - Radial spotlight card shine effect.
  - Animated ambient gradient background with floating glowing mesh orbs.
  - 3D Neumorphic glowing toggle switches and depth buttons with ripple click effect.
  - Fully responsive design across desktop, tablet, and mobile viewports.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic elements (`<main>`, `<header>`, `<section>`), ARIA labels, clean accessibility structure.
- **CSS3**: CSS Custom Properties (variables), Flexbox/Grid layouts, `backdrop-filter` glassmorphism, 3D perspective transforms (`preserve-3d`, `rotateX`, `rotateY`), custom range slider thumb styling, keyframe animations.
- **Vanilla JavaScript (ES6+)**: Event listeners, Crypto API (`getRandomValues`), DOM manipulation, Clipboard API, Fisher-Yates array shuffle, entropy calculation.

---

## 📁 File Structure

```
├── index.html        # Main HTML layout & structural markup
├── style.css         # Glassmorphism theme, 3D CSS effects & responsive design
├── script.js        # Core generator logic, 3D card tilt, strength meter & toast
├── vercel.json       # Vercel deployment configuration
├── package.json      # Project metadata & npm configuration
├── .gitignore        # Files excluded from Git tracking
└── README.md         # Project documentation & setup instructions
```

---

## 🐙 How to Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g., `passvault-3d`).
2. Run the following commands in your terminal:

```bash
# Rename default branch to main
git branch -M main

# Add your GitHub remote URL
git remote add origin https://github.com/YOUR_USERNAME/passvault-3d.git

# Push code to GitHub
git push -u origin main
```

---

## 🚀 How to Deploy on Vercel

### Option 1: Automatic Deployment via GitHub (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** $\rightarrow$ **"Project"**.
2. Import your GitHub repository (`passvault-3d`).
3. Vercel will automatically detect the static project configuration from `vercel.json` and `index.html`.
4. Click **"Deploy"**. Your site will be live instantly with an SSL certificate!

### Option 2: Deploy via Vercel CLI
Run the following commands in your terminal:

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy project directly
vercel
```

---

## 📄 License

This project is licensed under the MIT License - feel free to use, modify, and distribute it for personal or commercial projects.
