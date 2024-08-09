import Greeting from './components/greeting'
import Nav from './components/nav'
import Experience from './components/experience'
import Projects from './components/projects'
import Contact from './components/contact'


export default function Home() {
  return (
    <div className='bg-[#818181] h-[3000px]'>
      <Nav/>
      <Greeting/>

      {/* <div className='py-[20vh] px-[2vw]'>
        <p className='text-black text-4xl mb-10'>Experience</p>
        <Experience/>
      </div> */}

      {/* <div className='pb-[20vh] px-[2vw]'>
        <p className='text-black text-4xl mb-10'>Projects</p>
        <Projects/>
      </div> */}

      {/* <div className='flex justify-center mb-[20vh]'>
        <p className='text-black text-3xl'>
          Looking for more? Check out my <a href="blogs" className='text-blue-500'><u>blogs</u></a> and
           <a href="blogs" className='text-blue-500'> <u>art</u></a>!
        </p>
      </div>

      <Contact/> */}
    </div>
  );
}
