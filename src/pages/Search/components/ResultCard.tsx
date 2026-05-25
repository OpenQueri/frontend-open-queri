import { useState, useCallback } from "react";
import { Copy, Check } from "@gravity-ui/icons";
import { Button, Tooltip } from "@heroui/react";

interface ResponseProps {
  title: string;
  link: string;
  index: number;
}

export const ResultCard = ({ title, link, index }: ResponseProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Помилка при копіюванні: ", err);
    }
  }, [link]);

  return (
    <div
      className="group relative w-full max-w-5xl 
                 p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] 
                 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl 
                 border border-zinc-200 dark:border-white/10 
                 shadow-sm hover:shadow-md dark:shadow-none
                 transition-all duration-300
                 hover:bg-white/90 dark:hover:bg-zinc-900/60
                 mt-4"
    >
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
        <Tooltip 
          content="Скопійовано!" 
          isOpen={copied} 
          color="success" 
          placement="top"
          showArrow
        >
          <Button
            isIconOnly
            size="sm"
            variant="flat" 
            className="rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 transition-colors"
            onPress={handleCopy}
          >
            {copied ? <Check className="text-green-500" /> : <Copy width={16} className="sm:w-[18px]" />}
          </Button>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 pr-10 sm:pr-14">
        <div className="flex items-center gap-2">
           <img 
            src={`https://www.google.com/s2/favicons?domain=${new URL(link).hostname}&sz=32`}
            className="w-4.5 h-4.5 rounded-full opacity-70"
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-md select-all">
            {link}
          </span>
        </div>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight"
        >
          {title}
        </a>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          Тут буде відображатися короткий опис сайту. Це допомагає швидко зрозуміти контент сторінки 
          перед тим, як натиснути на посилання.
        </p>
      </div>
    </div>
  );
};