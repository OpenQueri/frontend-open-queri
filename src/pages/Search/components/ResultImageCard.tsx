import { useState, useEffect } from "react";
import { Copy, Check, ArrowShapeDownToLine, Xmark, FileCode } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

export interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  sourceLink: string;
  width?: number;
  height?: number;
  fileSize?: string;
}

// 1. БАТЬКІВСЬКИЙ КОМПОНЕНТ ГАЛЕРЕЇ
export const ImageGallery = ({ images }: { images: ImageItem[] }) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  return (
    <div className="flex w-full gap-4 items-start relative p-4 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      
      {/* ЛІВА ЧАСТИНА: Сітка зображень */}
      <div className="flex-1 flex flex-col gap-6">
        <div 
          className={`grid gap-4 transition-all duration-300
            grid-cols-1 sm:grid-cols-2 
            ${selectedImage ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}`}
        >
          {visibleImages.map((img) => (
            <ImageCard
              key={img.id}
              data={img}
              isSelected={selectedImage?.id === img.id}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        {/* Кнопка "Завантажити ще" */}
        {hasMore && (
          <div className="flex justify-center py-10">
            <Button 
              variant="flat" 
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-8 font-semibold"
            >
              Завантажити ще
            </Button>
          </div>
        )}
      </div>

      {/* ПРАВА ЧАСТИНА: Бічна панель */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ x: "100%", opacity: 0, width: 0 }}
            animate={{ x: 0, opacity: 1, width: "auto" }}
            exit={{ x: "100%", opacity: 0, width: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="sticky top-4 hidden md:flex shrink-0 w-[400px] xl:w-[480px] h-[calc(100vh-2rem)] flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-10"
          >
            <SidebarContent 
              data={selectedImage} 
              onClose={() => setSelectedImage(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Мобільна модалка */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col"
          >
             <SidebarContent 
              data={selectedImage} 
              onClose={() => setSelectedImage(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



const ImageCard = ({ data, isSelected, onClick }: { data: ImageItem, isSelected: boolean, onClick: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Безпечне отримання домену
  const domain = (() => {
    try { return new URL(data.sourceLink).hostname; } 
    catch { return "unknown"; }
  })();

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col rounded-xl p-2.5 cursor-pointer transition-all duration-300 border
        ${isSelected 
          ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-400 shadow-md ring-2 ring-primary/50' 
          : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
    >
      {/* Контейнер зображення з фіксованим aspect-ratio */}
      <div className="relative w-full aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
        
        {/* Скелетон, поки вантажиться */}
        {!isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <FileCode className="size-8 text-zinc-400 dark:text-zinc-600" />
          </div>
        )}

        {/* Стан помилки */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400">
            <WarningCircle className="size-8 mb-2" />
            <span className="text-[10px]">Помилка</span>
          </div>
        )}

        {/* Зображення */}
        <img
          src={data.imageUrl}
          alt={data.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Футер картки */}
      <div className="mt-3 flex items-center gap-2 overflow-hidden">
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          className="w-4 h-4 rounded-full shrink-0"
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <span className="text-[11px] text-zinc-500 truncate">{domain}</span>
      </div>
      
      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate mt-1">
        {data.title}
      </h4>
    </div>
  );
};

// 3. КОМПОНЕНТ БІЧНОЇ ПАНЕЛІ
const SidebarContent = ({ data, onClose }: { data: ImageItem, onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const domain = new URL(data.sourceLink).hostname;

  // Попереднє "прогрівання" кешу браузера для миттєвого відкриття
  useEffect(() => {
    const img = new Image();
    img.src = data.imageUrl;
  }, [data.imageUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(data.imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = data.title.replace(/[^a-z0-9а-яієїґ]/gi, '_').toLowerCase() + "." + (data.imageUrl.split('.').pop()?.split('?')[0] || "jpg");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(data.imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Хедер панелі */}
      <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} className="w-4 h-4 rounded-full" alt="" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">{domain}</span>
        </div>
        <Button isIconOnly radius="full" variant="light" className="text-zinc-500" onClick={onClose}>
          <Xmark className="size-5" />
        </Button>
      </div>

      {/* Скролл-контент панелі */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="w-full bg-zinc-100 dark:bg-zinc-950/50 rounded-xl p-2 flex items-center justify-center border border-zinc-200 dark:border-white/5 min-h-[240px]">
          <img src={data.imageUrl} alt={data.title} decoding="async" className="max-w-full max-h-[40vh] object-contain rounded-md shadow-sm" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug hover:underline cursor-pointer">
            <a href={data.sourceLink} target="_blank" rel="noreferrer">{data.title}</a>
          </h3>
          <p className="text-[12px] text-zinc-500">Зображення може бути захищене авторським правом.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a href={data.sourceLink} target="_blank" rel="noreferrer" className="w-full">
            <Button color="primary" radius="full" className="w-full text-xs font-bold h-10 shadow-md shadow-primary/20">Перейти</Button>
          </a>
          <Button radius="full" variant="flat" isLoading={isDownloading} className="text-xs font-semibold h-10 bg-zinc-200/60 dark:bg-zinc-800" onClick={handleDownload}>
            {!isDownloading && <ArrowShapeDownToLine className="size-4 mr-1" />}
            {isDownloading ? "Завантаження..." : "Зберегти"}
          </Button>
          <Button radius="full" variant="flat" className="text-xs font-semibold h-10 bg-zinc-200/60 dark:bg-zinc-800" onClick={handleCopyLink}>
            {copied ? <><Check className="size-4 mr-1 text-green-500" />Копія</> : <><Copy className="size-4 mr-1" />Посилання</>}
          </Button>
        </div>

        <hr className="border-zinc-200 dark:border-white/5" />

      </div>
    </>
  );
};