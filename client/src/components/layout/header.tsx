import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const categories = [
    { name: "All Products", path: "/products" },
    { name: "Raw Shea Butter", path: "/products/raw-shea-butter" },
    { name: "Body Creams", path: "/products/body-creams" },
    { name: "Hair Products", path: "/products/hair-products" },
    { name: "Soaps", path: "/products/soaps" },
    { name: "Gift Sets", path: "/products/gift-sets" },
    { name: "Live Market", path: "/live-market" },
  ];
  
  const isActiveCategory = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <span className="font-montserrat font-bold text-xl hidden sm:block">Shea Ghana</span>
            </Link>
          </div>
          
          {/* Search Bar - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for shea products..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-neutral-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-neutral-500 absolute left-3 top-2.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </form>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="text-neutral-700 hover:text-primary transition-colors duration-200">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </Link>
            <Link href="/cart" className="text-neutral-700 hover:text-primary transition-colors duration-200 relative">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden text-neutral-700" 
              onClick={toggleMobileMenu}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            {isAuthenticated ? (
              <Link 
                href="/account" 
                className="hidden md:block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full font-montserrat font-medium transition-colors duration-200"
              >
                {user?.name.split(' ')[0]}
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="hidden md:block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full font-montserrat font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Search - Only visible on mobile */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 rounded-full border border-neutral-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-neutral-500 absolute left-3 top-2.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </form>
        </div>
      </div>
      
      {/* Category Navigation */}
      <nav className="border-t border-neutral-300 bg-white overflow-x-auto custom-scroll">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6 py-3 whitespace-nowrap">
            {categories.map((category) => (
              <li key={category.path}>
                <Link 
                  href={category.path} 
                  className={`${
                    isActiveCategory(category.path) 
                      ? "text-primary font-medium" 
                      : "text-neutral-600 hover:text-primary transition-colors duration-200"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
