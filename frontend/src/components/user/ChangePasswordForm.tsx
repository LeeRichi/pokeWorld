import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface ChangePasswordFormProps {
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that new passwords match
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", {
        position: 'top-center',
        autoClose: 2000,
      });
      return;
    }

    try {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsedUser = JSON.parse(localUser);
        const id = parsedUser.user_id;

        const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/change_password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ id, currentPassword, newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Password change failed');
        }

        const data = await response.json();
        toast.success(data.message, {
          position: 'top-center',
          autoClose: 2000,
        });
        onClose();
      } else {
        console.log('No user found in localStorage');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleClickOutside = (event: React.MouseEvent) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
      <div className="bg-white p-6 rounded-lg shadow-md w-8/12 modal-content">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="mr-2 text-gray-500" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
