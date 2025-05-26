'use client'
import CollectionCreateModal from '@/app/components/admin/collectionCreateModal';
import ArtCollectionCard from '@/app/components/general/artCollectionCard';
import { Nav } from '@/app/components/general/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { createCollection, deleteCollection, getArtCollections, updateCollection } from '@/public/utils/artCollectionUtils';
import { User } from '@/types/authtypes';
import { ArtCollection } from '@/types/types';
import Image from 'next/image'
import React, { useEffect, useState } from 'react';

export default function AdminArt() {
	const [collections, setCollections] = useState<ArtCollection[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState<string>("");
	const [toEdit, setToEdit] = useState<ArtCollection | undefined>();

	useEffect(() => {
		(async () => {
			const res = await getArtCollections();
			if (!res.error) {
				setCollections(res.unwrap());
			}
		})();
	}, []);

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

	async function handleCreate(coll: ArtCollection) {
		const res = await createCollection(coll);
		if (!res.error) {
			setCollections(prev => [res.unwrap(), ...prev]);
		}
		return res;
	}

	async function handleUpdate(searchName: string, coll: ArtCollection) {
		const res = await updateCollection(searchName, coll);
		if (!res.error) {
			setCollections(prev => prev.map(x => x.name == searchName ? coll : x));
		}
		return res;
	}
	
	async function handleDelete(coll: ArtCollection) {
		const res = await deleteCollection(coll);
		if (!res.error) {
			setCollections(prev => prev.filter(x => coll.name != x.name));
		}
	}

	// async function handleSearch(searchText: string) {
	// 	setRows(exps.filter(experience => experience.title.toLowerCase().includes(searchText.toLowerCase())));
	// }

	// async function refreshExps() {
	// 	const res = await getBlogs();
	// 	if (!res.error) {
	// 		setExps(res.unwrap());
	// 		setRows(res.unwrap());
	// 	}
	// }

	// useEffect(() => {
	// 	refreshExps();
	// }, []);

	// function dateFormat(date: Date) {
	// 	return date.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
	// }

	return (
		<div className='w-full text-white'>
			<Nav alwaysOn />
			
			<VerifyLayout verify={verify}>
				<div className='w-full flex flex-col gap-10 items-center mt-[110px]'>
					<div>
						<Image
							width={300}
							height={300}
							alt="Artist Evan"
							src="/artpage.png"
							priority
						/>
						<p className='text-[40px] text-center mt-5'>Art Collections</p>
					</div>
			
					{/* {collections.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>} */}

					<div className='flex flex-wrap justify-center items-stretch gap-5 w-[80%] pb-20'>
						{collections.map((coll, idx) =>
							<div key={idx}>
								<ArtCollectionCard
									coll={coll}
									key={idx}
								/>
								<div className='flex justify-center gap-5 mt-3'>
									<button
										onClick={() => {
											if (deleteConfirm == coll.name) {
												handleDelete(coll);
												setDeleteConfirm("");
											} else {
												setDeleteConfirm(coll.name);
											}
										}}
										className='opacity-50 hover:opacity-100'
										>
										<Image
											width={30}
											height={30}
											alt="Delete Icon"
											src={deleteConfirm == coll.name ? "/svgs/wcheck.svg" : "/svgs/wtrash.svg"}
										/>
									</button>

									<button
										onClick={() => {
											setToEdit(coll);
											setOpenModal(true);
										}}
										className='opacity-50 hover:opacity-100'
										>
										<Image
											width={30}
											height={30}
											alt="Edit Icon"
											src="/svgs/wedit.svg"
											/>
									</button>
								</div>
							</div>
						)}
						<button
							className='cursor-pointer'
							onClick={() => {
								setToEdit(undefined);
								setOpenModal(true);
							}}
						>
							<div className='w-[216px] h-[288px] bg-neutral-900 rounded-2xl flex justify-center items-center
								text-[40px] text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-600
								hover:border-neutral-500 border-dashed mb-[42px]'
							>
								+
							</div>
						</button>
					</div>
				</div>

				<CollectionCreateModal
					toEdit={toEdit}
					visible={openModal}
					setVisible={setOpenModal}
					handleCreate={handleCreate}
					handleUpdate={handleUpdate}
				/>
			</VerifyLayout>
		</div>
	)	
}