import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GoogleSignInBtn } from './GoogleSignInBtn';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from '@/types/type_User';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface LoginProps
{
	setUser: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({setUser}) => {
  const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [auth_method, setAuth_method] = useState('local')
	//temporary use void to avoid build complant
	void setAuth_method;
	const [showPassword, setShowPassword] = useState(false);

	const redirect = useRouter();

	useEffect(() =>
	{
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		localStorage.removeItem('nextauth.message')

		console.log('login page')
			// This will sign out the user as soon as they land on the login page
		signOut({ redirect: false });
	}, []);

  const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password, auth_method }),
			});
			if (!response.ok) {
				throw new Error('Login failed');
			}
			const data = await response.json();
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000,
      });
			setTimeout(() =>
			{
				console.log(data.user)
				setUser(data.user)
        redirect.push('/');
      }, 2000);
		} catch (error) {
			console.error(error)
			toast.error('Invalid username or password.', {
        position: 'bottom-center',
        autoClose: 3000,
      });
		}
	};

return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
			<div className="bg-white p-6 rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold text-center mb-4">Login</h2>
				<GoogleSignInBtn setUser={setUser} />
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username:
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
					>
						Login
				</button>
				</form>
				<div className="mt-4 text-center">
					<p>
						Dont have an account yet?{' '}
						<Link href="/signup" className="text-blue-500 hover:underline">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
			{/* <ToastContainer /> */}
		</div>
  );
};

export default Login;
