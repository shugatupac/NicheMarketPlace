import { Link } from "wouter";
import { Auction } from "@/lib/types";
import { Button } from "../ui/button";
import { CountdownTimer } from "../ui/countdown-timer";

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
  if (!auction?.product) {
    return null;
  }

  const { id, product, currentPrice, endTime, bidCount, supplier } = auction;
  const productImage = product.images?.[0] ?? '/placeholder-image.jpg';
  const productName = product.name ?? 'Untitled Product';
  const supplierName = supplier?.businessName;

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-lg border border-neutral-200 hover:border-accent transition-colors duration-200">
      <div className="relative">
        <img 
          src={productImage} 
          alt={productName} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="auction-timer absolute bottom-0 left-0 right-0 text-white py-2 px-4 flex justify-between items-center bg-gradient-to-r from-accent to-accent-dark">
          <span className="font-medium text-sm">Ends in:</span>
          <CountdownTimer endTime={new Date(endTime)} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-montserrat font-semibold text-lg leading-tight">{productName}</h3>
          <div className="bg-neutral-100 px-2 py-1 rounded text-sm">
            {bidCount} bids
          </div>
        </div>

        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {supplierName ? `${product.description} from ${supplierName}` : product.description}
        </p>

        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-neutral-500 block">Current Bid:</span>
            <div className="font-poppins font-bold text-2xl text-accent">
              GH₵ {currentPrice.toFixed(2)}
            </div>
          </div>

          <Link 
            href={`/live-market/${id}`}
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Place Bid
          </Link>
        </div>
      </div>
    </div>
  );
};

export { AuctionCard };