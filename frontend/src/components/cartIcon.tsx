import Link from 'next/link';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useState, useMemo } from 'react';

const CartIcon = () => {
  const cart = useSelector((state: RootState) => state.cart.items);

  console.log(typeof(cart))
  console.log(cart)

  // Use Object.values(cart) to convert the object into an array if cart is an object
  const totalItems = useMemo(() => {
    if (Array.isArray(cart)) {
      return cart.reduce((total, item) => total + item.quantity, 0);
    } else {
      // If cart is an object, convert it to an array
      const cartArray = Object.values(cart);
      return cartArray.reduce((total, item) => total + item.quantity, 0);
    }
  }, [cart]);

  const cappedTotalItems = totalItems > 99 ? 99 : totalItems;

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Link href="/cart" className="relative">
      <AiOutlineShoppingCart className="text-2xl" />
      {hydrated && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {cappedTotalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
