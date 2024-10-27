import { PokeDetail } from '@/types/type_Pokemon';
import React, { ChangeEvent, KeyboardEvent, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  suggestions: PokeDetail[];
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, suggestions, setSearchTerm }) =>
{
	const [localSearchTerm, setLocalSearchTerm] = useState('');


	const router = useRouter();

	const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
      onSearch(term);
    }, 300),
    [setSearchTerm, onSearch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (id: string) => {
		router.push(`/pokemon/${id}`);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) =>
	{
		if (e.key === 'Enter') {
      router.push(`/pokemon/${localSearchTerm}`);
		}
		if (e.key === 'Escape')
		{
			onSearch('');
			setLocalSearchTerm('');
		}
	}

	const handleBlur = () => {
    onSearch('');
  };

  return (
    <div className="relative border">
      <input
        type="text"
        placeholder="Search Pokémon..."
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				className="border border-gray-300 rounded-md shadow-sm p-2 h-12 w-full md:w-96 lg:w-12/12 focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
			{suggestions.length > 0 && (
  			<ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-auto rounded-md">
					{suggestions.map((suggestion) => (
						<>
							<li
								key={suggestion.name}
								className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center"
								onClick={() => handleSuggestionClick(suggestion.id)}
							>
								{suggestion.name}
								<Image
									className="mt-4 mx-auto h-7 w-7 object-contain transition-transform duration-300 ease-in-out hover:scale-125"
									src={suggestion.sprites.other.showdown.front_default || suggestion.sprites.front_default}
									alt={suggestion.name}
									width={7}
									height={7}
									priority={true}
									layout="fixed"
								/>
							</li>
						</>
						)
					)}
				</ul>
			)}
    </div>
  );
};

export default SearchBar;
