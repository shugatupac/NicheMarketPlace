const PaymentMethods = () => {
  const paymentOptions = [
    {
      name: "Visa",
      image: "https://cdn.pixabay.com/photo/2022/01/17/09/23/visa-6944541_960_720.png",
      alt: "Visa"
    },
    {
      name: "Mastercard",
      image: "https://www.logo.wine/a/logo/Mastercard/Mastercard-Logo.wine.svg",
      alt: "Mastercard"
    },
    {
      name: "MTN Mobile Money",
      image: "https://www.logo.wine/a/logo/MTN_Group/MTN_Group-Logo.wine.svg",
      alt: "MTN Mobile Money"
    },
    {
      name: "Vodafone Cash",
      image: "https://www.logo.wine/a/logo/Vodafone/Vodafone-Logo.wine.svg",
      alt: "Vodafone Cash"
    },
    {
      name: "Telecel Cash",
      image: "https://www.logo.wine/a/logo/Telecel_Group/Telecel_Group-Logo.wine.svg",
      alt: "Telecel Cash"
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-xl mb-6 text-center">Secure Payment Options</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {paymentOptions.map((option, index) => (
            <div key={index} className="text-center">
              <img src={option.image} alt={option.alt} className="h-12 object-contain mx-auto" />
              <span className="text-sm text-neutral-600 mt-2 block">{option.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
