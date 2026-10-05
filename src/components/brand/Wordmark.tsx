/**
 * LORE / ORGANICS lockup — one treatment everywhere (header, footer).
 * Replace with the supplied logo file once the team sends it.
 */
const Wordmark = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const main = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-2xl md:text-[28px]";
  const sub = size === "lg" ? "text-[11px]" : "text-[9px] md:text-[10px]";
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className={`font-serif font-normal tracking-[0.14em] ${main}`}>LORE</span>
      <span className={`mt-1 font-sans font-medium tracking-[0.42em] pl-[0.42em] ${sub}`}>ORGANICS</span>
    </span>
  );
};

export default Wordmark;
