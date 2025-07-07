import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 hover:border-primary/30 overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      {/* Icon Container */}
      <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
        <div className="text-4xl text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 text-secondary group-hover:text-primary transition-colors duration-300 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm mb-6 group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
        
        {/* Enhanced CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 group-hover:border-primary/20 transition-colors duration-300">
          <span className="text-sm text-primary font-semibold group-hover:text-secondary transition-colors duration-300">
            Learn More
          </span>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <span className="text-primary group-hover:text-white text-sm font-bold transition-colors duration-300">
              →
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors duration-300"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/20 rounded-full group-hover:bg-secondary/40 transition-colors duration-300"></div>
    </div>
  );
};

export default ServiceCard;
