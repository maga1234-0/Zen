# Connect Your Project to GitHub Repository

## Your Repository
https://github.com/maga1234-0/zenith1.git

## Step-by-Step Commands

### Step 1: Open PowerShell in Your Project Folder

1. Open File Explorer
2. Navigate to: `C:\Users\aubin\Downloads\kiro1`
3. Click in the address bar
4. Type `powershell` and press Enter

### Step 2: Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

### Step 3: Initialize Git Repository

```powershell
git init
```

### Step 4: Add All Files

```powershell
git add .
```

### Step 5: Create First Commit

```powershell
git commit -m "Initial commit: Complete Hotel PMS"
```

### Step 6: Connect to Your GitHub Repository

```powershell
git remote add origin https://github.com/maga1234-0/zenith1.git
```

### Step 7: Set Main Branch

```powershell
git branch -M main
```

### Step 8: Push to GitHub

```powershell
git push -u origin main
```

**Note**: You'll be asked for credentials:
- Username: Your GitHub username
- Password: Use a Personal Access Token (NOT your GitHub password)

## Get Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Hotel PMS Deploy"
4. Select scope: `repo` (full control)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. Use this token as your password when pushing

## All Commands in One Block

Copy and paste these one by one:

```powershell
# Configure Git (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize and add files
git init
git add .
git commit -m "Initial commit: Complete Hotel PMS"

# Connect to GitHub
git remote add origin https://github.com/maga1234-0/zenith1.git
git branch -M main

# Push to GitHub
git push -u origin main
```

## If Repository Already Has Files

If your GitHub repository already has some files, use this instead:

```powershell
# Pull existing files first
git pull origin main --allow-unrelated-histories

# Then push your files
git push -u origin main
```

## Troubleshooting

### Error: "remote origin already exists"

```powershell
git remote remove origin
git remote add origin https://github.com/maga1234-0/zenith1.git
```

### Error: "failed to push"

```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

### Error: "Authentication failed"

Make sure you're using a Personal Access Token, not your GitHub password.

## After First Push

For future updates, just use:

```powershell
git add .
git commit -m "Your update message"
git push origin main
```

## Verify Upload

After pushing, visit:
https://github.com/maga1234-0/zenith1

You should see all your files there!

---

**Ready to connect? Open PowerShell in your project folder and run the commands!** 🚀
