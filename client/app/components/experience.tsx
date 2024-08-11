'use client'
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { isMobile } from 'react-device-detect'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// https://www.youtube.com/watch?v=IwAYsbuERL4
import './experience.css';
import { Suspense, useEffect, useState } from 'react';


async function experienceLoader() {
  const json = await fetch("experience.json").then(r => r.json())
  return json
}


interface ExpSlideProps {
  header: string,
  date: string,
  bullets: Array<string>
}


const Experience = () => {
  const [expSlides, setSlides] = useState([])

  useEffect(() => {
    if (isMobile) {
      const prevArrow = document.getElementsByClassName('swiper-button-prev')
      const nextArrow = document.getElementsByClassName('swiper-button-next')
      prevArrow[0].style.display = "none"
      nextArrow[0].style.display = "none"
    }

    experienceLoader().then((data) => {
      setSlides(data.slides.map((slide: ExpSlideProps) => {
        return (
          <SwiperSlide key={slide.header + slide.date}>
            <div className='h-[100%] w-[100%] p-3 flex justify-center'>
                <div className='w-[350px] h-[450px] bg-white rounded-[30px] shadow-md p-5'>
                    <p className='text-[25px]'><b>{slide.header}</b></p>
                    <p>{slide.date}</p>
                    <br/>
                    <ul className='list-disc px-5'>
                      {slide.bullets.map((bullet: string) => {
                        return(<li key={bullet}>{bullet}</li>)
                      })}
                    </ul>
                </div>
            </div>
          </SwiperSlide>
        )
      }))
    })
  })

  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Scrollbar, A11y]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      onSwiper={(swiper) => {}}
      onSlideChange={() => {}}
    >
      {...expSlides}
    </Swiper>
  );
};

export default Experience;