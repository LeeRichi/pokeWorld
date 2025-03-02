"use client";

import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import google_logo from "../../assests/google_logo.png"

import { toast } from 'react-toastify';
import { User } from '@/types/type_User';

interface GoogleSignInBtnProps {
	setUser: (user: User) => void;
}

export function GoogleSignInBtn({ setUser }: GoogleSignInBtnProps){
	const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session)
  console.log(status)

  useEffect(() =>
  {
    sessionStorage.clear();

    if (status === 'authenticated' && session) {
      const userInfo = {
        email: session.user?.email,
        username: session.user?.name,
        image: session.user?.image,
        auth_method: 'google',
      };

      console.log("session.user: " + JSON.stringify(session.user))

      const handleBackendLogin = async () =>
      {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
          });

          console.log(res.ok)
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', JSON.stringify(data.token));
            setUser(data.user);

            toast.success('Login successful!', {
              position: 'top-center',
              autoClose: 2000,
            });
            router.push('/');
          } else {
            const createRes = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userInfo),
            });

            if (createRes.ok) {
              const createData = await createRes.json();
              console.log('User created:', createData);
            } else {
              throw new Error('User creation failed');
            }
          }
        } catch (error) {
          console.error(error);
          toast.error('An error occurred during login.');
        }
      };
      handleBackendLogin();
    }
  }, [session, status, setUser, router]);

  const handleGoogleLogin = () =>
  {
    signIn('google');
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-ring-blue-500 text-black rounded-lg focus:shadow-outline hover:bg-slate-200 mb-2"
    >
      <Image src={google_logo} alt="Google Logo" width={20} height={20} />
      <span className="ml-4">Continue with Google</span>
    </button>
  );
}



