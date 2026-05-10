import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    Button,
    Input,
    Checkbox,
    TextField,
    Label,
    CloseButton,
    Spinner,
    Alert,
} from "@heroui/react";

import {
    Lock,
    Envelope,
    Eye,
    EyeSlash,
    ArrowRight,
} from "@gravity-ui/icons";
import axios from 'axios';

export const authService = {
  register: async (userData: any) => {
    const host = window.location.hostname;
    try {
      const response = await axios.post(`http://${host}:8000/register`, userData);
      

      if (response.data && response.data.success === false) {
         return { success: false, error: response.data.message || "Помилка реєстрації" };
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Axios Error Object:", error.response?.data);
      
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || "Помилка сервера" 
      };
    }
  },

login: async (credentials: any) => {
    const host = window.location.hostname;
    try {
        const response = await axios.post(`http://${host}:8000/login`, credentials);
        
        const backendData = response.data;

        if (backendData.success === false) {
            return { success: false, error: backendData.data };
        }

        return { success: true, data: backendData };

    } catch (error: any) {
        return { 
            success: false, 
            error: error.response?.data?.data || "Помилка сервера" 
        };
    }
}
};

import { GlassLogoProvider } from "../../components/Logo/GlassLogoScene";
import { StaticLogo } from "../../components/Logo/Logo";
import { TermsModal } from "./TermsModal";

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
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{status: "success" | "danger", title: string} | null>(null);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) newErrors.email = "Введіть email";
        else if (!email.includes("@")) newErrors.email = "Невірний формат email";

        if (!isLogin) {
            if (!username) newErrors.username = "Введіть ім'я користувача";
            if (!password) newErrors.password = "Введіть пароль";
            if (password !== confirmPassword) newErrors.confirmPassword = "Паролі не співпадають";
        }

        if (isLogin) {
            if (!password) newErrors.password = "Введіть пароль";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = { email, username, password };
    setIsLoading(true); 

    try {
       

        const result = isLogin 
            ? await authService.login({ email, password })
            : await authService.register(payload);

        console.log(result);


        if (result && result.success === true) {
            setAlert({ 
                status: "success", 
                title: isLogin ? "Вхід виконано!" : "Реєстрація успішна!" 
            });
            
            if (!isLogin) {
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setIsLogin(true);
            }
        } else {
            setAlert({ 
                status: "danger", 
                title: result?.error || "Невідома помилка сервера" 
            });
            if (isLogin) setErrors({ server: result?.error });
        }
    } catch (e) {
        console.error("Критична помилка запиту:", e);
        setAlert({ status: "danger", title: "Сервер ліг або CORS заблокував" });
    } finally {
        setIsLoading(false);
        setTimeout(() => setAlert(null), 4000);
    }
};

    const handleCheckboxClick = () => {
        if (!termsAccepted) setShowTerms(true);
        else setTermsAccepted(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

            <AnimatePresence>
                {alert && (
                    <motion.div 
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="fixed top-10 left-1/2 z-[100] w-full max-w-[400px] px-4"
                    >
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
                        alert.status === "success" 
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    }`}>                       
                        <div className="flex-1">
                        <p className="font-bold text-sm uppercase tracking-wider opacity-70">
                            {alert.status === "success" ? "Успіх" : "Помилка"}
                        </p>
                        <p className="font-medium">
                            {alert.title}
                        </p>
                        </div>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-white dark:bg-zinc-950 transition-colors duration-500" />
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
                        '--bg-spotlight': 'rgba(120, 119, 198, 0.3)' 
                    } as any}
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
                <div className="hidden lg:flex flex-col justify-center items-center relative">
                    <div className="relative w-full max-w-[420px]">
                        <div className="absolute -inset-20 bg-blue-600/10 dark:bg-blue-600/5 rounded-[6rem] blur-3xl" />
                        <GlassLogoProvider is3D={false} width="100%" height="100%">
                            <StaticLogo className="w-full h-full drop-shadow-2xl" />
                        </GlassLogoProvider>
                        <div className="mt-10 text-center">
                            <h2 className="text-5xl font-black tracking-tighter text-foreground">OpenQueri</h2>
                            <p className="text-foreground/60 mt-3 text-xl font-medium tracking-tight">Інший підхід. Енергія Rust.</p>
                        </div>
                    </div>
                </div>

                <Card className="bg-default-50/80 dark:bg-default-50/30 backdrop-blur-3xl border border-default-200 p-10 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-[480px] mx-auto">
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
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-3 text-default-400 hover:text-foreground transition-colors">
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
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-3 text-default-400 hover:text-foreground transition-colors">
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