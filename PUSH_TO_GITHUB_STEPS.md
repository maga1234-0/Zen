# Quick Guide: Push to GitHub

## Step 1: Install Git (If Not Installed)

1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings
4. Restart your terminal/PowerShell

## Step 2: Configure Git (First Time Only)

Open PowerShell and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Use the Automated Script

Simply double-click the file:
```
push-to-github.bat
```

This will:
- Initialize git repository
- Add all files
- Create a commit
- Add remote repository
- Push to GitHub

## Step 4: Enter Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (NOT your GitHub password)

### How to Get Personal Access Token:
1. Go to GitHub.com
2. Click your profile picture → Settings
3. Scroll down → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token (classic)
6. Select scope: `repo` (full control of private repositories)
7. Generate token
8. Copy the token (you won't see it again!)
9. Use this token as your password when pushing

## Step 5: Verify

Visit your repository:
https://github.com/maga1234-0/zenith1

You should see all your files there!

## Alternative: Manual Commands

If you prefer to do it manually:

```bash
# Navigate to your project
cd C:\Users\aubin\Downloads\kiro1

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete Hotel PMS"

# Add remote
git remote add origin https://github.com/maga1234-0/zenith1.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Troubleshooting

### Error: "git is not recognized"
- Git is not installed. Install from https://git-scm.com/download/win
- Restart your terminal after installation

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/maga1234-0/zenith1.git
```

### Error: "failed to push"
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### Error: "Authentication failed"
- Make sure you're using a Personal Access Token, not your password
- Generate a new token from GitHub settings

## After First Push

For future updates:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

## Important Files Created

1. **GIT_SETUP_GUIDE.md** - Complete detailed guide
2. **push-to-github.bat** - Automated script (just double-click)
3. **GITHUB_README.md** - Copy this to README.md for your GitHub repo
4. **.gitignore** - Already configured to exclude sensitive files

## What Gets Pushed

✅ All source code
✅ Documentation files
✅ Database scripts
✅ Configuration examples

❌ node_modules/ (excluded)
❌ .env files (excluded)
❌ Build outputs (excluded)

---

**Ready to push? Just double-click `push-to-github.bat`!**
