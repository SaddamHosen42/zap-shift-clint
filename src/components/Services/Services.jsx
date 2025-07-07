import React from "react";

import {
  FaShippingFast,
  FaMapMarkedAlt,
  FaBoxes,
  FaHandHoldingUsd,
  FaWarehouse,
  FaUndoAlt,
} from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const servicesData = [
  {
    icon: FaShippingFast,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    icon: FaBoxes,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    icon: FaHandHoldingUsd,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    icon: FaWarehouse,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    icon: FaUndoAlt,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];
const Services = () => {
  return (
    <section className="py-24 px-6 bg-secondary relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10 ">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
            ⚡ Our Services
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Delivery Solutions for <br/>
            <span className="text-primary">Every Need</span>
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Experience fast, reliable parcel delivery with real-time tracking and zero hassle. 
            From personal packages to business shipments — we deliver excellence, every time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {servicesData.map((service, idx) => (
            <ServiceCard key={idx} service={service} />
          ))}
        </div>

        {/* Enhanced Additional Info Section */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-10 shadow-xl border border-gray-200 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-secondary mb-3">Why Choose ZapShift?</h3>
              <p className="text-gray-600">Key features that make us Bangladesh's leading delivery service</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚀</span>
                </div>
                <h4 className="font-bold text-secondary mb-2 text-lg">Same Day Delivery</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Express delivery in Dhaka within 4-6 hours</p>
              </div>
              
              <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌍</span>
                </div>
                <h4 className="font-bold text-secondary mb-2 text-lg">Nationwide Coverage</h4>
                <p className="text-sm text-gray-600 leading-relaxed">All 64 districts with home delivery</p>
              </div>
              
              <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔒</span>
                </div>
                <h4 className="font-bold text-secondary mb-2 text-lg">100% Secure</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Insured packages with guaranteed safety</p>
              </div>
              
              <div className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📱</span>
                </div>
                <h4 className="font-bold text-secondary mb-2 text-lg">Live Tracking</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Real-time GPS tracking & notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
