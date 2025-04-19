import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Auction } from "@/lib/types";
import AuctionCard from "../product/auction-card";
import { Skeleton } from "../ui/skeleton";

const LiveMarket = () => {
  const { data: auctions, isLoading, error } = useQuery<Auction[]>({
    queryKey: ['/api/auctions'],
  });

  return (
    <section id="live-market" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-montserrat font-bold text-2xl">Live Market Auctions</h2>
          <Link 
            href="/live-market" 
            className="text-primary font-medium flex items-center"
          >
            View All Auctions
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg border border-neutral-300">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-3 w-12 mb-1" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-accent">Failed to load auctions. Please try again later.</p>
          </div>
        ) : auctions && auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.slice(0, 3).map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No active auctions available at the moment.</p>
            <p className="mt-2">Check back later or subscribe to our newsletter to be notified of upcoming auctions.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveMarket;
