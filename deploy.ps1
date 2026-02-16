# Deploy portfolio to GitHub Pages
# Run this AFTER: 1) Installing Git  2) Creating a repo on GitHub  3) Setting your username/repo below

$GitHubUsername = "MAGedAHmed5946"
$RepoName        = "maged-ahmed-portfolio"

$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
$projectRoot = $PSScriptRoot

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
    Write-Host "Adding remote: $remoteUrl"
    git remote add origin $remoteUrl
} else {
    Write-Host "Remote already set: $currentRemote"
}

Write-Host "Pushing to GitHub (you may be asked for username and Personal Access Token)..."
git push -u origin main

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
