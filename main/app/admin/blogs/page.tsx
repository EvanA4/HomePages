'use client'
import { Nav } from '@/app/components/general/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { deleteBlog, getBlogs } from '@/public/utils/blogUtils';
import { User } from '@/types/authtypes';
import { BlogType } from '@/types/types';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


export default function AdminBlogs() {
	const [exps, setExps] = useState<BlogType[]>([]);
	const [rows, setRows] = useState<BlogType[]>([]);
	const [deleteConfirm, setDeleteConfirm] = useState<string>("");
	const [searchText, setSearchText] = useState<string>("");

	function verify(user: User | undefined): PageVerifyType {
		const pv: PageVerifyType = {
			accepted: false,
			rejectMsg: "You must be a logged in admin to visit this page.",
			url: "/",
		}

		if (!user) {
			return pv;
		
		} else if (!user.isAdmin) {
			pv.rejectMsg = "You must be an admin to visit this page.";
			return pv;
		
		} else {
			pv.accepted = true;
			pv.rejectMsg = "";
			return pv;
		}
	}
	
	async function handleDelete(blog: BlogType) {
		const res = await deleteBlog(blog);
		if (!res.error) {
			setExps(prev => prev.filter(x => blog.title != x.title));
			setRows(prev => prev.filter(x => blog.title != x.title));
		}
	}

	async function handleSearch(searchText: string) {
		setRows(exps.filter(experience => experience.title.toLowerCase().includes(searchText.toLowerCase())));
	}

	async function refreshExps() {
		const res = await getBlogs();
		if (!res.error) {
			setExps(res.unwrap());
			setRows(res.unwrap());
		}
	}

	useEffect(() => {
		refreshExps();
	}, []);

	function dateFormat(date: Date) {
		return date.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
	}

	return (
		<div className='w-full text-white'>
			<Nav alwaysOn />
			
			<VerifyLayout verify={verify}>
				<div className='w-full flex flex-col gap-10 items-center mt-[150px]'>
					<div>
						<Image
							width={300}
							height={300}
							alt="Writer Evan"
							src="/blogs.png"
							priority
						/>
						<p className='text-[40px] text-center mt-5'>Blogs</p>
					</div>
			
					<div className='p-3 w-[100%] flex gap-3 justify-center static'>
						<input type="text" onChange={e => setSearchText(e.target.value)} placeholder='Search by title!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10 bg-white'/>
						<button
							onClick={() => handleSearch(searchText)}
							className='bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-[10px]'
						>Search</button>
						<a
							href='/admin/blogs/create'
						><div className='bg-green-600 hover:bg-green-700 text-white px-3 rounded-[10px] h-full flex items-center'>Create</div></a>
					</div>
			
					{rows.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>}

					<div className='flex flex-wrap justify-center items-stretch gap-5 w-[80%] pb-20'>
						{rows.map((blog, idx) =>
							<div key={idx} className='text-white p-3 border-white border-2 rounded-[15px] bg-black flex w-full'>
								<div className='w-[90%]'>
									<p className='text-lg'><b>{blog.title}</b></p>
									<p className='text-neutral-300'>{dateFormat(blog.postdate)}</p>
									<p className='mt-5'>{blog.summary}</p>
								</div>
								<div className='w-[10%] flex flex-col items-end justify-center gap-5'>
									<button
										onClick={(e) => {
											e.stopPropagation();
											if (deleteConfirm == blog.title) {
												handleDelete(blog)
												setDeleteConfirm("");
											} else {
												setDeleteConfirm(blog.title);
											}
										}}
										className='opacity-50 hover:opacity-100 cursor-pointer'
									>
										<Image
											width={30}
											height={30}
											alt="Check Icon"
											src={deleteConfirm == blog.title ? "/svgs/wcheck.svg" : "/svgs/wtrash.svg"}
										/>
									</button>

									<a
										href={`/admin/blogs/${blog.title.replaceAll(" ", "+")}`}
										className='opacity-50 hover:opacity-100 cursor-pointer'
									>
										<Image
											width={30}
											height={30}
											alt="Edit Icon"
											src="/svgs/wedit.svg"
										/>
									</a>
								</div>
							</div>
						)}
					</div>
				</div>
			</VerifyLayout>
		</div>
	)	
}