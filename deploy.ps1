# Deploy portfolio to GitHub Pages
# Run this AFTER: 1) Installing Git  2) Creating a repo on GitHub  3) Setting your username/repo below

$GitHubUsername = "MAGedAHmed5946"
$RepoName        = "maged-ahmed-portfolio"

$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
$projectRoot = $PSScriptRoot
if (Test-Path "C:\Program Files\Git\cmd\git.exe") { $env:Path = "C:\Program Files\Git\cmd;" + $env:Path }
Set-Location $projectRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Install from: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path .git)) {
    Write-Host "Initializing git repo..."
    git init
    git branch -M main
}

Write-Host "Adding and committing files..."
git add .
git status
git commit -m "Deploy portfolio to GitHub Pages" 2>$null
if ($LASTEXITCODE -ne 0) { git commit -m "Update portfolio" }

Write-Host "Checking remote..."
$currentRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote add origin $remoteUrl
}
# Use token from file for push if present
$tokenFile = Join-Path $projectRoot "Githubtokkeen.txt"
if (Test-Path $tokenFile) {
    $token = (Get-Content $tokenFile -Raw).Trim()
    git remote set-url origin "https://${GitHubUsername}:$token@github.com/$GitHubUsername/$RepoName.git"
}
Write-Host "Pushing to GitHub..."
git push -u origin main
# Remove token from remote URL after push
git remote set-url origin $remoteUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Done. Enable Pages: Repo -> Settings -> Pages -> Source: main branch, / (root) -> Save" -ForegroundColor Green
    if ($RepoName -like "*.github.io") {
        Write-Host "Site URL: https://$GitHubUsername.github.io" -ForegroundColor Cyan
    } else {
        Write-Host "Site URL: https://$GitHubUsername.github.io/$RepoName/" -ForegroundColor Cyan
    }
} else {
    Write-Host "Push failed. Create the repo on GitHub first, then run this script again." -ForegroundColor Yellow
    Write-Host "Create repo: https://github.com/new" -ForegroundColor Yellow
}
