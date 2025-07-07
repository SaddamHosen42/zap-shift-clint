import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "ZapShift has been incredible for my e-commerce business. Fast, reliable, and affordable!"
    },
    {
      name: "Fatima Rahman",
      role: "Online Seller",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      text: "Best delivery service in Bangladesh! My customers love the quick delivery times."
    },
    {
      name: "Karim Ahmed",
      role: "Student",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      text: "Sent my documents home during exam season. Arrived safely and on time!"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600">Real feedback from our satisfied customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h4 className="font-bold text-secondary group-hover:text-primary transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-primary text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic mb-4 group-hover:text-gray-700 transition-colors duration-300">
                "{testimonial.text}"
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
