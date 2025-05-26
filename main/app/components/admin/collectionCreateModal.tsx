import React, { useEffect, useState } from 'react'
import Modal from '../general/modal'
import Image from 'next/image';
import { ArtCollection } from '@/types/types';
import { Result } from '@/types/result';

type CollectionCreateModalProps = {
    toEdit?: ArtCollection;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleCreate: (coll: ArtCollection) => Promise<Result<ArtCollection>>;
    handleUpdate: (searchName: string, coll: ArtCollection) => Promise<Result<boolean>>;
}

export default function CollectionCreateModal(props: CollectionCreateModalProps) {
    const [inputName, setInputName] = useState("");
    const [inputDisplayImgPath, setInputDisplayImgPath] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        setInputName(props.toEdit ? props.toEdit.name : "");
        setInputDisplayImgPath(props.toEdit ? props.toEdit.displayImgPath : "");
        setShowPreview(false);
    }, [props.toEdit]);

    async function onSubmit() {
        const newCollection: ArtCollection = {
            name: inputName,
            displayImgPath: inputDisplayImgPath,
            count: 0,
        }

        // Form error handling
        if (
            inputName.length == 0 ||
            inputDisplayImgPath.length == 0
        ) {
            setFormError("Neither field can be empty");
            return;
        }
        setFormError("");

        // Actually create the project
        let res: Result<ArtCollection> | Result<boolean>;
        if (props.toEdit) {
            res = await props.handleUpdate(props.toEdit.name, newCollection);
        } else {
            res = await props.handleCreate(newCollection);
        }
        if (!res.error) {
            props.setVisible(false);
        } else {
            console.error(res.message);
        }
    }

    return (
        <Modal
            visible={props.visible}
            setVisibile={props.setVisible}
            hasShadow
            centered
        >
            <div className='p-10 bg-neutral-800 text-white rounded-2xl flex flex-col gap-5 w-[800px]'>
                <div className='w-full'>
                    <label htmlFor="name" className="mr-3 block mb-1"><b>Name</b></label>
                    <input
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Collection name"
                    />
                </div>

                {/* Link */}
                <div className='w-full'>
                    <label htmlFor="displayImgPath" className="mr-3 block mb-1"><b>Display Image Path</b></label>
                    <input
                        value={inputDisplayImgPath}
                        onChange={e => setInputDisplayImgPath(e.target.value)}
                        type="text"
                        name="displayImgPath"
                        id="displayImgPath"
                        className="bg-white outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-black w-full"
                        placeholder="Path for collection thumbnail"
                    />
                </div>

                <div className='flex justify-center'>
                    <div className='w-[200px] h-[200px]'>
                        {showPreview ? 
                            <div className='h-full bg-black relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-200'>
                                <div className='h-full overflow-hidden relative flex justify-center items-center'>
                                    <img
                                        src={inputDisplayImgPath}
                                        alt="beatrice art"
                                        className='object-cover block w-full h-full brightness-50 blur-md pointer-events-none'
                                    />
                                    <img
                                        src={inputDisplayImgPath}
                                        alt="beatrice art"
                                        className='absolute top-[50%] left-0 -translate-y-[50%]'
                                    />
                                </div>
                            </div>
                        :
                            <div className='h-full bg-neutral-900 flex items-center justify-center rounded-2xl text-neutral-400'>
                                Preview
                            </div>
                        }
                    </div>
                </div>

                {formError && <p className='text-red-600 text-center'>{formError}</p>}

                <div className='flex justify-center mt-5 gap-5'>
                    {props.toEdit ?
                        <button
                            onClick={onSubmit}
                            className='px-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg w-[20%]'
                        >
                            Update
                        </button> :
                        <button
                            onClick={onSubmit}
                            className='px-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg w-[20%]'
                        >
                            Create
                        </button>
                    }

                    <button
                        onClick={() => setShowPreview(prev => !prev)}
                        className='px-2 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg w-[20%]'
                    >
                        Preview
                    </button>
                </div>
            </div>
        </Modal>
    )
}
