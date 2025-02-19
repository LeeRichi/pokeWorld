import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import EditProfileForm from '@/components/EditProfileForm';
import { User } from '@/types/type_User';

interface TopbarProps {
	onFriendsClick: () => void;
	user: User;
	setUser: (user: User | null) => void;
}

const Topbar: React.FC<TopbarProps> = ({ onFriendsClick, user }) =>
{

	//temp
	console.log(user)
  const { data: session } = useSession();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
	};

	const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md p-4">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4 justify-end">
        <button className="text-gray-800" onClick={handleEditClick}>
          Edit Profile
        </button>
        <button className="text-gray-800" onClick={onFriendsClick}>Friends</button>
        <button className="text-blue-500 hover:underline" onClick={() => handleLogout()}>
          Log Out
        </button>
      </div>
      {isEditModalOpen && (
        <EditProfileForm onClose={closeEditModal} initialData={{ name: session?.user?.name || '', email: session?.user?.email || '' }} />
      )}
    </div>
  );
};

export default Topbar;
