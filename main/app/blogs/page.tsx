'use client'
import Image from 'next/image';
import { Nav } from '../components/nav'
import { useRef, useState } from 'react';
import { GetBlogs } from '@/actions/blogActions';
import { BlogType } from '@/types/types';


export default function Blogs() {
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const searchText = useRef<string>('');
    const firstSearch = useRef(false);

    // load blogs if first run
    if (!firstSearch.current) {
        firstSearch.current = true;
        (async () => {
            setBlogs(await GetBlogs(""));
        })();
    }

    return (
        <div className='bg-zinc-950 min-h-[100vh]'>
            <Nav alwaysOn={true}/>
            

            <div className='w-[100%] my-[4vh] flex flex-col justify-center items-center p-3 relative'>
                <Image
                    src={'/blogs.png'}
                    width={500}
                    height={500}
                    priority
                    alt='Blogs picture'
                />
                <p className='text-neutral-200 mt-5'>Welcome to the blogs page!</p>

                <div className='absolute left-0 bottom-[10vh] rotate-[30deg] z-0 w-[48vw] min-w-[200px] h-[14vh] -ml-[28vh] rounded-full blur-[10vh] bg-green-800'/>
                <div className='absolute left-0 bottom-0 rotate-[30deg] z-0 w-[20vw] h-[10vh] -ml-[7vh] rounded-full blur-[7vh] bg-green-600'/>
            </div>


            <div className='p-3 w-[100%] flex gap-3 justify-center static'>
                <input type="text" onInput={(e: any) => {searchText.current = e.target.value}} placeholder='Search or scroll!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10'/>
                <button onClick={async () => {
                    setBlogs(await GetBlogs(searchText.current));
                }} className='bg-blue-500 hover:bg-blue-400 text-white px-3 rounded-[10px]'>Search</button>
            </div>

            <div className='flex flex-col gap-[25px] w-[100%] justify-center items-center px-5 pb-[50px] pt-[50px]'>
                {blogs.map((blog: BlogType) => {
                    return (
                        <a key={blog.title} href={'blogs/' + blog.title.replaceAll(' ', '+')} className='w-[100%] z-20'>
                            <div className='text-white p-3 border-white border-2 rounded-[15px] bg-black'>
                                <p className='text-lg'><b>{blog.title}</b></p>
                                <p className='text-neutral-300'>{blog.postdate}</p>
                                <br/>
                                <p>{blog.summary}</p>
                            </div>
                        </a>
                    )
                })}
                {blogs.length == 0 ? <p className='text-neutral-300 text-3xl'>No Results</p> : <></>}
            </div>
        </div>
    );
}