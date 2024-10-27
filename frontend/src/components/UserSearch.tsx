import React, { useState, useRef, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { useRouter } from 'next/router';

const UserSearch = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const [users, setUsers] = useState([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
  };

  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
		setSearchTerm('');
  };

  // Focus the input element when showSearch becomes true
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    console.log(token);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
			setUsers(users);

      const foundUser = users.find((user: { username: string }) =>
        user.username.toLowerCase() === searchTerm.toLowerCase()
      );

      console.log(foundUser);

      if (foundUser) {
        // Assuming the user link is based on their username
        router.push(`/user/${foundUser.user_id}`); // Change this based on your routing setup
      } else {
        alert('User not found');
      }

    } catch (error) {
			alert((error as Error).message);
    }
  };

  return (
    <div className="user-search flex">
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="search-bar flex items-center">
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={handleInputChange}
            ref={inputRef}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </form>
      )}
      <button
        onClick={toggleSearchBar}
        className="toggle-button text-black py-2 px-4 rounded-md hover:bg-blue-200">
        {showSearch ? <MdCancel /> : <CiSearch />}
      </button>

      {showSearch && searchTerm && (
      	<div className="search-results mt-4">
          {users.map((user) => (
            <div key={user.user_id} className="user-item p-2 border-b border-gray-300">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>ID:</strong> {user.user_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
