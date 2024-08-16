import Greeting from './components/greeting'
import Nav from './components/nav'
import Experience from './components/experience'
import Projects from './components/projects'
import Contact from './components/contact'


export default function Home() {
  return (
    <div className='bg-zinc-950'>
      <Nav alwaysOn={false}/>
      <Greeting/>

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
    </div>
  );
}
