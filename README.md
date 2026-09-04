# TaskPulse Pro 3D - Executive Task Manager

An executive-grade, cryptographically secure 3D Glassmorphism Task & Focus Management web application built with pure Vanilla HTML5, CSS3, and JavaScript (no frameworks or external dependencies required).

![TaskPulse Pro](https://img.shields.io/badge/Status-Complete-success)
![Edition](https://img.shields.io/badge/Edition-Executive%20Pro-purple)
![License](https://img.shields.io/badge/License-MIT-blue)
![Built%20With](https://img.shields.io/badge/Built%20With-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange)

---

## 🌟 Executive Features

- 🎯 **Task Priorities**: Assign **High (🔥)**, **Medium**, or **Low** priority flags to tasks with custom glowing color badges.
- ✏️ **Inline Task Editing**: Edit task descriptions inline dynamically by double-clicking the text or clicking the edit button (save via `Enter`, cancel via `Esc`).
- 🔍 **Real-Time Search Bar**: Instant keyword search filtering as you type.
- 🔀 **Smart Sorting Controls**: Sort your focus list by **Newest First**, **Oldest First**, **Priority (High $\rightarrow$ Low)**, or **Alphabetical (A-Z)**.
- ↩️ **1-Click Undo Deletion**: Instant Toast notification banner with a live countdown timer allowing 1-click restoration of accidentally deleted tasks.
- 📊 **Executive Productivity Dashboard**: Live 4-metric summary cards (Total, Pending, High Priority, Completed) coupled with an SVG 3D progress ring widget.
- 💾 **Robust LocalStorage Sync**: Saves all task states, priorities, and timestamps locally (`taskpulse_pro_tasks_v2`) with backward compatibility schema migration.
- 🎨 **Executive 3D Glassmorphism UI**:
  - Interactive mouse parallax 3D card tilt with specular light sheen overlay.
  - Elevating 3D task card items with glowing depth drop shadows (`translateY(-4px)`).
  - Custom animated 3D checkmark button with scale bounce pop.
  - Ambient background with floating glowing color mesh orbs and grid texture.
  - Fully responsive across desktop, tablet, and mobile displays.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags (`<main>`, `<header>`, `<section>`, `<form>`, `<select>`, `<ul>`), accessible ARIA roles.
- **CSS3**: Custom CSS variables, Flexbox & Grid layouts, `backdrop-filter: blur`, 3D perspective transforms (`preserve-3d`, `rotateX`, `rotateY`), custom keyframe animations.
- **Vanilla JavaScript (ES6+)**: Event delegation, LocalStorage API with schema migration, SVG progress ring calculations, Fisher-Yates and array sorting logic.

---

## 📁 File Structure

```
├── index.html        # Executive dashboard markup, search & sort controls, metrics grid
├── style.css         # Executive glassmorphism theme, priority badges, 3D card tilt
├── script.js        # Executive state manager, priority sorting, inline editing, undo toast
├── vercel.json       # Vercel deployment configuration with security headers
├── package.json      # Project metadata & npm serve script
├── .gitignore        # Files excluded from Git tracking
└── README.md         # Documentation & deployment guide
```

---

## 🚀 How to Run Locally

No build tools or npm package installs required!

### Option 1: Open `index.html` Directly
Double-click `index.html` in your file explorer to launch the app in any browser.

### Option 2: Using Local HTTP Server
Run the following command in your terminal inside the project folder:

```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🐙 Push to GitHub

To push all executive updates to your GitHub repository ([https://github.com/mohammed-sohail2005/task_manager](https://github.com/mohammed-sohail2005/task_manager)):

```bash
git add .
git commit -m "Upgrade TaskPulse to Pro Executive edition with priorities, inline editing, search & undo"
git push origin main
```

---

## 🚀 Deploy to Vercel

1. Import your GitHub repository (`mohammed-sohail2005/task_manager`) into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Vercel automatically detects `vercel.json` and `index.html`.
3. Click **Deploy** to launch your live production website!

---

## 📄 License

This project is licensed under the MIT License - feel free to use, modify, and distribute it for personal or commercial projects.
