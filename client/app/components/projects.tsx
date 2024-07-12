import React from 'react'
import ProjSlide from './projSlide'

const Projects = () => {
    return (
        <div className='flex flex-col items-center'>
            <div className='flex'>
                <ProjSlide/>
                <ProjSlide/>
            </div>
            <div className='flex'>
                <ProjSlide/>
                <ProjSlide/>
            </div>
            <div className='flex'>
                <ProjSlide/>
                <ProjSlide/>
            </div>
        </div>
    )
}

export default Projects
