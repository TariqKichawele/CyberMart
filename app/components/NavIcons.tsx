'use client';

import { useWixClient } from '@/hooks/useWixClient';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import CartModal from './CartModal';
import { useCartStore } from '@/hooks/useCartStore';


const NavIcons = () => {
    const [ isProfileOpen, setIsProfileOpen ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isCartOpen, setIsCartOpen ] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const wixClient = useWixClient();
    const isLoggedIn = wixClient.auth.loggedIn();

    const { cart, counter, getCart } = useCartStore();
    
    useEffect(() => {
        getCart(wixClient);
    }, [wixClient, getCart])

    const handleProfile = () => {
        if(!isLoggedIn) {
            router.push("/login")
        } else {
            setIsProfileOpen((prev) => !prev)
        }
    }

    const handleLogout = async () => {
        setIsLoading(true);
        Cookies.remove('refreshToken');
        const { logoutUrl } = await wixClient.auth.logout(window.location.href);
        setIsLoading(false);
        setIsProfileOpen(false);
        router.push(logoutUrl);
    }

 
  return (
    <div className='flex items-center gap-4 xl:gap-6 relative'>
        <Image 
            src={'/profile.png'}
            alt=''
            width={22}
            height={22}
            className='cursor-pointer'
            onClick={handleProfile}
        />
        {isProfileOpen && (
            <div className='absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0, 0, 0, 0.2)] z-20'>
                <Link href={'/profile'}>Profile</Link>
                <div className='mt-2 cursor-pointer' onClick={handleLogout}>
                    { isLoading ? 'Logging out' : 'Logout'}
                </div>
            </div>
        )}
        <Image 
            src={'/notification.png'}
            alt=''
            width={22}
            height={22}
            className='cursor-pointer'
        />
        <div
            className='relative cursor-pointer'
            onClick={() => setIsCartOpen((prev) => !prev)}
        >
            <Image src={'/cart.png'} height={22} width={22} alt=''/>
            <div className='absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center'>
                {counter}
            </div>
        </div>
        {isCartOpen && <CartModal isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>}
    </div>
  )
}

export default NavIcons