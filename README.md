<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15jdI34Pl7FjeQw_3nA6nKvLGLKJ8KOWF

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Environment variables and secrets

Create a `.env.local` (or `.env`) file in the project root and add your API keys. Example values are in `.env.example`.

Example `.env.local` (client-visible values must be prefixed with `VITE_`):

```
VITE_GEMINI_API_KEY=sk-...
VITE_TMDB_API_KEY=tmdb-...
```

The project loads environment variables at build/startup. Client code should read
non-secret, client-safe values via `import.meta.env.VITE_*`. Do NOT put private
API keys into client bundles. For secret keys, move API calls to a server-side
endpoint where the keys remain secret.

Note: Do NOT commit your `.env.local` or `.env` file to source control. `.gitignore` already contains a rule to ignore `.env` and `*.local` files.

## SEO and social sharing

To help search engines and social networks index and preview your app correctly, this project includes meta tags, Open Graph and Twitter Card tags in `index.html`, plus `robots.txt` and a simple `sitemap.xml` at the repo root.

Before deploying, update the placeholder URLs and handles in `index.html`, `sitemap.xml`, and `robots.txt`:

- Replace `https://your-domain.example/` with your production domain.
- Replace `https://your-domain.example/og-image.png` with a real Open Graph image (1200x630 recommended).
- Set `@your_twitter_handle` to your Twitter/X handle if you have one.

After deployment, submit your `sitemap.xml` to Google Search Console and Bing Webmaster Tools and monitor indexing. Consider adding analytics and creating shareable content to drive traffic.
