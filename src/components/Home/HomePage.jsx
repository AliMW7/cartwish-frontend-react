import React from "react";

import "./HomePage.css";
import HeroSection from "./HeroSection";
import iphone from "../../assets/iphone-14-pro.webp";
import mac from "../../assets/mac-system-cut.jfif";
import FeaturedProducts from "./FeaturedProducts";

const HomePage = () => {
    return (
        <div>
            <HeroSection
                title='Buy iphone 14 Pro'
                subtitle='Experience the power of the latest iphone 14 with our most Pro camera ever'
                link='/products/686e34a49a1b374d84e8c4fd'
                image={iphone}
            />
            <FeaturedProducts />
            <HeroSection
                title='Build the ultimate setup'
                subtitle='Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque libero necessitatibus nulla in minima culpa.'
                link='/products/686e34a49a1b374d84e8c505'
                image={mac}
            />
        </div>
    );
};

export default HomePage;
