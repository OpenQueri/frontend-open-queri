import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Magnifier, Thunderbolt, ShieldCheck, Globe, 
  LocationArrow, StarFill, LogoGithub, ChevronRight
} from "@gravity-ui/icons";

type AnimationStep = "typing" | "clicking" | "results" | "visiting";

const SCENARIOS = [
  {
    query: "Rust ecosystem 2026",
    siteName: "rust-lang.org",
    title: "Rust Ecosystem",
    url: "https://rust-lang.org",
    content: "Empowering everyone to build reliable and efficient software with memory safety.",
    brandIcon: <Thunderbolt className="text-orange-500 size-8" />,
    accent: "bg-orange-600"
  },
  {
    query: "Search benchmarks 2026",
    siteName: "benchmarks.io",
    title: "Performance Report",
    url: "https://benchmarks.io",
    content: "OpenQueri leads with 0.8ms latency on 1TB+ data indexes. Industry best results.",
    brandIcon: <StarFill className="text-blue-500 size-8" />,
    accent: "bg-blue-600"
  },
  {
    query: "OpenQueri source code",
    siteName: "github.com",
    title: "search-core",
    url: "https://github.com/OpenQueri",
    content: "The future of decentralized search engines is open source. Join 10k+ devs.",
    brandIcon: <LogoGithub className="dark:text-white text-zinc-900 size-8" />,
    accent: "bg-zinc-900"
  }
];

const SearchBar = ({ query, step }: { query: string; step: AnimationStep }) => (
  <div className="relative flex items-center gap-4 pb-6 mb-8 border-b dark:border-white/10 border-zinc-100">
    <div className="shrink-0">
      <Magnifier className="size-5 dark:text-white/20 text-zinc-400" />
    </div>
    
    <div className="grow text-xl md:text-2xl font-medium tracking-tight dark:text-white text-zinc-800 flex items-center h-8">
      {query}
      {step === "typing" && (
        <motion.div 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }} 
          className="w-[2px] h-6 bg-blue-500 ml-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
        />
      )}
    </div>

    <div className={`p-2 rounded-xl border transition-all duration-500 ${
      step === "results" 
        ? "bg-blue-500/10 border-blue-500/40 text-blue-500" 
        : "dark:bg-white/5 bg-zinc-50 dark:border-white/10 border-zinc-100 dark:text-white/20 text-zinc-300"
    }`}>
      <LocationArrow className="size-5 rotate-45" />
    </div>
  </div>
);

const SearchResult = ({ scenario }: { scenario: typeof SCENARIOS[0] }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="group">
    <div className="p-6 dark:bg-white/5 bg-white backdrop-blur-xl rounded-[2rem] border dark:border-white/10 border-zinc-100 dark:shadow-2xl shadow-lg hover:border-blue-500/30 transition-all duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 dark:bg-white/5 bg-zinc-50 rounded-lg">
            <Globe className="size-3 dark:text-white/40 text-zinc-400" />
        </div>
        <span className="text-[10px] dark:text-white/40 text-zinc-400 font-bold uppercase tracking-[0.2em]">{scenario.siteName}</span>
      </div>
      <div className="flex justify-between items-end">
        <div className="space-y-2">
            <h3 className="text-2xl font-semibold dark:text-white text-zinc-900 tracking-tight">{scenario.title}</h3>
            <p className="dark:text-white/50 text-zinc-500 text-sm md:text-base max-w-[90%]">{scenario.content}</p>
        </div>
        <div className="p-3 dark:bg-white/5 bg-zinc-50 rounded-full dark:text-white/20 text-zinc-300 group-hover:text-blue-500 transition-all">
            <ChevronRight className="size-5" />
        </div>
      </div>
    </div>
  </motion.div>
);

const WebsiteView = ({ scenario }: { scenario: typeof SCENARIOS[0] }) => (
  <motion.div
    initial={{ opacity: 0, scale: 1.02 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="relative dark:bg-zinc-950 bg-white rounded-[3rem] overflow-hidden shadow-2xl h-[480px] md:h-[520px] flex flex-col border dark:border-white/10 border-zinc-100 w-full"
  >
    <div className="dark:bg-white/5 bg-zinc-50 p-4 flex items-center justify-between border-b dark:border-white/5 border-zinc-100">
      <div className="flex gap-2 ml-2">
        <div className="w-2.5 h-2.5 rounded-full dark:bg-white/10 bg-zinc-200" />
        <div className="w-2.5 h-2.5 rounded-full dark:bg-white/10 bg-zinc-200" />
      </div>
      <div className="dark:bg-black/40 bg-white rounded-2xl px-6 py-1.5 text-[11px] dark:text-white/50 text-zinc-400 border dark:border-white/5 border-zinc-200 flex items-center gap-2">
        <ShieldCheck className="size-3 text-emerald-500" /> {scenario.url}
      </div>
      <div className="w-10" />
    </div>

    <div className="grow flex items-center justify-center p-8">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8 p-6 dark:bg-white/5 bg-zinc-50 rounded-[2.5rem] border dark:border-white/5 border-zinc-100 inline-block">
            {scenario.brandIcon}
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold dark:text-white text-zinc-900 mb-4 tracking-tight">
            {scenario.title.split(' ')[0]}
        </h1>
        <p className="dark:text-white/40 text-zinc-500 text-lg leading-relaxed max-w-sm mx-auto">
            {scenario.content}
        </p>
    </div>
    </div>

    <div className={`${scenario.accent} p-3 flex items-center justify-center gap-3`}>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">OpenQueri Secure Connection</span>
    </div>
  </motion.div>
);

export const SearchSimulation = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState<AnimationStep>("typing");
  const [query, setQuery] = useState("");
  const current = useMemo(() => SCENARIOS[scenarioIndex], [scenarioIndex]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (step === "typing") {
      let i = 0;
      const interval = setInterval(() => {
        setQuery(current.query.slice(0, i + 1));
        i++;
        if (i === current.query.length) {
          clearInterval(interval);
          timeout = setTimeout(() => setStep("clicking"), 800);
        }
      }, 50);
      return () => clearInterval(interval);
    }

    const delays: Record<AnimationStep, number> = { typing: 0, clicking: 600, results: 2500, visiting: 3500 };
    const nextStepMap: Record<AnimationStep, AnimationStep | null> = { typing: null, clicking: "results", results: "visiting", visiting: "typing" };

    const nextStep = nextStepMap[step];
    if (nextStep) {
        timeout = setTimeout(() => {
            if (step === "visiting") {
                setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
                setQuery("");
            }
            setStep(nextStep);
        }, delays[step]);
    }
    return () => clearTimeout(timeout);
  }, [step, current]);

  return (
    <section className="relative py-20 px-6 w-full max-w-5xl mx-auto z-10">
      <div className="relative h-[480px] md:h-[520px]">
        <AnimatePresence mode="wait">
          {step !== "visiting" ? (
            <motion.div
              key="search-ui"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="dark:bg-[#0a0a0a] bg-white border dark:border-white/10 border-zinc-100 rounded-[3rem] p-8 md:p-12 dark:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] shadow-xl h-full flex flex-col w-full overflow-hidden"
            >
              <SearchBar query={query} step={step} />
              <div className="grow flex flex-col justify-start">
                {step === "results" && <SearchResult scenario={current} />}
              </div>
              <div className="mt-auto pt-8 flex justify-center">
                 <div className="px-5 py-2 rounded-full border dark:border-white/5 border-zinc-100 dark:bg-white/5 bg-zinc-50 text-[9px] font-black uppercase tracking-[0.3em] dark:text-white/20 text-zinc-400">
                    Neural Engine V4.0.2
                 </div>
              </div>
            </motion.div>
          ) : (
            <WebsiteView scenario={current} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};