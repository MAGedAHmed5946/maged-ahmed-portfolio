# How to Host This Portfolio on GitHub Pages

## 1. Create a GitHub account (if you don’t have one)
- Go to [github.com](https://github.com) and sign up.

## 2. Install Git (if needed)
- Download: [https://git-scm.com/download/win](https://git-scm.com/download/win)
- Run the installer and use the default options.

## 3. Create a new repository on GitHub
- Log in to GitHub → click the **+** (top right) → **New repository**.
- **Repository name:** e.g. `maged-ahmed-portfolio` or `username.github.io` (see note below).
- Set visibility to **Public**.
- **Do not** add a README, .gitignore, or license (you already have files).
- Click **Create repository**.

> **Optional:** If you name the repo `YOUR_USERNAME.github.io` (e.g. `magedahmed.github.io`), the site will be at `https://YOUR_USERNAME.github.io`. Any other name gives `https://YOUR_USERNAME.github.io/REPO_NAME/`.

## 4. Open a terminal in your portfolio folder
- In File Explorer go to: `C:\Users\Compumarts\Desktop\Maged Ahmed`
- In the address bar type `cmd` and press Enter (or right‑click → “Open in Terminal” / “Open PowerShell here”).

## 5. Initialize Git and push your site
Run these commands one by one (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

```bash
git init
git add .
git commit -m "Initial commit - portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

When prompted, sign in with your GitHub username and a **Personal Access Token** (GitHub no longer accepts account passwords for Git). To create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token**; give it a name and the `repo` scope, then use the token as the password when Git asks.

## 6. Turn on GitHub Pages
- On GitHub, open your repository.
- Go to **Settings** → **Pages** (left sidebar).
- Under **Source**, choose **Deploy from a branch**.
- Under **Branch**, select **main** and **/ (root)**.
- Click **Save**.

## 7. Wait and open your site
- After 1–2 minutes, the site will be live at:
  - **If repo name is `USERNAME.github.io`:**  
    `https://YOUR_USERNAME.github.io`
  - **Otherwise:**  
    `https://YOUR_USERNAME.github.io/YOUR_REPO/`

If you used a repo name like `maged-ahmed-portfolio`, your **base URL** will be `https://YOUR_USERNAME.github.io/maged-ahmed-portfolio/`. In that case, internal links (e.g. to `cv.html`) still work because they are relative (`cv.html`, `index.html`).

---

## Quick reference

| Step | What to do |
|------|------------|
| 1 | GitHub account + (optional) Git installed |
| 2 | New repo, e.g. `maged-ahmed-portfolio` or `USERNAME.github.io` |
| 3 | In project folder: `git init` → `git add .` → `git commit -m "Initial commit"` |
| 4 | `git remote add origin https://github.com/USERNAME/REPO.git` |
| 5 | `git push -u origin main` |
| 6 | Repo **Settings** → **Pages** → Source: **main** branch, **/ (root)** → Save |
| 7 | Visit `https://USERNAME.github.io` or `https://USERNAME.github.io/REPO/` |

---

## Updating the site later
After you change files in your folder:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Pages will redeploy automatically; changes can take a minute to appear.
