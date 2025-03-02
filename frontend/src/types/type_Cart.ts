export interface CartItem {
  id: number;
  name: string;
  image: string | null;
  cost: number;
  descriptionEntry: string;
  quantity: number;
}
