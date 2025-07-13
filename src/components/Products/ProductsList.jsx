import React, { useEffect, useState } from "react";

import "./ProductsList.css";
import ProductCard from "./ProductCard";
import useData from "../../hooks/useData";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useSearchParams } from "react-router-dom";
//import Pagination from "../Common/Pagination";

const ProductsList = () => {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const [sortedProducts, setSortedProducts] = useState([]);

    const [search, setSearch] = useSearchParams();
    const category = search.get("category");
    const searchQuery = search.get("search");

    const { data, errors, isLoading } = useData(
        "/products",
        {
            params: {
                search: searchQuery,
                category: category,
                perPage: 10,
                page: page,
            },
        },
        [category, page, searchQuery]
    );

    useEffect(() => {
        setPage(1);
    }, [category, searchQuery]);

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8];

    // const handlePageChange = (page) => {
    //     const currentParams = Object.fromEntries([...search]);
    //     setSearch({
    //         ...currentParams,
    //         page: parseInt(currentParams.page) + 1,
    //     });
    // };

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } =
                document.documentElement;
            if (
                scrollTop + clientHeight >= scrollHeight - 1 &&
                !isLoading &&
                data &&
                page < data.totalPages
            ) {
                console.log("reach");
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [data, isLoading]);

    useEffect(() => {
        if (data && data.products) {
            const products = [...data.products];
            console.log(products)

            if (sortBy === "price desc") {
                setSortedProducts(products.sort((a, b) => b.price - a.price));
            } else if (sortBy === "price asc") {
                setSortedProducts(products.sort((a, b) => a.price - b.price));
            } else if (sortBy === "rate desc") {
                setSortedProducts(
                    products.sort((a, b) => b.reviews.rate - a.reviews.rate)
                );
            } else if (sortBy === "rate asc") {
                setSortedProducts(
                    products.sort((a, b) => a.reviews.rate - b.reviews.rate)
                );
            } else {
                setSortedProducts(products);
            }
        }
    }, [sortBy, data]);

    return (
        <section className='products_list_section'>
            <header className='align_center products_list_header'>
                <h2>Products</h2>
                <select
                    name='sort'
                    id=''
                    className='products_sorting'
                    onChange={(e) => setSortBy(e.target.value)}>
                    <option value=''>Relevance</option>
                    <option value='price desc'>Price HIGH to LOW</option>
                    <option value='price asc'>Price LOW to HIGH</option>
                    <option value='rate desc'>Rate HIGH to ROW</option>
                    <option value='rate asc'>Rate LOW to HIGH</option>
                </select>
            </header>

            <div className='products_list'>
                {errors && <em className='form_error'>{errors}</em>}
                {data?.products &&
                    sortedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                {isLoading &&
                    skeleton.map((n) => <ProductCardSkeleton key={n} />)}
            </div>
            {/* {data?.totalProducts && (
                <Pagination
                    totalPosts={data.totalProducts}
                    postPerPage={8}
                    onClick={handlePageChange}
                    currentPage={page}
                />
            )} */}
        </section>
    );
};

export default ProductsList;
