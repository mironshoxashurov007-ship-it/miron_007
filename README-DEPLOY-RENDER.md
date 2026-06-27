Deploying Miron.uz (Node server) to Render — shared storage (recommended)

This repository already includes `server.js` which exposes `/api/state` and persists to `data/state.json`.
Deploying the Node server makes all visitors see the same articles (shared persistence).

Quick steps (recommended: Render.com):

1. Push your repo to GitHub if not already:

```bash
git add .
git commit -m "Prepare app for cloud deployment"
git push origin main
```

2. Create a free account at https://render.com and connect your GitHub account.

3. Create a new "Web Service":
- Select your repository.
- Branch: `main` (or your branch)
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: leave default (Render sets `PORT` automatically)

4. Deploy. Render will build and start your Node server. When active you get a public URL like `https://your-service.onrender.com`.

5. (Optional) Point your custom domain to Render
- Add your domain in Render dashboard (Service → Settings → Custom Domains).
- Follow Render DNS instructions (CNAME or A records) and wait for propagation.

Notes and checks:
- `server.js` writes `data/state.json` automatically — no other setup required.
- If you prefer another host: Fly, Railway, Heroku (if available), or DigitalOcean App Platform also work similarly.
- For GitHub Pages (static) you must use `app.local.js` and you'll lose shared server persistence.

If you want, I can:
- Create a small `render.md` with the exact DNS/CNAME step for your domain (if you give the domain), and
- Verify your repo is ready (run `node server.js` locally and test `http://localhost:3000/api/state`).

Which do you prefer: I deploy instructions only, or help you prepare & verify locally now?