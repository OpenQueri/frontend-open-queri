import React, { useState, useEffect } from 'react';

import "./PromoImage.css";
const images = [
  '/media/PromoPhoto/space_OQ.jpg',
  '/media/PromoPhoto/space_OQ.jpg',
];

export const PromoImage = () => {

    const [current, setCurrent] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrent((prev) => (prev + 1) % images.length);
        }, 5000); // смена каждые 5 секунд
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            
            <img className='promo-wrap' src={images[current]}/>

        </div>
    )
}