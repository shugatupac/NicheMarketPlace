import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="relative bg-neutral-800 text-white">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 to-neutral-900/70"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1571907483086-3c0ea40cc16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      ></div>
      <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="max-w-xl">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">Authentic Ghanaian Shea Butter</h1>
          <p className="text-lg mb-6">Directly from local producers to your doorstep. Pure, natural and ethically sourced.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/products" 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium inline-block text-center transition-colors duration-200"
            >
              Shop Now
            </Link>
            <Link 
              href="/live-market" 
              className="bg-white hover:bg-neutral-200 text-neutral-900 px-6 py-3 rounded-full font-medium inline-block text-center transition-colors duration-200"
            >
              Live Market
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
