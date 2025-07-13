import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import "./Navbar.css";
import LinkWithIcon from "./LinkWithIcon";
import UserContext from "./../../context/UserContext";
import CartContext from "../../context/CartContext";
import { getSuggestionAPI } from "../../services/productServices";

const Navbar = () => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestion] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);

    const navigate = useNavigate();

    const user = useContext(UserContext);
    const { cart } = useContext(CartContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (search.trim() !== "") {
            navigate(`/products?search=${search.trim()}`);
        }

        setSuggestion([]);
    };

    const handleKeyDown = (e) => {
        if (selectedItem < suggestions.length) {
            if (e.key === "ArrowDown") {
                setSelectedItem((current) =>
                    current === suggestions.length - 1 ? 0 : current + 1
                );
            } else if (e.key === "ArrowUp") {
                setSelectedItem((current) =>
                    current === 0 ? suggestions.length - 1 : current - 1
                );
            } else if (e.key === "Enter" && selectedItem > -1) {
                const suggestion = suggestions[selectedItem];
                navigate(`/products?search=${suggestion.title}`);
                setSearch("");
                setSuggestion([]);
            }
        } else {
            setSelectedItem(-1);
        }
    };

    useEffect(() => {
        const delaySuggestion = setTimeout(() => {
            if (search.trim() !== "") {
                getSuggestionAPI(search)
                    .then((res) => {
                        setSuggestion(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                setSuggestion([]);
            }
        }, 300);
        return () => clearTimeout(delaySuggestion);
    }, [search]);

    return (
        <nav className='navbar align_center'>
            <div className='align_center'>
                <h1 className='navbar_heading'>CartWish</h1>
                <form
                    action=''
                    className='align_center navbar_form'
                    onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='navbar_search'
                        placeholder='Search Products'
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        value={search}
                    />
                    <button type='submit' className='search_button'>
                        Search
                    </button>

                    {suggestions.length > 0 && (
                        <ul className='search_result'>
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={suggestion._id}
                                    className={
                                        selectedItem === index
                                            ? "search_suggestion_link active"
                                            : "search_suggestion_link"
                                    }>
                                    <Link
                                        onClick={() => {
                                            setSearch("");
                                            setSuggestion([]);
                                        }}
                                        to={`/products?search=${suggestion.title}`}>
                                        {suggestion.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            </div>
            <div className='align_center navbar_links'>
                <LinkWithIcon title='Home' link='/' icon='none' />
                <LinkWithIcon title='Products' link='/products' icon='none' />
                {!user && (
                    <>
                        <LinkWithIcon title='LogIn' link='/login' icon='none' />
                        <LinkWithIcon
                            title='SignUp'
                            link='/signup'
                            icon='none'
                        />
                    </>
                )}
                {user && (
                    <>
                        <LinkWithIcon
                            title='My Orders'
                            link='/myorders'
                            icon='none'
                        />
                        <LinkWithIcon
                            title='Logout'
                            link='/logout'
                            icon='none'
                        />

                        <NavLink to='/cart' className='align_center'>
                            Cart{" "}
                            <p className='align_center cart_counts'>
                                {cart.length}
                            </p>
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
