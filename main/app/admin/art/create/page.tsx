'use client'
import { Nav } from '@/app/components/general/nav'
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { User } from '@/types/authtypes';
import React from 'react'
import ArtEditor from '@/app/components/admin/artEditor';


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
                <ArtEditor />
            </VerifyLayout>
        </div>
    )	
}