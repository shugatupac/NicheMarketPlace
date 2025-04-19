import { Link } from "wouter";
import { Product } from "@/lib/types";
import StarRating from "../ui/star-rating";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    id, 
    name, 
    price, 
    discountPrice, 
    images, 
    bestSeller, 
    isNew,
    supplier
  } = product;

  // Get supplier name or use a placeholder
  const supplierName = supplier?.businessName || (product.supplierId ? `Supplier #${product.supplierId}` : "Unknown Supplier");
  
  // Get average rating
  const reviewsCount = product.reviews?.length || 0;
  const averageRating = product.reviews?.reduce((acc, review) => acc + review.rating, 0) / reviewsCount || 0;

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${id}`}>
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={images[0] || "https://placehold.co/500x500?text=No+Image"} 
            alt={name} 
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300" 
          />
          {bestSeller && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              Best Seller
            </div>
          )}
          {isNew && !bestSeller && (
            <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
              New
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="text-xs text-neutral-500 mb-1">{supplierName}</div>
          <h3 className="font-montserrat font-medium text-neutral-900 line-clamp-2">{name}</h3>
          <div className="mt-2 flex items-baseline">
            <span className="font-poppins font-semibold text-lg">GH₵ {price.toFixed(2)}</span>
            {discountPrice && (
              <span className="text-neutral-500 text-sm line-through ml-2">GH₵ {discountPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center mt-1">
            <StarRating rating={averageRating} reviewCount={reviewsCount} size="sm" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
