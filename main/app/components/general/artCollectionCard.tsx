import { ArtCollection } from '@/types/types';
import Image from 'next/image';
import React from 'react'

type ArtCollectionProps = {
    coll: ArtCollection,
}

export default function ArtCollectionCard(props: ArtCollectionProps) {
    return (
        <a href={`art/${props.coll.name}`}>
            <div className='bg-neutral-800 hover:bg-[#323232] p-2 rounded-2xl'>
                <div className='w-[200px] h-[200px] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-200'>
                    <div className='h-full overflow-hidden relative flex justify-center items-center'>
                        <img
                            src={props.coll.displayImgPath}
                            alt="beatrice art"
                            className='object-cover block w-full h-full brightness-50 blur-md pointer-events-none'
                        />
                        <img
                            src={props.coll.displayImgPath}
                            alt="beatrice art"
                            className='absolute top-[50%] left-0 -translate-y-[50%]'
                        />
                    </div>
                </div>

                <div className='flex flex-col items-center justify-center my-3'>
                    <b>{props.coll.name}</b>
                    <p className='text-neutral-300'>{props.coll.count != 1 ? `${props.coll.count} entries` : `${props.coll.count} entry`} </p>
                </div>
            </div>
        </a>
    )
}
