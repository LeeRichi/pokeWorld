import * as motion from "motion/react-client"
import type { Variants } from "motion/react"
import { PokeDetail } from "@/types/type_Pokemon";
import Image from "next/image";
import { forwardRef } from "react";
import Heart from "@/components/Heart";

interface CardProps
{
  pokemon: PokeDetail;
  hueA: number
  hueB: number
  i: number
  ref: React.Ref<HTMLDivElement>
}

// Use forwardRef to pass ref correctly
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ pokemon, emoji, hueA, hueB, i }, ref) => {
    const typeColors: Record<string, string> = {
      fire: "#fba56f",
      water: "#63a5fc",
      grass: "#85e89d",
      electric: "#f7cb42",
      bug: "#6e7a22",
      fairy: "#f4a4e6",
      poison: "#aa3d8c",
      psychic: "#f47c6d",
      ghost: "#7a4ee0",
      dragon: "#0c7abf",
      dark: "#5e2f21",
      steel: "#d4d9de",
      fighting: "#9f4d4d",
      normal: "#d9d9d9",
    };

    const pokemonTypes = pokemon.types.map((type) => type.type.name);
    const backgroundColor = pokemonTypes.map((type) => typeColors[type] || "#d9d9d9");

    if (backgroundColor.length === 1) backgroundColor.push(backgroundColor[0]);

    return (
      <motion.div
        ref={ref}
        className={`card-container-${i}`}
        style={cardContainer}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.8 }}
      >
        <div style={{ ...splash, background: `linear-gradient(306deg, ${backgroundColor})` }} />
        <motion.div style={card} variants={cardVariants} className="card">
          <span style={idStyle}>#{pokemon.id}</span>
          <h1 style={nameStyle}>{pokemon.name}</h1>
          <div className="flex justify-center mt-2" style={typeStyle}>
            {pokemonTypes.map((type) => (
              <span
                key={type}
                style={{
                  backgroundColor: typeColors[type] || "#d9d9d9",
                  color: type === "dark" ? "#5e2f21" : "inherit",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  margin: "0 2px",
                }}
              >
                {type}
              </span>
            ))}
          </div>
          <button style={likeBtnStyle}>
            <Heart isFilled={false} />
          </button>
          <Image
            className="mx-auto w-full h-auto object-contain transition-transform duration-300 ease-in-out hover:scale-105"
            src={pokemon.sprites.other.home.front_default}
            alt={pokemon.name}
            width={200}
            height={200}
          />
        </motion.div>
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;

const cardVariants: Variants = {
    offscreen: {
        y: 300,
    },
    onscreen: {
        y: 50,
        rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
        },
    },
}

/**
 * ==============   Styles   ================
 */

const cardContainer: React.CSSProperties = {
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 20,
    marginBottom: -120,
}

const splash: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
}

const card: React.CSSProperties = {
    // fontSize: 164,
    width: 300,
    height: 430,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    background: "#f5f5f5",
    boxShadow:
        "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
    transformOrigin: "10% 60%",
}

const idStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  left: "15px",
  fontSize: "18px",
  fontWeight: "600",
  backgroundColor: "rgb(219, 234, 254)",
  color: "rgb(29, 78, 216)",
  padding: "6px 12px",
  borderRadius: "9999px",
  display: "inline-block",
};

const likeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "18px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const nameStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#000",
};

const typeStyle: React.CSSProperties = {
  position: "absolute",
  top: "50px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#inherit",
}
