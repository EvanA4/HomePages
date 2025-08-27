import { Project } from "@/types/types";

// {
//     title: string;
//     completed: Date;
//     link: string;
//     summary: string;
//     flags: string[];
// }

export const HARDCODED_PROJECTS: Project[] = [
    {
        title: "HomePages",
        completed: new Date(2025, 4, 25),
        link: "https://github.com/EvanA4/HomePages",
        summary: "My little corner of the internet, a full-stack self-hosted application. Blogs, experiences, and projects are all stored on a MySQL database. Hosted on gnni.",
        flags: [
            "nextjs",
            "sequelize",
            "mysql",
            "opengl",
            "threejs"
        ]
    },
    {
        title: "Haggle",
        completed: new Date(2025, 3, 23),
        link: "https://github.com/EvanA4/Haggle",
        summary: "A simple, online card game to play against random bots. Uses the phaser game library.",
        flags: [
            "nextjs",
            "tailwindcss"
        ]
    },
    {
        title: "Blackjack API",
        completed: new Date(2025, 1, 28),
        link: "https://github.com/EvanA4/blackjack-api",
        summary: "A minimalist blackjack game api for simulating many games (or casual playing). Supports multiple hands, surrendering, and insurance.",
        flags: [
            "python"
        ]
    },
    {
        title: "LaziBoard",
        completed: new Date(2025, 0, 27),
        link: "https://github.com/EvanA4/LaziBoard",
        summary: "The sequel to UCIvsGUI. Focused on writing as little of my own code for this as possible, still ending up with a better GUI than its predecessor.",
        flags: [
            "svelte",
            "typescript",
            "tailwindcss"
        ]
    },
    {
        title: "HP Manager",
        completed: new Date(2024, 11, 14),
        link: "https://github.com/EvanA4/HPManager",
        summary: "The HomePages (HP) Manager is a Svelte web applicaiton for reading and writing experiences and blogs for the HomePages website.",
        flags: [
            "svelte",
            "sequelize",
            "tailwindcss"
        ]
    },
    {
        title: "C Ray Tracer",
        completed: new Date(2024, 11, 9),
        link: "https://github.com/EvanA4/C-Ray-Tracer",
        summary: "A minimalistic, multithreaded ray tracer written entirely in the C programming language. Simulates black holes!",
        flags: [
            "svelte",
            "sequelize",
            "tailwindcss"
        ]
    },
    {
        title: "React Resume",
        completed: new Date(2024, 9, 5),
        link: "https://github.com/EvanA4/ReactResume",
        summary: "First React applicatoin, simulating physics and gravity with React Three Rapier. Utilizes Reach Hooks for a visually interesting display.",
        flags: [
            "reactjs",
            "reactthreerapier",
            "threejs"
        ]
    },
    {
        title: "RC Turtle",
        completed: new Date(2024, 9, 4),
        link: "https://github.com/EvanA4/RCturtle",
        summary: "A web application which remote controls with a Lua-based robot through a websocket server. The environment the robot detects is rendered in 3D on the web app.",
        flags: [
            "reactjs",
            "nodejs",
            "lua",
            "threejs"
        ]
    },
    {
        title: "Evans Turtle Tools",
        completed: new Date(2024, 8, 19),
        link: "https://github.com/EvanA4/EvansTurtleTools",
        summary: "A collection of different Lua programs designed to run on ComputerCraft: Tweaked robots. Programs involve complex interactions between robots for tasks like charcoal farming.",
        flags: [
            "lua"
        ]
    },
    {
        title: "Black Hole",
        completed: new Date(2024, 8, 14),
        link: "https://github.com/EvanA4/BlackHole",
        summary: "Uses numeric integration to simulate the paths of photons around a Schwarzschild black hole and display the results to the screen. All in real-time!",
        flags: [
            "html",
            "css"
        ]
    },
    {
        title: "CNN Chess",
        completed: new Date(2024, 5, 2),
        link: "https://github.com/EvanA4/CNNChess",
        summary: "A chess bot powered by a convolutional neural network (CNN) for evaluating chess positions. Uses alpha-beta pruning and the mini-max algorithm.",
        flags: [
            "pytorch",
            "cplusplus",
            "cmake"
        ]
    },
    {
        title: "UCIvsGUI",
        completed: new Date(2024, 5, 2),
        link: "https://github.com/EvanA4/UCIvsGUI",
        summary: "A PyGame applicaton for playing against any chess bot imaginable. Uses asynchronous functions for a smooth playing experience.",
        flags: [
            "python",
            "pygame"
        ]
    },
    {
        title: "HTML Resume",
        completed: new Date(2023, 8, 19),
        link: "https://github.com/EvanA4/HTML-Resume",
        summary: "Original resume website design, using pure HTML and CSS. Everyone has to start somewhere!",
        flags: [
            "html",
            "css"
        ]
    },
    {
        title: "JS Task Manager",
        completed: new Date(2023, 0, 27),
        link: "https://github.com/EvanA4/JSTaskManager",
        summary: "Some raw HTML, CSS, and JavaScript for creating, deleting, and finishing tasks.",
        flags: [
            "html",
            "css",
            "javascript"
        ]
    },
].sort((a, b) => a.completed.getTime() < b.completed.getTime() ? 1 : 0);