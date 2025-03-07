import Link from 'next/link';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useState } from 'react';

const CartIcon = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Link href="/cart" className="relative">
      <AiOutlineShoppingCart className="text-2xl" />
     {hydrated && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
