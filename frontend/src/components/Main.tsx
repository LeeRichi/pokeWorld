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

const Main: React.FC<MainProps> = ({ user, setUser }) =>
{
	const router = useRouter();
	//basic data
	const [pokeDetails, setPokeDetails] = useState<PokeDetail[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);

	//sorting and filtering algorithm
	const [selectedType, setSelectedType] = useState('');
	const [sortBy, setSortBy] = useState('id');

	const [sort, setSort] = useState('id');
	const [order, setOrder] = useState('asc');
	const [quantity, setQuantity] = useState(0);

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;
	const [restLoading, setRestLoading] = useState(true);

	// Search state
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<PokeDetail[]>([]);

	useEffect(() =>
	{
		// const token = localStorage.getItem('token');
		const user_from_ls = localStorage.getItem('user');
		// setUserInLocalStorage(user_from_ls)
		if (user_from_ls) {
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

	const handleTypeChange = (type: string) =>
	{
		setSelectedType(type);
		setCurrentPage(1);
	};

	const handleSortChange = (sortBy: string) =>
	{
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

	const fetchPokemons = async (page: number, offset: number, limit: number, sort: string, order: string) =>
	{
		try {
			const response = await fetch(`${apiUrl}/api/pokemons?page=${page}&offset=${offset}&limit=${limit}&sort=${sort}&order=${order}`);
			const data = await response.json();
			setPokeDetails(data);
			const quantityRes = await fetch(`${apiUrl}/api/pokemonsquantity`);
			const quantityData = await quantityRes.json();
			setQuantity(quantityData)
			setRestLoading(false);
		} catch (error) {
			console.error("Error fetching Pokémon data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() =>
	{
		const offset = (currentPage - 1) * itemsPerPage;

		fetchPokemons(currentPage, offset, itemsPerPage, sort, order);
	}, [currentPage, itemsPerPage, sort, order]);

	const handleLikesChange = (pokemonId: string, newLikes: number) =>
	{
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

	useEffect(() => {
		if (sortBy === 'id') {
			setSort('id');
			setOrder('asc');
		} else if (sortBy === 'reverse-id') {
			setSort('id');
			setOrder('desc');
		} else if (sortBy === 'name') {
			setSort('name');
			setOrder('asc');
		} else if (sortBy === 'reverse-name') {
			setSort('name');
			setOrder('desc');
		} else if (sortBy === 'likes') {
			setSort('likes');
			setOrder('asc');
		} else if (sortBy === 'reverse-likes') {
			setSort('likes');
			setOrder('desc');
		}
	}, [sortBy]);

	const totalPages = Math.ceil((quantity ?? 0) / itemsPerPage);

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
	  return null;
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
				{filteredPokemons.map((pokemon) => (
					<Card key={pokemon.name} pokemon={pokemon} userPageMode={false} isFavorite={user?.favorite_pokemon_ids?.includes(pokemon.id)} user={user} onLikesChange={handleLikesChange}/>
				))}
			</div>
			<PaginationBtn totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} restLoading={restLoading} />
		</div>
  );
};

export default Main;
