import { ExpType } from "@/types/types";

// {
//     title: string;
//     link: string;
//     startTime: Date;
//     endTime?: Date;
//     bullets: string[];
// }

export const HARDCODED_EXPERIENCES: ExpType[] = [
    {
        title: "JTV SWE Intern",
        link: "https://www.jtv.com",
        startTime: new Date(2025, 4, 22),
        endTime: new Date(2025, 7, 15),
        bullets: [
            "Created a Spring Boot application to mediate for 2 legacy JTV applications",
            "Collaborated with QA team to refine Android application UI/UX",
            "Learned how to perform access and application-level logging",
            "Spoke in in daily Agile standups with professional developers"
        ]
    },
    {
        title: "Tech Lead H4I",
        link: "https://utk.hack4impact.org/",
        startTime: new Date(2024, 8, 20),
        endTime: new Date(2025, 4, 19),
        bullets: [
            "Design and host a volunteer management and check-in system for Love's Kitchen",
            "Lead a team of 6 developers in the Agile software development work environment",
            "Draw and manage MongoDB and Mongoose database architecture with Auth0 authentication for admin users"
        ]
    },
    {
        title: "ORNL SULI Intern II",
        link: "https://education.ornl.gov/suli/",
        startTime: new Date(2024, 4, 18),
        endTime: new Date(2024, 6, 28),
        bullets: [
            "Reinforced Github practices and workflow",
            "Honed my communication skills for poster presentations",
            "Fine-tuned large language models in zero-shot learning conditions",
            "Implemented queue-based breadth-first search algorithm"
        ]
    },
    {
        title: "ORNL SULI Intern I",
        link: "https://education.ornl.gov/suli/",
        startTime: new Date(2023, 4, 21),
        endTime: new Date(2023, 6, 27),
        bullets: [
            "Committed changes to group Github repositories",
            "Presented my contributions at meetings",
            "Designed object recognition for point clouds",
            "Utilized the KD-Tree nearest neighbor(s) search algorithm"
        ]
    }
];