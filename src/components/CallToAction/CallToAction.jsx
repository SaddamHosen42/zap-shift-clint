import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Send Your Parcel?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and experience Bangladesh's best delivery service today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn btn-primary btn-lg text-black hover:scale-105 transition-transform">
            Send Parcel Now
          </button>
          <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-secondary">
            Calculate Price
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
