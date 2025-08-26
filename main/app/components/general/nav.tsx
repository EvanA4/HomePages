"use client"
import { actionLogout } from '@/actions/authActions';
import { useUser } from '@/public/utils/authUtils';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Modal from './modal';


interface navProps {
    alwaysOn: boolean
}


export function Nav(props: navProps) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLinkDropdown, setShowLinkDropdown] = useState(false);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={
                'fixed w-[100%] top-0 z-50 bg-green-600/80 backdrop-filter backdrop-blur-md '
                + 'flex justify-between items-center transition-all duration-300 h-[50px] px-5 md:px-10 '
                + (scrollPosition > 50 || props.alwaysOn ? '' : '-translate-y-[100%]')
            }
        >
            <div className='text-white'>
                <a href="/"><b>Home</b></a>
            </div>

            <div className='flex gap-5 md:gap-10 items-center'>
                <div className='relative flex items-center'>
                    <button
                        onClick={() => {
                            setShowLinkDropdown(prev => !prev);
                        }}
                        className='opacity-70 hover:opacity-100'
                    >
                        <Image
                            src="/svgs/burger.svg"
                            height={35}
                            width={35}
                            alt="Burger icon"
                            priority
                        />
                    </button>

                    <div
                        className={'absolute bottom-0 right-0 translate-y-[100%] overflow-hidden ' + ((scrollPosition > 50 || props.alwaysOn) && showLinkDropdown ? '' : 'h-0')}
                    >
                        <Modal visible={showLinkDropdown} setVisibile={setShowLinkDropdown} >
                            <div className='flex flex-col rounded-lg text-white overflow-hidden w-[150px] text-center'>
                                <a href="/blogs">
                                    <div
                                        className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2'
                                    >
                                        Blogs
                                    </div>
                                </a>

                                <hr className='border-[rgb(18,80,40)]'/>

                                <a href="/art">
                                    <div
                                        className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2'
                                    >
                                        Art
                                    </div>
                                </a>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}