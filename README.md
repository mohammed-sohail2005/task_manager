# TaskPulse OS - Executive 3D Task Dashboard

An enterprise-grade, cryptographically secure 3D Glassmorphism Executive Task & Focus Management Dashboard Suite built with pure Vanilla HTML5, CSS3, and JavaScript (no frameworks or external dependencies required).

![TaskPulse OS](https://img.shields.io/badge/Status-Complete-success)
![Edition](https://img.shields.io/badge/Edition-Executive%20v3.0-purple)
![License](https://img.shields.io/badge/License-MIT-blue)
![Built%20With](https://img.shields.io/badge/Built%20With-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange)

---

## 🌟 Executive Dashboard Features

- 📊 **Multi-Panel Executive Layout**: Dedicated Left Sidebar Navigation + Main Executive Panel with live system storage status.
- 🎯 **Category & Project Tagging**: Organize tasks by **Work 💼**, **Personal 👤**, **Urgent ⚡**, or **Project 🚀** tags.
- 🔥 **Priority Matrix**: Assign **High (🔥)**, **Medium**, or **Low** priority flags with custom glowing color badges.
- 🔲 **Dual View Modes**: Switch seamlessly between **Detailed 3D Grid View** and **Compact List View**.
- 🏆 **Productivity Score Rating Engine**: Calculates dynamic completion rating % and assigns letter grades (**A+**, **A**, **B**, **C**, **D**) alongside an SVG circular progress ring.
- ✏️ **Inline Task Editing**: Edit task descriptions inline dynamically by double-clicking task text or clicking the edit button (save via `Enter`, cancel via `Esc`).
- 🔍 **Real-Time Keyword Search Bar**: Instant search filtering as you type.
- 🔀 **Smart Sorting Controls**: Sort deliverables by **Newest First**, **Oldest First**, **Priority (High $\rightarrow$ Low)**, or **Alphabetical (A-Z)**.
- ↩️ **1-Click Undo Deletion**: Instant Toast notification banner with a live countdown timer allowing 1-click restoration of deleted tasks.
- 💾 **Robust LocalStorage Sync**: Saves all task states, categories, priorities, and timestamps locally (`taskpulse_os_tasks_v3`) with backward compatibility schema migration.
- 🎨 **Executive 3D Glassmorphism UI**:
  - Interactive mouse parallax 3D card tilt with specular light sheen overlay.
  - Elevating 3D task card items with glowing depth drop shadows (`translateY(-4px)`).
  - Custom animated 3D checkmark button with scale bounce pop.
  - Ambient background with floating glowing color mesh orbs and grid texture.
  - Fully responsive across desktop, tablet, and mobile displays.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags (`<main>`, `<aside>`, `<header>`, `<section>`, `<form>`, `<select>`, `<ul>`), accessible ARIA roles.
- **CSS3**: Custom CSS variables, Flexbox & Grid layouts, `backdrop-filter: blur`, 3D perspective transforms (`preserve-3d`, `rotateX`, `rotateY`), custom keyframe animations.
- **Vanilla JavaScript (ES6+)**: Event delegation, LocalStorage API with schema migration, SVG progress ring & productivity score calculations, Fisher-Yates and array sorting logic.

---

## 📁 File Structure

```
├── index.html        # Executive Dashboard layout (Sidebar Nav + Main Content Panel)
├── style.css         # Executive glassmorphism theme, category chips, 3D card tilt, dual view modes
├── script.js        # Executive Dashboard engine: Categories, View Modes, Productivity Score, Undo Toast
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
git commit -m "Transform Task Manager into Executive 3D Dashboard Suite v3.0"
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
