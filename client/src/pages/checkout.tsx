import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    paymentMethod: "mtnmomo"
  });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some products before checking out.",
        variant: "destructive"
      });
      navigate("/products");
      return;
    }
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.region) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // For demo purposes, using userId = 1
      const userId = 1;
      
      const orderData = {
        userId,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.region}`,
        paymentMethod: formData.paymentMethod,
        totalAmount: cart.totalAmount + 20, // Including shipping
      };
      
      await apiRequest("POST", "/api/orders", orderData);
      
      // Simulate a slight delay for better UX
      setTimeout(() => {
        clearCart();
        toast({
          title: "Order Placed Successfully",
          description: "Thank you for your purchase! Your order has been placed."
        });
        navigate("/order-confirmation");
      }, 1000);
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // Calculate subtotal, shipping, and total
  const subtotal = cart?.totalAmount || 0;
  const shipping = 20; // Fixed shipping cost
  const total = subtotal + shipping;

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
          You need to add products to your cart before checkout.
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-montserrat font-semibold mb-4">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region/State *</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
              </div>

              <h2 className="text-xl font-montserrat font-semibold mb-4">
                Payment Method
              </h2>

              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="mtnmomo" id="mtnmomo" />
                  <Label htmlFor="mtnmomo" className="flex items-center cursor-pointer">
                    <img
                      src="https://www.logo.wine/a/logo/MTN_Group/MTN_Group-Logo.wine.svg"
                      alt="MTN Mobile Money"
                      className="h-8 mr-2"
                    />
                    MTN Mobile Money
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="vodafonecash" id="vodafonecash" />
                  <Label htmlFor="vodafonecash" className="flex items-center cursor-pointer">
                    <img
                      src="https://www.logo.wine/a/logo/Vodafone/Vodafone-Logo.wine.svg"
                      alt="Vodafone Cash"
                      className="h-8 mr-2"
                    />
                    Vodafone Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center cursor-pointer">
                    <div className="flex">
                      <img
                        src="https://cdn.pixabay.com/photo/2022/01/17/09/23/visa-6944541_960_720.png"
                        alt="Visa"
                        className="h-8 mr-1"
                      />
                      <img
                        src="https://www.logo.wine/a/logo/Mastercard/Mastercard-Logo.wine.svg"
                        alt="Mastercard"
                        className="h-8"
                      />
                    </div>
                    <span className="ml-2">Credit/Debit Card</span>
                  </Label>
                </div>
              </RadioGroup>

              {formData.paymentMethod === "card" && (
                <div className="border border-neutral-200 p-4 rounded-lg mb-6">
                  <div className="mb-4">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {(formData.paymentMethod === "mtnmomo" || formData.paymentMethod === "vodafonecash") && (
                <div className="border border-neutral-200 p-4 rounded-lg mb-6">
                  <p className="text-neutral-600 mb-2">
                    You will receive a prompt on your phone to confirm payment once you place the order.
                  </p>
                  <div>
                    <Label htmlFor="momoNumber">Mobile Money Number</Label>
                    <Input 
                      id="momoNumber" 
                      placeholder="e.g., 024 123 4567" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between mt-8">
                <Link
                  href="/cart"
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
                  Back to Cart
                </Link>

                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent-dark"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-montserrat font-semibold mb-4">
              Order Summary
            </h2>

            <div className="mb-4 max-h-80 overflow-y-auto">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-3 border-b border-neutral-200 last:border-0"
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={item.product?.images[0]}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {item.product?.name}
                    </h3>
                    <div className="text-xs text-neutral-500 flex items-center justify-between mt-1">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-medium">
                        GH₵{" "}
                        {(
                          (item.product?.discountPrice ||
                            item.product?.price ||
                            0) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">GH₵ {shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-neutral-300 pt-3 flex justify-between">
                <span className="font-montserrat font-semibold">Total</span>
                <span className="font-poppins font-bold text-lg">
                  GH₵ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-neutral-100 p-4 rounded-lg text-sm space-y-2 text-neutral-700">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-secondary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Free delivery for orders above GH₵ 200</p>
              </div>
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-secondary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Safe and secure payments</p>
              </div>
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-secondary mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p>Your purchase directly supports Ghanaian artisans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
