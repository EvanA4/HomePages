import React from 'react'

const Contact = () => {
  return (
    <div className='bg-[#265530] p-20'>
      <p className='text-white text-3xl mb-10'>Contact</p>
      <textarea name="Messaeg" id="1" placeholder='Message' className='h-[20%] w-[60%] p-2 block mb-10'></textarea>
      <input type="text" placeholder='Email' className='p-2 block mb-10'/>
      <button className='bg-green-600 px-4 py-3 rounded-md text-white'>Submit</button>
    </div>
  )
}

export default Contact