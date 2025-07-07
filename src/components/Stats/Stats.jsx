import React, { useState, useEffect, useRef } from 'react';

const Stats = () => {
  const [counters, setCounters] = useState({
    customers: 0,
    parcels: 0,
    cities: 0,
    success: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Counting animation function
  const animateCount = (start, end, duration, key) => {
    const startTime = Date.now();
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      
      setCounters(prev => ({ ...prev, [key]: currentCount }));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Start animations with different durations for variety
            animateCount(0, 50, 2000, 'customers');
            animateCount(0, 100, 2500, 'parcels');
            animateCount(0, 8, 1500, 'cities');
            animateCount(0, 99.5, 3000, 'success');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={statsRef} className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Achievements</h2>
          <p className="text-lg opacity-90">Numbers that speak for our excellence</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">😊</div>
            <div className="text-4xl font-bold text-primary mb-2">
              {counters.customers}K+
            </div>
            <div className="text-lg opacity-90">Happy Customers</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">📦</div>
            <div className="text-4xl font-bold text-primary mb-2">
              {counters.parcels}K+
            </div>
            <div className="text-lg opacity-90">Parcels Delivered</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🏙️</div>
            <div className="text-4xl font-bold text-primary mb-2">
              {counters.cities}+
            </div>
            <div className="text-lg opacity-90">Cities Covered</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">✅</div>
            <div className="text-4xl font-bold text-primary mb-2">
              {counters.success}%
            </div>
            <div className="text-lg opacity-90">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
