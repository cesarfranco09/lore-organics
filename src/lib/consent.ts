/**
 * Cookie-consent helper (iubenda Cookie Solution).
 *
 * The banner comes from iubenda's remote-configured embed widget loaded in
 * index.html. Because that config lives in the iubenda dashboard (no local JS
 * callbacks), we watch `_iub.cs.api.getPreferences()` with a light poll and
 * dispatch a `lore:consent` CustomEvent when consent appears. Everything here
 * degrades safely: with no iubenda loaded, no consent is ever reported and
 * marketing scripts simply never load.
 *
 * iubenda purpose ids: 1 necessary, 2 functionality, 3 experience,
 * 4 measurement, 5 marketing.
 */

export type ConsentPurpose = "measurement" | "marketing";

const PURPOSE_IDS: Record<ConsentPurpose, string> = {
  measurement: "4",
  marketing: "5",
};

interface IubPreferences {
  consent?: boolean;
  purposes?: Record<string, boolean>;
}

declare global {
  interface Window {
    _iub?: {
      cs?: { api?: { getPreferences?: () => IubPreferences | null } };
      csConfiguration?: unknown;
    };
  }
}

export const CONSENT_EVENT = "lore:consent";

function getPreferences(): IubPreferences | null {
  try {
    return window._iub?.cs?.api?.getPreferences?.() ?? null;
  } catch {
    return null;
  }
}

export function hasConsent(purpose: ConsentPurpose): boolean {
  const prefs = getPreferences();
  if (!prefs) return false;
  // Per-purpose consent when available, otherwise the blanket consent flag.
  if (prefs.purposes && Object.keys(prefs.purposes).length > 0) {
    return prefs.purposes[PURPOSE_IDS[purpose]] === true;
  }
  return prefs.consent === true;
}

/* Poll iubenda's preference API (remote-config embeds can't register local JS
 * callbacks). Fast at first — most consents happen in the opening seconds —
 * then slower, forever (a visitor can open the privacy widget at any time). */
let watcherStarted = false;
function startConsentWatcher(): void {
  if (watcherStarted) return;
  watcherStarted = true;

  let elapsed = 0;
  let lastSnapshot = "";
  const checkNow = () => {
    const prefs = getPreferences();
    const snapshot = prefs ? JSON.stringify(prefs.purposes ?? prefs.consent ?? "") : "";
    if (snapshot && snapshot !== lastSnapshot) {
      lastSnapshot = snapshot;
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT)); // listeners re-check their purpose
    }
  };
  const interval = () => (elapsed < 30_000 ? 1_000 : 10_000);
  const tick = () => {
    checkNow();
    elapsed += interval();
    setTimeout(tick, interval());
  };
  setTimeout(tick, interval());
  // Consent always requires a click (banner button / privacy widget) — re-check
  // shortly after any click so pixels load near-instantly even in slow-poll phase.
  document.addEventListener("click", () => setTimeout(checkNow, 600), { passive: true });
}

/**
 * Run `cb` once, as soon as the given purpose is consented — immediately if a
 * stored preference already grants it, otherwise when the consent watcher
 * sees it granted. Never runs on rejection.
 */
export function onConsent(purpose: ConsentPurpose, cb: () => void): void {
  let fired = false;
  const fire = () => {
    if (!fired) {
      fired = true;
      cb();
    }
  };

  if (hasConsent(purpose)) {
    fire();
    return;
  }

  window.addEventListener(CONSENT_EVENT, () => {
    if (!fired && hasConsent(purpose)) fire();
  });
  startConsentWatcher();
}
