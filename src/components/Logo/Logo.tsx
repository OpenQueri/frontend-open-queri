import * as React from 'react';
import "./Logo.css";


export const Logo = () => {
    return(
        <div className='flex items-start justify-start w-12 m-3'>
            <img 
                src="/media/logo/SmallSize/image_300x300.png" 
                className="w-full h-auto transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                alt="logo"
            />
        </div>

    )
}