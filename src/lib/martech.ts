/**
 * Marketing-script loaders, hard-gated on cookie consent (GDPR).
 *
 * Meta Pixel, TikTok and Klaviyo only load after the visitor grants the
 * "marketing" purpose in the iubenda banner (see index.html + consent.ts).
 * GA4 is NOT loaded here — it stays in index.html under Google Consent Mode v2.
 *
 * The Klaviyo newsletter signup keeps working without consent via the native
 * fallback form in NewsletterSection.tsx (direct POST on explicit user action).
 */

import { onConsent } from "./consent";
import { getLastTrackedPath } from "./analytics";

const TIKTOK_PIXEL_ID = "D8ASDMRC77UAEKHUG2Q0";
const KLAVIYO_COMPANY_ID = "YiRTrJ";

function addScript(src: string): void {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

function loadMetaPixel(): void {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  if (!pixelId || window.fbq) return;

  // Standard fbq stub: queues calls until fbevents.js takes over.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const fbq: any = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  (window as unknown as Record<string, unknown>)._fbq = fbq;

  addScript("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", pixelId);
  // No PageView here — the route tracker / replay below owns page views.
}

function loadTikTok(): void {
  if (window.ttq) return;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  w.TiktokAnalyticsObject = "ttq";
  const ttq = (w.ttq = w.ttq || []);
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
  ttq.setAndDefer = function (t: any, e: string) {
    t[e] = function (...args: unknown[]) {
      t.push([e, ...args]);
    };
  };
  for (const m of ttq.methods) ttq.setAndDefer(ttq, m);
  ttq.instance = function (t: string) {
    const e = ttq._i?.[t] || [];
    for (const m of ttq.methods) ttq.setAndDefer(e, m);
    return e;
  };
  ttq.load = function (id: string, options?: unknown) {
    const url = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[id] = [];
    ttq._i[id]._u = url;
    ttq._t = ttq._t || {};
    ttq._t[id] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[id] = options || {};
    addScript(`${url}?sdkid=${id}&lib=ttq`);
  };
  ttq.load(TIKTOK_PIXEL_ID);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  // No ttq.page() here — the route tracker / replay below owns page views.
}

function loadKlaviyo(): void {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  if (w.klaviyo) return;
  w._klOnsite = w._klOnsite || [];
  try {
    w.klaviyo = new Proxy(
      {},
      {
        get(_n, i: string) {
          return i === "push"
            ? function (...args: unknown[]) {
                w._klOnsite.push(...args);
              }
            : function (...args: unknown[]) {
                const cb = typeof args[args.length - 1] === "function" ? args.pop() : undefined;
                return new Promise((resolve) => {
                  w._klOnsite.push([
                    i,
                    ...args,
                    (v: unknown) => {
                      if (cb) (cb as (v: unknown) => void)(v);
                      resolve(v);
                    },
                  ]);
                });
              };
        },
      }
    );
  } catch {
    w.klaviyo = w.klaviyo || [];
    w.klaviyo.push = function (...args: unknown[]) {
      w._klOnsite.push(...args);
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  addScript(`https://static.klaviyo.com/onsite/js/${KLAVIYO_COMPANY_ID}/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`);
}

/** Call once at app boot (src/main.tsx). */
export function initMartech(): void {
  onConsent("marketing", () => {
    const run = () => {
      loadMetaPixel();
      loadTikTok();
      loadKlaviyo();
      // If the visitor granted consent mid-session, the pixels missed the
      // current page's view (the route tracker fired before they existed) —
      // replay it once. On a fresh load with stored consent, lastTrackedPath
      // is still null here and the route tracker sends it instead.
      if (getLastTrackedPath() !== null) {
        window.fbq?.("track", "PageView");
        window.ttq?.page?.();
      }
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 500);
    }
  });
}
