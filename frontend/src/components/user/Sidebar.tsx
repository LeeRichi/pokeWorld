import React from 'react';
// import { useRouter } from 'next/router';
import { User } from '@/types/type_User';

interface SidebarProps
{
	onEditProfileClick: () => void;
	onChangePassword: () => void;
	onFriendsClick: () => void;
	user: User | null;
	setUser: (user: User | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onEditProfileClick, onFriendsClick, user, setUser, onChangePassword }) => {
  // const router = useRouter();
	// const [user, setUser] = useState<{ name?: string } | {username?: string} | null>(null);

  // const handleNavigation = (path: string) => {
  //   router.push(path);
  // };

	const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="md:translate-x-0 md:shadow-none md:w-64 h-full border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Hi, {user?.username || user?.name}</h2>
      <ul className='pt-6'>
        <li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={onEditProfileClick} // Trigger the modal open function
        >
          Edit Profile
				</li>
				<li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={onChangePassword} // Trigger the modal open function
        >
          Change Password
				</li>
        <li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={onFriendsClick}
        >
          Friends
				</li>
				<li
          className="mb-6 cursor-pointer hover:text-blue-500"
        >
          bag
        </li>
        <li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={handleLogout}
        >
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
