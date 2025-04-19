import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import { useState } from "react";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-neutral-200">
        <Header toggleMobileMenu={toggleMobileMenu} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductListPage} />
            <Route path="/products/:category" component={ProductListPage} />
            <Route path="/product/:id" component={ProductDetailPage} />
            <Route path="/live-market" component={LiveMarketPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/supplier-dashboard" component={SupplierDashboardPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        <Footer />
        
        {/* Supplier Dashboard Portal Button */}
        <div className="fixed right-5 bottom-5 z-30">
          <a 
            href="/supplier-dashboard" 
            className="bg-secondary hover:bg-secondary-dark text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2 font-medium hidden md:inline">Supplier Portal</span>
          </a>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
