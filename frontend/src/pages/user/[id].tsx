import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { User } from '@/types/type_User';
import defaultAvatar from '@/assests/default_avatar.jpg';
// import FriendsList from '@/components/FriendsList';
import Card from '@/components/Card';
import { PokeDetail } from '@/types/type_Pokemon';
import { ToastContainer } from 'react-toastify';

interface UserDetailProps {
  user: User | null;
  setUser: (user: User | null | string) => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, setUser }) => {
  const { data: session, status } = useSession(); // Fetch session from next-auth
  const router = useRouter();
  const { id } = router.query;

  const [aSingleUser, setASingleUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<{ id: number; name: string }[]>([]);
  void friends
  // const [showFriendsList, setShowFriendsList] = useState(false);

	useEffect(() =>
	{
		if (status === 'loading') return; // Wait for session to load

		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
			fetchUserDetails(id);
		} else if (!session)
		{
			router.push('/login');
		} else {
      fetchUserDetails(id);
    }
  }, [session, id, router]);

	const fetchUserDetails = async (id: number | string | string[] | undefined) =>
	{
		const token = localStorage.getItem('token');

		console.log(token)

    try {
			// const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/${id}`);
			 const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers
        },
      });
			const data = await response.json();
			console.log(data)
      setASingleUser(data);
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
	};

  const calculateExperienceProgress = () => {
    if (!aSingleUser) return 0;
    const { exp = 0 } = aSingleUser; // Default to 0 if exp is undefined
		const tempFakeLevel = 1;
		// const expRequiredForNextLevel = level * 100;
		const expRequiredForNextLevel = tempFakeLevel * 100;
		return (exp / expRequiredForNextLevel) * 100;
  };

  // const closeFriendList = () => {
  //   setShowFriendsList(false);
  // };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col mt-36 w-10/12 mx-auto">
      <div className="flex flex-1">
        <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24">
              <Image
                className="rounded-full border"
                src={aSingleUser?.image || defaultAvatar}
                alt={`${aSingleUser?.name}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {aSingleUser?.name || aSingleUser?.username}
                </h1>
                <p className="text-gray-600">{aSingleUser?.email}</p>
							</div>
							{user?.user_id === aSingleUser?.user_id ?
								null :
								<button
									onClick={() => console.log('add friend')}
									className="text-blue-500 hover:bg-blue-500 hover:text-white mt-2 ml-5 border border-blue-500 rounded-md px-4 py-2"
								>
									Add friend
								</button>
							}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Level: {aSingleUser?.level}</p>
            <div className="relative h-4 bg-gray-300 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${calculateExperienceProgress()}%` }}
              />
            </div>
            <p className="text-gray-600 text-sm">
							{aSingleUser?.exp} / {(1 || 0) * 100} EXP
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorites Pokémon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {aSingleUser?.favorites ? (
              aSingleUser.favorites.map((pokemon: PokeDetail) => (
                <Card
                  key={pokemon.name}
                  pokemon={pokemon}
                  userPageMode={true}
                  user={aSingleUser}
                  isFavorite={false}
                />
              ))
            ) : (
              <p className="text-gray-600">No liked Pokémon yet.</p>
            )}
          </div>
        </main>
      </div>
      {/* {showFriendsList && <FriendsList friends={friends} onClose={closeFriendList} />} */}
      <ToastContainer />
    </div>
  );
};

export default UserDetail;

