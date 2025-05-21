'use client';

import React, { useRef, useState } from 'react'
import Modal from './modal'
import { DBImage } from '@/types/types'
import FileUploader from './FileUploader';

type ImageCreateModalProps = {
    setImages: React.Dispatch<React.SetStateAction<DBImage[]>>;
    setRows: React.Dispatch<React.SetStateAction<DBImage[]>>;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleCreate: (files: File[], imageClass: string) => void;
}

export default function ImageCreateModal(props: ImageCreateModalProps) {
    const [inputClass, setInputClass] = useState("");
    const [globalError, setGlobalError] = useState("");
    const filesRef = useRef<File[]>([]);

    async function handleUpload(files: File[]) {
        filesRef.current = files;
    }

    async function handleCreate(files: File[], inputClass: string) {
        // form handling before actually calling the props function
        if (files.length == 0) {
            setGlobalError("No files to upload");
            return;
        }

        if (!inputClass) {
            setGlobalError("No class selected");
            return;
        }

        setGlobalError("");
        setInputClass("");
        filesRef.current = [];
        props.handleCreate(files, inputClass);
    }

    return (
        <Modal visible={props.visible} setVisibile={props.setVisible} centered hasShadow>
            <div className='w-[700px] h-[800px] p-10 rounded-2xl bg-neutral-900 relative'>
                <p className='text-3xl text-white text-center mb-10'>Image Upload</p>

                <div className='h-[50%]'>
                    <FileUploader onUpload={handleUpload} allowedTypes={["png", "jpg", "jpeg", "svg"]}/>
                </div>

                <div className='mt-10'>
                    <p className='text-2xl text-white text-center mb-2'>Class</p>
                    <div className='flex'>
                        <button
                            onClick={() => setInputClass("art")}
                            className={'bg-neutral-600 w-full hover:bg-neutral-700 text-white px-3 py-2 rounded-[10px] ' + (inputClass == "art" && ' opacity-50')}
                        >Art</button>

                        <button
                            onClick={() => setInputClass("blogs")}
                            className={'bg-neutral-600 w-full hover:bg-neutral-700 text-white px-3 py-2 rounded-[10px] ' + (inputClass == "blogs" && ' opacity-50')}
                        >Blogs</button>

                        <button
                            onClick={() => setInputClass("projects")}
                            className={'bg-neutral-600 w-full hover:bg-neutral-700 text-white px-3 py-2 rounded-[10px] ' + (inputClass == "projects" && ' opacity-50')}
                        >Projects</button>
                    </div>

                    <p className='text-center mt-5 text-red-600'>{globalError}</p>
                </div>

                <button
                    onClick={() => handleCreate(filesRef.current, inputClass)}
                    className='bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-[10px] absolute bottom-10 right-10'
                >Create</button>
            </div>
        </Modal>
    )
}
