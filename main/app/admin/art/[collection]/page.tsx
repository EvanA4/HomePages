'use client';

import { Nav } from '@/app/components/general/nav';
import VerifyLayout, { PageVerifyType } from '@/app/components/general/verifyLayout';
import { User } from '@/types/authtypes';
import Image from 'next/image';
import React, { use } from 'react';

export default function ({
  params,
}: {
  params: Promise<{ collection: string }>
}) {
    const collection = (use(params) as { collection: string }).collection.replaceAll("%2B", " ");
    
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

    function setSearchText(searchText: string) {

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
                  alt="Writer Evan"
                  src="/artpieces.png"
                  priority
                />
                <p className='text-[40px] text-center mt-5'>{collection}</p>
              </div>
          
              <div className='p-3 w-[100%] flex gap-3 justify-center static'>
                <input type="text" onChange={e => setSearchText(e.target.value)} placeholder='Search by title!' className='w-[60vw] rounded-full py-3 px-4 text-black z-10 bg-white'/>
                <button
                  // onClick={() => handleSearch(searchText)}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-[10px]'
                >Search</button>
                <a
                  href='/admin/art/create'
                ><div className='bg-green-600 hover:bg-green-700 text-white px-3 rounded-[10px] h-full flex items-center'>Create</div></a>
              </div>
          
              {/* {rows.length == 0 && <p className='text-3xl text-neutral-400'>No Results</p>} */}

              <div className='flex flex-wrap justify-center items-stretch gap-5 w-[80%] pb-20'>
                
              </div>
            </div>

          </VerifyLayout>
        </div>
    );
}
