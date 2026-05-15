# 🚀 Repo Ranker (v1.5.1)

**Repo Ranker** is a local-first, high-performance web tool designed for developers to architect their GitHub profile READMEs. It streamlines the process of fetching, ranking, and styling your repository showcase with a sleek, GitHub-authentic aesthetic.

![Version](https://img.shields.io/badge/version-1.5.1-58a6ff)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)


## ✨ Key Features

* **Smart Fetching:** Instantly pull all public, non-forked repositories for any GitHub username.
* **Priority Tech Stack:** Automatic sorting of tech tags (UI/Frontend → UX/Backend → Others).
* **Intuitive Ranking:** Reorder your projects using a robust Drag-and-Drop system or manual arrow controls.
* **Sleek Previewer:** A live, side-scrollable "README.md Preview" that mimics GitHub's native UI (complete with badge-style tags).
* **Fast Editing:** Inline content editing for project names and descriptions without leaving the table.
* **One-Click Export:** Download your customized layout as a perfectly formatted `.md` table.

## 📸 UI Preview
* **Theme:** Dark Charcoal / GitHub Dark Mode.
* **Aesthetic:** Glassmorphism with neon accents and high-contrast badge tags.
* **Responsiveness:** Fully optimized for desktop and mobile.


## 🛠️ Tech Stack

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Icons:** FontAwesome 6.4
- **API:** GitHub REST API


## 🚀 Getting Started

### 1. Installation
Clone the repository and install the required dependencies:

```
git clone https://github.com/AJ-016/Repo-Ranker.git
cd Repo-Ranker
pip install -r requirements.txt
```
### 2. Usage
Run the FastAPI server:
```
python app.py
```

Open your browser and navigate to: http://127.0.0.1:8005


## 📂 Project Structure
```
Repo-Ranker/
├── app.py              # FastAPI Backend logic
├── requirements.txt    # Project dependencies
├── .gitignore          # Files to ignore in Git
├── README.md           # Documentation
└── static/             # Frontend assets
    ├── index.html      # Main UI structure
    ├── style.css       # Custom Glassmorphism styles
    └── script.js       # App logic and Drag-and-Drop
```
## 🤝 Contributing
Feel free to fork this project, open issues, or submit pull requests to improve the UI or add new export formats!

Developed with ☕ by AJ-016