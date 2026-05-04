import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import { motion, useDragControls, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Button, Tooltip } from "@heroui/react";
import { 
  Moon, Sun, House, Person, Magnifier, ChartColumn,
  Grip, Xmark, Layers 
} from "@gravity-ui/icons";

const NAVIGATION_CONFIG = [
  { id: 'home',    label: 'Landing',    path: '/Landing',  icon: <House className="size-6" /> },
  { id: 'search',  label: 'Home',       path: '/',         icon: <Magnifier className="size-6" /> },
  { id: 'profile', label: 'About Us',   path: '/about',    icon: <Person className="size-6" /> },
  { id: 'stats',   label: 'Statistics', path: '/stats',    icon: <ChartColumn className="size-6" /> },
];

const IDLE_TIMEOUT = 5000;

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null); 
  const dragControls = useDragControls();
  
  const isDragging = useRef(false);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. БАЗОВАЯ ОРИЕНТАЦИЯ: Горизонтально по умолчанию
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("nav-v4-is-vertical");
    return saved !== null ? JSON.parse(saved) : false; 
  });

  // 2. БАЗОВАЯ ПОЗИЦИЯ: Центр-Низ при первом запуске
  const getInitialPos = () => {
    const saved = localStorage.getItem("nav-v4-offset");
    if (saved) return JSON.parse(saved);
    
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    return { x: winW / 2 - 150, y: winH - 90 }; 
  };

  const initialPos = getInitialPos();
  const mX = useMotionValue(initialPos.x);
  const mY = useMotionValue(initialPos.y);
  const [isReady, setIsReady] = useState(false);

  const [visibleItems, setVisibleItems] = useState(() => {
    const saved = localStorage.getItem("nav-v4-modules");
    return saved ? JSON.parse(saved) : { home: true, search: true, profile: true, stats: true };
  });

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isConfigOpen) return;
    idleTimerRef.current = setTimeout(() => setIsCollapsed(true), IDLE_TIMEOUT);
  }, [isConfigOpen]);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer, location.pathname]);

  // Функция для идеального выравнивания (вызывается при смене ориентации)
  const applyPerfectPosition = (vertical: boolean, immediate = false) => {
    if (navRef.current) {
      const navW = navRef.current.offsetWidth;
      const navH = navRef.current.offsetHeight;
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      let targetX, targetY;
      if (vertical) {
        targetX = winW - navW - 10;
        targetY = (winH - navH) / 2;
      } else {
        targetX = (winW - navW) / 2;
        targetY = winH - navH - 10;
      }

      if (immediate) {
        mX.set(targetX);
        mY.set(targetY);
      } else {
        animate(mX, targetX, { type: "spring", damping: 25, stiffness: 200 });
        animate(mY, targetY, { type: "spring", damping: 25, stiffness: 200 });
      }
      localStorage.setItem("nav-v4-offset", JSON.stringify({ x: targetX, y: targetY }));
    }
  };

  useEffect(() => {
    setIsReady(true);
    // Если в сторадже пусто, фиксируем позицию центр-низ как "стартовую"
    if (!localStorage.getItem("nav-v4-offset")) {
      setTimeout(() => applyPerfectPosition(isVertical, true), 30);
    }
  }, []);

  const handleOrientationChange = (vertical: boolean) => {
    setIsVertical(vertical);
    localStorage.setItem("nav-v4-is-vertical", JSON.stringify(vertical));
    // Ждем микротик, чтобы DOM обновил размеры перед расчетом центра
    setTimeout(() => applyPerfectPosition(vertical), 50);
  };

  if (!isReady) return null;

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9998]" />

      <motion.div
        ref={navRef}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        style={{ x: mX, y: mY }}
        onDragEnd={() => {
          localStorage.setItem("nav-v4-offset", JSON.stringify({ x: mX.get(), y: mY.get() }));
        }}
        onMouseEnter={() => {
          setIsCollapsed(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        }}
        onMouseLeave={resetIdleTimer}
        
        animate={{ 
          flexDirection: isVertical ? "column" : "row",
          width: isCollapsed ? "64px" : "auto",
          height: isCollapsed ? "64px" : "auto",
          borderRadius: isCollapsed ? "100px" : "3rem",
        }}
        initial={false} // Важно: предотвращает анимацию из 0,0 при маунте
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className="fixed top-0 left-0 pointer-events-auto flex items-center gap-2 p-3 bg-zinc-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl z-[9999] touch-none overflow-hidden"
      >
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          
          className="text-white/20 p-2 cursor-grab active:cursor-grabbing hover:text-white/50 transition-colors flex-shrink-0"
        >
          <Grip className="size-6" />
        </div>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="nav-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex ${isVertical ? "flex-col" : "flex-row"} gap-2 items-center`}
            >
              <div className={`flex ${isVertical ? "flex-col" : "flex-row"} gap-2`}>
                {NAVIGATION_CONFIG.map((item) => {
                  if (!visibleItems[item.id as keyof typeof visibleItems]) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <Tooltip key={item.id} content={item.label} placement={isVertical ? "left" : "top"}>
                      <Link to={item.path} className="relative">
                        <Button isIconOnly variant="ghost" size="lg" className={`border-none min-w-12 h-12 ${isActive ? "text-white bg-white/10" : "text-white/60"}`}>
                          {item.icon}
                        </Button>
                        {isActive && (
                          <motion.div 
                            layoutId="active-pill" 
                            className="absolute inset-0 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                          />
                        )}
                      </Link>
                    </Tooltip>
                  );
                })}
              </div>

              <div className={`${isVertical ? "h-px w-8" : "w-px h-8"} bg-white/10 my-1`} />

              <div className={`flex ${isVertical ? "flex-col" : "flex-row"} gap-2`}>
                <Button isIconOnly variant="ghost" size="lg" className="border-none text-white/60 min-w-12 h-12" onPress={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Moon className="size-6"/> : <Sun className="size-6"/>}
                </Button>
                <Button isIconOnly variant="ghost" size="lg" className={`border-none min-w-12 h-12 ${isConfigOpen ? "text-white bg-white/10" : "text-white/40"}`} onPress={() => setIsConfigOpen(true)}>
                  <Layers className="size-6"/>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* PORTAL CONFIGURATION */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isConfigOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
                onClick={() => setIsConfigOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pointer-events-auto relative w-[320px] bg-zinc-900 border border-white/10 p-8 rounded-[3rem] text-white shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-black uppercase text-white/30 tracking-[0.2em]">Configuration</span>
                  <button onClick={() => setIsConfigOpen(false)} className="text-white/20 hover:text-white transition-colors"><Xmark className="size-6"/></button>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-white/20 mb-4 uppercase tracking-wider">Orientation</p>
                    <div className="grid grid-cols-2 gap-3 p-1 bg-black/30 rounded-2xl border border-white/5">
                      <Button fullWidth size="md" variant={!isVertical ? "secondary" : "ghost"} onPress={() => handleOrientationChange(false)}> Horizontal </Button>
                      <Button fullWidth size="md" variant={isVertical ? "secondary" : "ghost"} onPress={() => handleOrientationChange(true)}> Vertical </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/20 mb-4 uppercase tracking-wider">Navigation Modules</p>
                    <div className="flex flex-col gap-3">
                      {NAVIGATION_CONFIG.map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => {
                            const newVisible = {...visibleItems, [item.id]: !visibleItems[item.id as keyof typeof visibleItems]};
                            setVisibleItems(newVisible);
                            localStorage.setItem("nav-v4-modules", JSON.stringify(newVisible));
                            setTimeout(() => applyPerfectPosition(isVertical), 50);
                          }}
                          className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${visibleItems[item.id as keyof typeof visibleItems] ? "bg-white/5 border-white/10" : "opacity-30 border-white/5"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-white/40">{item.icon}</span>
                            <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${visibleItems[item.id as keyof typeof visibleItems] ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : "bg-white/10"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};