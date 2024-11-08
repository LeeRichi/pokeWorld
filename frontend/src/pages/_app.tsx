import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './global.css';
import { User } from '@/types/type_User';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router';


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps)
{
	const [user, setUser] = useState<User | null>(null);

	const router = useRouter();

	console.log(user)

	const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('token');
        setUser(null);
				toast.error("Session expired. Please log in again.");
				// setTimeout(() => {
					router.push('/login');
				// }, 2000);
      }
    }
	};

	useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
				<Header user={user} setUser={setUser} />
        <main className="flex-grow">
					<Component {...pageProps} user={user} setUser={setUser} />
        </main>
        <Footer />
				<ToastContainer />
			</div>
    </SessionProvider>
  );
}

export default MyApp;
