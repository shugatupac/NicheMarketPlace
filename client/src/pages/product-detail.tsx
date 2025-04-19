import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StarRating from "@/components/ui/star-rating";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const ProductDetailPage = () => {
  const { id } = useParams();
  const productId = parseInt(id);
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // For demo purposes, using userId = 1
      const userId = 1;
      
      await apiRequest("POST", `/api/cart/${userId}/items`, {
        productId: product.id,
        quantity
      });
      
      addToCart({
        id: 0, // Will be assigned by backend
        cartId: 0, // Will be assigned by backend
        productId: product.id,
        quantity,
        product
      });
      
      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive"
      });
      console.error("Failed to add to cart:", error);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
        <p className="mb-4">We couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const {
    name,
    description,
    price,
    discountPrice,
    images,
    stock,
    supplier,
    category,
    reviews
  } = product;

  const averageRating = reviews?.reduce((acc, review) => acc + review.rating, 0) / (reviews?.length || 1) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <img src={images[0]} alt={name} className="w-full h-auto rounded" />
          </div>
          
          {/* Thumbnail gallery if there are multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded overflow-hidden"
                >
                  <img 
                    src={image} 
                    alt={`${name} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          {category && (
            <div className="text-sm text-neutral-500 mb-2">{category.name}</div>
          )}
          
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-2">{name}</h1>
          
          {supplier && (
            <div className="mb-4">
              <span className="text-neutral-600">By </span>
              <a 
                href={`/suppliers/${supplier.id}`} 
                className="text-primary hover:underline font-medium"
              >
                {supplier.businessName}
              </a>
              {supplier.verified && (
                <span className="ml-1 text-secondary-dark">✓</span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={averageRating} reviewCount={reviews?.length} size="md" />
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-poppins font-bold">GH₵ {price.toFixed(2)}</span>
              {discountPrice && (
                <span className="text-neutral-500 text-lg line-through">GH₵ {discountPrice.toFixed(2)}</span>
              )}
              {discountPrice && (
                <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm">
                  Save {Math.round(((discountPrice - price) / discountPrice) * 100)}%
                </span>
              )}
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              {stock > 0 ? (
                <span className="text-secondary">In Stock ({stock} available)</span>
              ) : (
                <span className="text-accent">Out of Stock</span>
              )}
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p>{description}</p>
          </div>
          
          {/* Quantity and Add to Cart */}
          <div className="flex gap-4 mb-6">
            <div className="border border-neutral-300 rounded-md flex items-center">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                className="px-3 py-2 text-lg"
                disabled={quantity >= stock}
              >
                +
              </button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary-dark"
              disabled={stock <= 0}
            >
              Add to Cart
            </Button>
          </div>
          
          <Button 
            onClick={handleBuyNow}
            className="w-full bg-accent hover:bg-accent-dark"
            disabled={stock <= 0}
          >
            Buy Now
          </Button>
          
          {/* Sharing */}
          <div className="mt-8">
            <h3 className="font-medium mb-2">Share This Product</h3>
            <div className="flex gap-3">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this amazing product: ${name} - ${window.location.href}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing product: ${name}`)}&url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-blue-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a 
                href={`https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-pink-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-neutral-300">
          <div className="flex overflow-x-auto">
            <button className="px-6 py-3 font-medium text-primary border-b-2 border-primary">
              Description
            </button>
            <button className="px-6 py-3 font-medium text-neutral-600 hover:text-primary">
              Reviews ({reviews?.length || 0})
            </button>
            <button className="px-6 py-3 font-medium text-neutral-600 hover:text-primary">
              Shipping
            </button>
          </div>
        </div>
        
        <div className="py-6">
          <div className="prose max-w-none">
            <p>{description}</p>
            
            <h3>Product Details</h3>
            <ul>
              <li>100% authentic Ghanaian shea butter</li>
              <li>Ethically sourced from local producers</li>
              <li>Free from additives and chemicals</li>
              <li>Rich in vitamins A, E, and F</li>
              <li>Ideal for dry skin, eczema, and other skin conditions</li>
            </ul>
            
            <h3>How to Use</h3>
            <p>
              Apply a small amount to your skin and massage gently until absorbed. 
              Can be used daily on face and body. For hair, warm a small amount in palms 
              and apply to damp hair, focusing on ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
