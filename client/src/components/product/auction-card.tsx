import { Link } from "wouter";
import { Auction } from "@/lib/types";
import CountdownTimer from "../ui/countdown-timer";

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const { 
    id, 
    product, 
    currentPrice, 
    bidCount, 
    endTime,
  } = auction;

  if (!product) {
    return null;
  }

  const productImage = product.images?.[0] || "https://placehold.co/800x800?text=No+Image";
  const supplierName = product.supplier?.businessName || "";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-neutral-300">
      <div className="relative">
        <img 
          src={productImage} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="auction-timer absolute bottom-0 left-0 right-0 text-white py-2 px-4 flex justify-between items-center" style={{ background: 'rgba(239, 43, 45, 0.9)' }}>
          <span className="font-medium">Ends in:</span>
          <CountdownTimer endTime={new Date(endTime)} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-montserrat font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-neutral-600 text-sm mb-3">
          {supplierName ? `${product.description.substring(0, 60)}... from ${supplierName}` : product.description.substring(0, 60)}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xs text-neutral-500">Current Bid:</span>
            <div className="font-poppins font-bold text-xl text-neutral-900">GH₵ {currentPrice.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-500">Bids:</span>
            <div className="font-medium text-neutral-900">{bidCount} bids</div>
          </div>
        </div>
        
        <Link 
          href={`/live-market/${id}`} 
          className="block w-full bg-accent hover:bg-accent-dark text-white text-center py-2 rounded-full font-medium transition-colors duration-200"
        >
          Place Bid
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
