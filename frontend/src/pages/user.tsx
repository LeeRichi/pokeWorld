import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// import { useSession } from "next-auth/react";
import { User } from '@/types/type_User';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import EditProfileForm from '@/components/EditProfileForm';
import FriendsList from '@/components/FriendsList';
import { PokeDetail } from '@/types/type_Pokemon';
import defaultAvatar from '@/assests/default_avatar.jpg'
import Card from '@/components/Card';
import { ToastContainer } from 'react-toastify';
// import { motion } from 'framer-motion'
import ChangePasswordForm from '@/components/ChangePasswordForm';

interface UserDetailProps
{
	user: User | null;
	setUser: (user: User | null | string) => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, setUser }) =>
{
  const router = useRouter();
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [changePasswordOpen, setChangePasswordOpen] = useState(false)
	const [friends, setFriends] = useState<{ id: number; name: string }[]>([]);
	const [showFriendsList, setShowFriendsList] = useState(false);

  useEffect(() => {
		const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
		} else {
			const user_from_ls = localStorage.getItem('user');
			setUser(user_from_ls)
			if (user_from_ls)
			{
				const parsedUser = JSON.parse(user_from_ls);
				fetchUserDetails(parsedUser.user_id);
				// setUser(parsedUser);
			}
    }
	}, [router]);

	const fetchUserDetails = async (id: number) =>
	{
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/${id}`, {
					headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			});
			const data = await response.json();
			setUser(data);
			setFriends(data.friends || []);
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		}
	};

	const toggleFriendsList = () => {
    setShowFriendsList(prev => !prev);
  };

  const calculateExperienceProgress = () => {
    if (!user) return 0;
		const { exp = 0 } = user;
		const tempFakeLevel = 1;
		// const expRequiredForNextLevel = level * 100;
		const expRequiredForNextLevel = tempFakeLevel * 100;
		return (exp / expRequiredForNextLevel) * 100;
  };

  const handleEditProfileClick = () => {
    setEditModalOpen(true);
	};

	const toggleChangePasswordClick = () =>
	{
		setChangePasswordOpen(prev => !prev);
	}

  const closeEditModal = () => {
    setEditModalOpen(false);
	};

	const closeFriendList = () =>
	{
		setShowFriendsList(false);
	}

  return (
		<div className="flex flex-col mt-36 w-10/12 mx-auto">
      <div className="md:hidden">
				<Topbar onFriendsClick={toggleFriendsList} user={user} />
      </div>
      <div className="flex flex-1">
        <div className="hidden md:block">
					<Sidebar onEditProfileClick={handleEditProfileClick} onChangePassword={toggleChangePasswordClick} onFriendsClick={toggleFriendsList} user={user} />
        </div>
        <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24">
              <Image
                className="rounded-full border"
                src={user?.image || defaultAvatar}
                alt={`${user?.name}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Level: {user?.level}</p>
            <div className="relative h-4 bg-gray-300 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${calculateExperienceProgress()}%` }}
              />
            </div>
            <p className="text-gray-600 text-sm">
              {user?.exp} / {(1 || 0) * 100} EXP
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorites Pokémon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user?.favorites? (
							user?.favorites?.map((pokemon: PokeDetail) => (
								<Card key={pokemon.name} pokemon={pokemon} userPageMode={true} user={user} isFavorite={false} />
              ))
            ) : (
              <p className="text-gray-600">No liked Pokémon yet.</p>
            )}
          </div>
        </main>
      </div>
      {isEditModalOpen && (
        <EditProfileForm
          onClose={closeEditModal}
          initialData={{ name: user?.username || '', email: user?.email || '', userId: user?.user_id || '' }}
        />
			)}
			{changePasswordOpen && (
				<ChangePasswordForm
					onClose={toggleChangePasswordClick}
				/>
			)}
			{showFriendsList && <FriendsList friends={friends} onClose={closeFriendList} />}
			<ToastContainer />
    </div>
  );
};

export default UserDetail;
