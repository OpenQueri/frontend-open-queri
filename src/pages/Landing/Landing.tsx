import { Button } from "@heroui/react";
import { LogoGithub, ArrowRight, Cpu, Code, ShieldCheck, ChevronsUpWide, StarFill } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import { SearchSimulation } from "./components/SearchSimulation";

import { GlassLogoProvider } from '../../components/Logo/GlassLogoScene';
import { StaticLogo } from '../../components/Logo/Logo';

export default function Landing() {
  const scrollToContent = () => {
    const section = document.getElementById("features");
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const tickerWords = ["Безпека від Rust", "Відкритий код", "Приватність", "Жодних трекерів", "OpenQueri"];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 scroll-smooth overflow-x-hidden flex flex-col transition-colors duration-500">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden shrink-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/20 dark:bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <nav className="absolute top-10 z-20">
          <a href="https://github.com/OpenQueri" target="_blank" rel="noreferrer">
            <Button variant="ghost" className="bg-default-100/50 backdrop-blur-md border border-default-200 text-default-500 hover:text-foreground text-[11px] font-bold uppercase tracking-[0.2em] px-6 rounded-full">
              <LogoGithub className="size-4 mr-2" /> GitHub
            </Button>
          </a>
        </nav>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[15vw] lg:text-[10rem] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20">
            OpenQueri
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-lg mt-6 text-default-400 italic">
            Інший підхід. Енергія Rust.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12">
            <Button size="lg" color="foreground" className="font-black uppercase tracking-[0.3em] px-12 py-8 rounded-full shadow-2xl" onPress={scrollToContent}>
              Дізнатися більше <ArrowRight className="size-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: GRID FEATURES */}
      <section id="features" className="relative py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: <Cpu className="text-orange-500" />, title: "Rust Engine", desc: "Швидкість та безпека на рівні ядра." },
            { icon: <ShieldCheck className="text-green-500" />, title: "Приватність", desc: "Анонімні запити за замовчуванням." },
            { icon: <Code className="text-blue-500" />, title: "Open Source", desc: "Весь код доступний для аудиту." }
          ].map((item, i) => (
            <div key={i} className="group bg-default-50/50 backdrop-blur-3xl border border-default-100 p-10 rounded-[3rem] hover:border-default-300 transition-all">
              <div className="w-12 h-12 bg-default-100 rounded-2xl flex items-center justify-center mb-6 border border-default-200">
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{item.title}</h3>
              <p className="text-default-400 text-sm font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* BLOCK 1: 3D + CODE */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-default-50/30 p-8 md:p-16 rounded-[4rem] border border-default-100 backdrop-blur-sm mb-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -z-10" />
          
          {/* 3D Glass Logo */}
          <div className="relative flex justify-center items-center">
             <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
             <div className="relative w-full max-w-[350px] md:max-w-[450px] aspect-square">
                <GlassLogoProvider is3D={true} width="100%" height="100%"> 
                    <StaticLogo className="w-full h-full p-8" />
                </GlassLogoProvider>
             </div>
          </div>

          {/* Text + Terminal */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Cpu className="size-3 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Core Architecture</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">
              Глобальна підтримка 30+ мов. <br />
              <span className="text-default-400">Локальна безпека.</span>
            </h2>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0d1117] rounded-2xl border border-white/5 p-6 font-mono text-[11px] md:text-xs shadow-2xl">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <p className="text-blue-400 mb-2">// Static PHF Map for indexing</p>
                <pre className="text-gray-300 leading-relaxed overflow-x-auto">
                  <code>{`static LANGUAGES: phf::Map<&str, &str> = phf_map!(
    "ukr" => "ukrainian",
    "eng" => "english",
    "deu" => "german"
);`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2: TEXT + SEARCH DEMO */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center bg-default-50/30 p-8 md:p-16 rounded-[4rem] border border-default-100 backdrop-blur-sm">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Live Demo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              Швидкість, яку <br /> 
              <span className="text-default-400">можна відчути.</span>
            </h2>
            <p className="text-default-500 font-medium leading-relaxed">
              Наш рушій на базі Rust обробляє запити в реальному часі. OpenQueri миттєво індексує та верифікує джерела.
            </p>
            <div className="flex gap-8 pt-4">
              <div><p className="text-2xl font-black">0.8мс</p><p className="text-[10px] uppercase text-default-400 font-bold">Затримка</p></div>
              <div className="w-px h-10 bg-default-200" />
              <div><p className="text-2xl font-black">100%</p><p className="text-[10px] uppercase text-default-400 font-bold">Open Source</p></div>
            </div>
          </div>

          <div className="lg:col-span-3 relative rounded-[2.5rem]  p-4 shadow-inner">
             <SearchSimulation />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">Готові до прозорого пошуку?</h2>
        <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="bordered" className="font-bold border-default-200 px-8 rounded-full">Документація</Button>
            <Button size="lg" color="primary" className="font-bold px-8 rounded-full shadow-lg shadow-primary/20">Спробувати Beta</Button>
        </div>
      </section>

      {/* TICKER */}
      <div className="relative py-12 border-y border-default-100 bg-default-50/20 overflow-hidden whitespace-nowrap">
        <motion.div initial={{ x: 0 }} animate={{ x: "-50%" }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-20 items-center w-max">
          {[...tickerWords, ...tickerWords].map((word, i) => (
            <div key={i} className="flex items-center gap-20">
              <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-default-200 italic">{word}</span>
              <StarFill className="text-primary size-8 opacity-20" />
            </div>
          ))}
        </motion.div>
      </div>

      <footer className="py-12 px-6 flex flex-col items-center gap-6 border-t border-default-100">
        <div className="flex gap-8">
            <a href="#" className="text-default-400 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors">Twitter</a>
            <a href="#" className="text-default-400 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors">Discord</a>
            <a href="#" className="text-default-400 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors">GitHub</a>
        </div>
        <p className="text-default-300 text-[10px] uppercase tracking-[0.5em]">
          © 2026 OpenQueri Engine • Built with Rust
        </p>
      </footer>
    </div>
  );
}