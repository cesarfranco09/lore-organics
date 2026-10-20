import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { stripLangPrefix } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Wordmark from "@/components/brand/Wordmark";

/**
 * Thin deep-sage announcement bar over a cream header (brief §3, Homepage 1–2).
 * Nav: Shop · Cycle Box · The Lore · About · EN NL DE · bag.
 */

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const CartButton = ({ bounce }: { bounce: boolean }) => {
  const { totalItems, toggleCart } = useCart();
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative flex h-10 w-10 items-center justify-center text-foreground transition-opacity duration-200 hover:opacity-70"
      aria-label={t("nav.openCart")}
      style={{
        transform: bounce ? "scale(1.15)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <ShoppingBag size={20} strokeWidth={1.25} />
      {totalItems > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground">
          {totalItems}
        </span>
      )}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const [cartBounce, setCartBounce] = useState(false);
  const { t } = useTranslation();
  const { localize } = useLocalizedPath();
  const barePath = stripLangPrefix(location.pathname);

  const items: NavItem[] = [
    {
      label: t("nav.shop"),
      href: "/products",
      children: [
        { label: t("nav.pads"), href: "/products/pads" },
        { label: t("nav.tampons"), href: "/products/tampons" },
        { label: t("nav.liners"), href: "/products/panty-liners" },
        { label: t("nav.howCycleBoxWorks"), href: "/cycle-box#how-it-works" },
      ],
    },
    { label: t("nav.cycleBox"), href: "/cycle-box" },
    { label: t("nav.theLore"), href: "/the-lore" },
    {
      label: t("nav.about"),
      href: "/about",
      children: [
        { label: t("nav.ourStory"), href: "/about" },
        { label: t("nav.materials"), href: "/materials" },
        { label: t("nav.giving"), href: "/giving" },
      ],
    },
  ];

  const isActive = (item: NavItem) =>
    barePath === item.href ||
    barePath.startsWith(`${item.href}/`) ||
    !!item.children?.some((c) => barePath === c.href.split("#")[0]);

  // Close the mobile menu on navigation.
  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    if (totalItems > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-50">
      <div className="flex min-h-8 items-center justify-center bg-primary px-4 py-1.5 text-center text-[10px] font-medium uppercase leading-[14px] tracking-[0.1em] text-primary-foreground md:text-[11px] md:tracking-[0.14em]">
        <span>{t("announcement")}</span>
      </div>

      <div className="border-b border-border bg-background">
        <div className="container-lore flex h-16 items-center justify-between gap-6 md:h-[76px]">
          <Link to={localize("/")} className="shrink-0 text-foreground" aria-label="Lore Organics">
            <Wordmark />
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label={t("nav.main")}>
            {items.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    to={localize(item.href)}
                    className={`flex items-center gap-1 py-6 text-label transition-opacity duration-200 hover:opacity-70 ${
                      isActive(item) ? "text-foreground" : "text-muted-foreground"
                    }`}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown size={12} strokeWidth={1.5} className="transition-transform duration-200 group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-0 opacity-0 transition-opacity duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-[220px] rounded-xl border border-border bg-background py-2 shadow-[0_18px_40px_-24px_rgba(47,51,46,0.35)]">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            to={localize(c.href)}
                            className="block px-5 py-2.5 text-[14px] text-foreground transition-colors duration-200 hover:bg-card"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={localize(item.href)}
                  className={`py-6 text-label transition-opacity duration-200 hover:opacity-70 ${
                    isActive(item) ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher className="hidden lg:flex" />
            <CartButton bounce={cartBounce} />
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
              aria-label={t("nav.toggleMenu")}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <nav
            className="max-h-[calc(100svh-96px)] overflow-y-auto border-t border-border bg-background lg:hidden"
            aria-label={t("nav.main")}
          >
            <ul className="container-lore divide-y divide-border py-2">
              {items.map((item) => (
                <li key={item.href} className="py-4">
                  <Link to={localize(item.href)} className="text-label text-foreground">
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mt-3 flex flex-col gap-3 pl-4">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link to={localize(c.href)} className="t-body text-muted-foreground">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="py-5">
                <LanguageSwitcher />
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
