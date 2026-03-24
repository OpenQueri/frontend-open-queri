import React from 'react';

interface CardProps {
  name: string;
  url: string;
  description?: string;
}

export const CardFoundComponent: React.FC<CardProps> = ({ name, url, description }) => {
  return (
    <div className="flex flex-col mb-6 max-w-[650px] font-sans">
      <div className="flex items-center text-sm text-[#ffffff] mb-1 truncate">
        <span className="bg-gray-100 p-1.5 rounded-full mr-2">
           
           <div className="w-4 h-4 bg-amber-400 rounded-sm flex items-center justify-center text-[10px] text-white">
             {name[0]}
           </div>
        </span>
        <cite className="not-italic text-sm">{url}</cite>
      </div>

      <a 
        href={url} 
        rel="noreferrer"
        className="text-xl text-[#1a0dab] hover:underline decoration-1 mb-1 block text-left"
      >
        <h3 className="inline-block">{name}</h3>
      </a>

      <div className="text-sm text-[#ffffff] leading-relaxed text-left">
        {description || `Результати пошуку для ${name}. Натисніть, щоб перейти на офіційний сайт  ${url} і дізнатися більше.`}
      </div>
    </div>
  );
};

export default CardFoundComponent;
