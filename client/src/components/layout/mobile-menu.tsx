import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Close menu when location changes
  useEffect(() => {
    onClose();
  }, [location, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 h-full w-3/4 max-w-xs p-4 transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="font-montserrat font-bold text-lg dark:text-white">Shea Ghana</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 dark:text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className={`block py-2 px-4 ${
              location === "/" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg font-medium`}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`block py-2 px-4 ${
              location === "/products" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            All Products
          </Link>
          <Link 
            href="/products/raw-shea-butter" 
            className={`block py-2 px-4 ${
              location === "/products/raw-shea-butter" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            Raw Shea Butter
          </Link>
          <Link 
            href="/products/body-creams" 
            className={`block py-2 px-4 ${
              location === "/products/body-creams" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            Body Creams
          </Link>
          <Link 
            href="/products/hair-products" 
            className={`block py-2 px-4 ${
              location === "/products/hair-products" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            Hair Products
          </Link>
          <Link 
            href="/products/soaps" 
            className={`block py-2 px-4 ${
              location === "/products/soaps" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            Soaps
          </Link>
          <Link 
            href="/products/gift-sets" 
            className={`block py-2 px-4 ${
              location === "/products/gift-sets" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            Gift Sets
          </Link>
          <Link 
            href="/live-market" 
            className={`block py-2 px-4 ${
              location === "/live-market" ? "bg-primary-light text-primary" : "hover:bg-neutral-200"
            } rounded-lg`}
          >
            Live Market
          </Link>
          
          <div className="border-t border-neutral-300 pt-4 mt-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/account" 
                  className="block py-2 px-4 hover:bg-neutral-200 rounded-lg"
                >
                  My Account
                </Link>
                <Link 
                  href="/orders" 
                  className="block py-2 px-4 hover:bg-neutral-200 rounded-lg"
                >
                  My Orders
                </Link>
                {user?.role === "supplier" && (
                  <Link 
                    href="/supplier-dashboard" 
                    className="block py-2 px-4 hover:bg-neutral-200 rounded-lg"
                  >
                    Supplier Dashboard
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="block w-full text-left py-2 px-4 hover:bg-neutral-200 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block py-2 px-4 hover:bg-neutral-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block py-2 px-4 hover:bg-neutral-200 rounded-lg"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
