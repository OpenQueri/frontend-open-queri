import { Button } from "@heroui/react";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Magnifier, Camera, ChevronRight, Xmark } from "@gravity-ui/icons";
import { recognizeTextFromImage } from "./recognizeTextFromImage";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Service utility to perform the search request via API.
 * Uses axios for the GET request with text as a query parameter.
 */
export const SearchSite = async (text: string, type: string = "default-search") => {
  const host = window.location.hostname; 
  try {
    const response = await axios.get(`http://${host}/api/search`, {
      params: { 
        text,
        type 
      } 
    });
    
    return response.data;
  } catch (error: any) {
    console.error('API Search Error:', error);
    if (error.response) {
      return error.response.data;
    }
    return { success: false, error: error.message };
  }
};

interface LiquidSearchProps {
  initialText?: string;
  onSearch?: (text: string, type?: string) => void; 
}

/**
 * LiquidSearch Component
 */
export const LiquidSearch = memo(({ initialText = "", onSearch }: LiquidSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(initialText);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [intensity, setIntensity] = useState(0); 
  
  const lastKeyTime = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialText);
  }, [initialText]);

  // Framer Motion spring physics
  const activeIntensity = useSpring(0, { 
    stiffness: 80, 
    damping: 15,
    mass: 0.5,
    restDelta: 0.01 
  });
  
  const glowOpacity = useTransform(activeIntensity, [0, 1], [0, 0.6]);
  const glowScale = useTransform(activeIntensity, [0, 1], [0.95, 1.05]);

  /**
   * Input Change Handler
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const now = Date.now();
    setQuery(value);

    if (lastKeyTime.current !== 0) {
      const diff = now - lastKeyTime.current;
      const boost = Math.max(0, (800 - diff) / 800);
      setIntensity((prev) => Math.min(prev + boost * 0.3, 1));
    }
    lastKeyTime.current = now;
  }, []);

  // Intensity cooldown loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIntensity((prev) => (prev > 0.01 ? prev - 0.05 : 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    activeIntensity.set(intensity);
  }, [intensity, activeIntensity]);

  /**
   * Unified Search Action Trigger
   */
  const handleAction = useCallback((textToSearch?: string, forcedType?: string) => {
    const finalQuery = textToSearch || query;
    if (finalQuery.trim() && !isProcessing) {
      setIntensity(0); 
      
      if (onSearch) {
        onSearch(finalQuery.trim(), forcedType);
      } else {
        navigate(`/Search?query=${encodeURIComponent(finalQuery.trim())}&type=default-search`);
      }
    }
  }, [query, isProcessing, onSearch, navigate]);

  return (
    <div className="relative w-full max-w-[600px] flex flex-col items-center px-4">
      <div className="relative w-full z-10">
        
        {/* Animated Glow Backdrop */}
        <motion.div
          style={{ opacity: glowOpacity, scale: glowScale, translateZ: 0 }}
          className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-[24px] blur-2xl -z-10 will-change-transform"
        />

        {/* Input Container */}
        <div className={`
          relative flex items-center p-1 sm:p-1.5 rounded-[20px] transition-all duration-500
          bg-white/70 dark:bg-zinc-900/40 border border-white/40 dark:border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.15)] transform-gpu backface-hidden
          ${isFocused ? "backdrop-blur-xl ring-1 ring-white/20 border-white/50" : "backdrop-blur-md"}
        `}>
          
          <div className="pl-2 sm:pl-3 pr-1 sm:pr-2 text-zinc-500/70">
            <Magnifier width={18} height={18} />
          </div>

          <input
            type="text"
            value={isProcessing ? "..." : query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] py-2 sm:py-2.5 px-1 text-zinc-800 dark:text-zinc-100"
            placeholder="Search..."
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5">
            {!query && !isProcessing && (
              <Button isIconOnly variant="light" onPress={() => fileInputRef.current?.click()} className="min-w-8 h-8 text-zinc-400 rounded-full transform-gpu">
                <Camera width={16} height={16} />
              </Button>
            )}
            
            {query && (
              <Button isIconOnly variant="light" onPress={() => setQuery("")} className="min-w-8 h-8 text-zinc-400 rounded-full transform-gpu">
                <Xmark width={16} height={16} />
              </Button>
            )}

            <Button 
              onPress={() => handleAction()} 
              className={`ml-1 h-8 sm:h-9 px-3 sm:px-4 rounded-[10px] text-xs sm:text-sm font-medium transition-all transform-gpu
                ${query ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "bg-zinc-200/50 text-zinc-400 dark:bg-white/5"}`}
            >
              <span className="hidden sm:inline">Search</span>
              <ChevronRight width={16} height={16} className="sm:ml-1" />
            </Button>
          </div>
        </div>

        {/* Hidden File Input for OCR functionality */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setIsProcessing(true);
              try {
                const text = await recognizeTextFromImage(file);
                setQuery(text);
                handleAction(text, "default-search"); 
              } catch (err) {
                console.error("OCR recognition error:", err);
              } finally {
                setIsProcessing(false);
              }
            }
          }} 
          accept="image/*" 
        />
      </div>
    </div>
  );
});