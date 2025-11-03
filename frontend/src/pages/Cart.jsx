import React, { useContext, useEffect, useState } from 'react';
import Title from '../component/Title';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CartTotal from '../component/CartTotal';

function Cart() {
  const { products, currency, cartItem, updateQuantity } =
    useContext(shopDataContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        if (cartItem[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size,
            quantity: cartItem[productId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] p-4 md:p-10">
      {/* Page Title */}
      <div className="text-center mt-[80px] mb-10">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Cart Items Section */}
      <div className="flex flex-col gap-6">
        {cartData.length === 0 ? (
          <p className="text-white text-center text-lg md:text-2xl mt-10">
            Your cart is empty 🛒
          </p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );
            if (!productData) return null;

            return (
              <div
                key={index}
                className="border border-[#9ff9f9]/30 rounded-2xl p-4 md:p-6 bg-[#1b3a3d70] flex flex-col md:flex-row md:items-center gap-5 md:gap-10"
              >
                {/* Product Image */}
                <img
                  src={productData.image1}
                  alt={productData.name}
                  className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-lg object-cover self-center"
                />

                {/* Product Details */}
                <div className="flex flex-col gap-3 flex-1">
                  <p className="text-white text-lg md:text-2xl font-semibold">
                    {productData.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-[#aaf4e7] text-base md:text-xl">
                      {currency} {productData.price}
                    </p>
                    <p className="w-[40px] h-[40px] flex items-center justify-center text-white bg-[#518080b4] rounded-md border border-[#9ff9f9]">
                      {item.size}
                    </p>
                  </div>
                </div>

                {/* Quantity Input + Delete Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto mt-3 md:mt-0">
                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className="w-[60px] md:w-[70px] px-2 py-1 text-white text-[16px] font-semibold bg-[#518080b4] border border-[#9ff9f9] rounded-md text-center"
                    onChange={(e) =>
                      e.target.value > 0 &&
                      updateQuantity(item._id, item.size, Number(e.target.value))
                    }
                  />

                  <RiDeleteBin6Line
                    className="text-[#9ff9f9] w-[28px] h-[28px] cursor-pointer hover:text-red-400 transition-all duration-200"
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Section */}
      {cartData.length > 0 && (
        <div className="flex justify-center md:justify-end my-10">
          <div className="w-full sm:w-[400px] md:w-[450px] bg-[#1b3a3d70] rounded-2xl p-5">
            <CartTotal />
            <button
              className="w-full mt-5 text-[18px] bg-[#51808048] hover:bg-[#3c6b6b] py-[10px] rounded-xl text-white border border-[#80808049] transition-all duration-200"
              onClick={() => navigate('/placeorder')}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
