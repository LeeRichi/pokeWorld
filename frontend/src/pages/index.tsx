import React from 'react';
import Main from '../components/Main';
import { User } from '@/types/type_User';

interface HomeProps {
  user: User | null;
	setUser: (user: User | null) => void;
}

const Home: React.FC<HomeProps> = ({ user, setUser }) =>
{
  return (
    <div>
			<Main user={user} setUser={setUser}/>
    </div>
  );
};

export default Home;
