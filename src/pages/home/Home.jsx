import React from "react";
import Banner from "../../components/banner/Banner";
import Services from "../../components/Services/Services";
import ClientLogosMarquee from "../../components/Marquee/ClientLogosMarquee";

const Home = () => {
  return (
    <div>
      <header className="container mx-auto my-10  w-[1500px]">
        <Banner></Banner>
      </header>
      <main>
        <section>
          <Services></Services>
        </section>
        <section>
          <ClientLogosMarquee></ClientLogosMarquee>
        </section>
      </main>
    </div>
  );
};

export default Home;
