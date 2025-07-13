import React from "react";
import { NavLink } from "react-router-dom";

import "./LinkWithIcon.css";

const LinkWithIcon = ({ title, link, icon, sidebar }) => {
    return (
        <NavLink
            className={sidebar ? "align_center sidebar_link" : "align_center"}
            to={link}>
            {title}
            {icon !== "none" && (
                <img className='link_emoji' src={icon} alt='' />
            )}
        </NavLink>
    );
};

export default LinkWithIcon;
