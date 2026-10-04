import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { stripLangPrefix } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import sustainabilityHero from "@/assets/sustainability-hero.webp";
import foundersImage from "@/assets/founders.webp";
import impactHero from "@/assets/impact-hero.webp";

const LAUNCH_DATE = new Date("2026-10-01T00:00:00Z");

const daysUntilLaunch = () => {
  const now = new Date();
  const diff = LAUNCH_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, toggleCart } = useCart();
  const [cartBounce, setCartBounce] = useState(false);
  const { t } = useTranslation();
  const { localize } = useLocalizedPath();
  const barePath = stripLangPrefix(location.pathname);

  const shopSubLinks = [
    { label: t("nav.allProducts"), href: "/products" },
    { label: t("nav.pads"), href: "/products/pads" },
    { label: t("nav.tampons"), href: "/products/tampons" },
    { label: t("nav.pantyLiners"), href: "/products/panty-liners" },
  ];

  const aboutMegaLinks = [
    {
      label: t("nav.ourStory"),
      href: "/about",
      description: t("nav.ourStoryDesc"),
      image: foundersImage,
      alt: "Geneviève Silvestra and Rachael Hoogkamer, co-founders of Lore Organics organic period care brand — Our Story navigation preview",
    },
    {
      label: t("nav.sustainability"),
      href: "/sustainability",
      description: t("nav.sustainabilityDesc"),
      image: sustainabilityHero,
      alt: "GOTS certified organic cotton field — sustainable, biodegradable period care from Lore Organics navigation preview",
    },
    {
      label: t("nav.impact"),
      href: "/impact",
      description: t("nav.impactDesc"),
      image: impactHero,
      alt: "Lore Organics impact — period equity and community partnerships navigation preview",
    },
  ];

  const navLinks = [
    { label: t("nav.products"), href: "/products", dropdown: "shop" as const },
    { label: t("nav.cycleBox"), href: "/cycle-box" },
    { label: t("nav.about"), href: "/about", dropdown: "about" as const },
  ];

  // Bounce the cart icon when items change
  useEffect(() => {
    if (totalItems > 0) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className="flex items-center justify-center h-[40px] text-xs tracking-wide font-bold"
        style={{ backgroundColor: "#F7F5F1", color: "#1A3528" }}
      >
        <span className="text-center px-4">
          {daysUntilLaunch() > 0
            ? t("announcement", { days: daysUntilLaunch() })
            : t("announcementLive")}
        </span>
      </div>
      <div className="bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-4">
        {/* Logo */}
        <Link to={localize("/")} className="flex flex-col items-start">
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.05em] text-foreground">
            LORE
          </span>
          <span className="text-[10px] md:text-xs font-sans font-normal tracking-[0.3em] text-muted-foreground -mt-1">
            ORGANICS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.href} className="relative group">
                <Link
                  to={localize(link.href)}
                  className={`text-label transition-colors hover:text-lore-botanical ${
                    barePath.startsWith(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>

                {/* Shop dropdown */}
                {link.dropdown === "shop" && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-background border border-border/50 shadow-lg py-2 min-w-[140px]">
                      {shopSubLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          to={localize(sub.href)}
                          className="block px-5 py-2 text-label text-muted-foreground hover:text-lore-botanical hover:bg-lore-sage/10 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* About mega dropdown */}
                {link.dropdown === "about" && (
                  <div className="fixed left-0 right-0 top-[112px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-background border-b border-border/50 shadow-xl">
                      <div className="px-6 md:px-12 lg:px-24 py-10">
                        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
                          {aboutMegaLinks.map((item) => (
                            <Link
                              key={item.href}
                              to={localize(item.href)}
                              className="group/card flex flex-col"
                            >
                              <div className="relative overflow-hidden mb-4 aspect-[16/10]">
                                <img
                                  src={item.image}
                                  alt={item.alt}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                />
                                <div className="absolute inset-0 bg-foreground/0 group-hover/card:bg-foreground/5 transition-colors duration-300" />
                              </div>
                              <h3 className="font-serif text-lg font-medium mb-1 group-hover/card:text-lore-botanical transition-colors duration-200">
                                {item.label}
                              </h3>
                              <p className="text-body text-muted-foreground text-sm leading-relaxed mb-3">
                                {item.description}
                              </p>
                              <span className="inline-flex items-center gap-2 text-label text-xs text-muted-foreground group-hover/card:text-lore-botanical group-hover/card:gap-3 transition-all duration-200">
                                {t("nav.explore")} <ArrowRight size={12} />
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                to={localize(link.href)}
                className={`text-label transition-colors hover:text-lore-botanical ${
                  barePath === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          <LanguageSwitcher />

          {/* Cart icon, desktop */}
          <button
            onClick={toggleCart}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("nav.openCart")}
            style={{
              transform: cartBounce ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center font-sans font-medium"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "hsl(var(--lore-botanical))",
                  color: "hsl(var(--primary-foreground))",
                  fontSize: "0.55rem",
                  lineHeight: 1,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Cart icon, mobile */}
          <button
            onClick={toggleCart}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("nav.openCart")}
            style={{
              transform: cartBounce ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center font-sans font-medium"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "hsl(var(--lore-botanical))",
                  color: "hsl(var(--primary-foreground))",
                  fontSize: "0.55rem",
                  lineHeight: 1,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground"
            aria-label={t("nav.toggleMenu")}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border/50 px-6 py-8 fade-in">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  to={localize(link.href)}
                  onClick={() => setIsOpen(false)}
                  className={`text-label transition-colors ${
                    barePath === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
                {link.dropdown === "shop" && (
                  <div className="flex flex-col gap-3 mt-3 ml-4">
                    {shopSubLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        to={localize(sub.href)}
                        onClick={() => setIsOpen(false)}
                        className="text-label text-muted-foreground hover:text-lore-botanical transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
                {link.dropdown === "about" && (
                  <div className="flex flex-col gap-4 mt-3 ml-4">
                    {aboutMegaLinks.map((item) => (
                      <Link
                        key={item.href}
                        to={localize(item.href)}
                        onClick={() => setIsOpen(false)}
                        className="text-label text-muted-foreground hover:text-lore-botanical transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <LanguageSwitcher className="pt-2 border-t border-border/40" />
          </div>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
