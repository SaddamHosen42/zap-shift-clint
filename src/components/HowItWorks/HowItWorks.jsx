import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      icon: "📱",
      step: "1",
      title: "Book Online",
      description: "Create your account and book a pickup from our website or mobile app in just a few clicks."
    },
    {
      icon: "🚚",
      step: "2", 
      title: "We Pickup",
      description: "Our delivery agent will arrive at your location to collect the parcel at your preferred time."
    },
    {
      icon: "🎯",
      step: "3",
      title: "Fast Delivery",
      description: "Track your parcel in real-time and receive confirmation once it's safely delivered."
    }
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple steps to send your parcel</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors duration-300">
                {step.step}. {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
