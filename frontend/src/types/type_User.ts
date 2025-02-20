import { PokeDetail } from "./type_Pokemon";

export interface User
{
	user_id: number;
	name?: string;
	username?: string;
	email: string;
	image?: string;
	favorites?: PokeDetail[];
	level?: number;
	exp?: number;
	pokcoin?: number;
	friends?: Array<string>;
	favorite_pokemon_ids?: number[];
}
