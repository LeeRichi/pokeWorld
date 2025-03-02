import React, { useEffect, useState } from 'react';
import Card from './Card';
import FilterBar from './FilterBar';
import { PokeDetail } from '../types/type_Pokemon';
import { pokemonTypes } from '../pokemonTypes'
import PaginationBtn from './PaginationBtn';
import SkeletonCard from './SkeletonCard';
// import debounce from 'lodash/debounce';
import {User} from '@/types/type_User';
import { useRouter } from 'next/router';
// import { CgPokemon } from 'react-icons/cg';
import { ToastContainer } from 'react-toastify';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import ErrorPage from './ErrorPage.tsx';

const GET_POKEMONS = gql`
  query GetPokemons($page: Int, $limit: Int, $sortBy: String, $total_len: Int) {
    pokemons(page: $page, limit: $limit, sortBy: $sortBy, total_len: $total_len) {
      total
      pokemons {
        id
        name
        likes
        sprites {
          front_default
          other {
            home {
              front_default
            }
            showdown {
              front_default
              back_default
            }
          }
        }
        height
        weight
        types {
          slot
          type {
            name
            url
          }
        }
      }
    }
  }
`;

const GET_POKEMONS_BY_TYPE = gql`
	query GetPokemonsByType($type: String) {
    pokemonsByTypes(type: $type) {
      total
      pokemons {
        id
        name
        likes
        sprites {
          front_default
          other {
            home {
              front_default
            }
            showdown {
              front_default
              back_default
            }
          }
        }
        height
        weight
        types {
          slot
          type {
            name
            url
          }
        }
      }
    }
	}
`

interface MainProps {
  user: User | null;
	setUser: (user: User | null) => void;
}

const Main: React.FC<MainProps> = ({ user, setUser }) =>
{
	const router = useRouter();
	const [pokeDetails, setPokeDetails] = useState<PokeDetail[]>([]);
	const [total_len, setTotal_len] = useState(0)

// const [loading, setLoading] = useState<boolean>(true);
	// const [loadingMore, setLoadingMore] = useState<boolean>(false);

	//sorting and filtering algorithm
	const [selectedType, setSelectedType] = useState('');
	const [sortBy, setSortBy] = useState('id');

	console.log(sortBy)

	const [sort, setSort] = useState('id');
	const [order, setOrder] = useState('asc');
	// const [quantity, setQuantity] = useState(0);

	console.log('look here: ', sort, order)

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

	const [restLoading, setRestLoading] = useState(true);

	// Search state
	const [searchTerm, setSearchTerm] = useState('');
	void searchTerm
	// console.log("searchTerm: ", searchTerm)

	const [totalPages, setTotalPages] = useState(0);

	// const [hasFetched, setHasFetched] = useState(false);

	const { data, loading, error } = useQuery(GET_POKEMONS, {
		skip: !!selectedType, // Skip if a type is selected
    variables: { page: currentPage, limit: itemsPerPage, sortBy, total_len },
	});

	const { data: typeData, loading: typeLoading, error: typeError } = useQuery(GET_POKEMONS_BY_TYPE, {
		skip: !selectedType,
		variables: { type: selectedType },
	});

	// const sortedAndFilteredPokemons = filteredPokemons?.sort((a, b) => {
	// 	if (sort === 'id') {
	// 		return order === 'asc' ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id);
	// 	} else if (sort === 'name') {
	// 		const nameA = a.name.toLowerCase();
	// 		const nameB = b.name.toLowerCase();
	// 		if (nameA < nameB) return order === 'asc' ? -1 : 1;
	// 		if (nameA > nameB) return order === 'asc' ? 1 : -1;
	// 		return 0;
	// 	} else if (sort === 'likes') {
	// 		return order === 'asc' ? a.likes - b.likes : b.likes - a.likes;
	// 	}
	// 	return 0;
	// });

  //for user
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

	useEffect(() => {
		if (data && data.pokemons) {
			setPokeDetails(data.pokemons.pokemons);
			setTotal_len(data.pokemons.total)
			setTotalPages(Math.ceil(data.pokemons.total / itemsPerPage));
			setRestLoading(false);
		}
	}, [data]);

	useEffect(() => {
    if (typeData && typeData.pokemonsByTypes) {
			setPokeDetails(typeData.pokemonsByTypes.pokemons);
      setTotalPages(Math.ceil(typeData.pokemonsByTypes.total / itemsPerPage));
      setRestLoading(false);
    }
  }, [typeData]);

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
		setCurrentPage(1)
  }, [sortBy]);

  //user
	const fetchUserDetails = async (id: number) =>
	{
		// console.log(id)
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

  if (loading || typeLoading) {
    return (
      <div className='mt-32'>
				<FilterBar
					sortBy={sortBy}
					onSortChange={handleSortChange}
					types={pokemonTypes}
					selectedType={selectedType}
					// setSelectedType={setSelectedType}
					onTypeChange={handleTypeChange}
					/>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
					{[...Array(itemsPerPage)]?.map((_, index) => (
						<SkeletonCard key={index} />
					))}
				</div>
			</div>
    );
	}

	if (error || typeError) {
		const errorMessage =
			error?.message === "Error message not found."
				? "Unable to connect to the server. Please try again later."
				: error?.message || typeError?.message || "An unknown error occurred.";

		return <ErrorPage statusCode={500} message={errorMessage} />;
	}

  if (!data && !typeData) {
    return <p>No data available</p>;
  }

	const handleLikesChange = (pokemonId: string, newLikes: number) =>
	{
		setPokeDetails((prevDetails) =>
			prevDetails?.map((pokemon) =>
				pokemon.id === pokemonId ? { ...pokemon, likes: newLikes } : pokemon
			)
		);
  };

	//This part translate the data array first into filtered version, and then a sorted array
	// const filteredPokemons = selectedType
	// 	? pokeDetails.filter((pokemon) =>
	// 		pokemon.types.some((type) => type.type.name === selectedType)
	// 	)
  // 	: pokeDetails;

	// if (loading) {
	// 	return (
	// 		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-60">
	// 			{[...Array(itemsPerPage)].map((_, index) => (
	// 				<SkeletonCard key={index} />
	// 			))}
	// 		</div>
	// 	);
	// }

  //what?
  if (router.pathname.includes('/pokemon/')) {
	  return null;
  }

	return (
		<div className='mt-32'>
			<ToastContainer />
			<FilterBar
				types={pokemonTypes}
				selectedType={selectedType}
				// setSelectedType={setSelectedType}
				onTypeChange={handleTypeChange}
				sortBy={sortBy}
				onSortChange={handleSortChange}

				searchHolder="Pokémon"
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
				{loading || typeLoading ? (
					[...Array(itemsPerPage)].map((_, index) => (
						<SkeletonCard key={index} />
					))
				) : (
					selectedType ? (
						pokeDetails?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((pokemon) => (
							<Card key={pokemon.name} pokemon={pokemon} userPageMode={false} isFavorite={user?.favorite_pokemon_ids?.includes(Number(pokemon.id))} user={user} onLikesChange={handleLikesChange}/>
						))
					) : (
						pokeDetails?.map((pokemon) => (
							<Card key={pokemon.name} pokemon={pokemon} userPageMode={false} isFavorite={user?.favorite_pokemon_ids?.includes(Number(pokemon.id))} user={user} onLikesChange={handleLikesChange}/>
						))
					)
				)}
			</div>
			<PaginationBtn totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} restLoading={restLoading} />
		</div>
	);
};

export default Main;
