import { useEffect } from "react";
import Seo from "@/components/Seo";

const PrivacyPolicy = () => {
  useEffect(() => {
    if (!document.querySelector('script[src="https://cdn.iubenda.com/iubenda.js"]')) {
      const s = document.createElement("script");
      s.src = "https://cdn.iubenda.com/iubenda.js";
      s.type = "text/javascript";
      s.async = true;
      document.body.appendChild(s);
    } else if ((window as any).iubendaLoader) {
      try { (window as any).iubendaLoader(); } catch {}
    }
  }, []);

  return (
    <main className="pt-32 pb-24 section-padding min-h-[60vh]">
      <Seo
        title="Privacy Policy — Lore Organics"
        description="How Lore Organics collects, uses and protects your personal data."
        path="/privacy-policy"
      />
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-label text-lore-botanical mb-4">Legal</p>
        <div className="divider-botanical mx-auto mb-8" />
        <h1 className="text-editorial-lg mb-8">Privacy Policy</h1>
        <a
          href="https://www.iubenda.com/privacy-policy/78164954"
          className="iubenda-white iubenda-noiframe iubenda-embed"
          title="Privacy Policy"
        >
          Privacy Policy
        </a>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
