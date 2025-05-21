import Image from 'next/image'
import React from 'react'

export default function AdminArt() {
	return (
		<div className='text-white'>
			Welcome to the admin art page

			<img
				src="/api/images/blogs/beatrice.png"
				alt="beatrice art"
				width={200}
			/>
		</div>
	)
}
