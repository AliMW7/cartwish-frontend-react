import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import UserContext from "./context/UserContext";
import "./app.css";
import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";
import { getJwt, getUser } from "./services/userServices";
import setAuthToken from "./utils/setAuthToken";
import {
    addToCartAPI,
    decreaseProductAPI,
    getCartAPI,
    increaseProductAPI,
    removeFromCartAPI,
} from "./services/cartServices";
import "react-toastify/dist/ReactToastify.css";
import CartContext from "./context/CartContext";

setAuthToken(getJwt());

const App = () => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        try {
            const jwtUser = getUser();
            if (Date.now() >= jwtUser.exp * 1000) {
                localStorage.removeItem("token");
                location.reload();
            } else {
                setUser(jwtUser);
            }
        } catch (error) {}
    }, []);

    const addToCart = (product, quantity) => {
        const updatedCart = [...cart];
        const productIndex = updatedCart.findIndex(
            (item) => item.product._id === product._id
        );

        if (productIndex === -1) {
            updatedCart.push({ product: product, quantity: quantity });
        } else {
            updatedCart[productIndex].quantity += quantity;
        }

        setCart(updatedCart);

        addToCartAPI(product._id, quantity)
            .then((res) => {
                toast.success("Product Added Successfully!");
            })
            .catch((err) => {
                toast.error("Failed To Add Product!");
                setCart(cart);
            });
    };

    const removeFromCart = (id) => {
        const oldCart = [...cart];
        const newCart = oldCart.filter((item) => item.product._id !== id);

        removeFromCartAPI(id)
            .then((res) => {
                setCart(newCart);
                toast.success("Product Removed Successfully !!");
            })
            .catch((err) => {
                toast.error("Failed To Removed Product!");
            });
    };

    const updateCart = (type, id) => {
        const oldCart = [...cart];
        const updatedCart = [...cart];
        const productIndex = updatedCart.findIndex(
            (item) => item.product._id === id
        );

        if (type === "increase") {
            updatedCart[productIndex].quantity += 1;
            setCart(updatedCart);
            increaseProductAPI(id).catch(() => {
                toast.error("Failed To Increase Product!");
                setCart(oldCart);
            });
        }
        if (type === "decrease") {
            updatedCart[productIndex].quantity -= 1;
            setCart(updatedCart);
            decreaseProductAPI(id).catch(() => {
                toast.error("Failed To Decrease Product!");
                setCart(oldCart);
            });
        }
    };

    const getCart = () => {
        getCartAPI()
            .then((result) => {
                setCart(result.data);
            })
            .catch((err) => {
                toast.error("Something went wrong !!!");
            });
    };

    useEffect(() => {
        if (user) {
            getCart();
        }
    }, [user]);

    return (
        <UserContext.Provider value={user}>
            <CartContext.Provider
                value={{
                    cart,
                    addToCart,
                    removeFromCart,
                    updateCart,
                    setCart,
                }}>
                <div className='app'>
                    <Navbar />
                    <main>
                        <ToastContainer position='bottom-right' />
                        <Routing />
                    </main>
                </div>
            </CartContext.Provider>
        </UserContext.Provider>
    );
};

export default App;
