import React from "react";
import Banner from "../../components/banner/Banner";
import Services from "../../components/Services/Services";
import Features from "../../components/Features/Features";
import Stats from "../../components/Stats/Stats";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Testimonials from "../../components/Testimonials/Testimonials";
import CallToAction from "../../components/CallToAction/CallToAction";
import ClientLogosMarquee from "../../components/Marquee/ClientLogosMarquee";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <header className="container mx-auto my-10 max-w-7xl px-4">
        <Banner />
      </header>

      <main>
        {/* Services Section */}
        <section className="py-16">
          <Services />
        </section>

        {/* Features Section */}
        <Features />

        {/* Stats Section */}
        <Stats />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <CallToAction />

        {/* Client Logos Section */}
        <section className="py-16">
          <ClientLogosMarquee />
        </section>
      </main>
    </div>
  );
};

export default Home;
