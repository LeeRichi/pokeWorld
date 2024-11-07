import React, { useState, ChangeEvent } from 'react';
import SearchBar from './SearchBar';
import { PokeDetail } from '@/types/type_Pokemon';

interface FilterBarProps {
  types: string[];
  onTypeChange: (selectedType: string) => void;
	onSortChange: (sortBy: string) => void;
	onSearch: (searchTerm: string) => void;
  suggestions: PokeDetail[];
  setSearchTerm: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ types, onTypeChange, onSortChange, onSearch, suggestions, setSearchTerm}) => {
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedType(selectedValue);
    onTypeChange(selectedValue);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
		onSortChange(sortValue);
		console.log(sortValue)
  };

  return (
    <div className="p-4 bg-white rounded-lg flex items-center space-x-4 flex-wrap justify-center">

			<SearchBar onSearch={onSearch} suggestions={suggestions} setSearchTerm={setSearchTerm}/>

      <div className="mr-4 mb-4">
        <select
          id="type-filter"
          value={selectedType}
          onChange={handleTypeChange}
          className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 h-12" // Set height to match
        >
          <option value="">All Types</option>
          {types.map((type) => (
						<option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

			<div className="ml-auto mb-4 mt-4 flex items-center whitespace-nowrap">
  			<label htmlFor="sort-options" className="text-gray-700 font-medium mr-2">
          Sort by
        </label>
        <select
          id="sort-options"
          value={sortOption}
          onChange={handleSortChange}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 h-12"
        >
					<option value="id">ID</option>
					<option value="reverse-id">ID descending</option>
					<option value="name">Name</option>
					<option value="reverse-name">Name descending</option>
					<option value="likes">Likes</option>
					<option value="reverse-likes">Likes descending</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
