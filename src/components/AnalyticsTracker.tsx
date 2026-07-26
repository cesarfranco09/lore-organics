import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Sends a page_view (GA4 + Meta + TikTok) on every route change, including
 * the initial load — GA4 is configured with send_page_view: false and the
 * pixels never fire an init-time PageView, so this is the single source of
 * page views and nothing double-counts.
 */
const AnalyticsTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Next tick so react-helmet has applied the new document.title.
    const t = setTimeout(() => trackPageView(pathname + search), 0);
    return () => clearTimeout(t);
  }, [pathname, search]);

  return null;
};

export default AnalyticsTracker;
