import React, { useEffect, useState, useContext } from "react";

import UserContext from "../../context/UserContext";
import Table from "../Common/Table";
import "./Cartpage.css";
import config from "../../config.json";
import remove from "../../assets/remove.png";
import QuantityInput from "../SingleProduct/QuantityInput";
import CartContext from "../../context/CartContext";
import { checkoutAPI } from "../../services/orderServices";
import { toast } from "react-toastify";

const CartPage = () => {
    const [subTotal, setSubTotal] = useState(0);
    const user = useContext(UserContext);
    const { cart, removeFromCart, updateCart, setCart } =
        useContext(CartContext);

    useEffect(() => {
        let total = 0;
        cart.forEach((element) => {
            total += element.product.price * element.quantity;
        });
        setSubTotal(total);
    }, [cart]);

    const checkout = () => {
        const oldCart = [...cart];
        setCart([]);
        checkoutAPI()
            .then(() => {
                toast.success("Order placed successfully!!");
            })
            .catch(() => {
                toast.error("Something went wrong!!");
                setCart(oldCart);
            });
    };

    return (
        <section className='align_center cart_page'>
            <div className='align_center user-info'>
                <img
                    src={`${config.backendURL}/profile/${user?.profilePic}`}
                    alt='user profile'
                />
                <div>
                    <p className='user_name'>Name: {user?.name}</p>
                    <p className='user_email'>Email: {user?.email}</p>
                </div>
            </div>

            <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]}>
                <tbody>
                    {cart.map(({ product, quantity }) => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>${product.price}</td>
                            <td className='align_center table_quantity_input'>
                                <QuantityInput
                                    quantity={quantity}
                                    stock={product.stock}
                                    setQuantity={updateCart}
                                    cartPage
                                    productId={product._id}
                                />
                            </td>
                            <td>${quantity * product.price}</td>
                            <td>
                                <img
                                    onClick={() => removeFromCart(product._id)}
                                    src={remove}
                                    alt='remove icon'
                                    className='cart_remove_icon'
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <table className='cart_bill'>
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>${subTotal}</td>
                    </tr>
                    <tr>
                        <td>Shipping Charge</td>
                        <td>$5</td>
                    </tr>
                    <tr className='cart_bill_final'>
                        <td>Total</td>
                        <td>${subTotal}</td>
                    </tr>
                </tbody>
            </table>

            <button
                onClick={checkout}
                className='search_button checkout_button'>
                Checkout
            </button>
        </section>
    );
};

export default CartPage;
