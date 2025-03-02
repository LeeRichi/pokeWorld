import { useState, useEffect, useRef, useCallback } from "react";
import { PokeDetail } from "@/types/type_Pokemon";
import Card from "../../components/GalleryCard";
import { useRouter } from 'next/router';

export default function ScrollTriggered() {
  const router = useRouter();
  const { id } = router.query;
  const [pokemons, setPokemons] = useState<PokeDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch Pokémon dynamically based on offset
  const fetchPokemons = useCallback(async (newOffset: number) => {
    try {
      const ids = [newOffset - 2, newOffset - 1, newOffset, newOffset + 1, newOffset + 2];
      const pokemonPromises = ids.map((pokemonId) =>
        pokemonId > 0 ? fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json()) : null
      );

      const pokemonData = await Promise.all(pokemonPromises);
      const newPokemons = pokemonData.filter(pokemon => pokemon !== null);

      setPokemons(prev => {
      const existingIds = new Set(prev.map(pokemon => pokemon.id));
      const uniqueNewPokemons = newPokemons.filter(pokemon => !existingIds.has(pokemon.id));

      return [...prev, ...uniqueNewPokemons];
    });
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      setPokemons([]);
      setOffset(numericId);
      fetchPokemons(numericId);
    }
  }, [id, fetchPokemons]);

  // useEffect(() => {
  //   if (pokemons.length >= 3 && scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }, [pokemons]);

  const lastPokemonRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setOffset(prev => prev + 5);
      }
    });

    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (offset !== Number(id)) {
      fetchPokemons(offset);
    }
  }, [offset, fetchPokemons]);

  return (
    <div style={container}>
      {pokemons.map((pokemon, i) => (
        <div className="" key={i}>
          <Card
            key={pokemon.name}
            pokemon={pokemon}
            hueA={340}
            hueB={10}
            i={i}
            ref={i === pokemons.length - 1 ? lastPokemonRef : null}
            />
        </div>
      ))}
    </div>
  );
}

const container: React.CSSProperties = {
  margin: "100px auto",
  maxWidth: 500,
  paddingBottom: 120,
  width: "100%",
};
