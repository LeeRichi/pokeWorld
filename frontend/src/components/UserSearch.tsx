import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CiSearch } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';
import { User } from '@/types/type_User';

const UserSearch = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const [users, setUsers] = useState([])

	const [suggestions, setSuggestions] = useState([])

	const fetchUserSuggestions = useCallback(
		debounce(async (term: string) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users-search/search?username=${term}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const users = await response.json();
          setSuggestions(users);
        } else {
          console.error('Failed to fetch user suggestions');
        }
      } catch (error) {
        console.error('Error fetching user suggestions:', error);
      }
    }, 500),
    []
	);

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) =>
	{
		if (e.key === 'Enter') {
      // router.push(`/pokemon/${localSearchTerm}`);
		}
		if (e.key === 'Escape')
		{
			setSuggestions([]);
			// setLocalSearchTerm('');
		}
	}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
		fetchUserSuggestions(e.target.value)
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
        router.push(`/user/${foundUser.user_id}`);
      } else {
        alert('User not found');
      }

    } catch (error) {
			alert((error as Error).message);
    }
	};

	const handleSuggestionClick = (userId: number) => {
    router.push(`/user/${userId}`);
    toggleSearchBar();
  };

	console.log(suggestions)

  return (
    <div className="user-search flex">
      {showSearch && (
				<form
					onSubmit={handleSearchSubmit}
					className="search-bar flex items-center">
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={handleInputChange}
						ref={inputRef}
						onKeyDown={handleKeyDown}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
					/>
					{suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 mt-28 w-6/12 max-h-60 overflow-auto rounded-md shadow-lg">
							{suggestions.map((user: User) => (
                <li
                  key={user.user_id}
                  onClick={() => handleSuggestionClick(user.user_id)}
                  className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
								>
									{user.image}
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </form>
      )}
      <button
        onClick={toggleSearchBar}
        className="toggle-button text-black py-2 px-4 rounded-md hover:bg-blue-200">
        {showSearch ? <MdCancel /> : <CiSearch />}
      </button>

      {/* {showSearch && searchTerm && (
      	<div className="search-results mt-4">
					{users.map((user) => (

            <div key={user.user_id} className="user-item p-2 border-b border-gray-300">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>ID:</strong> {user.user_id}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default UserSearch;
