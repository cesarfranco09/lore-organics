import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { initMartech } from "./lib/martech";
import "./lib/i18n"; // i18next init (EN/NL/DE)
import "./index.css";

// Marketing scripts (Meta Pixel, TikTok, Klaviyo) — loaded only after cookie consent.
initMartech();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
