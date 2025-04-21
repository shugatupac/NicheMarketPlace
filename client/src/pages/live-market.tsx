import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import { Auction } from "@/lib/types";
import { AuctionCard } from "@/components/product/auction-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const LiveMarketPage = () => {
  const params = useParams();
  const auctionId = params?.id ? parseInt(params.id) : undefined;
  const { toast } = useToast();
  
  // State for bid amount
  const [bidAmount, setBidAmount] = useState<string>("");
  
  // Query for all auctions
  const { 
    data: auctions, 
    isLoading: auctionsLoading, 
    error: auctionsError
  } = useQuery<Auction[]>({
    queryKey: ['/api/auctions'],
  });
  
  // Query for specific auction if ID is provided
  const { 
    data: auction, 
    isLoading: auctionLoading, 
    error: auctionError,
    refetch: refetchAuction
  } = useQuery<Auction>({
    queryKey: [`/api/auctions/${auctionId}`],
    enabled: !!auctionId,
  });
  
  const handlePlaceBid = async () => {
    if (!auction || !bidAmount) return;
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= auction.currentPrice) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be higher than the current price (GH₵ ${auction.currentPrice.toFixed(2)})`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      // For demo purposes, using userId = 1
      const userId = 1;
      
      await apiRequest("POST", `/api/auctions/${auction.id}/bids`, {
        userId,
        amount
      });
      
      toast({
        title: "Bid Placed",
        description: `Your bid of GH₵ ${amount.toFixed(2)} was placed successfully`,
      });
      
      // Refetch auction data to update the UI
      refetchAuction();
      setBidAmount("");
    } catch (error: any) {
      toast({
        title: "Bid Failed",
        description: error.message || "Failed to place bid. Please try again.",
        variant: "destructive"
      });
    }
  };

  // If viewing a specific auction
  if (auctionId) {
    if (auctionLoading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/2 h-96" />
            <div className="md:w-1/2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-6 w-2/3 mb-4" />
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      );
    }
    
    if (auctionError || !auction) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Auction</h2>
          <p className="mb-4">We couldn't find the auction you're looking for.</p>
          <Button onClick={() => window.history.back()}>
            Back to Auctions
          </Button>
        </div>
      );
    }
    
    const { product, currentPrice, endTime, bidCount, bids } = auction;
    
    if (!product) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Auction</h2>
          <p className="mb-4">Product information is missing.</p>
          <Button onClick={() => window.history.back()}>
            Back to Auctions
          </Button>
        </div>
      );
    }
    
    const auctionEnded = new Date(endTime) < new Date();
    const minBidAmount = currentPrice + 5; // Minimum bid is 5 GH₵ more than current
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-auto rounded" 
              />
              <div className="mt-4 flex justify-between items-center bg-accent text-white p-3 rounded">
                <span className="font-medium">Auction Ends:</span>
                <span className="font-poppins font-semibold">
                  {auctionEnded ? 'Ended' : new Date(endTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Auction Details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-2">{product.name}</h1>
            <p className="text-neutral-600 mb-4">{product.description}</p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">Current Bid:</span>
                <span className="text-2xl font-poppins font-bold text-accent">GH₵ {currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600 mb-4">
                <span>Starting Price: GH₵ {auction.startPrice.toFixed(2)}</span>
                <span>{bidCount} bids</span>
              </div>
              
              {!auctionEnded ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={`Min bid: GH₵ ${minBidAmount.toFixed(2)}`}
                      min={minBidAmount}
                      step="0.01"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handlePlaceBid}
                      className="bg-accent hover:bg-accent-dark"
                      disabled={!bidAmount || parseFloat(bidAmount) <= currentPrice}
                    >
                      Place Bid
                    </Button>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Enter an amount greater than GH₵ {currentPrice.toFixed(2)} to place your bid.
                  </p>
                </div>
              ) : (
                <div className="bg-neutral-100 p-4 rounded">
                  <p className="text-center text-lg font-medium">This auction has ended</p>
                </div>
              )}
            </div>
            
            {/* Bid History */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-montserrat font-semibold text-lg mb-4">Bid History</h3>
              
              {bids && bids.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {bids.map((bid) => (
                    <div key={bid.id} className="flex justify-between p-2 border-b border-neutral-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center mr-2">
                          <span className="text-primary font-medium">
                            {bid.user?.name.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span>{bid.user?.name || 'Anonymous'}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">GH₵ {bid.amount.toFixed(2)}</div>
                        <div className="text-xs text-neutral-500">
                          {new Date(bid.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-500 py-4">No bids yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Display all auctions
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">Live Market Auctions</h1>
      
      {auctionsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      ) : auctionsError ? (
        <div className="text-center py-8">
          <p className="text-accent">Failed to load auctions. Please try again later.</p>
        </div>
      ) : auctions && auctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
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
          <p className="text-neutral-600 mb-6">There are currently no active auctions. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default LiveMarketPage;
