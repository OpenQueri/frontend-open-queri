import { motion } from "framer-motion";

import { LiquidSearch } from "../../components/SearchBar/SearchBar";



export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#020202] p-4 sm:p-6 overflow-hidden">
  
      <div className="flex flex-col items-center mb-8 sm:mb-12 relative z-10 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-5xl sm:text-[84px] font-semibold tracking-[-0.04em] text-white text-center select-none"
        >
          OpenQueri<span className="text-blue-500">.</span>
        </motion.h1>
      </div>

      <LiquidSearch initialText="" />

      <div className="mt-8 sm:mt-10">
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.2 }} 
          className="hidden sm:block text-white text-xs tracking-[0.2em] uppercase font-light text-center select-none"
        >
          Натисніть <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-[10px] mx-1 select-none" >Enter</kbd> щоб знайти інформацію
        </motion.p>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.4 }} 
          className="block sm:hidden text-white text-[10px] tracking-[0.1em] uppercase font-light text-center px-6 leading-relaxed select-none"
        >
          Введіть запит та натисніть на <span className="text-blue-400 select-none">стрілочку</span>
        </motion.p>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

    </main>
  );
}