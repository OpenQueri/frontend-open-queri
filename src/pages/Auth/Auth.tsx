import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    Button,
    Input,
    Checkbox,
    TextField,
    Label,
} from "@heroui/react";

import {
    Lock,
    Envelope,
    Eye,
    EyeSlash,
    ArrowRight,
} from "@gravity-ui/icons";

import { GlassLogoProvider } from "../../components/Logo/GlassLogoScene";
import { StaticLogo } from "../../components/Logo/Logo";

// ====================== CUSTOM PREMIUM TERMS MODAL ======================
function TermsModal({
    isOpen,
    onClose,
    onAccept,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const element = scrollRef.current;
        if (!element) return;
        const progress = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    useEffect(() => {
        if (isOpen) {
            setScrollProgress(0);
            setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "instant" }), 10);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-[520px] bg-default-50 dark:bg-default-950 border border-default-300 dark:border-default-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="relative px-8 pt-8 pb-5 border-b border-default-200 dark:border-default-800">
                                <button onClick={onClose} className="absolute top-6 right-6 text-default-400 hover:text-foreground">✕</button>
                                <h2 className="text-2xl font-black tracking-tighter">Умови використання</h2>
                                <p className="text-default-400 mt-1.5">та Політика конфіденційності</p>
                            </div>

                            <div className="h-1.5 bg-default-200 dark:bg-default-800 relative">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                                    animate={{ width: `${scrollProgress}%` }}
                                />
                            </div>

                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="max-h-[520px] overflow-auto p-8 text-[15px] leading-relaxed custom-scrollbar"
                            >
                                <div className="prose dark:prose-invert">
                                    <p className="mb-6 text-base">Ласкаво просимо до OpenQueri...</p>
                                    {/* Текст умов */}
                                    {Array.from({ length: 18 }).map((_, i) => (
                                        <p key={i} className="mt-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t flex gap-3">
                                <Button variant="tertiary" onClick={onClose} className="flex-1 h-12">Скасувати</Button>
                                <Button onClick={onAccept} isDisabled={scrollProgress < 98} className="flex-1 h-12 font-bold">
                                    {scrollProgress > 98 ? "Я приймаю умови" : "Прокрутіть до кінця"}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ====================== MAIN AUTH PAGE ======================
export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Валідація
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) newErrors.email = "Введіть email";
        else if (!email.includes("@")) newErrors.email = "Невірний формат email";

        if (!isLogin) {
            if (!username) newErrors.username = "Введіть ім'я користувача";
            if (!password) newErrors.password = "Введіть пароль";
            if (password !== confirmPassword) newErrors.confirmPassword = "Паролі не співпадають";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            alert(isLogin ? "Вхід успішний!" : "Реєстрація успішна!");
        }
    };

    const handleCheckboxClick = () => {
        if (!termsAccepted) setShowTerms(true);
        else setTermsAccepted(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
    
        {/* Адаптивный фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Базовый слой: в темной теме почти черный, в светлой — молочно-белый */}
            <div className="absolute inset-0 bg-white dark:bg-zinc-950 transition-colors duration-500" />
            
            {/* Слой с мягким движущимся свечением */}
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 20%, var(--bg-spotlight) 0%, transparent 40%)",
                        "radial-gradient(circle at 80% 80%, var(--bg-spotlight) 0%, transparent 40%)",
                        "radial-gradient(circle at 20% 80%, var(--bg-spotlight) 0%, transparent 40%)",
                    ],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-40 dark:opacity-20"
                style={{
                    // Магия здесь: переменная подстраивается под тему
                    '--bg-spotlight': 'rgba(120, 119, 198, 0.3)' 
                } as any}
            />
            
            {/* Тонкая сетка для текстуры (опционально, но добавляет "дороговизны") */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
        </div>
    


            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
                {/* Ліва частина з Logo */}
                <div className="hidden lg:flex flex-col justify-center items-center relative">
                    <div className="relative w-full max-w-[420px]">
                        <div className="absolute -inset-20 bg-blue-600/10 dark:bg-blue-600/5 rounded-[6rem] blur-3xl" />
                        <GlassLogoProvider is3D={false} width="100%" height="100%">
                            <StaticLogo className="w-full h-full drop-shadow-2xl" />
                        </GlassLogoProvider>
                        <div className="mt-10 text-center">
                            <h2 className="text-5xl font-black tracking-tighter ">OpenQueri</h2>
                            <p className="text-5xl font-black tracking-tighter text-xl">Інший підхід. Енергія Rust.</p>
                        </div>
                    </div>
                </div>

                {/* Права частина - Форма */}
                <Card className="bg-default-50/80 dark:bg-default-50/30 backdrop-blur-3xl border border-default-200 p-10 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-[480px] mx-auto">
                    {/* Tabs */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex bg-default-100 p-1 rounded-full">
                            <div onClick={() => setIsLogin(true)} className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${isLogin ? "bg-foreground text-background" : "text-default-500"}`}>Увійти</div>
                            <div onClick={() => setIsLogin(false)} className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${!isLogin ? "bg-foreground text-background" : "text-default-500"}`}>Реєстрація</div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-4xl font-black tracking-tighter text-center mb-2">
                                {isLogin ? "З поверненням" : "Створити акаунт"}
                            </h1>
                            <p className="text-default-400 text-center mb-10">
                                {isLogin ? "Увійдіть, щоб продовжити пошук" : "Приєднуйтесь до спільноти OpenQueri"}
                            </p>

                            <div className="space-y-6">
                                <TextField>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </TextField>

                                {!isLogin && (
                                    <TextField>
                                        <Label>Ім'я користувача</Label>
                                        <Input
                                            type="text"
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                        />
                                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                    </TextField>
                                )}

                                <TextField>
                                    <Label>Пароль</Label>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                        endContent={
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-3">
                                                {showPassword ? <EyeSlash /> : <Eye />}
                                            </button>
                                        }
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </TextField>

                                {!isLogin && (
                                    <TextField>
                                        <Label>Підтвердіть пароль</Label>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            classNames={{ inputWrapper: "h-14 rounded-2xl" }}
                                            endContent={
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-3">
                                                    {showConfirmPassword ? <EyeSlash /> : <Eye />}
                                                </button>
                                            }
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                    </TextField>
                                )}

                                {!isLogin && (
                                    <div className="flex items-start gap-3 pt-2">
                                        <Checkbox isSelected={termsAccepted} onChange={handleCheckboxClick} />
                                        <p className="text-sm text-default-500 leading-tight cursor-pointer" onClick={handleCheckboxClick}>
                                            Я погоджуюсь з{" "}
                                            <span className="text-blue-500 hover:underline">Умовами використання</span> та{" "}
                                            <span className="text-blue-500 hover:underline">Політикою конфіденційності</span>
                                        </p>
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full h-14 rounded-2xl font-black text-base mt-4"
                                    isDisabled={!isLogin && !termsAccepted}
                                    onPress={handleSubmit}
                                >
                                    {isLogin ? "Увійти" : "Створити акаунт"} <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </Card>
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={() => {
                    setTermsAccepted(true);
                    setShowTerms(false);
                }}
            />
        </div>
    );
}