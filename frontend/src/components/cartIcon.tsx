import Link from 'next/link';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useState, useMemo } from 'react';

type CartIconProps = {
  cartLen: number;
};

const CartIcon: React.FC<CartIconProps> = ({ cartLen }) =>
{
  const cart = useSelector((state: RootState) => state.cart.items);

  // Use Object.values(cart) to convert the object into an array if cart is an object
  const totalItems: number = useMemo(() => {
    if (Array.isArray(cart)) {
      return cart.reduce((total, item) => total + item.quantity, 0);
    } else {
      // If cart is an object, convert it to an array
      const cartArray = Object.values(cart);
      return cartArray.reduce((total, item) => total + item.quantity, 0);
    }
  }, [cart]);

  console.log(totalItems)
  console.log(cartLen)

  const cappedTotalItems: number = totalItems > 99 ? 99 : totalItems;

  console.log(cappedTotalItems)

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Link href="/cart" className="relative">
      <AiOutlineShoppingCart className="text-2xl" />
      {hydrated && (cartLen > 0 || cappedTotalItems > 0) && (
        <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {cappedTotalItems === 0 ? cartLen : cappedTotalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
