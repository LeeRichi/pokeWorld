import React from 'react';
import Login from '../components/auth/Login';
import { User } from '@/types/type_User';

interface LoginProps
{
	setUser: (user: User | null) => void;
}

const LoginPage: React.FC<LoginProps> = ({ setUser }) =>
{
  return (
		<div>
			<Login setUser={setUser}/>
		</div>
  );
};

export default LoginPage;
