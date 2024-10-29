import React, { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import FilterBar from './FilterBar';
import { Pokemon, PokeDetail } from '../types/type_Pokemon';
import { pokemonTypes } from '../pokemonTypes'
import PaginationBtn from './PaginationBtn';
import SkeletonCard from './SkeletonCard';
import debounce from 'lodash/debounce';
import {User} from '@/types/type_User';
import { useRouter } from 'next/router';
import { CgPokemon } from 'react-icons/cg';
import { ToastContainer } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_MY_BACKEND_API_URL;

interface MainProps {
  user: User | null;
	setUser: (user: User | null) => void;
}

const Main: React.FC<MainProps> = ({user, setUser}) =>
{
	const router = useRouter();
	//basic data
	const [pokeDetails, setPokeDetails] = useState<PokeDetail[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);

	//sorting and filtering algorithm
	const [selectedType, setSelectedType] = useState('');
	const [sortBy, setSortBy] = useState('id');

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	// Search state
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<PokeDetail[]>([]);

	useEffect(() => {
		// const token = localStorage.getItem('token');
		const user_from_ls = localStorage.getItem('user');
			// setUserInLocalStorage(user_from_ls)
		if (user_from_ls)
		{
			const parsedUser = JSON.parse(user_from_ls);
			fetchUserDetails(parsedUser.user_id);
			console.log(parsedUser)
			setUser(parsedUser);
		}
	}, [router]);

	const fetchUserDetails = async (id: number) =>
	{
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/${id}`, {
				headers: {
          Authorization: `Bearer ${token}`,
        },
			});
			const data = await response.json();
			setUser(data);
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		}
	};

	const handleTypeChange = (type: string) => {
		setSelectedType(type);
		setCurrentPage(1);
	};

	const handleSortChange = (sortBy: string) => {
		setCurrentPage(1);
		setSortBy(sortBy);
	};

	const handleSearch = (term: string) =>
	{
		setSearchTerm(term);
		if (term) {
			const filteredSuggestions = pokeDetails.filter(pokemon =>
				pokemon.name.toLowerCase().includes(term.toLowerCase())
			);
			setSuggestions(filteredSuggestions);
		} else {
			setSuggestions([]);
		}
	};

	useEffect(() => {
		const fetchInitialPokemons = async () => {
			try {
				// Fetch the first batch only (20 items)
				const initialData = await fetch(`${apiUrl}/api/pokemons_with_likes?offset=0&limit=20`).then((res) => res.json());
				setPokeDetails(initialData);
				setLoading(false);

				// Fetch the rest in the background
				const remainingData = await fetch(`${apiUrl}/api/pokemons_with_likes?offset=20&limit=1025`).then((res) => res.json());
				console.log(remainingData)
				const combinedData = [...initialData, ...remainingData];

				setPokeDetails(combinedData);
			} catch (error) {
				console.error("Error fetching Pokémon data:", error);
			} finally {
				setLoadingMore(false);
			}
		};

		fetchInitialPokemons();
	}, []);

	const handleLikesChange = (pokemonId: string, newLikes: number) => {
    setPokeDetails((prevDetails) =>
      prevDetails.map((pokemon) =>
        pokemon.id === pokemonId ? { ...pokemon, likes: newLikes } : pokemon
      )
    );
  };

	//This part translate the data array first into filtered version, and then a sorted array
	const filteredPokemons = selectedType
		? pokeDetails.filter((pokemon) =>
			pokemon.types.some((type) => type.type.name === selectedType)
		)
		: pokeDetails;

	// console.log(filteredPokemons)

	const sortedPokemons = filteredPokemons.sort((a, b) =>
	{
		if (sortBy === 'id') {
			return parseInt(a.id) - parseInt(b.id);
		} else if (sortBy === 'reverse-id')
		{
			return parseInt(b.id) - parseInt(a.id);
		} else if (sortBy === 'name')
		{
			return a.name.localeCompare(b.name);
		} else if (sortBy === 'reverse-name')
		{
			return b.name.localeCompare(a.name);
		} else if (sortBy === 'likes')
		{
			return a.likes - b.likes
		} else if (sortBy === 'reverse-likes')
		{
			return b.likes - a.likes
		}
			return parseInt(a.id) - parseInt(b.id);
	});

	//page calculations
	const indexOfLastPokemon = currentPage * itemsPerPage;
	const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
	const currentPokemons = sortedPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
	const totalPages = Math.ceil(sortedPokemons.length / itemsPerPage);

	if (loading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-60">
				{[...Array(itemsPerPage)].map((_, index) => (
					<SkeletonCard key={index} />
				))}
			</div>
		);
	}

  if (router.pathname.includes('/pokemon/')) {
	  return null; // Don't render anything if we're on a pokemon detail page
  }

  return (
		<div className='mt-32'>
			<ToastContainer />
			<FilterBar
				types={pokemonTypes}
				onSearch={handleSearch}
				suggestions={suggestions}
				setSearchTerm={setSearchTerm}
				onTypeChange={handleTypeChange}
				onSortChange={handleSortChange}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
				{currentPokemons.map((pokemon) => (
					<Card key={pokemon.name} pokemon={pokemon} userPageMode={false} isFavorite={user?.favorite_pokemon_ids?.includes(pokemon.id)} user={user} onLikesChange={handleLikesChange}/>
				))}
			</div>
			<PaginationBtn totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</div>
  );
};

export default Main;
