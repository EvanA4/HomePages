'use client'
import AdminImageCard from '@/app/components/admin/adminImage';
import ImageCreateModal from '@/app/components/admin/imageCreateModal';
import ImageSearch from '@/app/components/admin/imageSearch';
import { Nav } from '@/app/components/general/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { deleteImage, getImages, writeImage } from '@/public/utils/imageUtils';
import { User } from '@/types/authtypes';
import { DBImage } from '@/types/types';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


const MAX_PER_PAGE = 10;


export default function AdminImages() {
	const [images, setImages] = useState<DBImage[]>([]);
	const [rows, setRows] = useState<DBImage[]>([]);
	const [pageNum, setPageNum] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [deleteConfirm, setDeleteConfirm] = useState<string>("");
	const [searchClass, setSearchClass] = useState<string>("projects");

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
	
	async function handleDelete(image: DBImage) {
		const res = await deleteImage(image.path);
		if (!res.error) {
			setImages(prev => prev.filter(x => image.name != x.name));
			setRows(prev => prev.filter(x => image.name != x.name));
		}
	}

	async function handleCreate(files: File[], imageClass: string) {
		files.forEach(async (x: File) => {
			const res = await writeImage(x, imageClass);
			if (res && (imageClass == searchClass)) {
				setImages(prev => [res, ...prev]);
				setRows(prev => [res, ...prev]);
			}
		});
	}

	async function handleSearch(searchText: string) {
		setPageNum(0);
		setRows(images.filter(image => image.name.toLowerCase().includes(searchText.toLowerCase())));
	}

	async function refreshImages(argClass?: string) {
		const res = await getImages(argClass || searchClass);
		if (!res.error) {
			setImages(res.unwrap());
			setRows(res.unwrap());
			setPageNum(0);
		}
	}

	useEffect(() => {
		refreshImages();
	}, []);

	return (
		<div className='w-full text-white'>
			<Nav alwaysOn />
			
			<VerifyLayout verify={verify}>
				<div className='w-full flex flex-col gap-10 items-center mt-[150px]'>
					<div>
						<Image
							width={300}
							height={300}
							alt="Polaroid Evan"
							src="/dbimages.png"
							priority
						/>
						<p className='text-[40px] text-center mt-5'>Images</p>
					</div>
			
					<div>
						<div className='flex gap-10 mb-5'>
							<button
								onClick={() => {
									setSearchClass("art")
									refreshImages("art");
								}}
								className={'bg-neutral-600 w-full hover:bg-neutral-700 text-white px-3 py-2 rounded-[10px] ' + (searchClass == "art" && ' opacity-50')}
							>Art</button>

							<button
								onClick={() => {
									setSearchClass("blogs")
									refreshImages("blogs");
								}}
								className={'bg-neutral-600 w-full hover:bg-neutral-700 text-white px-3 py-2 rounded-[10px] ' + (searchClass == "blogs" && ' opacity-50')}
							>Blogs</button>

							<button
								onClick={() => {
									setSearchClass("projects")
									refreshImages("projects");
								}}
								className={'bg-neutral-600 w-full hover:bg-neutral-700 text-white px-3 py-2 rounded-[10px] ' + (searchClass == "projects" && ' opacity-50')}
							>Projects</button>
						</div>
						<ImageSearch handleSearch={handleSearch} refreshImages={refreshImages} setOpenModal={setOpenModal} />
					</div>
			
					{rows.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>}
			
					<div className='flex justify-center items-center gap-5'>
						<button
							onClick={() => setPageNum(prev => prev - 1)}
							className={'px-3 py-2 rounded-lg ' + ((pageNum == 0) ? 'opacity-30' : 'hover:opacity-100 opacity-70')}
							disabled={pageNum == 0}
						>
							<Image
								width={20}
								height={20}
								alt="Left Icon"
								src="/svgs/leftarrow.svg"
							/>
						</button>

						<p>Page {pageNum + 1} of {Math.ceil(rows.length / MAX_PER_PAGE)}</p>

						<button
							onClick={() => setPageNum(prev => prev + 1)}
							className={'px-3 py-2 rounded-lg ' + (((pageNum + 1) * MAX_PER_PAGE >= rows.length) ? 'opacity-30' : 'hover:opacity-100 opacity-70')}
							disabled={(pageNum + 1) * MAX_PER_PAGE >= rows.length}
						>
							<Image
								width={20}
								height={20}
								alt="Right Icon"
								src="/svgs/rightarrow.svg"
							/>
						</button>
					</div>

					<div className='flex flex-wrap justify-center items-stretch gap-5 w-[80%] pb-20'>
						{rows.filter((_, idx) => (
							idx >= MAX_PER_PAGE * pageNum && idx < MAX_PER_PAGE * (pageNum + 1)
						)).map((image, idx) => <div key={idx}>{AdminImageCard({
							image: image,
							deleteConfirm: deleteConfirm,
							setDeleteConfirm: setDeleteConfirm,
							onDelete: handleDelete
						})}</div>)}
					</div>
				</div>

				<ImageCreateModal
					visible={openModal}
					setVisible={setOpenModal}
					handleCreate={handleCreate}
				/>
			</VerifyLayout>
		</div>
	)	
}