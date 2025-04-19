import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "../product/product-card";
import { Product } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <section id="products" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-montserrat font-bold text-2xl">Featured Products</h2>
          <Link 
            href="/products" 
            className="text-primary font-medium flex items-center"
          >
            View All
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-5 w-4/5 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-accent">Failed to load featured products. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
