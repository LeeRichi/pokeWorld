import React, { useEffect } from 'react';
import { RxCross1 } from "react-icons/rx";

interface Friend {
  id: number;
  name: string;
}

interface FriendsListProps {
  friends: Friend[];
  onClose: () => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onClose }) =>
{
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

	const handleClickOutside = (event: React.MouseEvent) =>
	{
    const target = event.target as HTMLElement;
    if (target.closest('.modal-content') === null) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClickOutside}
    >
      <div className="modal-content bg-white p-6 rounded-lg shadow-md w-8/12 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
					<RxCross1 size={24}/>
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Friends</h2>
        {friends.length > 0 ? (
          <ul className="list-disc list-inside">
            {friends.map((friend) => (
              <li key={friend.id} className="text-gray-700">{friend.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No friends found.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
