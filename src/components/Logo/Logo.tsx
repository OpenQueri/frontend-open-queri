import React from 'react';
import { LOGO_DATA } from './LogoData';

interface StaticLogoProps {
  size?: number | string;
  [key: string]: any; // Для інших props типу className, style тощо
}

export const StaticLogo: React.FC<StaticLogoProps> = ({ size = 100, ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 300 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Корпус */}
      <path
        d={LOGO_DATA.hull.d}
        fill={LOGO_DATA.hull.color} 
      />

      {/* Каюта */}
      <path
        d={LOGO_DATA.cabin.d}
        fill={LOGO_DATA.cabin.color}
      />

      {/* Щогла */}
      <path
        d={LOGO_DATA.mast.d}
        fill={LOGO_DATA.mast.color}
      />

      {/* Ліве вітрило */}
      <path
        d={LOGO_DATA.sailLeft.d}
        fill={LOGO_DATA.sailLeft.color}
      />

      {/* Праве вітрило */}
      <path
        d={LOGO_DATA.sailRight.d}
        fill={LOGO_DATA.sailRight.color}
      />
    </svg>
  );
};