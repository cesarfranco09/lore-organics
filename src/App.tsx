import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import LangLayout from "@/components/LangLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import GiveOneInterstitial from "@/components/donation/GiveOneInterstitial";
import Index from "./pages/Index";
import WaitlistBar from "@/components/WaitlistBar";

// Code-split secondary routes so the home page loads only what it needs
const Products = lazy(() => import("./pages/Products"));
const About = lazy(() => import("./pages/About"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
const Impact = lazy(() => import("./pages/Impact"));
const CycleBox = lazy(() => import("./pages/CycleBox"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ReturnRefundPolicy = lazy(() => import("./pages/ReturnRefundPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

// One page tree, mounted under each language prefix (EN at root, /nl, /de).
const pageRoutes = (
  <>
    <Route index element={<Index />} />
    <Route path="products" element={<Products />} />
    <Route path="products/:category" element={<Products />} />
    <Route path="cycle-box" element={<CycleBox />} />
    <Route path="about" element={<About />} />
    <Route path="sustainability" element={<Sustainability />} />
    <Route path="impact" element={<Impact />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="privacy-policy" element={<PrivacyPolicy />} />
    <Route path="return-refund-policy" element={<ReturnRefundPolicy />} />
    <Route path="faq" element={<FAQ />} />
    <Route path="*" element={<NotFound />} />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsTracker />
          <Navbar />
          <CartDrawer />
          <GiveOneInterstitial />
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<LangLayout lang="en" />}>
                {pageRoutes}
              </Route>
              <Route path="/nl" element={<LangLayout lang="nl" />}>
                {pageRoutes}
              </Route>
              <Route path="/de" element={<LangLayout lang="de" />}>
                {pageRoutes}
              </Route>
            </Routes>
          </Suspense>
          <Footer />
          <WaitlistBar />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
