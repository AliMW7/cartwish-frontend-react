import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import "./SingleProductPage.css";
import QuantityInput from "./QuantityInput";
import useData from "../../hooks/useData";
import Loader from "../Common/Loader";
import CartContext from "../../context/CartContext";
import UserContext from "../../context/UserContext";

const SingleProductPage = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useContext(CartContext);
    const user = useContext(UserContext);

    const { id } = useParams();

    const { data: product, error, isLoading } = useData(`/products/${id}`);

    return (
        <section className='align_center single_product'>
            {error && <em className='form_error'>{error}</em>}
            {isLoading && <Loader />}
            {product && (
                <>
                    <div className='align_center'>
                        <div className='single_product_thumbnails'>
                            {product.images.map((image, index) => (
                                <img
                                    onClick={() => setSelectedImage(index)}
                                    alt={product.title}
                                    key={index}
                                    src={`http://localhost:5000/products/${image}`}
                                    className={
                                        selectedImage === index
                                            ? "selected_image"
                                            : ""
                                    }
                                />
                            ))}
                        </div>

                        <img
                            className='single_product_display'
                            src={`http://localhost:5000/products/${product.images[selectedImage]}`}
                            alt={product.title}
                        />
                    </div>

                    <div className='single_product_details'>
                        <h1 className='single_product_title'>
                            {product.title}
                        </h1>
                        <p className='single_product_description'>
                            {product.description}
                        </p>
                        <p className='single_product_price'>
                            ${product.price.toFixed(2)}
                        </p>

                        {user && (
                            <>
                                <h2 className='quantity_title'>Quantity:</h2>
                                <div className='align_center quantity_input'>
                                    <QuantityInput
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                        stock={product.stock}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        addToCart(product, quantity);
                                    }}
                                    className='search_button add_cart'>
                                    Add to Cart
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default SingleProductPage;
