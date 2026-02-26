# Netlify Deploy Checklist (Android + HTTPS)

## 1) Create GitHub repo and push
Run these commands in this folder:

```bash
git init
git add .
git commit -m "Initial Guitar Fretboard Trainer"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2) Deploy on Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click `Add new site` -> `Import an existing project`
3. Select your GitHub repo
4. Build settings:
- Build command: *(leave empty)*
- Publish directory: `.`
5. Click `Deploy site`

## 3) Open from Android
1. Open your Netlify URL in Chrome:
- `https://<site-name>.netlify.app/trainer.html`
2. Grant microphone permission when prompted
3. Install app (optional):
- Chrome menu -> `Add to Home screen` / `Install app`

## 4) Notes for audio/mic
- Use HTTPS URL (Netlify): required/recommended for mobile mic access.
- If mic seems stale after updates: refresh once, or close/reopen tab.

## 5) Update flow after code changes
```bash
git add .
git commit -m "Your update message"
git push
```
Netlify redeploys automatically after each push.
