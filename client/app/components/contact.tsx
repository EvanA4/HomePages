'use client'
import Image from 'next/image'
import React, { useState } from 'react'

const Contact = () => {
  const [showEmail, setEmail] = useState(false)

  return (
    <div className='bg-green-950 py-20'>
      <div className='mb-10'>
        <p className='text-white text-center text-4xl'>Contact</p>
        <p className={'transition-opacity text-neutral-300 text-center ' + (showEmail ? 'opacity-100' : 'opacity-0')}>evanabbott04@gmail.com</p>
      </div>
      <div className='w-[100%] flex justify-around'>
        <a className='px-5' href="https://github.com/EvanA4">
          <Image
            src="/svgs/github.svg"
            width={100}
            height={100}
            alt='GitHub SVG'
          />
        </a>
        <a className='px-5' href="https://www.linkedin.com/in/evan-abbott-667167214/">
          <Image
            src="/svgs/linkedin.svg"
            width={100}
            height={100}
            alt='LinkedIn SVG'
          />
        </a>
        <button className='px-5 relative' onClick={() => {
          setEmail(!showEmail)
        }}>
          <Image
              src="/svgs/gmail.svg"
              width={100}
              height={100}
              alt='LinkedIn SVG'
          />
          <p className='absolute bottom-0 left-[50%] -translate-x-[50%] translate-y-[75%] text-neutral-300 text-nowrap'>Click me!</p>
        </button>
      </div>
    </div>
  )
}

export default Contact