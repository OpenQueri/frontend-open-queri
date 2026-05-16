import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    Button,
    Input,
    Chip,
} from "@heroui/react";
import {
  
    TrashBin,
    Globe,
    ShieldCheck,
    ArrowRightFromSquare,
    Clock,

    Plus,
    Xmark,

} from "@gravity-ui/icons";
import axios from 'axios';
import { GlassLogoProvider } from '../../components/Logo/GlassLogoScene';
import { StaticLogo } from '../../components/Logo/Logo';

type UserRole = 'admin' | 'user';

interface TrackedSite {
    id: string;
    url: string;
    status: "pending" | "crawling" | "indexed" | "error" | "review";
    submittedBy: string;
    lastUpdate: string;
    progress?: number;
}

export function WorkspacePage() {
    const [role, setRole] = useState<UserRole>('user');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [url, setUrl] = useState("");

    const [version, setVersion] = useState("...");
    const [username, setUsername] = useState("...");
    const [role_text, setRoleText] = useState("...");
    
    let cout_eror: number = 0; 

    const toggleRole = () => {
        setRole(prev => prev === 'admin' ? 'user' : 'admin');
    };

    const [sites, setSites] = useState<TrackedSite[]>([


    ]);

    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/workspace-ws");
        socket.current = ws;

        ws.onopen = () => {
            console.log("Connected ✅");
            const updateSite = {
                type: "UPDATE_SITE"
            }
            SendWS(updateSite);

        };

        ws.onmessage = (event) => {
            console.log("📩 Raw Data:", event.data);
            try {
                const data = JSON.parse(event.data);
                console.log("📦 Parsed Object:", data);

                if (data.version){
                    setVersion(data.version);
                }
                if (data.username){
                    setUsername(data.username);
                }

                if (data.role){
                    setRoleText(data.role);
                    if(data.role == "User"){
                        setRole('user');
                    }
                    if(data.role == "Admin"){
                        setRole('admin');
                    }
                }

                if (data.type){

                    if (data.type == "TrackedSite"){
                        const newSiteQuestion: TrackedSite = {
                            id: Date.now().toString(),
                            url: data.url.toString(),
                            status: data.status.toString(),
                            submittedBy: "Petux".toString(),
                            lastUpdate: data.lastUpdate.toString(),
                        };

                        setSites(prev => [newSiteQuestion, ...prev]);
                        setUrl("");
                    }   
                    if (data.type == "UPDATE_PENDING"){

                        console.log(data.type);
                        console.log(data.status);
                        console.log(data.id);

                        setSites(prev => prev.map(s => s.id === data.id ? { ...s, status: data.status as const } : s));

                    
                    }                

                }
                if (data.Error){
                    if (data.Error == "token_no_verify"){
                        console.log("token no verify");
                        localStorage.setItem("token_paseto", "false");
                        window.location.href = '/Auth';
                    }
                }





            } catch (e) {
                console.error("Parse Error:", event.data);
            }
        };

        ws.onclose = (event) => {
            console.log("Closed. Code:", event.code);
            if (event.code === 4001) {
                localStorage.setItem("token_paseto", "false");
                window.location.href = '/Auth';
            }

        };

        ws.onerror = () => {

        };

    }, []);

    const SendWS = (payload: any) => {
        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify(payload));
        } else {
            console.error("WebSocket Eror send json");
        }
    }

    const handleAddSite = () => {
    console.log("Current URL state:", url);
    if (!url.trim()) {
        console.error("URL is empty!");
        return;
    }



    if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ 
            type: "SUBMIT_NEW_URL", 
            url: url 
        }));
        console.log("Sent to WS ✅");
    } else {
        console.error("WS is not open. State:", socket.current?.readyState);
    }


    
    setUrl("");
};

    const approveSite = (id: string, url: string) => {
            const delete_url = {
                type: "UPDATE_PENDING",
                url: url,
                id: id,
            }
            SendWS(delete_url);
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground selection:bg-blue-500/20 overflow-x-hidden font-sans transition-colors duration-500">
            
            {/* Background Effects adapted to Landing Style */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[160px] opacity-50" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 brightness-100 contrast-150" />
                <div className="absolute inset-0 bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-6 py-8">

                 <div className="flex gap-3 mb-6">
                    <Button 
                        size="sm" 
                        variant="bordered"
                        onPress={toggleRole}
                        className="text-[10px] font-black uppercase tracking-widest px-4 h-9 rounded-xl border-default-200 dark:border-white/10 text-default-500 hover:text-foreground"
                    >
                        Role: {role}
                    </Button>
                </div>
                
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative w-18 h-18 rounded-2xl flex items-center justify-center dark:border-white/5 shadow-[0_0_60px_-15px_rgba(59,130,246,0.4)] dark:shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)]">
                                <GlassLogoProvider is3D={false} width={100} height={100}> 
                                    <StaticLogo size={100}/>
                                </GlassLogoProvider>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">OpenQueri</h1>
                                <Chip 
                                    size="sm"
                                    variant="dot" 
                                    color="success" 
                                    className="bg-default-100/50 backdrop-blur-md border border-default-200 text-[10px] font-black uppercase tracking-widest px-2"
                                >
                                    System Online
                                </Chip>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${role === 'admin' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                    {role === 'admin' ? "Superuser Access" : "Client Terminal"}
                                </span>
                                <span className="text-default-400 text-[10px] font-bold uppercase tracking-widest">{version}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <p className="text-[10px] font-black text-default-400 uppercase tracking-widest leading-none">Authenticated as</p>
                            <p className="text-sm font-bold text-foreground tracking-tight">{username}</p>
                        </div>
                        {/* CUSTOM DROPDOWN */}
                        <div className="relative group">
                            <button 
                                onClick={async () => { 
                                    
                                    const host = window.location.hostname;
                                    const response = await axios.get(`http://${host}:8000/delete-sesion-token`, {
                                        withCredentials: true 
                                    });
                                    
                                    if (response.data && response.data.success_token_delete) {
                                            localStorage.setItem("token_paseto", "false");
                                            window.location.href = '/Auth';
                                            console.log('Logout success');
                                        }
    
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-danger hover:bg-danger/10 transition-colors group/item rounded-2xl"
                            >
                                <div className="p-2 rounded-lg bg-danger/10 group-hover/item:bg-danger group-hover/item:text-white transition-colors rounded-2xl">
                                    <ArrowRightFromSquare size={16} />
                                </div>
                                
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="bg-default-50/50 backdrop-blur-3xl border border-default-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                    <Plus size={12} className="text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Core Command</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter mb-2">Initialize Crawl</h2>
                                <p className="text-default-400 text-xs font-medium mb-8 leading-relaxed">Введіть URL для миттєвої індексації в нейронну мережу OpenQueri.</p>
                                
                                <div className="space-y-4">
                                    <Input 
                                        variant="bordered"
                                        placeholder="https://target-domain.io" 
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        classNames={{
                                            inputWrapper: "h-14 bg-default-100/50 border-default-200 dark:border-white/10 group-data-[focus=true]:border-blue-500 rounded-2xl transition-all",
                                            input: "text-sm font-bold tracking-tight"
                                        }}
                                    />
                                    <Button 
                                        onPress={handleAddSite} 
                                        className="w-full h-16 font-black text-sm uppercase tracking-[0.2em] rounded-2xl bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
                                    >
                                        Execute Task
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-8 space-y-12">
                        
                        {role === 'admin' && (
                            <section>
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-3">
                                        <div className="w-8 h-px bg-blue-500/30" />
                                        <Clock size={14} /> Verification Queue
                                    </h3>
                                    <span className="text-[10px] font-bold text-default-400 uppercase">Awaiting pending: {sites.filter(s => s.status === 'review').length}</span>
                                </div>

                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {sites.filter(s => s.status === 'pending').map(site => (
                                            <motion.div 
                                                key={site.id} 
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                                className="group relative flex items-center justify-between p-6 bg-default-50/50 backdrop-blur-3xl border border-default-200 dark:border-white/5 hover:border-blue-500/30 rounded-[2rem] transition-all"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-default-100 dark:bg-black rounded-2xl flex items-center justify-center border border-default-200 dark:border-zinc-800 group-hover:border-blue-500/20 transition-colors">
                                                        <Globe size={20} className="text-default-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black tracking-tight mb-1">{site.url}</p>
                                                        <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">Requested by {site.submittedBy}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button 
                                                        variant="flat" 
                                                        onPress={() => approveSite(site.id, site.url)} 
                                                        className="bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    >
                                                        APPROVE
                                                    </Button>
                                                    <Button 
                                                        variant="flat"
                                                        onClick={() => setSites(prev => prev.filter(s => s.id !== site.id))} 
                                                        className="bg-default-100 dark:bg-zinc-800 text-[10px] font-black rounded-xl text-default-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                    >
                                                        <Xmark size={14} />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </section>
                        )}

                        <section>
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-default-400 flex items-center gap-3">
                                    <div className="w-8 h-px bg-default-200 dark:bg-zinc-800" />
                                    <ShieldCheck size={14} /> Active Neural Index
                                </h3>
                            </div>

                            <Card className="bg-default-50/30 dark:bg-zinc-950/40 border border-default-200 dark:border-zinc-900 rounded-[2.5rem] p-2 overflow-hidden shadow-sm">
                                <div className="divide-y divide-default-200 dark:divide-zinc-900/50">
                                    {sites.filter(s => s.status !== 'review').map((site) => (
                                        <div key={site.id} className="group flex justify-between items-center p-6 hover:bg-default-100/50 dark:hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`relative w-2.5 h-2.5 rounded-full ${site.status === 'crawling' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                                    {site.status === 'crawling' && <div className="absolute inset-0 bg-blue-500 animate-ping rounded-full opacity-40" />}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-foreground tracking-tight block">{site.url}</span>
                                                    <span className="text-[10px] text-default-400 font-medium uppercase tracking-tighter">Verified Node Protocol</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-[10px] font-black text-default-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                                    <p className={`text-[11px] font-black uppercase ${site.status === 'indexed' ? 'text-green-500' : 'text-blue-500'}`}>{site.status}</p>
                                                </div>
                                                <button
                                                    onClick={async () => { 
                                                        const delete_url = {
                                                            type: "DELETE_URL",
                                                            url: site.url,
                                                        }
                                                        SendWS(delete_url);
                                                    }}
                                                 className="p-2 text-default-300 hover:text-red-500 transition-colors">
                                                    <TrashBin size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>
                    </div>
                </div>

                <footer className="mt-20 pt-10 border-t border-default-200 dark:border-zinc-900 flex flex-col items-center gap-4">
                     <p className="text-default-400 text-[10px] uppercase tracking-[0.6em] font-medium">
                        © 2026 OpenQueri Terminal • Encrypted Session
                    </p>
                </footer>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}} />
        </div>
    );
}