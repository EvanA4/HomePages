'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { GetProjs } from '@/actions/projActions'
import { Project } from '@/types/types'


function projCard(data: Project) {
    return (
        <div key={data.title} className='w-[100%] sm:w-auto h-fit px-[7vw] py-3 sm:p-3 flex justify-center'>
            <div className='w-[100%] sm:w-[450px] h-[400px] sm:h-[350px] bg-white rounded-[30px] shadow-md p-5 relative'>
                {data.link ? <>
                    <a href={data.link} className='text-[25px]'><b>{data.title}</b></a>
                </> : <>
                    <p className='text-[25px]'><b>{data.title}</b></p>
                </>}
                <br/>
                <p>{data.summary}</p>
                <div className='absolute bottom-[20px] left-0 h-[10vw] max-h-[50px] w-[100%] px-5 flex justify-around'>
                    {data.flags.map((name: string) => {
                        return (
                            <Image
                                key={data.title + name}
                                src={'/svgs/' + name + '.svg'}
                                height={0}
                                width={0}
                                alt={name + ".svg"}
                                style={{width: "auto", height: "auto"}}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


const Projects = () => {
    const [projCards, setCards] = useState([])
    const finishedFirstLoad = useRef(false)

    useEffect(() => {(async () => {
        if (!finishedFirstLoad.current) {
            let data = await GetProjs("");

            var newCards = []
            for (let i = 0; i < data.length; i += 2) {
                var projRow = []

                // add first card
                var current: Project = data[i]
                projRow.push(projCard(current))

                // add second card
                if (i + 1 != data.length) {
                    current = data[i + 1]
                    projRow.push(projCard(current))
                }

                newCards.push(
                    <div key={i} className='flex flex-col lg:flex-row w-[100%] justify-center'>
                        {...projRow}
                    </div>
                )
            }
            setCards(newCards as any)

            finishedFirstLoad.current = true
        }
    })();})

    return (
        <div className='flex flex-col'>
            {...projCards}
        </div>
    )
}

export default Projects
