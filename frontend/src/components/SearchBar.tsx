// import { PokeDetail } from '@/types/type_Pokemon';
import React, { ChangeEvent, KeyboardEvent, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
// import Image from 'next/image';
import debounce from 'lodash/debounce';
// import Link from 'next/link';
import axios from 'axios';
// import { arch } from 'os';

// interface SearchBarProps {
  // onSearch: (searchTerm: string) => void;
  // setSearchTerm: (term: string) => void;
// }

const SearchBar: React.FC<{ searchHolder: string }> = ({ searchHolder }) =>
  {
	  const [pokemonNames, setPokemonNames] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const fetchPokemonNames = async () => {
			try {
				console.log(process.env.NEXT_PUBLIC_MY_BACKEND_API_URL)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/pokemons_names`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch Pokémon names:", error);
        return [];
      }
    };

    useEffect(() =>
	  {
			fetchPokemonNames().then((data) => {
				setPokemonNames(data);
			});
		}, []);

	const router = useRouter();

	const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    [setSearchTerm]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = pokemonNames.filter(pokemon =>
        pokemon.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }

    debouncedSearch(value);
  };

	const handleSuggestionClick = (name: string) =>
	{
		router.push(`/pokemon/${name}`);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) =>
	{
    if (e.key === 'Enter')
    {
      if (!pokemonNames.includes(searchTerm))
      {
        router.push(`/not_found`);
        setSearchTerm('')
        return;
      }
      router.push(`/pokemon/${searchTerm}`);
		}
		if (e.key === 'Escape')
		{
			setSearchTerm('');
		}
	}

  return (
    <div className="relative border">
      <input
        type="text"
        placeholder={`Search ${searchHolder}...`}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				// onBlur={handleBlur}
				className="border border-gray-300 rounded-md shadow-sm p-2 h-12 w-full md:w-96 lg:w-12/12 focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
			{filteredSuggestions.length > 0 && (
				<ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-auto rounded-md">
					{filteredSuggestions.map((suggestion, index) => (
						<>
							{/* <Link href={`/pokemon/${suggestion.id}`} passHref> */}
							<li
                  key={`${suggestion}-${index}`}
									className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center"
									onClick={() => handleSuggestionClick(suggestion)}
								>
									{suggestion}
									{/* <Image
										className="mt-4 mx-auto h-7 w-7 object-contain transition-transform duration-300 ease-in-out hover:scale-125"
										src={suggestion.sprites.other.showdown.front_default || suggestion.sprites.front_default}
										alt={suggestion}
										width={7}
										height={7}
										priority={true}
										layout="fixed"
										unoptimized={true}
									/> */}
								</li>
							{/* </Link> */}
						</>
						)
					)}
				</ul>
			)}
    </div>
  );
};

export default SearchBar;
