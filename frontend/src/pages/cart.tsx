import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";
import { RootState } from "../redux/store";
import Image from 'next/image';
import { BsFillTrashFill } from "react-icons/bs";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeFromCart(itemId));
  };

  const totalPrice = cart.reduce((total, item) => total + item.cost * item.quantity, 0);

  return (
    <div className="flex mt-32 mx-12 flex-col sm:flex-row">
      <div className="w-2/3 p-4 overflow-auto bg-white  rounded-lg max-sm:w-full p-0">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty!</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-2">
								<div className="font-medium flex w-full">
									<div className="border border-gray-300 h-40 w-32 flex justify-center items-center">
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

								{/* Quantity and remove button */}
								<div className="flex items-center space-x-2">
									<input
										type="number"
										value={item.quantity}
										onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) }))}
										className="w-12 p-1 border rounded text-center"
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
			<div className="w-full sm:w-1/4 h-[40vh] p-4 bg-slate-200 sm:ml-4 mt-4 sm:mt-0 border flex flex-col">
				<h2 className="text-2xl font-semibold mb-4">Checkout</h2>
				<div className="flex justify-between items-center">
          <span className="text-gray-600">Items Fee:</span>
            {/* <span>${itemsFee}</span> */}
          <span>1</span>
				</div>
				<div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Fee:</span>
            {/* <span>${deliveryFee}</span> */}
            <span>1</span>
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
