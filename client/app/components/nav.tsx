"use client"
import React, { useState, useEffect } from 'react';


interface navProps {
    alwaysOn: boolean
}


const Nav = (props: navProps) => {
    const [scrollPosition, setScrollPosition] = useState(0);
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
    <div className={(props.alwaysOn ? 'sticky ' : 'fixed ') + 'w-[100%] top-0 z-50 bg-green-600/80 flex justify-between items-center backdrop-blur-md transition-all duration-300 overflow-hidden ' + (scrollPosition > 50 || props.alwaysOn ? 'h-[50px]' : 'h-0')}>
        <div className='pl-10 text-white'>
            <a href="/"><b>Home</b></a>
        </div>
        <div className='flex gap-10 pr-10 text-white'>
            <a href="/blogs">Blogs</a>
            <a href="/art">Art</a>
        </div>
    </div>
    )
}

export default Nav
