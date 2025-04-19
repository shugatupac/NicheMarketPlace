import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Supplier } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const SupplierStory = () => {
  const { data: suppliers, isLoading, error } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  // Just display the first supplier for the homepage feature
  const featuredSupplier = suppliers?.[0];

  return (
    <section className="py-10 bg-neutral-200">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-2xl mb-6 text-center">Meet Our Suppliers</h2>
        
        {isLoading ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-2/5">
                <Skeleton className="h-64 md:h-full w-full" />
              </div>
              <div className="md:w-3/5 p-6">
                <div className="mb-4">
                  <Skeleton className="h-8 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="mt-6 flex gap-3">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-accent">Failed to load supplier information. Please try again later.</p>
          </div>
        ) : featuredSupplier ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-2/5">
                <div className="h-64 md:h-full relative">
                  <img 
                    src={featuredSupplier.coverImage || "https://images.unsplash.com/photo-1578386773647-18cb3a4093ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={`${featuredSupplier.businessName} Women`} 
                    className="object-cover w-full h-full" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
                    <h3 className="font-montserrat font-bold text-xl text-white">{featuredSupplier.businessName}</h3>
                    <p className="text-white/80 text-sm">{featuredSupplier.location}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-3/5 p-6">
                <div className="hidden md:block mb-4">
                  <h3 className="font-montserrat font-bold text-2xl">{featuredSupplier.businessName}</h3>
                  <p className="text-neutral-600">{featuredSupplier.location}</p>
                </div>
                
                <div className="prose max-w-none">
                  <p className="mb-4">{featuredSupplier.description}</p>
                  {featuredSupplier.story && (
                    <p className="mb-4">{featuredSupplier.story}</p>
                  )}
                  <blockquote className="italic border-l-4 border-primary pl-4 my-4">
                    "When you buy our shea products, you're not just getting quality - you're helping women like me build a better future for our families."
                    <footer className="font-medium mt-1">- Founder, {featuredSupplier.businessName}</footer>
                  </blockquote>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link 
                    href={`/products?supplierId=${featuredSupplier.id}`}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full font-medium inline-block text-center transition-colors duration-200"
                  >
                    View Their Products
                  </Link>
                  <Link 
                    href={`/suppliers/${featuredSupplier.id}`}
                    className="bg-white border border-primary text-primary hover:bg-primary-light px-4 py-2 rounded-full font-medium inline-block text-center transition-colors duration-200"
                  >
                    Their Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No supplier information available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SupplierStory;
