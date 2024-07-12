import Greeting from './components/greeting'
import Nav from './components/nav'
import Experience from './components/experience'
import Projects from './components/projects'


export default function Home() {
  return (
    <div className='h-[5000px] bg-[#ffeccb]'>
      <Nav/>
      <Greeting/>

      <div className='py-[20vh] px-[2vw]'>
        <p className='text-black text-4xl mb-10'>Experience</p>
        <Experience/>
      </div>

      <div className='pb-[20vh] px-[2vw]'>
        <p className='text-black text-4xl mb-10'>Projects</p>
        <Projects/>
      </div>
    </div>
  );
}
