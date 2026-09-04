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

## 🚀 How to Run Locally

Since this app is built with pure web technologies, no build tools, Node.js, or package managers are required!

### Method 1: Direct File Open
1. Clone or download this repository to your local computer.
2. Double-click `index.html` or right-click and choose **Open with Browser** (Chrome, Firefox, Edge, Safari).

### Method 2: Local HTTP Server (Recommended)
Using a local server ensures optimal Clipboard API support and smooth performance:

#### Using VS Code Live Server:
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (if not already installed).
3. Right-click `index.html` and click **"Open with Live Server"**.

#### Using Python HTTP Server:
Run one of the following commands in your terminal inside the project directory:

```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 📁 File Structure

```
├── index.html        # Main HTML layout & structural markup
├── style.css         # Glassmorphism theme, 3D CSS effects & responsive design
├── script.js        # Core generator logic, 3D card tilt, strength meter & toast
└── README.md         # Project documentation & instructions
```

---

## 📄 License

This project is licensed under the MIT License - feel free to use, modify, and distribute it for personal or commercial projects.
