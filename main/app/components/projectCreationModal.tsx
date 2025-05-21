'use client';

import { createProject } from '@/public/utils/projectUtils';
import { Project } from '@/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Modal from './modal';
import { Result } from '@/types/result';

type ProjectCreationModalProps = {
    toEdit: Project | undefined;
    visible: boolean;
    setVisibile: React.Dispatch<React.SetStateAction<boolean>>;
    handleCreate: (project: Project) => Promise<Result<Project>>;
    handleUpdate: (searchTitle: string, project: Project) => Promise<Result<boolean>>;
};

export default function ProjectCreationModal(props: ProjectCreationModalProps) {
    const [inputTitle, setInputTitle] = useState<string>("");
    const [inputCompleted, setInputCompleted] = useState<string>(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const [inputLink, setInputLink] = useState<string>("");
    const [inputSummary, setInputSummary] = useState<string>("");
    const [inputFlag, setInputFlag] = useState<string>("");    
    const [inputAllFlags, setInputAllFlags] = useState<string[]>([]);
    const [formError, setFormError] = useState<string>("");

    useEffect(() => {
        setInputTitle(props.toEdit ? props.toEdit.title : "")
        setInputCompleted(
            props.toEdit ?
            props.toEdit.completed.toLocaleString('en-US', { timeZone: 'America/New_York' }) :
            new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
        )
        setInputLink(props.toEdit ? props.toEdit.link : "")
        setInputSummary(props.toEdit ? props.toEdit.summary : "")
        setInputAllFlags(props.toEdit ? props.toEdit.flags : [])
    }, [props.toEdit])
    
    async function onSubmit() {
        const newProject: Project = {
            title: inputTitle,
            completed: new Date(Date.parse(inputCompleted)),
            link: inputLink,
            summary: inputSummary,
            flags: inputAllFlags
        }

        // Form error handling
        if (
            inputTitle.length == 0 ||
            inputCompleted.length == 0 ||
            inputLink.length == 0 ||
            inputSummary.length == 0
        ) {
            setFormError("Only the flag field can be left empty");
            return;
        }
        setFormError("");

        // Actually create the project
        let res: Result<Project> | Result<boolean>;
        if (props.toEdit) {
            res = await props.handleUpdate(props.toEdit.title, newProject);
        } else {
            res = await props.handleCreate(newProject);
        }
        if (!res.error) {
            props.setVisibile(false);
        } else {
            console.error(res.message);
        }
    }

    return (
        <Modal visible={props.visible} setVisibile={props.setVisibile} hasShadow centered >
            <div className='p-10 bg-neutral-800 text-white rounded-2xl flex flex-col gap-5 w-[800px]'>
                {/* Title */}
                <div className='w-full'>
                    <label htmlFor="title" className="mr-3 block mb-1"><b>Title</b></label>
                    <input
                        value={inputTitle}
                        onChange={e => setInputTitle(e.target.value)}
                        type="text"
                        name="title"
                        id="title"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Project title"
                    />
                </div>

                {/* Completed */}
                <div className='w-full'>
                    <label htmlFor="Completed" className="mr-3 block mb-1"><b>Completed</b></label>
                    <input
                        value={inputCompleted}
                        onChange={e => setInputCompleted(e.target.value)}
                        type="text"
                        name="completed"
                        id="completed"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Display date completed"
                    />
                </div>

                {/* Link */}
                <div className='w-full'>
                    <label htmlFor="link" className="mr-3 block mb-1"><b>Link</b></label>
                    <input
                        value={inputLink}
                        onChange={e => setInputLink(e.target.value)}
                        type="text"
                        name="link"
                        id="link"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Title link"
                    />
                </div>

                {/* Summary */}
                <div className='w-full'>
                    <label htmlFor="summary" className="mr-3 block mb-1"><b>Summary</b></label>
                    <textarea
                        value={inputSummary}
                        onChange={e => setInputSummary(e.target.value)}
                        name="summary"
                        id="summary"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full h-[150px]"
                        placeholder="Enter a project summary"
                    />
                </div>

                {/* Flags */}
                <div className='w-full'>
                    <label htmlFor="flags" className="mr-3 block mb-1 text-center"><b>Flags</b></label>
                    <div className='w-full flex gap-5 justify-center'>
                        <input
                            value={inputFlag}
                            onChange={e => setInputFlag(e.target.value)}
                            type="text"
                            name="flag"
                            id="flag"
                            className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-[50%]"
                            placeholder="New flag"
                        />
                        <button
                            onClick={() => {
                                if (inputFlag) {
                                    setInputAllFlags(prev => [...prev, inputFlag]);
                                }
                                setInputFlag("");
                            }}
                            className='px-3 py-1 bg-green-600 hover:bg-green-700 rounded-full'
                        >
                            +
                        </button>
                    </div>

                    <div className='w-full flex flex-wrap gap-5 mt-5'>
                        {inputAllFlags.map((flag, idx) =>
                            <div key={idx} className='px-3 py-1 bg-neutral-700 rounded-lg flex gap-5'>
                                {flag}

                                <button
                                    onClick={() => setInputAllFlags(prev => prev.filter(x => x != flag))}
                                    className='opacity-70 hover:opacity-100'
                                    >
                                    <Image
                                        width={20}
                                        height={20}
                                        alt="Delete Icon"
                                        src="/svgs/wtrash.svg"
                                        />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {formError && <p className='text-red-600 text-center'>{formError}</p>}

                {/* Submit button */}
                <div className='w-full flex justify-end mt-5'>
                    {!props.toEdit ? <>
                        <button
                            onClick={onSubmit}
                            className='px-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg'
                        >
                            Create
                        </button>

                    </> : <>
                        <button
                            onClick={onSubmit}
                            className='px-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg'
                        >
                            Update
                        </button>
                    </>}
                </div>
            </div>
        </Modal>
    )
}
