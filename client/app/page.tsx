import Greeting from './components/greeting'
import Nav from './components/nav'
import Experience from './components/experience'
import Projects from './components/projects'
import Contact from './components/contact'
import Image from 'next/image'


export default function Home() {
  return (
    <div className='bg-zinc-950'>
      <Nav alwaysOn={false}/>
      <Greeting/>

      <div className='pt-[20vh]'>
        {/* <p className='text-green-500 text-4xl mb-10 px-[2vw]'>About</p> */}
        <div className='text-neutral-200 p-[20px] border-white border-2 rounded-[15px] bg-black mx-[5vw]'>
          <div className='mb-[20px]'>
              <p className='text-white text-[36px]'><b>About</b></p>
              <hr className='border-neutral-700'/>
          </div>
          <p>
            I'm Evan Abbott, a junior computer science student at the University of Tennessee (Knoxville). Although I'm currently an undergraduate student, I hope to
            eventually earn a master's degree. Since freshman year, I've created projects across machine learning, full-stack web development, GUI design, graphics programming,
            and even a little bit of game development. I'm currently looking for internships, so feel free to <a className="text-blue-400" href="#contact"><u>reach out</u></a>!
          </p>
        </div>
      </div>

      <div className='py-[20vh]'>
        <p className='text-green-500 text-4xl mb-10 px-[2vw]'>Experience</p>
        <Experience/>
        <p className='text-neutral-300 text-center'>Swipe the cards!</p>
      </div>

      <div className='pb-[20vh]'>
        <p className='text-green-500 text-4xl mb-10 px-[2vw]'>Projects</p>
        <p className='text-neutral-300 text-center'>The project headings are URLs!</p>
        <Projects/>
      </div>

      <div className='flex justify-center mb-[20vh]'>
        <p className='text-white text-2xl md:text-3xl text-center px-5'>
          Looking for more? Check out my <a href="/blogs" className='text-blue-400'><u>blogs</u></a> and
           <a href="/art" className='text-blue-400'> <u>art</u></a>!
        </p>
      </div>

      <Contact/>
      <div id='contact'></div>
    </div>
  );
}
