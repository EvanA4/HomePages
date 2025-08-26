'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Project } from '@/types/types'
import { getProjects } from '@/public/utils/projectUtils'
import DynamicSVG from '../general/dynamicSVG'
import { HARDCODED_PROJECTS } from '@/utils/hardcoded/projects'


function projCard(project: Project) {
    return (
        <div key={project.title} className='w-full sm:w-auto h-fit px-[7vw] py-3 sm:p-3 flex justify-center'>
            <div className='w-full sm:w-[450px] h-[400px] sm:h-[350px] bg-white rounded-[30px] shadow-md p-5'>
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        {project.link ? <>
                            <a href={project.link} className='text-[25px]'><b>{project.title}</b></a>
                            </> : <>
                            <p className='text-[25px]'><b>{project.title}</b></p>
                        </>}
                        <p className="text-neutral-500">{project.completed.toLocaleDateString('en-US', { timeZone: 'America/New_York' })}</p><br/>
                        <p>{project.summary}</p>
                    </div>

                    <div className='w-full'>
                        <div className='h-[10vw] max-h-[50px] w-full px-5 flex justify-around'>
                            {project.flags.map((name, idx) => {
                                return (
                                    <DynamicSVG
                                        key={idx}
                                        path={'/projects/' + name + '.svg'}
                                        scaling='maxfit'
                                        fitDims={{
                                            width: 50,
                                            height: 50
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const Projects = () => {
    const [projCards, setCards] = useState([]);
    const finishedFirstLoad = useRef(false);

    useEffect(() => {(async () => {
        if (!finishedFirstLoad.current) {
            const data = HARDCODED_PROJECTS;

            var newCards = [];
            for (let i = 0; i < data.length; i += 2) {
                var projRow = [];

                // add first card
                var current: Project = data[i];
                projRow.push(projCard(current));

                // add second card
                if (i + 1 != data.length) {
                    current = data[i + 1];
                    projRow.push(projCard(current));
                }

                newCards.push(
                    <div key={i} className='flex flex-col lg:flex-row w-[100%] justify-center'>
                        {...projRow}
                    </div>
                );
            }
            setCards(newCards as any);

            finishedFirstLoad.current = true;
        }
    })();});

    return (
        <div className='flex flex-col'>
            {...projCards}
        </div>
    );
}

export default Projects;

/*
[
    {
        "title": "HomePages",
        "completed": "2025-01-11T00:00:00Z",
        "link": "https://github.com/EvanA4/HomePages",
        "summary": "My little corner of the internet, a full-stack self-hosted application. Blogs are powered by a MySQL database server, and the site is hosted on my own mini PC!",
        "flags": [
            "nextjs",
            "tailwindcss",
            "sequelize",
            "opengl",
            "threejs"
        ]
    },
    {
        "title": "HomePages Manager",
        "completed": "2025-01-11T00:00:00Z",
        "link": "https://github.com/EvanA4/HomePages/tree/main/manager",
        "summary": "A Svelte web application for managing the MySQL database that powers the experiences, projects, and blogs of the main site. It shows my first ever REST HTML api with convenient server actions for a simpler developer experience!",
        "flags": [
            "svelte",
            "mysql",
            "sequelize"
        ]
    },
    {
        "title": "Volman",
        "completed": "2025-01-03T00:00:00Z",
        "link": "https://github.com/EvanA4/Volman",
        "summary": "A Django-based, fake volunteer management system that uses a many-to-many relationship between Volunteers and Sessions. Django's User model is used for authentication for staff and user navigation across the site.\n",
        "flags": [
            "django",
            "python",
            "tailwindcss"
        ]
    },
    {
        "title": "C Ray Tracer",
        "completed": "2024-12-09T00:00:00Z",
        "link": "https://github.com/EvanA4/C-Ray-Tracer",
        "summary": "A multithreaded ray tracer entirely written in the C programming language. You can pick which scene to render, but at this point there is only a sphere and black hole.",
        "flags": [
            "c"
        ]
    },
    {
        "title": "BlackHole",
        "completed": "2024-09-14T00:00:00Z",
        "link": "https://github.com/EvanA4/BlackHole",
        "summary": "This NextJS application uses a derivation from the Schwarzchild metric to numerically integrate the paths of light for real-time general relativistic raytracing.",
        "flags": [
            "nextjs",
            "tailwindcss",
            "typescript",
            "opengl",
            "threejs"
        ]
    },
    {
        "title": "CNN Chess",
        "completed": "2024-06-02T00:00:00Z",
        "link": "https://github.com/EvanA4/CNNChess",
        "summary": "A chess bot powered by a convolutional neural network (CNN) for evaluating chess positions. Uses alpha-beta pruning and the mini-max algorithm.",
        "flags": [
            "pytorch",
            "cplusplus",
            "cmake"
        ]
    },
    {
        "title": "UCIvsGUI",
        "completed": "2024-06-02T00:00:00Z",
        "link": "https://github.com/EvanA4/UCIvsGUI",
        "summary": "A PyGame application for playing against any chess bot imaginable. Uses asynchronous functions for a smooth playing experience.",
        "flags": [
            "python",
            "pygame"
        ]
    },
    {
        "title": "Evan's Turtle Tools",
        "completed": "2024-05-13T00:00:00Z",
        "link": "https://github.com/EvanA4/EvansTurtleTools",
        "summary": "A collection of different Lua programs designed to run on ComputerCraft: Tweaked robots. Programs involve complex interactions between robots for tasks like charcoal farming.",
        "flags": [
            "lua"
        ]
    },
    {
        "title": "React Resume",
        "completed": "2024-04-15T00:00:00Z",
        "link": "https://github.com/EvanA4/ReactResume",
        "summary": "First React application, simulating physics and gravity with React Three Rapier. Utilizes React Hooks for a visually interesting display.",
        "flags": [
            "reactjs",
            "reactthreerapier",
            "threejs"
        ]
    },
    {
        "title": "Instant Stonks",
        "completed": "2023-12-18T00:00:00Z",
        "link": "https://github.com/EvanA4/InstantStonks",
        "summary": "Simple Python program with a free YahooFinance API to simulate randomly selected stock portfolios. It may make you second-guess your investments...",
        "flags": [
            "python"
        ]
    },
    {
        "title": "RC Turtle",
        "completed": "2023-11-01T00:00:00Z",
        "link": "https://github.com/EvanA4/RCturtle",
        "summary": "A web application which remote controls with a Lua-based robot through a websocket server. The environment the robot detects is rendered in 3D on the web app.",
        "flags": [
            "reactjs",
            "nodejs",
            "lua",
            "threejs"
        ]
    },
    {
        "title": "HTML Resume",
        "completed": "2023-09-19T00:00:00Z",
        "link": "https://github.com/EvanA4/HTML-Resume",
        "summary": "Original resume website design, using pure HTML and CSS. Everyone has to start somewhere!",
        "flags": [
            "html",
            "css"
        ]
    },
    {
        "title": "JS Task Manager",
        "completed": "2023-01-27T00:00:00Z",
        "link": "https://github.com/EvanA4/JSTaskManager",
        "summary": "Some raw HTML, CSS, and JavaScript for creating, deleting, and finishing tasks.",
        "flags": [
            "html",
            "css",
            "javascript"
        ]
    }
]
*/