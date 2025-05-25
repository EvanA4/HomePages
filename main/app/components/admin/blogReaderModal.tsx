'use client';

import React, { useRef, useState } from 'react';
import Modal from '../general/modal';
import FileUploader from './FileUploader';

type BlogReaderModalProps = {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleOpen: (files: File) => void;
}

export default function BlogReaderModal(props: BlogReaderModalProps) {
    async function handleUpload(files: File[]) {
        props.handleOpen(files[0]);
    }

    return (
        <Modal visible={props.visible} setVisibile={props.setVisible} centered hasShadow>
            <div className='w-[600px] h-[400px]'>
                <FileUploader onUpload={handleUpload} allowedTypes={["json"]}/>
            </div>
        </Modal>
    )
}
