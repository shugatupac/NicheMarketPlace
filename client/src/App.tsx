import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LoginModal } from "@/components/ui/login-modal";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import HomePage from "@/pages/home";
import ProductListPage from "@/pages/product-list";
import ProductDetailPage from "@/pages/product-detail";
import LiveMarketPage from "@/pages/live-market";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import SupplierDashboardPage from "@/pages/supplier-dashboard";
import WishlistPage from "@/pages/wishlist";
import { useState } from "react";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Dashboard from "./pages/dashboard/index";
import orders from "./pages/dashboard/orders";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-neutral-100 dark:bg-slate-950">
        <Header toggleMobileMenu={toggleMobileMenu} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <main className="flex-grow">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductListPage} />
            <Route path="/products/:category" component={ProductListPage} />
            <Route path="/product/:id" component={ProductDetailPage} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            {/* Dashboard routes */}
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/dashboard/:path*" component={Dashboard} />
            <Route path="/live-market" component={LiveMarketPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/wishlist" component={WishlistPage} />
            <Route path="/supplier-dashboard" component={SupplierDashboardPage} />
            <Route component={NotFound} />
          </Switch>
        </main>

        <Footer />

        {/* Supplier Dashboard Portal Button */}
        <div className="fixed right-5 bottom-5 z-30">
          <button 
            onClick={() => setLoginModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 rounded-full p-3 shadow-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2 font-medium hidden md:inline">Supplier Portal</span>
          </button>
        </div>
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;