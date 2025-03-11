import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import {store} from "@/redux/store";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './global.css';
import { User } from '@/types/type_User';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';
// import Card from '@/components/Card';

const GA_TRACKING_ID = "G-XVTMR61Y98"; //safe in public

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps)
{
	const [user, setUser] = useState<User | null>(null);
	const [cartLen, setCartLen] = useState<number>(0);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	void isLoading
	const [error, setError] = useState<string | null>(null);
	void error

	const router = useRouter();

	console.log(user)

	useEffect(() => {
    const fetchCart = async () => {
      if (!user?.user_id) return;
      try {
        const response = await fetch(`http://localhost:8081/myapp/cart/${user.user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }

				const cartData = await response.json();

				localStorage.setItem("cart", JSON.stringify(cartData))

				const items = cartData.items as Record<string, number>;
        const sum = Object.values(items).reduce((acc, curr) => acc + curr, 0);

				console.log(sum)
        setCartLen(sum);
      } catch (err: unknown) {
				setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user]);

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
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
		const handleRouteChange = (url: string) => {
			if (window.gtag) {
				window.gtag("config", GA_TRACKING_ID, { page_path: url });
			}
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<Provider store={store}>
			<SessionProvider session={session}>
				<Head>
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
				</Head>

				<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${GA_TRACKING_ID}');
					`}
				</Script>

				<div className="flex flex-col min-h-screen">
					<Header user={user} setUser={setUser} cartLen={cartLen} />
					<main className="flex-grow">
						<Component {...pageProps} user={user} setUser={setUser} />
					</main>
					<Footer />
					<ToastContainer />
				</div>
			</SessionProvider>
		</Provider>
  );
}

export default MyApp;
