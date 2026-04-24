# Push Code to GitHub Repository

## Repository URL
https://github.com/maga1234-0/zenith1.git

## Prerequisites

### 1. Install Git
Download and install Git for Windows from: https://git-scm.com/download/win

During installation:
- Choose "Git from the command line and also from 3rd-party software"
- Use default settings for other options

After installation, restart your terminal/PowerShell.

### 2. Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step-by-Step Guide

### Option 1: Push to New Repository (Recommended)

```bash
# 1. Navigate to your project directory
cd C:\Users\aubin\Downloads\kiro1

# 2. Initialize git repository
git init

# 3. Add all files to staging
git add .

# 4. Create initial commit
git commit -m "Initial commit: Hotel PMS with all features"

# 5. Add remote repository
git remote add origin https://github.com/maga1234-0/zenith1.git

# 6. Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Option 2: If Repository Already Has Content

If the repository already exists and has files, you'll need to pull first:

```bash
# 1. Initialize and add remote
git init
git remote add origin https://github.com/maga1234-0/zenith1.git

# 2. Pull existing content
git pull origin main --allow-unrelated-histories

# 3. Add your files
git add .

# 4. Commit changes
git commit -m "Add Hotel PMS application"

# 5. Push to GitHub
git push -u origin main
```

## Important: Create .gitignore File

Before pushing, you should exclude sensitive files and dependencies:

```bash
# Create .gitignore file (already exists in your project)
# Make sure it contains:
```

### .gitignore Content (Already in your project)
```
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
server/.env

# Build outputs
dist/
build/
client/dist/
server/dist/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Temporary files
*.tmp
*.temp
```

## Verify Before Pushing

Check what will be committed:
```bash
git status
```

Check file differences:
```bash
git diff
```

## Authentication

When you push, GitHub will ask for authentication:

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use token as password when pushing

### Option 2: GitHub CLI
```bash
# Install GitHub CLI from: https://cli.github.com/
gh auth login
```

## Common Issues & Solutions

### Issue 1: "fatal: not a git repository"
```bash
git init
```

### Issue 2: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/maga1234-0/zenith1.git
```

### Issue 3: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Issue 4: Large files error
If you have files larger than 100MB:
```bash
# Install Git LFS
git lfs install
git lfs track "*.large-file-extension"
git add .gitattributes
git commit -m "Add Git LFS"
```

## After Successful Push

Verify your code is on GitHub:
1. Visit: https://github.com/maga1234-0/zenith1
2. Check that all files are there
3. Verify README.md displays correctly

## Update README.md for GitHub

Make sure your README.md includes:
- Project title and description
- Installation instructions
- How to run the project
- Environment variables needed
- Database setup instructions
- Login credentials for demo

## Future Updates

After initial push, to update the repository:

```bash
# 1. Check status
git status

# 2. Add changed files
git add .

# 3. Commit with message
git commit -m "Description of changes"

# 4. Push to GitHub
git push origin main
```

## Quick Commands Reference

```bash
# Check status
git status

# Add all files
git add .

# Add specific file
git add filename.txt

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull from GitHub
git pull origin main

# View commit history
git log

# View remote URL
git remote -v

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main
```

## Protect Sensitive Information

Before pushing, ensure these files are in .gitignore:
- ✅ server/.env (contains database password)
- ✅ node_modules/ (large dependency folders)
- ✅ Any files with API keys or secrets

## Repository Structure on GitHub

After pushing, your repository will have:
```
zenith1/
├── client/              # React frontend
├── server/              # Express backend
├── database/            # SQL scripts
├── README.md            # Project documentation
├── .gitignore          # Ignored files
└── [other docs]        # All your documentation files
```

## Collaboration

To allow others to contribute:
1. Go to repository Settings → Collaborators
2. Add collaborators by username/email
3. They can then clone and push to the repository

## Clone Repository (For Others)

Others can get your code with:
```bash
git clone https://github.com/maga1234-0/zenith1.git
cd zenith1
npm install
```

---

## Quick Start (After Git is Installed)

```bash
cd C:\Users\aubin\Downloads\kiro1
git init
git add .
git commit -m "Initial commit: Complete Hotel PMS"
git remote add origin https://github.com/maga1234-0/zenith1.git
git branch -M main
git push -u origin main
```

**Note**: You'll need to enter your GitHub username and Personal Access Token when prompted.

---

**Need Help?** 
- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
