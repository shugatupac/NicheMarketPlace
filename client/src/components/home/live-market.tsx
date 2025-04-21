
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Auction } from "@/lib/types";
import { AuctionCard } from "../product/auction-card";
import { Skeleton } from "../ui/skeleton";

const LiveMarket = () => {
  const { data: auctions, isLoading, error } = useQuery<Auction[]>({
    queryKey: ['/api/auctions'],
  });

  return (
    <section id="live-market" className="py-16 bg-gradient-to-b from-white to-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-montserrat font-bold text-3xl mb-4">Live Market Auctions</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Join our dynamic marketplace where authentic Ghanaian products are auctioned daily. 
            Bid on premium shea butter and related products directly from verified suppliers.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 bg-white p-3 rounded-full shadow-sm border border-neutral-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-medium">Live Now</span>
            </div>
            <div className="text-sm text-neutral-600">
              {auctions?.length || 0} Active Auctions
            </div>
          </div>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.slice(0, 3).map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link 
                href="/live-market" 
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
              >
                View All Auctions
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-neutral-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-montserrat font-semibold mb-2">No Active Auctions</h3>
            <p className="text-neutral-600 mb-6">Check back soon for new auctions from our verified suppliers.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveMarket;
