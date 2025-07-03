import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Slider1 from "../../assets/banner/banner1.png";
import Slider2 from "../../assets/banner/banner2.png";
import Slider3 from "../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      //navigation
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      className="w-full mx-auto"
    >
      <SwiperSlide><img src={Slider1}/></SwiperSlide>
      <SwiperSlide><img src={Slider2} /></SwiperSlide>
      <SwiperSlide><img src={Slider3} /></SwiperSlide>
    </Swiper>
  );
};

export default Banner;
