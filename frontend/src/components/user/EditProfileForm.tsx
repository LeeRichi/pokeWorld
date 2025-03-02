// components/EditProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface EditProfileFormProps {
  onClose: () => void;
  initialData: { name: string; email: string, userId: string | number };
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onClose, initialData }) =>
{
  const [name, setName] = useState(initialData.name);
	const [email, setEmail] = useState(initialData.email);

	const id = initialData.userId;

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/:id`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({ name, email, id }),
			})

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Update failed');
			}
			const data = await response.json();
    	console.log(data);
			toast.success(`${data.message}`, {
				position: 'top-center',
				autoClose: 2000,
			});
			onClose();
		} catch (error) {
			console.error(error)
			console.log(error)
		}
	};

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
      <div className="bg-white p-6 rounded-lg shadow-md w-8/12 modal-content">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md w-full p-2"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="mr-2 text-gray-500" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
