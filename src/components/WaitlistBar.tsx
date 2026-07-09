import { ArrowRight } from "lucide-react";

const scrollToWaitlist = () => {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
};

const WaitlistBar = () => {
  return (
    <button
      onClick={scrollToWaitlist}
      className="md:hidden fixed bottom-0 inset-x-0 z-[80] w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] tracking-[0.12em] uppercase shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.25)] active:opacity-90"
      style={{ backgroundColor: "#1A3528", color: "#F7F5F1" }}
      aria-label="Join the waitlist"
    >
      Get 10% off at launch. Join the waitlist <ArrowRight size={14} />
    </button>
  );
};

export default WaitlistBar;
