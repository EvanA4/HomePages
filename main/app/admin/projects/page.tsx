'use client'
import DynamicSVG from '@/app/components/dynamicSVG';
import { Nav } from '@/app/components/nav'
import ProjectCreationModal from '@/app/components/projectCreationModal';
import VerifyLayout, { PageVerifyType } from '@/app/components/verifyLayout';
import { createProject, deleteProject, getProjects, updateProject } from '@/public/utils/projectUtils';
import { User } from '@/types/authtypes';
import { Result } from '@/types/result';
import { Project } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'


export default function AdminProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [rows, setRows] = useState<Project[]>([]);
	const [deleteConfirm, setDeleteConfirm] = useState<string | undefined>();
  	const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>("");
    const [toEdit, setToEdit] = useState<Project | undefined>();

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

	useEffect(() => {
		(async () => {
			const res = await getProjects();

      if (!res.error) {
        setProjects(res.unwrap());
        setRows(res.unwrap());
      } else {
        console.error("Failed to load projects!");
      }
		})();
	}, []);

  	async function handleSearch() {
		setRows(projects.filter(project => project.title.toLowerCase().includes(searchText.toLowerCase())));
	}

	async function handleDelete(project: Project) {
		const res = await deleteProject(project);
		if (!res.error) {
			setProjects(prev => prev.filter(x => x.title != project.title));
			setRows(prev => prev.filter(x => x.title != project.title));
		}
	}

	async function handleCreate(project: Project): Promise<Result<Project>> {
		const res = await createProject(project);
		if (!res.error) {
			setProjects(prev => [project, ...prev]);
			if (project.title.toLowerCase().includes(searchText.toLowerCase())) {
				setRows(prev => [project, ...prev]);
			}
		}
		return res;
	}

    async function handleUpdate(searchTitle: string, project: Project): Promise<Result<boolean>> {
        const res = await updateProject(searchTitle, project);
		if (!res.error) {
			setProjects(prev => prev.map(x => x.title == searchTitle ? project : x));
			if (project.title.toLowerCase().includes(searchText.toLowerCase())) {
				setRows(prev => prev.map(x => x.title == searchTitle ? project : x));
			}
		}
		return res;
    }

	return (
		<div className='w-full text-white'>
			<Nav alwaysOn />

			<VerifyLayout verify={verify}>
				<div className='w-full flex flex-col gap-10 items-center mt-[150px] pb-10'>
					<div>
						<Image
							width={400}
							height={400}
							alt="Projects Evan"
							src="/projects.png"
							priority
						/>
						<p className='text-[40px] text-center mt-5'>Projects</p>
					</div>

					<div className='p-3 w-full flex gap-3 justify-center static'>
						<input type="text" onChange={e => setSearchText(e.target.value)} placeholder='Search by title!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10 bg-white'/>
						<button
							onClick={handleSearch}
							className='bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-[10px]'
						>Search</button>
						<button
							onClick={() => {
                                setToEdit(undefined);
                                setCreateModalOpen(true);
                            }}
							className='bg-green-600 hover:bg-green-700 text-white px-3 rounded-[10px]'
						>Create</button>
					</div>

					{rows.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>}

					<div className='flex flex-wrap justify-center gap-5 w-[80%] text-black'>
						{rows.map((project, idx) =>
							<div key={idx} className='w-full sm:w-auto h-fit px-[7vw] py-3 sm:p-3 flex justify-center'>
								<div className='w-full sm:w-[450px] h-[460px] sm:h-[410px] bg-white rounded-[30px] shadow-md p-5'>
									<div className='flex flex-col justify-between h-full'>
										<div>
											{project.link ? <>
												<a href={project.link} className='text-[25px]'><b>{project.title}</b></a>
												</> : <>
												<p className='text-[25px]'><b>{project.title}</b></p>
											</>}
											<p className="text-neutral-500">{project.completed.toLocaleDateString('en-US', { timeZone: 'America/New_York' })}</p><br/>
											<p>{project.summary}</p>
										</div>

										<div className='w-full'>
											<div className='h-[10vw] max-h-[50px] w-full px-5 flex justify-around'>
												{project.flags.map((name, idx) => {
													return (
														<DynamicSVG
															path={`/projects/${name}.svg`}
															scaling='maxfit'
															fitDims={{
																width: 50,
																height: 50
															}}
															key={idx}
														/>
													)
												})}
											</div>

											<div className='w-full flex justify-center gap-10 mt-5'>
												<button
													onClick={() => {
                                                        if (deleteConfirm == project.title) {
                                                            handleDelete(project)
                                                            setDeleteConfirm("");
                                                        } else {
                                                            setDeleteConfirm(project.title);
                                                        }
                                                    }}
													className='opacity-50 hover:opacity-70'
												>
													<Image
														width={40}
														height={40}
														alt="Check Icon"
														src={deleteConfirm == project.title ? "/svgs/bcheck.svg" : "/svgs/btrash.svg"}
													/>
												</button>

												<button
                                                    onClick={() => {
                                                        setToEdit(project);
                                                        setCreateModalOpen(true);
                                                    }}
													className='opacity-50 hover:opacity-70'
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
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<ProjectCreationModal
                    toEdit={toEdit}
					visible={createModalOpen}
					setVisibile={setCreateModalOpen}
					handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
				/>
			</VerifyLayout>
		</div>
	)
}