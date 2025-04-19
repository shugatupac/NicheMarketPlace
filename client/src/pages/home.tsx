import HeroSection from "@/components/home/hero-section";
import FeaturedProducts from "@/components/home/featured-products";
import SupplierStory from "@/components/home/supplier-story";
import LiveMarket from "@/components/home/live-market";
import WhyChooseUs from "@/components/home/why-choose-us";
import PaymentMethods from "@/components/home/payment-methods";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <SupplierStory />
      <LiveMarket />
      <WhyChooseUs />
      <PaymentMethods />
    </div>
  );
};

export default HomePage;
