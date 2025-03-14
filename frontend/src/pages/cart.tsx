import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, setCart, updateQuantity, resetCart } from "../redux/cartSlice";
void addToCart
import { RootState } from "../redux/store";
import Image from 'next/image';
import { BsFillTrashFill } from "react-icons/bs";
import { User } from '@/types/type_User';
import { CartItem, PairStates } from '@/types/type_Cart';

interface CartProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Cart: React.FC<CartProps> = ({ user, setUser }) =>
{
  void setUser //might not need
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  console.log(cart)

  const [hydrated, setHydrated] = useState(false);

  console.log(user?.user_id)

  //api call
  const addItemsToCartApi = async (user_id: number, item_id: number, quantity: number) =>
  {
    try {
      fetch(`http://localhost:8081/myapp/cart/${user_id}/add?itemId=${item_id}&quantity=${quantity}`, {
        method: 'POST',
      })
      console.log('Item added.');
    } catch (error) {
      console.error('Error adding item to the cart:', error);
    }
  };

  useEffect(() => {
    setHydrated(true);
    if (user) {
      const fetchCart = async () => {
        try {
          const response = await fetch(`http://localhost:8081/myapp/cart/${user.user_id}`);
          if (response.ok) {
            const cartData = await response.json();

            const formattedItems = Object.keys(cartData.items).map(key => ({ //this is from database
              id: Number(key),
              quantity: cartData.items[key]
            }));

            const existingItemsMap = new Map(formattedItems.map(item => [item.id, item]));

            cart.forEach(item =>
            {
              console.log(item.id)
              console.log(existingItemsMap)
              if (existingItemsMap.has(item.id)) {
                // If the item already exists, update the quantity
                const prevQuantity = existingItemsMap.get(item.id)?.quantity ?? 0;
                const quantityDifference = item.quantity - prevQuantity;

                console.log(quantityDifference)

                // Update the quantity in the map
                existingItemsMap.get(item.id)!.quantity = item.quantity;

                // Send the quantity difference to the API
                addItemsToCartApi(user.user_id, item.id, quantityDifference);
              } else {
                // If the item doesn't exist, add it to the map
                existingItemsMap.set(item.id, item);
                addItemsToCartApi(user.user_id, item.id, item.quantity);
              }
            });

            // Merge updated data
            //old
            // const combinedData = [...formattedItems, ...newItems];
            const combinedData = [...Array.from(existingItemsMap.values())];

            const fetchItemData = async () => {
              try {
                const fetchPromises = combinedData.map(each =>
                  fetch(`https://pokeapi.co/api/v2/item/${each.id}`).then(res => res.json())
                );
                const itemsData = await Promise.all(fetchPromises);

                const updatedData = combinedData.map((item: PairStates, index: number) => {
                  const itemData = itemsData[index];
                  const descriptionEntry = itemData.flavor_text_entries.find(
                    (entry: { language: { name: string } }) => entry.language.name === "en"
                  );

                  return {
                    ...item,
                    name: itemData.name,
                    image: itemData.sprites ? itemData.sprites.default : null,
                    cost: itemData.cost,
                    descriptionEntry: descriptionEntry ? descriptionEntry.text : "No description available."
                  };
                });

                dispatch(resetCart())
                dispatch(setCart(updatedData as CartItem[]));

                localStorage.removeItem('cart');
              } catch (error) {
                console.error('Error fetching item data:', error);
              }
            };
            fetchItemData();
          } else {
            console.error("Failed to fetch cart");
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };

      fetchCart();
    }
  }, [user]);

  const handleRemoveFromCart = async (itemId: number) =>
  {
    if (user)
    {
      try {
        const response = await fetch(`http://localhost:8081/myapp/cart/${user.user_id}/remove?userId=${user.user_id}&itemId=${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          dispatch(removeFromCart(itemId));
        } else {
          console.error('Error removing item');
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
    else
    {
      dispatch(removeFromCart(itemId));
    }
  };

  const itemsFee = Array.isArray(cart)
    ? cart.reduce((total, item) => total + item.cost * item.quantity, 0)
    : 0;  const deliveryFee = itemsFee < 50 && itemsFee !== 0 ? 10 : 0;
  const totalPrice = itemsFee + deliveryFee;

  if (!hydrated) {
    return null; // Prevent rendering on the server
  }

  return (
    <div className="flex mt-32 mx-12 flex-col md:flex-row">
      <div className="w-2/3 p-4 overflow-auto bg-white rounded-lg max-sm:w-full p-0">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty!</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center  rounded-lg py-2">
								<div className="font-medium flex w-full">
									<div className="border border-gray-300 h-40 w-32 flex justify-center items-center ml-2">
										<Image
											src={item.image || '/not-found.png'}
											alt={item.name} width={40} height={40}
										/>
									</div>
									<div className='h-40 flex flex-col justify-center w-full pl-4'>
										<div>
											<span>{item.name}</span>
										</div>
										<span className="text-sm font-medium">{item.descriptionEntry}</span>
										<span className='text-sm font-medium'>${item.cost * item.quantity}</span>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="number"
										value={item.quantity}
										onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) }))}
										className="w-14 p-1 border rounded text-center"
										min="1"
									/>
									<button
										onClick={() => handleRemoveFromCart(item.id)}
										className="px-2 py-2 rounded hover:bg-red-500"
									>
										<BsFillTrashFill />
									</button>
								</div>
							</div>

            ))}
          </div>
        )}
      </div>
			<div className="w-full md:w-1/4 h-[40vh] p-4 bg-slate-200 sm:ml-4 mt-4 md:mt-0 mb-4 border flex flex-col rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">Checkout</h2>
				<div className="flex justify-between items-center">
          <span className="text-gray-600">Items Fee:</span>
          <span>${itemsFee}</span>
				</div>
				<div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Fee:</span>
          <span>${deliveryFee}</span>
        </div>
        <hr className="border-t-1 border-gray-700 mt-10" />
        <div className="text-gray-600 text-lg flex justify-between items-center mt-auto">
          Total:
          <span>${totalPrice}</span>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-auto">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
