# TaskPulse 3D - Modern Glassmorphism Task Manager

A feature-rich, interactive 3D Glassmorphism Task Manager web application built with pure Vanilla HTML5, CSS3, and JavaScript (no frameworks or external dependencies required).

![TaskPulse 3D](https://img.shields.io/badge/Status-Complete-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Built%20With](https://img.shields.io/badge/Built%20With-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange)

---

## 🌟 Key Features

- 📝 **Dynamic Task Management**: Add new tasks with real-time DOM rendering (no page refresh).
- 💾 **LocalStorage Persistence**: Automatically saves tasks locally in `localStorage` so your focus list remains intact after page refreshes.
- ✅ **Animated 3D Custom Checkmark**: Circular checkbox morphs into a glowing checkmark with a bounce scale pop effect when completed.
- 🗑️ **Animated 3D Deletion**: Tasks slide out right and smoothly collapse height before removal from DOM.
- ⭕ **3D Progress Ring & Stats**: Circular SVG progress ring dynamically calculates % of completed tasks with animated fill.
- 🔍 **Task Filtering**: Instant filtering tabs for **All**, **Active**, and **Completed** tasks, plus a **Clear Done** quick action.
- 🎨 **Modern 3D Glassmorphism UI**:
  - Interactive 3D Card Parallax tilt responding to mouse movement.
  - 3D task card items with hover elevation shadows (`translateY(-4px)`).
  - Ambient background with floating blurred mesh orbs and grid texture overlay.
  - Animated empty-state illustration when all tasks are complete.
  - Fully responsive layout across desktop, tablet, and mobile displays.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic markup (`<main>`, `<header>`, `<section>`, `<form>`, `<ul>`), accessible ARIA attributes.
- **CSS3**: CSS Custom Variables, Flexbox/Grid, `backdrop-filter` glassmorphism, 3D perspective transforms (`preserve-3d`, `rotateX`, `rotateY`), custom keyframe animations (`taskEnter`, `taskExit`, `floatOrb`).
- **Vanilla JavaScript (ES6+)**: Event listeners, LocalStorage API, DOM manipulation, SVG progress ring calculations, Fisher-Yates and array methods.

---

## 📁 File Structure

```
├── index.html        # Main HTML layout & structural markup
├── style.css         # Glassmorphism theme, 3D elevation & keyframe animations
├── script.js        # Core state manager, CRUD operations, LocalStorage sync & progress ring
├── vercel.json       # Vercel deployment configuration
├── package.json      # Project metadata & npm configuration
├── .gitignore        # Files excluded from Git tracking
└── README.md         # Project documentation & setup instructions
```

---

## 🚀 How to Run Locally

No build tools or Node package installations are required!

### Option 1: Open `index.html` Directly
Double-click `index.html` in your file explorer to launch the app in your browser.

### Option 2: Using Local HTTP Server
Run one of the following commands in your terminal inside the project directory:

```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🐙 How to Push to GitHub

To push updates to your existing GitHub repository (`https://github.com/mohammed-sohail2005/task_manager`):

```bash
git add .
git commit -m "Build 3D Glassmorphism Task Manager web app"
git push origin main
```

---

## 🚀 How to Deploy on Vercel

1. Import your GitHub repository (`mohammed-sohail2005/task_manager`) into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Vercel automatically detects `vercel.json` and `index.html`.
3. Click **Deploy** to launch your live site!

---

## 📄 License

This project is licensed under the MIT License - feel free to use, modify, and distribute it for personal or commercial projects.
