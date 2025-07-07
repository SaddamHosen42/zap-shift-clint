import React from 'react';

const Features = () => {
  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast Delivery",
      description: "Same-day delivery within Dhaka and 24-48 hours nationwide delivery service."
    },
    {
      icon: "📍",
      title: "Real-time Tracking",
      description: "Track your parcels live with GPS tracking and get instant delivery notifications."
    },
    {
      icon: "🔒",
      title: "100% Secure",
      description: "Your packages are insured and handled with maximum security and care."
    },
    {
      icon: "💰",
      title: "Best Pricing",
      description: "Competitive rates with no hidden charges. Pay only for what you ship."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-white to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-3 bg-primary/15 rounded-full text-primary font-bold text-sm mb-6">
            ✨ Why Choose Us
          </div>
          <h2 className="text-5xl font-bold text-secondary mb-6 leading-tight">
            Experience the <span className="text-primary">Best</span> <br/>
            Delivery Service
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to providing exceptional service that exceeds your expectations 
            with cutting-edge technology and dedicated support.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50 hover:border-primary/20 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon Container */}
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              </div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full group-hover:bg-primary transition-colors duration-300"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/30 rounded-full group-hover:bg-secondary transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
