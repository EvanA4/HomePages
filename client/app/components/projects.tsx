'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'


async function projectLoader() {
    const json = await fetch("project.json").then(r => r.json())
    return json
}


interface projCardProps {
    header: string,
    desc: string,
    techs: Array<string>
}


function projCard(data: projCardProps) {
    return (
        <div key={data.header} className='w-[100%] sm:w-auto h-fit px-[7vw] py-3 sm:p-3 flex justify-center'>
            <div className='w-[100%] sm:w-[450px] h-[400px] sm:h-[350px] bg-white rounded-[30px] shadow-md p-5 relative'>
                <a href={"https://github.com/EvanA4/" + data.header}><p className='text-[25px]'><b>{data.header}</b></p></a>
                <br/>
                <p>{data.desc}</p>
                <div className='absolute bottom-[20px] left-0 h-[10vw] max-h-[50px] w-[100%] px-5 flex justify-around'>
                    {data.techs.map((name: string) => {
                        return (
                            <Image
                                key={data.header + name}
                                src={'/svgs/' + name + '.svg'}
                                height={0}
                                width={0}
                                alt="tech svg"
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

    useEffect(() => {
        if (!finishedFirstLoad.current) {
            projectLoader().then((data) => {
                var newCards = []

                for (let i = 0; i < data.slides.length; i += 2) {
                    var projRow = []

                    // add first card
                    var current: projCardProps = data.slides[i]
                    projRow.push(projCard(current))

                    // add second card
                    if (i + 1 != data.slides.length) {
                        current = data.slides[i + 1]
                        projRow.push(projCard(current))
                    }

                    newCards.push(
                        <div key={i} className='flex flex-col lg:flex-row w-[100%] justify-center'>
                            {...projRow}
                        </div>
                    )
                }

                setCards(newCards as any)
            })
            finishedFirstLoad.current = true
        }
    })

    return (
        <div className='flex flex-col'>
            {...projCards}
        </div>
    )
}

export default Projects
