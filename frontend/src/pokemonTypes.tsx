type PokemonType =
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'rock'
  | 'bug'
  | 'ghost'
  | 'steel'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'ice'
  | 'dragon'
  | 'dark'
  | 'fairy'
  | 'stellar'
	| 'unknown';

export const pokemonTypes = [
	'normal',
	'fighting',
	'flying',
	'poison',
	'ground',
	'rock',
	'bug',
	'ghost',
	'steel',
	'fire',
	'water',
	'grass',
	'electric',
	'psychic',
	'ice',
	'dragon',
	'dark',
	'fairy',
	'stellar',
	'unknown'
];

export const typeColors: Record<PokemonType, { backgroundColor: string; color: string }> = {
  grass: { backgroundColor: '#86efac', color: '#4f46e5' }, // bg-green-300 text-indigo-800
  normal: { backgroundColor: '#e5e7eb', color: '#1f2937' }, // bg-gray-200 text-gray-800
  fighting: { backgroundColor: '#f87171', color: '#ffffff' }, // bg-red-400 text-white
  flying: { backgroundColor: '#bfdbfe', color: '#1e3a8a' }, // bg-blue-200 text-blue-800
  poison: { backgroundColor: '#c4b5fd', color: '#6b21a8' }, // bg-purple-300 text-purple-800
  ground: { backgroundColor: '#a58a68', color: '#ffffff' }, // bg-brown-300 text-white
  rock: { backgroundColor: '#fcd34d', color: '#78350f' }, // bg-yellow-200 text-yellow-800
  bug: { backgroundColor: '#bbf7d0', color: '#166534' }, // bg-green-200 text-green-800
  ghost: { backgroundColor: '#c7d2fe', color: '#312e81' }, // bg-indigo-200 text-indigo-800
  steel: { backgroundColor: '#9ca3af', color: '#ffffff' }, // bg-gray-400 text-white
  fire: { backgroundColor: '#fca5a5', color: '#ffffff' }, // bg-red-300 text-white
  water: { backgroundColor: '#93c5fd', color: '#ffffff' }, // bg-blue-300 text-white
  electric: { backgroundColor: '#fde047', color: '#000000' }, // bg-yellow-300 text-black
  psychic: { backgroundColor: '#f9a8d4', color: '#ffffff' }, // bg-pink-300 text-white
  ice: { backgroundColor: '#a5f3fc', color: '#000000' }, // bg-cyan-200 text-black
  dragon: { backgroundColor: '#7c3aed', color: '#ffffff' }, // bg-purple-500 text-white
  dark: { backgroundColor: '#4b5563', color: '#ffffff' }, // bg-gray-600 text-white
  fairy: { backgroundColor: '#fbcfe8', color: '#be185d' }, // bg-pink-200 text-pink-800
  stellar: { backgroundColor: '#6b7280', color: '#ffffff' }, // bg-gray-500 text-white
  unknown: { backgroundColor: '#d1d5db', color: '#374151' }, // bg-gray-300 text-gray-700
};

