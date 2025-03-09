import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/type_Cart";

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem("cart");
    return Array.isArray(JSON.parse(cart!)) ? JSON.parse(cart!) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!Array.isArray(state.items)) state.items = [];

      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      // localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload.map(pair => ({
        id: pair.id,
        name: pair.name,
        image: pair.image,
        cost: pair.cost,
        descriptionEntry: pair.descriptionEntry || "No description available.",
        quantity: pair.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    updateQuantity: (state, action: PayloadAction<{ id: number, quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    resetCart: (state) => {
      state.items = []; // Reset state.items instead of returning a new object
      localStorage.removeItem("cart");
      console.log(JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, setCart, updateQuantity, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
