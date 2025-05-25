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
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [expandAdmin, setExpandAdmin] = useState(false);
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

    const { user, loading } = useUser();

    async function handleLogout() {
        await actionLogout();
        window.location.reload();
    }

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

                                <hr className='border-[rgb(18,80,40)]'/>

                                {user?.isAdmin && <>
                                    <button onClick={() => setExpandAdmin(prev => !prev)}>
                                        <div
                                            className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2 relative'
                                        >
                                            <p>Admin</p>

                                            <div className={'absolute right-[10%] top-[50%] -translate-y-[50%] opacity-70 hover:opacity-100 transition-all duration-200 ' + (!expandAdmin ? '' : 'rotate-180')}>
                                                <Image
                                                    src="/svgs/droparrow.svg"
                                                    height={25}
                                                    width={25}
                                                    alt="Drop Arrow"
                                                />
                                            </div>
                                        </div>
                                    </button>
                                    <hr className='border-[rgb(18,80,40)]'/>

                                    {expandAdmin && <>
                                        <a href="/admin/images">
                                            <div
                                                className='w-full bg-[rgb(15,73,35)] hover:bg-[rgb(10,63,25)] transition-colors px-4 py-2 text-neutral-300 hover:text-neutral-400'
                                            >
                                                Images
                                            </div>
                                        </a>
                                        <hr className='border-green-950'/>

                                        <a href="/admin/blogs">
                                            <div
                                                className='w-full bg-[rgb(15,73,35)] hover:bg-[rgb(10,63,25)] transition-colors px-4 py-2 text-neutral-300 hover:text-neutral-400'
                                            >
                                                Blogs
                                            </div>
                                        </a>
                                        <hr className='border-green-950'/>

                                        <a href="/admin/art">
                                            <div
                                                className='w-full bg-[rgb(15,73,35)] hover:bg-[rgb(10,63,25)] transition-colors px-4 py-2 text-neutral-300 hover:text-neutral-400'
                                            >
                                                Art
                                            </div>
                                        </a>
                                        <hr className='border-green-950'/>

                                        <a href="/admin/experiences">
                                            <div
                                                className='w-full bg-[rgb(15,73,35)] hover:bg-[rgb(10,63,25)] transition-colors px-4 py-2 text-neutral-300 hover:text-neutral-400'
                                            >
                                                Experiences
                                            </div>
                                        </a>
                                        <hr className='border-green-950'/>

                                        <a href="/admin/projects">
                                            <div
                                                className='w-full bg-[rgb(15,73,35)] hover:bg-[rgb(10,63,25)] transition-colors px-4 py-2 text-neutral-300 hover:text-neutral-400'
                                            >
                                                Projects
                                            </div>
                                        </a>
                                        <hr className='border-green-950'/>

                                        <a href="/admin/users">
                                            <div
                                                className='w-full bg-[rgb(15,73,35)] hover:bg-[rgb(10,63,25)] transition-colors px-4 py-2 text-neutral-300 hover:text-neutral-400'
                                            >
                                                Users
                                            </div>
                                        </a>
                                        <hr className='border-[rgb(18,80,40)]'/>
                                    </>}
                                </>}

                                {loading ? <>
                                    <div
                                        className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2'
                                    >
                                        Loading...
                                    </div>
                                </> : (user ? <>
                                    <button onClick={handleLogout}>
                                        <div
                                            className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2'
                                        >
                                            Logout
                                        </div>
                                    </button>
                                </> : <>
                                    <a href="/login">
                                        <div
                                            className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2'
                                        >
                                            Login
                                        </div>
                                    </a>
                                </>)}
                            </div>
                        </Modal>
                    </div>
                </div>

                {user && <div>
                    <p className='text-white hidden md:block'>u/<b>{user.username}</b></p>

                    <div className='relative'>
                        <button
                            onClick={() => {
                                setShowUserDropdown(prev => !prev);
                            }}
                            className={'opacity-70 hover:opacity-100 block md:hidden transition-all duration-200 ' + (showUserDropdown && 'rotate-180')}
                        >
                            <Image
                                src="/svgs/droparrow.svg"
                                height={35}
                                width={35}
                                alt="Drop Arrow"
                            />
                        </button>

                        <div
                            className={'absolute bottom-0 right-0 translate-y-[100%] overflow-hidden ' + ((scrollPosition > 50 || props.alwaysOn) && showUserDropdown ? '' : 'h-0')}
                        >
                            <Modal visible={showUserDropdown} setVisibile={setShowUserDropdown} >
                                <div
                                    className='w-full bg-green-800 hover:bg-green-900 transition-colors px-4 py-2 rounded-lg'
                                >
                                    <p className='text-neutral-300'>Logged in as</p>
                                    <p className='text-white'>u/<b>{user.username}</b></p>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}