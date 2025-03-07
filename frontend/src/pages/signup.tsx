import React from 'react'
import SignUp from '../components/auth/SignUp';
import { User } from '@/types/type_User';

interface SignUpProps
{
	setUser: (user: User | null) => void;
}

const signup: React.FC<SignUpProps> = ({setUser}) => {
	return (
		<div>
			<SignUp setUser={setUser} />
		</div>
  );
}

export default signup
