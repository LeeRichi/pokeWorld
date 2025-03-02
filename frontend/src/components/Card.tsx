import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PokeDetail } from '../types/type_Pokemon';
import { typeColors } from '../pokemonTypes';
import Heart from './Heart';
import { User } from '@/types/type_User';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import notFoundImage from '../assests/not_found.png';


const Card: React.FC<{ pokemon: PokeDetail, userPageMode: boolean, isFavorite: boolean | undefined, user: User | null, onLikesChange?: (pokemonId: string, newLikes: number) => void }> = ({ pokemon, userPageMode = false, isFavorite, user, onLikesChange}) => {
	const [isFilled, setIsFilled] = useState(isFavorite);

	let id = null;
	if (user)
	{
		id = String(user.user_id);
	}

	useEffect(() => {
    if (userPageMode) {
      setIsFilled(true);
    } else {
      setIsFilled(isFavorite);
    }
  }, [userPageMode, isFavorite]);

  const getColorClass = (type: keyof typeof typeColors) => {
    return typeColors[type];
	};

	const toggleFavorite = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!user)
		{
			const userConfirmed = confirm("To like a Pokémon, you will need to log in first.\nWould you like to log in now?");
			if (userConfirmed) {
				window.location.href = '/login';
				return
			} else {
				return
			}
		}
		setIsFilled(prev => !prev);

		if (isFilled) {
			const confirmed = window.confirm(`Are you sure you want to unlike ${pokemon.name}?`);
			if (!confirmed) {
				setIsFilled(prev => !prev);
				return;
			}
		}
		const newLikes = !isFilled ? pokemon.likes + 1 : pokemon.likes - 1;

		if (onLikesChange) {
      onLikesChange(pokemon.id, newLikes);
    }

		const method = isFilled ? 'DELETE' : 'POST';

		try {
			const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');

			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/favorites`, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					userId: user.user_id,
					pokemonId: pokemon.id,
				}),
			});

			if (!response.ok) {
				console.error('Failed to toggle favorite:', await response.json());
				setIsFilled(prev => !prev);
			}
			if (method == 'DELETE')
			{
				toast.success(`${pokemon.name} will remember this.`, {
					position: 'top-center',
					autoClose: 2000,
				});
			}
			else
				toast.success(`${pokemon.name} is now your favorite.`, {
					position: 'top-center',
					autoClose: 2000,
			});
		} catch (error) {
			console.error('Error toggling favorite:', error);
			setIsFilled(prev => !prev);
		}
	};
	const loggedUser = localStorage.getItem('user');

	let isUserOwner = false;
	if (loggedUser) {
		const parsedUser = JSON.parse(loggedUser);
		if (id && !Array.isArray(id)) {
			isUserOwner = parseInt(id) === parsedUser.user_id;
		}
	}

	const imageUrl = pokemon.sprites.other?.showdown.front_default || pokemon.sprites.front_default;

	const getTypeStyles = (color: string = '#e0e0e0', textColor: string = 'inherit', isEmpty: boolean = false) => ({
		padding: '4px 8px',
		fontSize: '12px',
		fontWeight: 'bold',
		marginRight: '8px',
		backgroundColor: color,
		color: textColor,
		borderRadius: '8px',
		display: 'inline-block',
		visitbility: isEmpty ? 'hidden' : 'visible'
	});

	return (
		<>
			<Head>
        <link
          rel="preload"
          href={imageUrl}
          as="image"
          type="image/png"
        />
      </Head>
			<Link href={`/pokemon/${pokemon.id}`} passHref>
				<div key={pokemon.name} className={`border rounded-lg shadow-lg p-4 bg-white relative ${userPageMode ? 'bg-white' : 'bg-white'} hover:scale-105 transition duration-200 ease-in-out`}>
					{pokemon.likes === 0 ? null : <span className='absolute top-5 right-11'>{pokemon.likes}</span>}
					{!isUserOwner ?
						<button
							onClick={(e) => {
								e.preventDefault();
								alert("This is not your Pokémon!!!");
							}}
							// onClick={toggleFavorite}
							className="absolute top-6 right-5 focus:outline-none w-5 hover:text-blue-500 hover:scale-110 transition duration-200 ease-in-out"
						>
							<Heart isFilled={isFilled} />
						</button>
						: <button
							onClick={toggleFavorite}
							className="absolute top-6 right-5 focus:outline-none w-5 hover:text-blue-500 hover:scale-110 transition duration-200 ease-in-out"
							>
							<Heart isFilled={isFilled} />
						</button>
					}
					<div className="flex justify-center items-center">
						<span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-blue-700 font-semibold text-lg shadow-md">
							#{pokemon.id}
						</span>
					</div>
					<div className="relative">
						<Image
							className="mt-4 mx-auto h-20 w-20 object-contain transition-transform duration-300 ease-in-out hover:scale-125"
							src={pokemon.sprites.other?.showdown.front_default || pokemon.sprites.front_default || notFoundImage}
							alt={pokemon.name}
							width={80}
							height={80}
							priority={true}
							layout="fixed"
							unoptimized
						/>
					</div>
					<h2 className="text-lg font-bold text-center mt-2">{pokemon.name}</h2>
					<div className="flex justify-center mt-2">
						{pokemon.types.length === 0 ? (
    					<span style={getTypeStyles('white', 'inherit', true)}>
								&nbsp;
							</span>
						) : (
							pokemon.types.map((typeSlot) => {
								const type = typeSlot.type.name as keyof typeof typeColors;
								const colorClass = getColorClass(type);
								return (
									<span
										key={typeSlot.type.name}
										style={getTypeStyles(colorClass.backgroundColor, type === 'dark' ? colorClass.color : 'inherit')}
									>
										{typeSlot.type.name}
									</span>
								);
							})
						)}
					</div>
				</div>
			</Link>
		</>
  );
};

export default Card;
