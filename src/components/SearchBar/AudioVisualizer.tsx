import { useEffect, useRef} from "react";


interface AudioVisualizerProps { isActive: boolean; }

export const AudioVisualizer = ({ isActive }: AudioVisualizerProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) startAudio();
    else stopAudio();
    return () => stopAudio();
  }, [isActive]);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyserRef.current = analyser;
      context.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 64;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        if (analyserRef.current && glowRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
          glowRef.current.style.boxShadow = `0 0 ${avg * 1.8}px rgba(59, 130, 246, ${avg / 80})`;
          glowRef.current.style.opacity = "1";
          animationRef.current = requestAnimationFrame(update);
        }
      };
      update();
    } catch (err) { console.error(err); }
  };

  const stopAudio = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
      glowRef.current.style.boxShadow = "none";
    }
  };

  return <div ref={glowRef} className="absolute -inset-[2px] rounded-[24px] border border-blue-500/50 pointer-events-none z-0 opacity-0 transition-opacity duration-300" />;
};