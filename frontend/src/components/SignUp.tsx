import React, { useState } from 'react';
import { GoogleSignInBtn } from './GoogleSignInBtn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from '@/types/type_User';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface SignUpProps
{
	setUser: (user: User | null) => void;
}

const SignUp: React.FC<SignUpProps> = ({setUser}) =>
{
	const redirect = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
		password: '',
		auth_method: 'local'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Sign Up failed');
			}
			// const data = await response.json();

			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			toast.success('Sign up successful!', {
				position: 'top-center',
				autoClose: 2000,
			});
			setTimeout(() =>
			{
				setUser(data.user)
				redirect.push('/');
			}, 2000);
		} catch (err) {
			const error = err as Error;
			console.error(error)
			toast.error(error.message, {
        position: 'bottom-center',
        autoClose: 3000,
      });
		}
	};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
				<h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <GoogleSignInBtn setUser={setUser} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
			</div>
			<ToastContainer />
    </div>
  );
};

export default SignUp;
