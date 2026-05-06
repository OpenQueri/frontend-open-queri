import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Card, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@heroui/react"; 
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Cpu, TrashBin, Pulse, ChartBar } from "@gravity-ui/icons";

interface Statistics {
    time: string;
    activity: number;
    timestamp: number;
    change: number;
    rps: number;
    total: number;
}

export function Stats() {
    const [history, setHistory] = useState<Statistics[]>([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [totalRequests, setTotalRequests] = useState(0);
    const [timeframe, setTimeframe] = useState(5);
    const [trend, setTrend] = useState<"up" | "down" | "none">("none");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const host = window.location.hostname;
    const socketRef = useRef<WebSocket | null>(null);

    const clearAllData = useCallback(() => {
        setHistory([]);
        setTotalRequests(0);
        setCurrentValue(0);
        localStorage.removeItem("openqueri_stats_v2");
        setIsModalOpen(false);
    }, []);

    const connectWebSocket = useCallback(() => {
        const socket = new WebSocket(`ws://${host}:8000/stats-ws`);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            try {
                const val = Number(JSON.parse(event.data));
                const now = Date.now();
                
                setHistory((prev) => {
                    const lastPoint = prev.length > 0 ? prev[prev.length - 1] : null;
                    
                    let calcRps = 0;
                    if (lastPoint) {
                        const diff = val - lastPoint.activity;
                        const timeDiff = (now - lastPoint.timestamp) / 1000;
                        calcRps = timeDiff > 0 && diff > 0 ? Math.floor(diff / timeDiff) : 0;
                    }

                    const diffPercent = (lastPoint && lastPoint.activity !== 0) 
                        ? ((val - lastPoint.activity) / lastPoint.activity) * 100 
                        : 0;
                    
                    setTrend(val > (lastPoint?.activity ?? 0) ? "up" : val < (lastPoint?.activity ?? 0) ? "down" : "none");
                    setTimeout(() => setTrend("none"), 800);

                    const addedActivity = lastPoint ? Math.max(0, val - lastPoint.activity) : val;
                    const newTotal = (lastPoint?.total ?? 0) + addedActivity;
                    setTotalRequests(newTotal);

                    const newPoint: Statistics = {
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        activity: val,
                        timestamp: now,
                        change: isFinite(diffPercent) ? Number(diffPercent.toFixed(1)) : 0,
                        rps: calcRps,
                        total: newTotal
                    };

                    return [...prev, newPoint].slice(-200);
                });

                setCurrentValue(val);
            } catch (e) { 
                console.error(e); 
            }
        };

        socket.onclose = () => {
            setTimeout(connectWebSocket, 3000);
        };

        return socket;
    }, [host]);

    useEffect(() => {
        const saved = localStorage.getItem("openqueri_stats_v2");
        if (saved) {
            try { 
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setHistory(parsed);
                    setTotalRequests(parsed[parsed.length - 1].total || 0);
                }
            } catch { 
                localStorage.removeItem("openqueri_stats_v2"); 
            }
        }

        const socket = connectWebSocket();
        return () => socket.close();
    }, [connectWebSocket]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (history.length > 0) localStorage.setItem("openqueri_stats_v2", JSON.stringify(history));
        }, 3000);
        return () => clearTimeout(timer);
    }, [history]);

    const filteredData = useMemo(() => {
        const cutoff = Date.now() - timeframe * 60 * 1000;
        return history.filter(p => p.timestamp >= cutoff);
    }, [history, timeframe]);

    return (
        <div className="w-full space-y-8 font-mono text-foreground p-2 md:p-6 transition-all duration-500">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-default-50 dark:bg-default-50/30 border border-default-200 p-8 rounded-[2.5rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-default-400 mb-2">Total Requests</p>
                    <div className="flex justify-between items-end">
                        <h2 className="text-4xl font-black tracking-tighter">{totalRequests.toLocaleString()}</h2>
                        <ChartBar className="size-6 text-default-200" />
                    </div>
                </Card>

                <Card className="bg-default-50 dark:bg-default-50/30 border border-default-200 p-8 rounded-[2.5rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-default-400 mb-2">Throughput</p>
                    <div className="flex justify-between items-end">
                        <h2 className="text-4xl font-black tracking-tighter text-foreground">
                            {(history[history.length - 1]?.rps ?? 0).toLocaleString()} <span className="text-sm text-default-300 italic font-medium">RPS</span>
                        </h2>
                        <Cpu className="size-6 text-default-200" />
                    </div>
                </Card>


            </div>

            <Card className="bg-default-50 dark:bg-default-50/20 border border-default-200 rounded-[3rem] p-8 h-[600px] flex flex-col relative overflow-hidden backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${trend === 'up' ? 'bg-blue-500 animate-ping' : 'bg-default-300'}`} />
                        <h3 className="text-xs font-black uppercase italic tracking-[0.2em] opacity-70">Real-time Pulse & RPS</h3>
                    </div>
                    <Button isIconOnly variant="ghost" className="rounded-full" onClick={() => setIsModalOpen(true)}>
                        <TrashBin className="size-4" />
                    </Button>
                </div>

                <div className="flex-grow w-full space-y-4">
                    <div className="h-1/2 w-full">
                        <ResponsiveContainer>
                            <AreaChart data={filteredData} syncId="pulseSync">
                                <defs>
                                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontSize: '10px', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fill="url(#colorLoad)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="h-1/2 w-full border-t border-default-200/50 pt-4">
                        <ResponsiveContainer>
                            <AreaChart data={filteredData} syncId="pulseSync">
                                <defs>
                                    <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontSize: '10px', fontWeight: 'bold' }} />
                                <Area type="stepAfter" dataKey="rps" stroke="#10b981" strokeWidth={2} fill="url(#colorRps)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
                {history.slice(-10).reverse().map((item) => (
                    <div key={item.timestamp} className="p-6 rounded-[2.5rem] border bg-white dark:bg-transparent border-default-200 dark:border-white/10 shadow-sm backdrop-blur-xl transition-all">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-black text-default-400 uppercase">{item.time}</span>
                            <Pulse className={`size-3 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                        <p className="text-2xl font-black tracking-tighter">{item.activity.toLocaleString()}</p>
                        <p className={`text-[10px] font-black mt-1 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} className="dark:bg-zinc-900 border border-white/10">
                    <div className="p-6">
                        <ModalHeader className="font-black uppercase tracking-widest text-sm">Подтверждение</ModalHeader>
                        <ModalBody className="py-4 text-default-500 text-sm">
                            Вы точно хотите очистить всю накопленную статистику? Это действие необратимо.
                        </ModalBody>
                        <ModalFooter className="gap-3">
                            <Button 
                                variant="outline" 
                                className="font-black uppercase text-[10px]"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </Button>
                            <Button 
                                className="bg-red-500 text-white font-black uppercase text-[10px] rounded-xl px-6"
                                onClick={clearAllData}
                            >
                                Удалить
                            </Button>
                        </ModalFooter>
                    </div>
                </Modal>
            )}
        </div>
    );
}