## Gandla Vyshnavi — Data Analyst Portfolio

Static portfolio site for **Gandla Vyshnavi**, focused on data analytics roles (Power BI, SQL, Python, Spark, EDA, dashboards).

Built as a **lightweight static site** (no backend, no Node.js build needed) so you can:

- Host locally with Python
- Upload directly to GitHub
- Deploy easily on Vercel

---

### 1. Project structure

- `index.html` — main page (layout + sections)
- `styles.css` — all styling, dark/light theme
- `script.js` — theme toggle, project filters, search, contact form mailto, etc.
- `data/profile.json` — your profile, contact info, skills (edit this to update content)
- `data/projects.json` — projects list (edit to add/remove or rename projects)
- `assets/`  
  - `favicon.svg` — browser tab icon  
  - `og.svg` — Open Graph preview image  
  - `resume (3).pdf` — your resume (current filename)
- `vercel.json` — Vercel configuration for static hosting
- `README.md` — this file

---

### 2. Update your personal details

Edit `data/profile.json` to make sure everything is accurate:

- **`email`**: `"gvyshnavi611@gmail.com"`
- **`phone`**: `"+91 80889 46259"`
- **`github`**: `"https://github.com/vysh611"`
- **`linkedin`**: **update this** to your real LinkedIn URL  
  Example:

```json
"linkedin": "https://www.linkedin.com/in/your-custom-handle/"
```

You can also adjust:

- `objective` text
- Skill groups under `skills`

---

### 3. Update / add projects

Projects are defined in `data/projects.json`.

For each project:

- `title`: project name
- `when`: time period (e.g. `"Feb 2026"`)
- `badge`: short label like `"Analytics"`, `"Dashboard"`, `"Applied ML"`
- `repo`: GitHub URL for the project (optional, but recommended)
- `tags`: tools/tech (used for filters and search)
- `summary`: 2–3 line overview
- `highlights`: bullet points focused on **impact** and **metrics**

You can:

- Remove entries you don’t want to highlight
- Add new entries for new repos or dashboards you build

---

### 4. Add your resume PDF

Your site is currently configured to open:

- `assets/resume (3).pdf`

If you want a cleaner filename:

1. Rename `assets/resume (3).pdf` to **`assets/resume.pdf`**
2. Update the resume link in `index.html` from `assets/resume%20(3).pdf` to `assets/resume.pdf`

Either approach works—just keep the filename and link matching.

---

### 5. Run the portfolio locally

You already have Python installed, so you can use its built-in HTTP server.

From a terminal:

1. Go to the project folder:

```bash
cd C:\Portfolio
```

2. Start a simple server (port 5500, matches what we used before):

```bash
py -m http.server 5500
```

3. Open in your browser:

```text
http://localhost:5500/index.html
```

Stop the server with `Ctrl + C` in the terminal when you’re done.

---

### 6. Create a GitHub repository (no local git needed)

Since git/Node are not installed locally, the easiest way is to upload via the GitHub web UI.

1. Go to [`https://github.com`](https://github.com) and sign in as `vysh611`.
2. Click **New repository**.
3. Repo name: **`portfolio`** (as you requested).
4. Set:
   - **Public**: enabled (recommended so Vercel can deploy it)
   - **Initialize with README**: _unchecked_ (you already have this `README.md`)
5. Click **Create repository**.
6. On the new repo page, use **“Upload files”**:
   - Drag and drop everything from `C:\Portfolio`:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `data/` folder
     - `assets/` folder (including `resume.pdf` that you added)
     - `vercel.json`
     - `README.md`
7. Scroll down and click **Commit changes**.

Your code is now on GitHub, ready for Vercel.

---

### 7. Deploy to Vercel

1. Go to [`https://vercel.com`](https://vercel.com) and sign in (GitHub login is easiest).
2. Click **“Add New…” → “Project”**.
3. Under “Import Git Repository”, choose the repo you just created (e.g. `data-analyst-portfolio`).
4. Vercel will detect it as a **static** project. Verify settings:
   - **Framework preset**: `Other` or `Static`
   - **Build Command**: leave **empty** (no build needed)
   - **Output Directory**: `.` (the root folder; default works)
5. Click **Deploy**.

After deployment:

- Vercel gives you a live URL like `https://data-analyst-portfolio-yourname.vercel.app`.
- You can copy this URL to:
  - Your resume
  - LinkedIn
  - GitHub profile description

---

### 8. How to update content later

For updates (new projects, text changes, etc.):

1. Edit `data/profile.json` or `data/projects.json` locally.
2. Re-upload just the files you changed via **“Upload files”** on GitHub.
3. Vercel will auto-redeploy from the updated repo.

No build tools or command-line git required.

