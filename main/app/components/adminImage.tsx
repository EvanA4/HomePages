import { DBImage } from '@/types/types'
import React from 'react'
import { prettySize } from '@/public/utils/imageUtils'
import DynamicSVG from './dynamicSVG'

type AdminImageCardProps = {
    image: DBImage
}

export default function AdminImageCard(props: AdminImageCardProps) {
    const { image } = props;

    return (
        <div className='h-full'>
            <div className='h-full flex flex-col justify-evenly py-5 px-8 bg-white rounded-lg text-black gap-5'>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className='w-[200px] h-[200px] flex justify-center items-center'>
                        {
                            image.type == "svg" ?
                            <div className='hover:shadow-[0_0px_10px_rgba(0,0,0,0.5)]'>
                                <DynamicSVG
                                    dbImage={image}
                                    scaling='minfit'
                                    fitDims={{
                                        width: 200,
                                        height: 200
                                    }}
                                />
                            </div> :
                            <img
                                src={`\\api\\images\\thumbnails\\${image.path}`}
                                alt={`${image.name} icon`}
                                className='hover:shadow-[0_0px_10px_rgba(0,0,0,0.5)]'
                            />
                        }
                    </div>

                    {(image.width && image.height) ? `${image.width}x${image.height}` : ""}
                </div>

                <div>
                    <div className='flex gap-5'>
                        <p><b>{image.name}</b></p>
                        <p className='text-neutral-700'>{prettySize(image.size)}</p>
                    </div>

                    <p className='text-neutral-500 mt-3 text-sm'>{image.path}</p>
                </div>
            </div>

            <div className='w-full flex justify-around'>
                    
            </div>
        </div>
    )
}
