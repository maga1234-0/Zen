# Quick Guide: Connect to GitHub

## Your Repository
https://github.com/maga1234-0/zenith1.git

## Method 1: Automated Script (Easiest!)

### Just Double-Click This File:
```
connect-and-push.bat
```

It will:
1. Initialize Git
2. Add all files
3. Create commit
4. Connect to your repository
5. Push to GitHub

**You'll need**: Personal Access Token (see below)

---

## Method 2: Manual Commands

### Open PowerShell in Your Project

1. Open File Explorer
2. Go to: `C:\Users\aubin\Downloads\kiro1`
3. Click address bar, type `powershell`, press Enter

### Run These Commands:

```powershell
# 1. Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. Initialize and connect
git init
git add .
git commit -m "Initial commit: Complete Hotel PMS"
git remote add origin https://github.com/maga1234-0/zenith1.git
git branch -M main
git push -u origin main
```

---

## Get Personal Access Token

### Why?
GitHub requires a token instead of password for security.

### How to Get It:

1. **Go to**: https://github.com/settings/tokens
2. **Click**: "Generate new token" → "Generate new token (classic)"
3. **Name**: "Hotel PMS"
4. **Expiration**: 90 days (or No expiration)
5. **Select scope**: Check `repo` (full control of private repositories)
6. **Click**: "Generate token"
7. **Copy**: The token (you won't see it again!)

### When Pushing:
- **Username**: Your GitHub username
- **Password**: Paste the token (NOT your GitHub password)

---

## Visual Steps

```
Step 1: Get Token
GitHub.com → Settings → Developer settings → Tokens
    ↓
Step 2: Run Script
Double-click: connect-and-push.bat
    ↓
Step 3: Enter Credentials
Username: your-github-username
Password: paste-your-token
    ↓
Step 4: Done!
Visit: https://github.com/maga1234-0/zenith1
```

---

## Common Issues

### "remote origin already exists"
**Solution**:
```powershell
git remote remove origin
git remote add origin https://github.com/maga1234-0/zenith1.git
git push -u origin main
```

### "failed to push some refs"
**Solution**:
```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

### "Authentication failed"
**Solution**: Make sure you're using the Personal Access Token, not your password

---

## After Successful Push

1. **Verify**: Visit https://github.com/maga1234-0/zenith1
2. **Check**: All folders are there (client, server, database)
3. **Next**: Deploy to Vercel (see VERCEL_STEP_BY_STEP.md)

---

## Quick Reference

### Your Repository
https://github.com/maga1234-0/zenith1.git

### Get Token
https://github.com/settings/tokens

### Future Updates
```powershell
git add .
git commit -m "Update message"
git push origin main
```

---

**Choose Method 1 (double-click connect-and-push.bat) for easiest experience!** 🚀
