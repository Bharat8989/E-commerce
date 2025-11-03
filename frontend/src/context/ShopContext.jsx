import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import { userDataContext } from './UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const shopDataContext = createContext();

function ShopContext({ children }) {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItem, setCartItem] = useState({});
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);

    const currency = '₹';
    const delivery_fee = 40;

    // Fetch products
    const getProducts = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/product/list", { withCredentials: true });
            console.log("Products:", result.data);
            setProducts(result.data);
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    // Add product to cart
    const addtoCart = async (itemId, size) => {
        if (!size) {
            console.log("Select Product Size");
            return;
        }

        // Update local cart state
        let cartData = structuredClone(cartItem);
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }
        setCartItem(cartData);

        // If user logged in, sync with backend
        if (userData) {
            setLoading(true);
            try {
                const result = await axios.post(
                    serverUrl + "/api/cart/add",
                    { itemId, size },
                    { withCredentials: true }
                );
                console.log("Cart Updated:", result.data);
                toast.success("Product Added");
            } catch (error) {
                console.log("Add to cart error:", error);
                toast.error("Add Cart Error");
            }
            setLoading(false);
        }
    };

    // Fetch user cart
    const getUserCart = async () => {
        if (!userData) return;
        try {
            const result = await axios.post(serverUrl + "/api/cart/get", {}, { withCredentials: true });
            setCartItem(result.data);
            console.log("User Cart:", result.data);
        } catch (error) {
            console.log("Error fetching cart:", error);
        }
    };

    // Update cart quantity
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItem);
        cartData[itemId][size] = quantity;
        setCartItem(cartData);

        if (userData) {
            try {
                await axios.post(
                    serverUrl + "/api/cart/update",
                    { itemId, size, quantity },
                    { withCredentials: true }
                );
            } catch (error) {
                console.log("Update cart error:", error);
            }
        }
    };

    // Get cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItem) {
            for (const size in cartItem[itemId]) {
                totalCount += cartItem[itemId][size] || 0;
            }
        }
        return totalCount;
    };

    // Get cart total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItem) {
            const itemInfo = products.find(product => product._id === itemId);
            if (!itemInfo) continue;
            for (const size in cartItem[itemId]) {
                totalAmount += itemInfo.price * (cartItem[itemId][size] || 0);
            }
        }
        return totalAmount;
    };

    // Effects
    useEffect(() => {
        getProducts();
    }, [serverUrl]);

    useEffect(() => {
        getUserCart();
    }, [userData, serverUrl]);

    const value = {
        products,
        currency,
        delivery_fee,
        getProducts,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addtoCart,
        getCartCount,
        setCartItem,
        updateQuantity,
        getCartAmount,
        loading
    };

    return (
        <shopDataContext.Provider value={value}>
            {children}
        </shopDataContext.Provider>
    );
}

export default ShopContext;
