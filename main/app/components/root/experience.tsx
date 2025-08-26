'use client'
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { isMobile } from 'react-device-detect'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// https://www.youtube.com/watch?v=IwAYsbuERL4
import './experience.css';
import { useEffect, useRef, useState } from 'react';
import { actionGetExps } from '@/actions/expActions';
import { ExpType } from '@/types/types';
import { HARDCODED_EXPERIENCES } from '@/utils/hardcoded/experiences';


const Experience = () => {
	const [expSlides, setSlides] = useState<JSX.Element[]>([])
	const finishedFirstLoad = useRef(false)

	function dateFormat(date: Date) {
		return date.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
	}

	useEffect(() => {(async () => { 
		if (isMobile) {
			const prevArrow: any = document.getElementsByClassName('swiper-button-prev')
			const nextArrow: any = document.getElementsByClassName('swiper-button-next')
			prevArrow[0].style.display = "none"
			nextArrow[0].style.display = "none"
		}

		if (!finishedFirstLoad.current) {
			let data = HARDCODED_EXPERIENCES;

			let expsHTMLs = data.map((exp: ExpType) => {
				return (
					<SwiperSlide key={exp.title}>
						<div className='h-[100%] w-[100%] p-3 flex justify-center'>
							<div className='w-[350px] h-[450px] bg-white rounded-[30px] shadow-md p-5'>
								{exp.link ? <>
									<a href={exp.link} className='text-[25px]'><b>{exp.title}</b></a>
								</> : <>
									<p className='text-[25px]'><b>{exp.title}</b></p>
								</>}
								<p className="text-neutral-500">{dateFormat(exp.startTime)} - {exp.endTime ? dateFormat(exp.endTime) : "Present"}</p>
								<br/>
								<br/>
								<ul className='list-disc px-5'>
									{exp.bullets.map((bullet: string) => {
										return(<li key={bullet}>{bullet}</li>)
									})}
								</ul>
							</div>
						</div>
					</SwiperSlide>
				)
			})

			setSlides(expsHTMLs);

			finishedFirstLoad.current = true
		}
	})();});

	return (
		<Swiper
			// install Swiper modules
			modules={[Navigation, Scrollbar, A11y]}
			spaceBetween={0}
			slidesPerView={1}
			navigation
		>
			{...expSlides}
		</Swiper>
	);
};

export default Experience;