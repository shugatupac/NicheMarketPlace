const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      ),
      title: "Direct from Producers",
      description: "We source directly from local cooperatives, ensuring fair compensation and authentic products."
    },
    {
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" 
          />
        </svg>
      ),
      title: "Quality Guaranteed",
      description: "Every product is tested and verified for quality, ensuring you receive only the best Ghanaian shea products."
    },
    {
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
          />
        </svg>
      ),
      title: "Supporting Communities",
      description: "Your purchase directly supports education, healthcare, and sustainable development in rural Ghanaian communities."
    }
  ];

  return (
    <section className="py-10 bg-neutral-200">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-2xl mb-8 text-center">Why Choose Shea Ghana</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-montserrat font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
