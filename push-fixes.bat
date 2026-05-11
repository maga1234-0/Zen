@echo off
echo Pushing Vercel build fixes to GitHub...

REM Add all changes
git add .

REM Commit changes
git commit -m "Fix Vercel build: change ./build-vercel.sh to bash build-vercel.sh and update Node engine version"

REM Push to GitHub
git push origin main

echo Done! Changes pushed to GitHub.
echo Vercel should automatically redeploy.