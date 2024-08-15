import Nav from '../components/nav'

export default function Blogs() {
    return (
        <div className='bg-zinc-950 h-[2000px]'>
            <Nav alwaysOn={true} />

            <div className="text-white py-[10vh] px-[10vw]">
                <div className='text-neutral-200'>
                    <div className='mt-[40px] mb-[20px]'>
                        <p className='text-white text-[36px]'><b>Welcome to the art page!</b></p>
                        <hr className='border-neutral-700'/>
                    </div>
                    <p>
                        This site is still a work in progress, so it may be a minute before this is available. In the meantime, check out
                        the <a className='text-blue-500' href="/blogs"><u>Blogs</u></a> page!
                    </p>
                </div>
            </div>
        </div>
    );
}