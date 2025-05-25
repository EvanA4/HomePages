import { useUser } from '@/public/utils/authUtils';
import { User } from '@/types/authtypes';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Nav } from './nav';
import Image from 'next/image';


export type PageVerifyType = {
  accepted: boolean;
  url: string | undefined; // if undefined, don't redirect
  rejectMsg: string; // must be defined if accepted == false
}

type VerifyLayoutProps = {
    verify: (user: User | undefined) => PageVerifyType;
    children: React.ReactNode;
}


export default function VerifyLayout(props: VerifyLayoutProps) {
    const { user, loading } = useUser();
    const router = useRouter();
    const [validity, setValidity] = useState<PageVerifyType | undefined>(undefined);

    useEffect(() => {
        if (!loading) {
            const res = props.verify(user);
            if (!res.accepted && res.url) {
                router.push(res.url);
            } else {
                setValidity(res);
            }
        }
    }, [user, loading])

    return (
        <>
            {validity === undefined ? <>
                {/* if the verification is still being computed... */}
                <div
                    className="w-screen h-screen flex items-center justify-center"
                >
                    <div className="animate-spin">
                        <Image
                            width={80}
                            height={80}
                            alt="preparing QR code..."
                            src="/svgs/loading.svg"
                            priority
                        />
                    </div>
                </div>

            </> : <>
                {/* verification computed, either success or rejection */}
                {validity.accepted ? <>
                    {/* accepted */}
                    {props.children}

                </> : <>
                    {/* rejected */}
                    <div
                        className="w-screen h-screen flex flex-col gap-10 items-center justify-center"
                    >
                        <Image
                            width={80}
                            height={80}
                            alt="preparing QR code..."
                            src="/svgs/error.svg"
                            priority
                        />
                        <p className='text-white'>{validity.rejectMsg}</p>
                    </div>
                    
                </>}
            </>}
        </>
    )
}
