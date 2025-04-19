import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/product/star-rating";
import PageHeader from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

interface WishlistProduct extends Product {
  addedAt?: Date;
}

interface WishlistResponse {
  id: number;
  userId: number;
  name: string;
  products: WishlistProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export default function WishlistPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  // Fetch wishlist data
  const { data: wishlist, isLoading: isLoadingWishlist } = useQuery<WishlistResponse>({
    queryKey: ['/api/wishlists', user?.id],
    enabled: !!user,
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiRequest(`/api/wishlists/${user?.id}/items/${productId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "Product removed from your wishlist",
      });
      // Invalidate wishlist data to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/wishlists', user?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist",
        variant: "destructive",
      });
    }
  });

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlistMutation.mutate(productId);
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: 0, // Will be set by backend
      cartId: 0, // Will be set by backend
      productId: product.id,
      quantity: 1,
      price: product.discountPrice || product.price,
      product: product
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <PageHeader title="My Wishlist" />
        <div className="flex flex-col items-center justify-center h-60">
          <h2 className="text-xl font-semibold mb-4">Please log in to view your wishlist</h2>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="My Wishlist" />
      
      {isLoadingWishlist ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : wishlist?.products && wishlist.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {wishlist.products.map((product) => (
            <Card key={product.id} className="h-full flex flex-col">
              <CardHeader className="pb-4 pt-6 px-6">
                <div className="aspect-square overflow-hidden rounded-md mb-2 bg-muted/20">
                  <Link href={`/products/${product.id}`}>
                    <img 
                      src={product.images?.[0] || "https://placehold.co/400x400?text=No+Image"} 
                      alt={product.name}
                      className="h-full w-full object-cover transition-all hover:scale-105 cursor-pointer"
                    />
                  </Link>
                </div>
                <div className="flex justify-between items-start">
                  <Link href={`/products/${product.id}`}>
                    <CardTitle className="text-lg cursor-pointer hover:text-primary line-clamp-2 min-h-[3rem]">{product.name}</CardTitle>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive/80"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    disabled={removeFromWishlistMutation.isPending}
                  >
                    {removeFromWishlistMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-4 px-6 flex-grow">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center gap-2">
                    <StarRating rating={4.5} />
                    <span className="text-sm text-muted-foreground">(12)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {product.discountPrice ? (
                      <>
                        <span className="text-lg font-semibold">{formatCurrency(product.discountPrice)}</span>
                        <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary ml-auto">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Button 
                  className="w-full gap-1" 
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Browse products and add items to your wishlist</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}