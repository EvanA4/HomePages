'use client'
import { Nav } from '@/app/components/general/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { addCodeFrame } from '@/public/utils/blogFrame';
import { createBlog, getBlogByTitle, updateBlog } from '@/public/utils/blogUtils';
import { User } from '@/types/authtypes';
import { BlogType } from '@/types/types';
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import * as babel from "babel-standalone";
import { useRouter } from 'next/navigation';
import BlogReaderModal from '@/app/components/admin/blogReaderModal';
import { blogDefault } from '@/public/utils/blogDefault';
import BlogEditor from '@/app/components/admin/blogEditor';


export default function AdminBlogs() {
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

    return (
        <div className='w-full text-white'>
            <Nav alwaysOn />
            
            <VerifyLayout verify={verify}>
                <BlogEditor />
            </VerifyLayout>
        </div>
    )	
}