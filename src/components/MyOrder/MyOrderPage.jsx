import React from "react";

import "./MyOrderPage.css";
import Table from "../Common/Table";
import useData from "./../../hooks/useData";
import Loader from "../Common/Loader";

const MyOrderPage = () => {
    const { data: orders, error, isLoading } = useData("/order");

    const getProductString = (products) => {
        let productsName = "";
        products.forEach((element) => {
            productsName +=
                element.product.title + " : " + element.quantity + " | ";
        });
        return productsName.slice(0, -2);
    };

    return (
        <section className='align_center myorder_page'>
            {isLoading && <Loader />}
            {error && <em className='form-error'>{error}</em>}
            {orders && (
                <Table headings={["Order", "Products", "Total", "Status"]}>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{getProductString(order.products)}</td>
                                <td>${order.total}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </section>
    );
};

export default MyOrderPage;
