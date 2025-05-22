import { DBImage } from '@/types/types'
import React from 'react'
import { prettySize } from '@/public/utils/imageUtils'
import DynamicSVG from './dynamicSVG'
import Image from 'next/image'

type AdminImageCardProps = {
    image: DBImage;
    deleteConfirm: string;
    setDeleteConfirm: React.Dispatch<React.SetStateAction<string>>;
    onDelete: (image: DBImage) => void; 
};

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
                                    path={image.path}
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

                <div className='w-full flex justify-center'>
                    <button
                        onClick={() => {
                            if (props.deleteConfirm != image.name) {
                                props.setDeleteConfirm(image.name);
                            } else {
                                props.onDelete(image);
                                props.setDeleteConfirm("");
                            }
                        }}
                        className='opacity-50 hover:opacity-100'
                    >
                        <Image
                            width={40}
                            height={40}
                            alt="Check Icon"
                            src={props.deleteConfirm == image.name ? "/svgs/bcheck.svg" : "/svgs/btrash.svg"}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}
