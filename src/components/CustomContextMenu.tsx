import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, ArrowRotateLeft, Magnifier, Star,
  FloppyDisk, LetterAUnderline, Camera, 
  Code, Eye, Compass
} from "@gravity-ui/icons";

export const GlobalContextMenu = () => {
  const [menuData, setMenuData] = useState<{ x: number; y: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const menuWidth = 260;
      const x = e.clientX > window.innerWidth - menuWidth ? e.clientX - menuWidth : e.clientX;
      const y = e.clientY > window.innerHeight - 450 ? e.clientY - 400 : e.clientY;
      setMenuData({ x, y });
    };

    const closeMenu = () => setMenuData(null);
    window.addEventListener("contextmenu", handleGlobalContextMenu);
    window.addEventListener("click", closeMenu);
    return () => {
      window.removeEventListener("contextmenu", handleGlobalContextMenu);
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleAction = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (type) {
      case "back": navigate(-1); break;
      case "forward": navigate(1); break;
      case "reload": window.location.reload(); break;
      case "home": navigate("/"); break;
      case "selectAll": window.getSelection()?.selectAllChildren(document.body); break;
      case "save":
        const link = document.createElement("a");
        link.href = "data:text/html," + encodeURIComponent(document.documentElement.outerHTML);
        link.download = "page.html";
        link.click();
        break;
      case "print": window.print(); break;
    }
    setMenuData(null);
  };

  return (
    <AnimatePresence>
      {menuData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ top: menuData.y, left: menuData.x, position: 'fixed' }}
          className="z-[99999] min-w-[260px] p-2 rounded-[22px] 
                     bg-black/40 backdrop-blur-[35px] 
                     border border-white/[0.12] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] 
                     ring-1 ring-inset ring-white/[0.05] select-none"
        >
          {/* Навигация */}
          <div className="grid grid-cols-4 gap-1 mb-1 px-1">
            <NavIconButton icon={<ArrowLeft />} onClick={(e) => handleAction(e, "back")} />
            <NavIconButton icon={<ArrowRight />} onClick={(e) => handleAction(e, "forward")} />
            <NavIconButton icon={<ArrowRotateLeft />} onClick={(e) => handleAction(e, "reload")} />
            <NavIconButton icon={<Magnifier />} onClick={(e) => handleAction(e, "home")} />
          </div>

          <Divider />

          {/* Рабочие команды */}
          <div className="space-y-0.5">
            <MenuItem 
              icon={<FloppyDisk className="size-4" />} 
              label="Зберегти як..." 
              shortcut="Ctrl+S"
              onAction={(e) => handleAction(e, "save")} 
            />
            <MenuItem 
              icon={<LetterAUnderline className="size-4" />} 
              label="Вибрати все" 
              shortcut="Ctrl+A"
              onAction={(e) => handleAction(e, "selectAll")} 
            />
            <MenuItem 
              icon={<Camera className="size-4" />} 
              label="Знімок екрана" 
              shortcut="Win+Shift+S"
              onAction={(e) => handleAction(e, "print")} 
            />
          </div>

          <Divider />

          {/* Блок подсказок */}
          <div className="space-y-0.5">
            <MenuItem 
              icon={<Star className="size-4" />} 
              label="Додати в обране" 
              shortcut="Ctrl+D"
              isHint 
            />
            <MenuItem 
              icon={<Code className="size-4" />} 
              label="Програмний код" 
              shortcut="Ctrl+U"
              isHint 
            />
            <MenuItem 
              icon={<Eye className="size-4" />} 
              label="Консоль" 
              shortcut="F12"
              isHint
            />
            <MenuItem 
              icon={<Compass className="size-4" />} 
              label="Дослідити" 
              shortcut="Ctrl+Shift+I"
              isHint
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Divider = () => <div className="h-px bg-white/[0.08] my-1.5 mx-2" />;

const NavIconButton = ({ icon, onClick }: any) => (
  <button
    onMouseDown={onClick}
    className="flex items-center justify-center p-2.5 rounded-[12px] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all active:scale-90"
  >
    <span className="size-5">{icon}</span>
  </button>
);

const MenuItem = ({ icon, label, shortcut, onAction, isHint }: any) => (
  <div
    onMouseDown={!isHint ? onAction : undefined}
    className={`w-full flex items-center justify-between px-3 py-[10px] rounded-[12px] text-[13px] transition-all
      ${isHint ? 'opacity-[0.35] cursor-default text-white' : 'cursor-pointer text-white/90 hover:bg-white/[0.1] active:bg-white/[0.05] group'}`}
  >
    <div className="flex items-center gap-3">
      <span className={isHint ? 'text-white' : 'text-white/40 group-hover:text-white transition-colors'}>
        {icon}
      </span>
      <span className="font-medium tracking-tight">{label}</span>
    </div>
    {shortcut && (
      <span className="text-[10px] font-mono opacity-40 tracking-tighter">
        {shortcut}
      </span>
    )}
  </div>
);