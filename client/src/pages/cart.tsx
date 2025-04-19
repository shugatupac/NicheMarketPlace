import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cart, updateCartItem, removeCartItem } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-neutral-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="text-2xl font-montserrat font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-neutral-600 mb-6 text-center">
          You haven't added any products to your cart yet.
          <br />
          Start shopping to add products.
        </p>
        <Link
          href="/products"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Handle quantity change
  const handleQuantityChange = async (itemId: number, quantity: number) => {
    try {
      // For demo purposes, using userId = 1
      const userId = 1;
      
      await apiRequest("PUT", `/api/cart/${userId}/items/${itemId}`, { quantity });
      updateCartItem(itemId, quantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId: number) => {
    try {
      // For demo purposes, using userId = 1
      const userId = 1;
      
      await apiRequest("DELETE", `/api/cart/${userId}/items/${itemId}`);
      removeCartItem(itemId);
      
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some products before checking out.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    // Simulate a short delay before navigating to checkout
    setTimeout(() => {
      setLoading(false);
      navigate("/checkout");
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:flex border-b border-neutral-200 p-4 text-neutral-600 font-medium">
              <div className="w-1/2">Product</div>
              <div className="w-1/6 text-center">Price</div>
              <div className="w-1/6 text-center">Quantity</div>
              <div className="w-1/6 text-center">Total</div>
            </div>

            {cart.items.map((item) => (
              <div
                key={item.id}
                className="border-b border-neutral-200 last:border-0 p-4 flex flex-col md:flex-row items-start md:items-center"
              >
                <div className="w-full md:w-1/2 flex items-center mb-4 md:mb-0">
                  <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={item.product?.images[0]}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-montserrat font-medium">
                      <Link
                        href={`/product/${item.productId}`}
                        className="hover:text-primary transition-colors"
                      >
                        {item.product?.name}
                      </Link>
                    </h3>
                    <div className="text-sm text-neutral-500">
                      {item.product?.supplier?.businessName}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-accent hover:text-accent-dark text-sm flex items-center mt-1 md:hidden"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/6 text-left md:text-center mb-2 md:mb-0">
                  <div className="md:hidden text-sm text-neutral-500 mb-1">
                    Price:
                  </div>
                  <div className="font-medium">
                    GH₵{" "}
                    {(
                      item.product?.discountPrice || item.product?.price || 0
                    ).toFixed(2)}
                  </div>
                </div>

                <div className="w-full md:w-1/6 flex items-center mb-2 md:mb-0">
                  <div className="md:hidden text-sm text-neutral-500 mr-2">
                    Quantity:
                  </div>
                  <div className="flex items-center border border-neutral-300 rounded-md">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 text-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          Math.min(item.product?.stock || 10, item.quantity + 1)
                        )
                      }
                      className="px-2 py-1 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center">
                  <div>
                    <div className="md:hidden text-sm text-neutral-500 mb-1">
                      Total:
                    </div>
                    <div className="font-poppins font-semibold">
                      GH₵{" "}
                      {(
                        (item.product?.discountPrice ||
                          item.product?.price ||
                          0) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-accent hover:text-accent-dark md:ml-4 hidden md:block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between">
            <Link
              href="/products"
              className="flex items-center text-primary hover:text-primary-dark mb-4 sm:mb-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Continue Shopping
            </Link>

            <Button
              variant="outline"
              onClick={() => {
                cart.items.forEach(item => handleRemoveItem(item.id));
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-montserrat font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">GH₵ {cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">GH₵ 20.00</span>
              </div>
              <div className="border-t border-dashed border-neutral-300 pt-3 flex justify-between">
                <span className="font-montserrat font-semibold">Total</span>
                <span className="font-poppins font-bold text-lg">
                  GH₵ {(cart.totalAmount + 20).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-accent hover:bg-accent-dark text-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">We Accept:</h3>
              <div className="flex flex-wrap gap-2">
                <img
                  src="https://cdn.pixabay.com/photo/2022/01/17/09/23/visa-6944541_960_720.png"
                  alt="Visa"
                  className="h-8 object-contain"
                />
                <img
                  src="https://www.logo.wine/a/logo/Mastercard/Mastercard-Logo.wine.svg"
                  alt="Mastercard"
                  className="h-8 object-contain"
                />
                <img
                  src="https://www.logo.wine/a/logo/MTN_Group/MTN_Group-Logo.wine.svg"
                  alt="MTN Mobile Money"
                  className="h-8 object-contain"
                />
                <img
                  src="https://www.logo.wine/a/logo/Vodafone/Vodafone-Logo.wine.svg"
                  alt="Vodafone Cash"
                  className="h-8 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
