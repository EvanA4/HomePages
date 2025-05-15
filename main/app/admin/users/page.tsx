'use client'
import { actionGetUsers } from '@/actions/userActions';
import { Nav } from '@/app/components/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/verifyLayout';
import { changeUserRole, deleteUser } from '@/public/utils/userUtils';
import { User } from '@/types/authtypes';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function AdminUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [rows, setRows] = useState<User[]>([]);
	const [deleteConfirm, setDeleteConfirm] = useState<string | undefined>();
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
	
	async function handleDelete(user: User) {
		if (!deleteConfirm || (deleteConfirm && deleteConfirm != user.username)) {
			setDeleteConfirm(user.username);
		} else {
			const res = await deleteUser({ id: user.id! });
			if (res.success) {
				setUsers(prev => prev.filter(x => user.username != x.username));
				setRows(prev => prev.filter(x => user.username != x.username));
			}
		}
	}

	async function handlePromote(user: User) {
		const res = await changeUserRole({ id: user.id! }, !user.isAdmin);
		if (res.success) {
			setUsers(prev => prev.map(x => ({
				...x,
				isAdmin: x.id == user.id ? !user.isAdmin : x.isAdmin,
			})));
			setRows(prev => prev.map(x => ({
				...x,
				isAdmin: x.id == user.id ? !user.isAdmin : x.isAdmin,
			})));
		}
	}

	async function handleSearch() {
		setRows(users.filter(user => user.username.toLowerCase().includes(searchText.toLowerCase())));
	}

	useEffect(() => {
		(async () => {
			const res = await actionGetUsers();
			setUsers(res);
			setRows(res);
		})();
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
							alt="Construction Evan"
							src="/construct.png"
							priority
						/>
						<p className='text-[40px] text-center mt-5'>Users</p>
					</div>

					<div className='p-3 w-[100%] flex gap-3 justify-center static'>
						<input type="text" onChange={e => setSearchText(e.target.value)} placeholder='Search by username!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10'/>
						<button
							onClick={handleSearch}
							className='bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-[10px]'
						>Search</button>
					</div>

					{rows.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>}

					<div className='flex flex-wrap justify-center gap-5 w-[80%]'>
						{rows.map(user => <div className='py-5 px-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-10' key={user.id}>
								<div>
									<div className='flex gap-5'>
										<p className={'text-3xl ' + (user.isAdmin && 'text-red-600')}>{user.username}</p>
										<p className=''>#{user.id}</p>
									</div>
									<p className='mt-8 text-neutral-400'>{user.createdAt?.toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
								</div>

								<div className='h-full flex flex-col justify-around'>
									<button
										onClick={() => handleDelete(user)}
										className='opacity-70 hover:opacity-100'
									>
										<Image
											width={30}
											height={30}
											alt="Delete Icon"
											src={deleteConfirm == user.username ? "/svgs/wcheck.svg" : "/svgs/wtrash.svg"}
										/>
									</button>

									<button
										onClick={() => handlePromote(user)}
										className='opacity-70 hover:opacity-100'
									>
										<Image
											width={30}
											height={30}
											alt={user.isAdmin ? "Demote Icon" : "Promote Icon"}
											src={user.isAdmin ? "/svgs/demote.svg" : "/svgs/promote.svg"}
										/>
									</button>
								</div>
						</div>)}
					</div>
				</div>
			</VerifyLayout>
		</div>
	)
}
