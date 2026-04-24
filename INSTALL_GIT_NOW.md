# Install Git - Step by Step

## You Need to Install Git First!

Git is not installed on your computer. Here's how to install it:

## Step 1: Download Git

**Click this link**: https://git-scm.com/download/win

Or go to: https://git-scm.com and click "Download for Windows"

## Step 2: Install Git

1. Run the downloaded installer (Git-2.xx.x-64-bit.exe)
2. Click "Next" through the installation wizard
3. **Important settings**:
   - ✅ Use default installation location
   - ✅ Select "Git from the command line and also from 3rd-party software"
   - ✅ Use default for all other options
4. Click "Install"
5. Click "Finish"

## Step 3: Restart PowerShell

**IMPORTANT**: Close and reopen PowerShell after installation!

## Step 4: Verify Installation

Open a new PowerShell window and type:
```bash
git --version
```

You should see something like: `git version 2.43.0`

## Step 5: Configure Git

Run these commands (replace with your info):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 6: Push to GitHub

Now you can use the automated script:
- Double-click `push-to-github.bat`

Or run manually:
```bash
git init
git add .
git commit -m "Initial commit: Complete Hotel PMS"
git remote add origin https://github.com/maga1234-0/zenith1.git
git branch -M main
git push -u origin main
```

---

## Quick Summary

1. **Download**: https://git-scm.com/download/win
2. **Install**: Use default settings
3. **Restart**: Close and reopen PowerShell
4. **Configure**: Set your name and email
5. **Push**: Double-click `push-to-github.bat`

---

## Alternative: Use GitHub Desktop (Easier)

If you prefer a visual interface:

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click "Add" → "Add existing repository"
4. Select your project folder: `C:\Users\aubin\Downloads\kiro1`
5. Click "Publish repository"
6. Choose repository name: `zenith1`
7. Click "Publish"

Done! Much easier with GitHub Desktop!

---

## Recommended: GitHub Desktop

For beginners, GitHub Desktop is much easier:
- No command line needed
- Visual interface
- Automatic authentication
- Easy to use

**Download**: https://desktop.github.com/

---

**Choose one method and follow the steps!**
