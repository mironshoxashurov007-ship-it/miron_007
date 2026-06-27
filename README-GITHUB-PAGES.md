Deploying Miron.uz to GitHub Pages (static, with custom domain)

This repository includes a server-enabled version (`server.js` + `data/state.json`) and a client-only variant for static hosting (`app.local.js`). GitHub Pages only serves static files, so use `app.local.js` when deploying here.

Steps to prepare the repo for GitHub Pages:

1. Switch index.html to load the client-only bundle

   Open `index.html` and replace:

   ```html
   <script type="module" src="app.js" defer></script>
   ```

   with:

   ```html
   <script type="module" src="app.local.js" defer></script>
   ```

2. Commit and push your repository to GitHub (create a new repo if needed):

```bash
git init
git add .
git commit -m "Initial commit for GitHub Pages"
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. Enable GitHub Pages

- On GitHub, go to Settings → Pages.
- Set the source to `main` branch and root `/` (or `gh-pages` branch if you prefer).
- Save and wait a minute — your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

4. Add a custom domain (optional)

If you want to use a custom domain (e.g. `example.com` or `www.example.com`):

- Create a DNS record:
  - For an apex domain (`example.com`): add A records pointing to GitHub Pages IPs:
    - 185.199.108.153
    - 185.199.109.153
    - 185.199.110.153
    - 185.199.111.153
  - For a subdomain (`www.example.com`): create a CNAME record pointing to `YOUR_USERNAME.github.io`.

- In your repo root, create a file named `CNAME` containing your custom domain on a single line, for example:

```
www.example.com
```

- Commit and push the `CNAME` file. GitHub Pages will automatically enable HTTPS (may take a few minutes).

5. Notes

- Because this is the static (client-only) deployment, data is stored per-browser in `localStorage`.
- If you need shared server-side data across visitors, consider deploying `server.js` to a Node hosting provider (Vercel, Render, DigitalOcean App Platform, etc.) instead.

If you want, I can:
- finish `app.local.js` by copying the remaining functions from `app.js` so it becomes a fully working client-only file, and
- create a `CNAME` file here if you give me the custom domain.

Tell me which of those you'd like me to do next.