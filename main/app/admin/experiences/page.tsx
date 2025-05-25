'use client'
import ExpCreateModal from '@/app/components/admin/expCreateModal';
import { Nav } from '@/app/components/general/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { createExp, deleteExp, getExps, updateExp } from '@/public/utils/expUtils';
import { User } from '@/types/authtypes';
import { Result } from '@/types/result';
import { ExpType } from '@/types/types';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


export default function AdminExperiences() {
	const [exps, setExps] = useState<ExpType[]>([]);
	const [rows, setRows] = useState<ExpType[]>([]);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [deleteConfirm, setDeleteConfirm] = useState<string>("");
	const [searchText, setSearchText] = useState<string>("");
	const [toEdit, setToEdit] = useState<ExpType | undefined>();

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
	
	async function handleDelete(experience: ExpType) {
		const res = await deleteExp(experience);
		if (!res.error) {
			setExps(prev => prev.filter(x => experience.title != x.title));
			setRows(prev => prev.filter(x => experience.title != x.title));
		}
	}

	async function handleCreate(experience: ExpType): Promise<Result<ExpType>> {
		const res = await createExp(experience);
		if (!res.error) {
		  setExps(prev => [res.unwrap(), ...exps]);
		  setRows(prev => [res.unwrap(), ...exps]);
		  return new Result<ExpType>(res.unwrap());
		}
		return new Result<ExpType>();
	}

	async function handleUpdate(experience: ExpType): Promise<Result<boolean>> {
		const res = await updateExp(toEdit!.title, experience);
		if (!res.error) {
			setExps(prev => prev.map(x => x.title == toEdit!.title ? experience : x));
			setRows(prev => prev.map(x => x.title == toEdit!.title ? experience : x));
			return new Result<boolean>(res.unwrap());
		}
		return new Result<boolean>();
	}

	async function handleSearch(searchText: string) {
		setRows(exps.filter(experience => experience.title.toLowerCase().includes(searchText.toLowerCase())));
	}

	async function refreshExps() {
		const res = await getExps();
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
							alt="Experienced Evan"
							src="/experiences.png"
							priority
						/>
						<p className='text-[40px] text-center mt-5'>Experiences</p>
					</div>
			
					<div className='p-3 w-[100%] flex gap-3 justify-center static'>
						<input type="text" onChange={e => setSearchText(e.target.value)} placeholder='Search by title!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10 bg-white'/>
						<button
								onClick={() => handleSearch(searchText)}
								className='bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-[10px]'
						>Search</button>
						<button
								onClick={() => {
									setToEdit(undefined);
									setOpenModal(true)
								}}
								className='bg-green-600 hover:bg-green-700 text-white px-3 rounded-[10px]'
						>Create</button>
					</div>
			
					{rows.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>}

					<div className='flex flex-wrap justify-center items-stretch gap-5 w-[80%] pb-20'>
						{rows.map((exp, idx) =>
							<div key={idx} className='w-[350px] h-[450px] bg-white rounded-[30px] flex flex-col justify-between shadow-md p-5 text-black'>
								<div>
									{exp.link ? <>
										<a href={exp.link} className='text-[25px]'><b>{exp.title}</b></a>
									</> : <>
										<p className='text-[25px]'><b>{exp.title}</b></p>
									</>}
									<p className="text-neutral-500">{dateFormat(exp.startTime)} - {exp.endTime ? dateFormat(exp.endTime) : "Present"}</p>
									<ul className='list-disc px-5 mt-10'>
										{exp.bullets.map((bullet: string) => {
											return(<li key={bullet}>{bullet}</li>)
										})}
									</ul>
								</div>

								<div
									className='w-full flex justify-center gap-10 mt-5'
								>
									<button
										onClick={() => {
											if (deleteConfirm == exp.title) {
												handleDelete(exp)
												setDeleteConfirm("");
											} else {
												setDeleteConfirm(exp.title);
											}
										}}
										className='opacity-50 hover:opacity-100 cursor-pointer'
									>
										<Image
											width={40}
											height={40}
											alt="Check Icon"
											src={deleteConfirm == exp.title ? "/svgs/bcheck.svg" : "/svgs/btrash.svg"}
										/>
									</button>

									<button
										onClick={() => {
												setToEdit(exp);
												setOpenModal(true);
										}}
										className='opacity-50 hover:opacity-100 cursor-pointer'
									>
										<Image
											width={40}
											height={40}
											alt="Edit Icon"
											src="/svgs/bedit.svg"
										/>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<ExpCreateModal
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