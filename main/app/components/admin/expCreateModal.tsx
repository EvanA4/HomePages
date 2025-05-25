'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Modal from '../general/modal';
import { Result } from '@/types/result';
import { ExpType } from '@/types/types';

type ExpCreateModalProps = {
    toEdit: ExpType | undefined;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleCreate: (project: ExpType) => Promise<Result<ExpType>>;
    handleUpdate: (exp: ExpType) => Promise<Result<boolean>>;
};

export default function ExpCreateModal(props: ExpCreateModalProps) {
    const [inputTitle, setInputTitle] = useState<string>("");
    const [inputLink, setInputLink] = useState<string>("");
    const [inputStartTime, setInputStartTime] = useState<string>(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const [inputEndTime, setInputEndTime] = useState<string>("");
    const [inputBullet, setInputBullet] = useState<string>("");
    const [inputAllBullets, setInputAllBullets] = useState<string[]>([]);
    const [formError, setFormError] = useState<string>("");

    useEffect(() => {
        setInputTitle(props.toEdit ? props.toEdit.title : "");
        setInputLink(props.toEdit ? props.toEdit.link : "");
        setInputStartTime(
            props.toEdit ?
            props.toEdit.startTime.toLocaleString('en-US', { timeZone: 'America/New_York' }) :
            new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
        );
        setInputEndTime(
            props.toEdit?.endTime ?
            props.toEdit.endTime.toLocaleString('en-US', { timeZone: 'America/New_York' }) :
            ""
        );
        setInputAllBullets(props.toEdit ? props.toEdit.bullets : []);
        setFormError("");
    }, [props.toEdit, props.visible])
    
    async function onSubmit() {
        const newExp: ExpType = {
            title: inputTitle,
            link: inputLink,
            startTime: new Date(Date.parse(inputStartTime)),
            endTime: inputEndTime ? new Date(Date.parse(inputEndTime)) : undefined,
            bullets: inputAllBullets
        }

        // Form error handling
        if (
            inputTitle.length == 0 ||
            inputStartTime.length == 0 ||
            inputAllBullets.length == 0
        ) {
            setFormError("Only the link and end time field can be left empty");
            return;
        }
        setFormError("");

        // Actually create the project
        let res: Result<ExpType> | Result<boolean>;
        if (props.toEdit) {
            res = await props.handleUpdate(newExp);
        } else {
            res = await props.handleCreate(newExp);
        }
        if (!res.error) {
            props.setVisible(false);
        } else {
            console.error(res.message);
        }
    }

    return (
        <Modal visible={props.visible} setVisibile={props.setVisible} hasShadow centered >
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
                        placeholder="Experience title"
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

                {/* StartTime */}
                <div className='w-full'>
                    <label htmlFor="StartTime" className="mr-3 block mb-1"><b>Start Time</b></label>
                    <input
                        value={inputStartTime}
                        onChange={e => setInputStartTime(e.target.value)}
                        type="text"
                        name="startTime"
                        id="startTime"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Date experience started"
                    />
                </div>

                {/* EndTime */}
                <div className='w-full'>
                    <label htmlFor="EndTime" className="mr-3 block mb-1"><b>End Time</b></label>
                    <input
                        value={inputEndTime}
                        onChange={e => setInputEndTime(e.target.value)}
                        type="text"
                        name="endTime"
                        id="endTime"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Date experience ended"
                    />
                </div>

                {/* Bullets */}
                <div className='w-full'>
                    <label htmlFor="bullet" className="mr-3 block mb-1 text-center"><b>Bullets</b></label>
                    <div className='w-full flex gap-5 justify-center items-center'>
                        <textarea
                            value={inputBullet}
                            onChange={e => setInputBullet(e.target.value)}
                            name="bullet"
                            id="bullet"
                            className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-[70%] h-[75px] resize-none"
                            placeholder="New bullet"
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                if (e.key == "Enter") {
                                    if (inputBullet) {
                                        setInputAllBullets(prev => [...prev, inputBullet]);
                                    }
                                    setInputBullet("");
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                if (inputBullet) {
                                    setInputAllBullets(prev => [...prev, inputBullet]);
                                }
                                setInputBullet("");
                            }}
                            className='px-3 py-1 bg-green-600 hover:bg-green-700 rounded-full h-fit'
                        >
                            +
                        </button>
                    </div>

                    <div 
                        className='w-full flex flex-col items-center gap-5 mt-5 max-h-[170px] overflow-y-scroll'
                        style={{
                            scrollbarWidth: "none"
                        }}
                    >
                        {inputAllBullets.map((bullet, idx) =>
                            <div key={idx} className='px-5 py-3 bg-neutral-700 rounded-lg flex justify-between gap-5 w-[50%]'>
                                <p className='w-[80%]'>{bullet}</p>

                                <div className='flex flex-col justify-center gap-5'>
                                    <button
                                        onClick={() => setInputAllBullets(prev => prev.filter(x => x != bullet))}
                                        className='opacity-70 hover:opacity-100'
                                        >
                                        <Image
                                            width={25}
                                            height={25}
                                            alt="Delete Icon"
                                            src="/svgs/wtrash.svg"
                                            />
                                    </button>

                                    <button
                                        onClick={() => setInputBullet(bullet)}
                                        className='opacity-70 hover:opacity-100'
                                        >
                                        <Image
                                            width={25}
                                            height={25}
                                            alt="Copy Icon"
                                            src="/svgs/copy.svg"
                                            />
                                    </button>
                                </div>
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
