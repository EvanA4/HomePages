'use client'
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ExpSlide from './expSlide';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// https://www.youtube.com/watch?v=IwAYsbuERL4
import './experience.css';

const Experience = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={4}
      navigation
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
      <SwiperSlide><ExpSlide/></SwiperSlide>
    </Swiper>
  );
};

export default Experience;