import React from "react";


import "./ProductsSidebar.css";
import LinkWithIcon from "../Navbar/LinkWithIcon";
import useData from "../../hooks/useData";

const ProductsSidebar = () => {
    const {data: categories, errors} = useData("/category")

    return (
        <aside className='products_sidebar'>
            <h2>Category</h2>

            <div className='category_links'>
                {errors && <em className="form_error">{errors}</em>}
                {categories && categories.map((category) => (
                    <LinkWithIcon
                        key={category._id}
                        id={category._id}
                        title={category.name}
                        icon={`http://localhost:5000/category/${category.image}`}
                        link={`/products?category=${category.name}`}
                        sidebar
                    />
                ))}
            </div>
        </aside>
    );
};

export default ProductsSidebar;
