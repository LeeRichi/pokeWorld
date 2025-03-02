import React, { ChangeEvent } from 'react';
import SearchBar from './SearchBar';

interface FilterBarProps
{
  types?: string[];
  onTypeChange?: (selectedType: string) => void;
  selectedType?: string;
  // setSelectedType: (selectedType: string) => void;

  sortBy: string;
  onSortChange: (sortBy: string) => void;

  searchHolder: string
}

const FilterBar: React.FC<FilterBarProps> = ({ sortBy, types, onTypeChange, onSortChange, selectedType, searchHolder}) => {

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // setSelectedType(selectedValue);
    onTypeChange?.(selectedValue);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
		onSortChange(sortValue);
  };

  return (
    <div className="p-4 bg-white rounded-lg flex items-center space-x-4 flex-wrap justify-center">

      <SearchBar searchHolder={searchHolder} />

      <div className={`mr-4 mb-4 ${types ? '' : 'invisible'}`}>
        <select
          id="type-filter"
          value={selectedType}
          onChange={handleTypeChange}
          className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 h-12"
        >
          <option value="">All Types</option>
          {types?.map((type) => (
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
          value={sortBy}
          onChange={handleSortChange}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 h-12"
          >
           {types ? (
              <>
                <option value="id">ID</option>
                <option value="reverse-id">ID descending</option>
                <option value="name">Name</option>
                <option value="reverse-name">Name descending</option>
                <option value="likes">Likes</option>
                <option value="reverse-likes">Likes descending</option>
              </>
            ) : (
              <>
                <option value="id">Price</option>
                <option value="reverse-id">Price descending</option>
              </>
            )}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
