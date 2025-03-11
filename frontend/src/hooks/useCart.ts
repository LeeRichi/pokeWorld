import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCart, resetCart } from '@/redux/cartSlice';
import { CartItem, PairStates } from '@/types/type_Cart';
import { User } from '@/types/type_User';

const useCart = (user: User | null) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const [hydrated, setHydrated] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // This will track fetch state

  useEffect(() => {
    setHydrated(true);
    if (user && !isFetching) {
      setIsFetching(true)
      const fetchCart = async () => {
        try {
          const response = await fetch(`http://localhost:8081/myapp/cart/${user.user_id}`);
          if (response.ok) {
            const cartData = await response.json();
            const formattedItems = Object.keys(cartData.items).map(key => ({
              id: Number(key),
              quantity: cartData.items[key]
            }));

            const existingItemsMap = new Map(formattedItems.map(item => [item.id, item]));

            cart.forEach(item => {
              if (existingItemsMap.has(item.id)) {
                const prevQuantity = existingItemsMap.get(item.id)?.quantity ?? 0;
                const quantityDifference = item.quantity - prevQuantity;
                existingItemsMap.get(item.id)!.quantity = item.quantity;
              } else {
                existingItemsMap.set(item.id, item);
              }
            });

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
                    (entry: { language: { name: string } }) => entry.language.name === 'en'
                  );
                  return {
                    ...item,
                    name: itemData.name,
                    image: itemData.sprites ? itemData.sprites.default : null,
                    cost: itemData.cost,
                    descriptionEntry: descriptionEntry ? descriptionEntry.text : 'No description available.'
                  };
                });

                dispatch(resetCart());
                dispatch(setCart(updatedData as CartItem[]));
                localStorage.removeItem('cart');
              } catch (error) {
                console.error('Error fetching item data:', error);
              } finally {
                setIsFetching(false)
              }
            };
            fetchItemData();
          } else {
            console.error('Failed to fetch cart');
            setIsFetching(false);
          }
        } catch (error) {
          console.error('Error fetching cart data:', error);
          setIsFetching(false)
        }
      };

      fetchCart();
    }
  }, [user, isFetching]);

  return {
    hydrated,
    cart,
  };
};

export default useCart;
