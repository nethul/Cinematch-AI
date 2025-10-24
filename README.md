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
