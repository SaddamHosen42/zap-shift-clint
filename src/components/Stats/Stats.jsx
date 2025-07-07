import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Stats = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true, // Animation will trigger only once
  });

  const statsData = [
    {
      icon: "😊",
      end: 50,
      suffix: "K+",
      label: "Happy Customers",
      duration: 2.5
    },
    {
      icon: "📦", 
      end: 100,
      suffix: "K+",
      label: "Parcels Delivered",
      duration: 3
    },
    {
      icon: "🏙️",
      end: 8,
      suffix: "+",
      label: "Cities Covered", 
      duration: 2
    },
    {
      icon: "✅",
      end: 99.5,
      suffix: "%",
      label: "Success Rate",
      duration: 3.5,
      decimals: 1
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-primary/20 rounded-full text-primary font-bold text-sm mb-6">
            📊 Our Achievements
          </div>
          <h2 className="text-5xl font-bold mb-4">Numbers That Speak</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Our dedication to excellence reflected in real numbers and satisfied customers
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center group">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              
              {/* Counter */}
              <div className="text-5xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                {inView ? (
                  <CountUp
                    start={0}
                    end={stat.end}
                    duration={stat.duration}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                    separator=","
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              
              {/* Label */}
              <div className="text-lg opacity-90 font-medium group-hover:text-primary transition-colors duration-300">
                {stat.label}
              </div>
              
              {/* Progress Bar Animation */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-primary rounded-full transition-all duration-[3000ms] ease-out ${
                    inView ? 'w-full' : 'w-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 200}ms` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-primary/80 text-lg">
            ✨ Trusted by thousands of customers across Bangladesh
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
