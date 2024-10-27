import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import pokeBall from '../assests/logo.png';
import defaultAvatar from '../assests/default_avatar.jpg'
import { User } from '@/types/type_User';
import Dropdown from './Dropdown';
import UserSearch from './UserSearch';
// import Heart from './Heart';

interface HeaderProps {
  user: User | null;
	setUser: (user: User | null) => void;
}

const Header: React.FC<HeaderProps> = ({user, setUser}) => {
	const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

	const handleLogout = () =>
	{
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDropdownVisible(false);
    window.location.href = '/login';
	};

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0">
            <a aria-current="page" className="flex items-center w-10" href="/">
              <Image src={pokeBall.src} alt="Poke Ball" width={40} height={40} />
              <p className="sr-only">Website Title</p>
            </a>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <a
              aria-current="page"
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#"
            >
              pokemon
            </a>
            <a className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900" href="#">
              shopping center
						</a>
						{/* <p>searach bar Palbo</p> */}
          </div>
					<div className="flex items-center justify-end gap-3 relative">
						{/* cosider the heart and amount of likes */}
						{/* <button><Heart isFilled={false} /></button> */}
            {user ? (
							<div className="relative flex items-center space-x-2">
									<UserSearch />
									<h3 className="text-left">{user.username}</h3>
                <button
                  onClick={toggleDropdown}
                  className="inline-flex items-center justify-center rounded-full h-10 w-10"
                >
                  <Image
                    src={user?.image || defaultAvatar}
                    alt="User Avatar"
                    width={38}
                    height={38}
                    className="h-8 w-8 rounded-full mt-1"
                  />
                </button>
								 <Dropdown isOpen={dropdownVisible} onClose={() => setDropdownVisible(false)}>
                  <a
										href={`${process.env.NEXT_PUBLIC_MY_FRONTEND_API_URL}/user`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    See My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </Dropdown>
              </div>
            ) : (
              <>
                <a className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex" href="/login">
                  Log in
                </a>
                <a className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500" href="/signup">
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
