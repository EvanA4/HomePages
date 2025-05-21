'use client';

import { syncImages } from '@/public/utils/imageUtils';
// import { syncImages } from '@/public/utils/imageUtils';
import React, { useState } from 'react'

type ImageSearchProps = {
    handleSearch: (searchText: string) => Promise<void>,
    refreshImages: () => Promise<void>,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function ImageSearch(props: ImageSearchProps) {
    const [searchText, setSearchText] = useState<string>("");

    return (
        <div>
            <div className='p-3 w-[100%] flex gap-3 justify-center static'>
                <input type="text" onChange={e => setSearchText(e.target.value)} placeholder='Search by name!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10 bg-white'/>
                <button
                    onClick={() => props.handleSearch(searchText)}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-[10px]'
                >Search</button>
                <button
                    onClick={() => props.setOpenModal(true)}
                    className='bg-green-600 hover:bg-green-700 text-white px-3 rounded-[10px]'
                >Create</button>
            </div>

            <div className='w-full flex justify-center'>
                <button
                    onClick={() => {
                        if (confirm("Resync image database?")) {
                            syncImages();
                            props.refreshImages();
                        }
                    }}
                    className='py-2 px-5'
                >
                        <p className='text-center text-blue-500 hover:text-blue-400'>Sync images</p>
                </button>
            </div>
        </div>
    )
}
