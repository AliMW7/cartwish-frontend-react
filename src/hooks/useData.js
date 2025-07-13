import React, { useState, useEffect } from "react";
import apiClient from "../utils/api-client";
import { useSearchParams } from "react-router-dom";

const useData = (endpoint, customConfig, deps) => {
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(
        () => {
            setIsLoading(true);
            apiClient
                .get(endpoint, customConfig)
                .then((res) => {
                    if (
                        endpoint === "/products" &&
                        data &&
                        data.products &&
                        customConfig.params.page !== 1
                    ) {
                        setData((prev) => ({
                            ...prev,
                            products: [...prev.products, ...res.data.products],
                        }));
                    } else {
                        setData(res.data);
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    setErrors(err.message);
                    setIsLoading(false);
                });
        },
        deps ? deps : []
    );
    return { data, errors, isLoading };
};

export default useData;
