
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import MovieDetailsPage from './pages/MovieDetails';
import { Analytics } from '@vercel/analytics/react';

// NOTE: Do NOT load `dotenv` in client-side code. `dotenv` expects Node APIs
// (like process.cwd) and will fail when bundled for the browser. Environment
// variables for client-side code should come from Vite's `import.meta.env` or
// be injected at build time via `define` in `vite.config.ts`.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>
);
