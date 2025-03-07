import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import Filterbar from "../components/FilterBar";
import { User } from "../types/type_User";
import Image from 'next/image';
import { PiCoinVerticalBold } from "react-icons/pi";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { RootState } from "../redux/store";
import PaginationBtn from "@/components/PaginationBtn";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ItemSimple {
  name: string;
  url: string;
}

interface ItemRaw {
  count: number;
  results: ItemSimple[];
}

interface ItemDetail {
  id: number;
  name: string;
  image: string | null;
  cost: number;
  descriptionEntry: string;
}

interface CartItem extends ItemDetail {
  quantity: number;
}

interface ShoppingPageProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const fetchItems = async (): Promise<ItemRaw> => {
  const response = await fetch("https://pokeapi.co/api/v2/item?limit=50");
  return response.json();
};

const ShoppingPage: React.FC<ShoppingPageProps> = ({ user, setUser }) => {
  const [items, setItems] = useState<ItemDetail[]>([]);
  const itemsPerPage = 20;
  const [sortBy, setSortBy] = useState('id');

  const [currentPage, setCurrentPage] = useState(1);

  const pageItems = items.slice((currentPage - 1) * itemsPerPage, itemsPerPage * currentPage)
	const [restLoading, setRestLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  console.log("cart: ", cart)

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const loadItems = async () => {
      const itemsList = await fetchItems();
      const itemsWithDetails = await Promise.all(
        itemsList.results.map(async (item: ItemSimple) => {
          const res = await fetch(item.url);
          const itemData = await res.json();

          const descriptionEntry = itemData.flavor_text_entries.find(
            (entry: { language: { name: string } }) => entry.language.name === "en"
          );

          return {
            name: item.name,
            image: itemData.sprites ? itemData.sprites.default : null,
            id: itemData.id,
            cost: itemData.cost || 0,
            descriptionEntry: descriptionEntry ? descriptionEntry.text : "No description available."
          };
        })
      );
      setItems(itemsWithDetails);
      setTotalPages(Math.ceil(items.length / 20))
      setRestLoading(false)
    };
    loadItems();
  }, []);

  const handleQuantityChange = (itemId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleAddToCart = (item: ItemDetail) =>
  {
    const quantity = quantities[item.id] || 1;
    dispatch(addToCart({ ...item, quantity }));

    toast.success(`${item.name} x ${quantity} added to the cart.`, {
      position: 'top-center',
      autoClose: 2000,
    });
  };

  return (
    <div className="min-h-screen pt-32">
      <Filterbar searchHolder="items" sortBy={sortBy} onSortChange={setSortBy} />

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Items</h2>
        <table className="min-w-full table-auto divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-2 text-left text-gray-700">Item</th>
              <th className="py-2 text-left text-gray-700">Description</th>
              <th className="py-2 text-left text-gray-700">Cost</th>
              {/* <th className="py-2 text-left text-gray-700">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-4 flex items-center space-x-3">
                  <Image
                    className="h-10 w-10 object-contain"
                    src={item.image || '/not-found.png'}
                    alt={item.name}
                    width={40}
                    height={40}
                    priority={true}
                    layout="fixed"
                    unoptimized
                  />
                  <span className="text-lg font-medium text-gray-800">{item.name}</span>
                </td>
                <td className="py-4 text-sm text-gray-600 max-w-xs">{item.descriptionEntry}</td>
                <td className="py-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <PiCoinVerticalBold className="text-yellow-500"/>{item.cost}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-3 justify-end">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="1"
                      className="w-16 h-8 border border-gray-300 rounded-md px-2"
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    />
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="min-h-8 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBtn totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} restLoading={restLoading} />
    </div>
  );
};

export default ShoppingPage;
