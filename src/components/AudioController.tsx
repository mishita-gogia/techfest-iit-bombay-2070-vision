import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Web Audio API instance holder
let audioCtx: AudioContext | null = null;
let droneOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
let masterGain: GainNode | null = null;

export function initAudio() {
  if (audioCtx) return;
  // Initialize context
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime); // Start silent, fade in
  masterGain.connect(audioCtx.destination);
}

export function playHoverClick() {
  try {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === "suspended") return;
    
    const ctx = audioCtx!;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    // Quick tech-click sweep: slide from 1200Hz to 400Hz
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(masterGain || ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (err) {
    console.warn("Audio click failed:", err);
  }
}

export function playSectionSweep() {
  try {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === "suspended") return;

    const ctx = audioCtx!;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(240, ctx.currentTime + 0.6);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
    filter.Q.setValueAtTime(5, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain || ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch (err) {
    console.warn("Audio sweep failed:", err);
  }
}

export function startAmbientDrone() {
  try {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === "suspended") return;
    if (droneOscs.length > 0) return; // Already running

    const ctx = audioCtx!;

    // Create a multi-harmonic spaceship hum pad
    const frequencies = [65.41, 97.99, 130.81]; // C2, G2, C3 notes
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Gentle frequency LFO/detune
      const detuneAmount = (idx - 1) * 8; 
      osc.detune.setValueAtTime(detuneAmount, ctx.currentTime);

      // Low volume for safe ambient listening
      gain.gain.setValueAtTime(0.05, ctx.currentTime);

      osc.connect(gain);
      gain.connect(masterGain || ctx.destination);

      osc.start();
      droneOscs.push({ osc, gain });
    });
  } catch (err) {
    console.warn("Audio drone failed:", err);
  }
}

export function stopAmbientDrone() {
  try {
    droneOscs.forEach(({ osc }) => {
      try { osc.stop(); } catch {}
    });
    droneOscs = [];
  } catch {}
}

export default function AudioController() {
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    try {
      initAudio();
      if (!audioCtx) return;

      if (muted) {
        // Unmuting
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        startAmbientDrone();
        if (masterGain) {
          masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 1.2); // smooth fade-in
        }
        setMuted(false);
        playSectionSweep();
      } else {
        // Muting
        if (masterGain) {
          masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4); // smooth fade-out
        }
        setTimeout(() => {
          stopAmbientDrone();
        }, 450);
        setMuted(true);
      }
    } catch (err) {
      console.error("Audio toggle failed:", err);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAmbientDrone();
    };
  }, []);

  return (
    <button
      id="audio-speaker-toggle"
      onClick={toggleMute}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full cursor-pointer px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all glass-card ${
        muted
          ? "text-[#a2a8c0] border-white/5 bg-cyber-dark/40 hover:border-white/20"
          : "text-cyber-cyan border-cyber-cyan/30 neon-border-cyan bg-cyber-dark-accent/70 hover:scale-105"
      }`}
      title={muted ? "Enable audio immersion" : "Disable audio"}
    >
      {muted ? (
        <>
          <VolumeX className="w-4 h-4 animate-pulse text-rose-500" />
          <span>AUDIO OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-cyber-cyan" />
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-cyber-cyan animate-[soundWave_0.6s_infinite_alternate]" style={{ height: "40%" }} />
            <span className="w-0.5 bg-cyber-cyan animate-[soundWave_0.8s_infinite_alternate]" style={{ height: "80%", animationDelay: "0.2s" }} />
            <span className="w-0.5 bg-cyber-cyan animate-[soundWave_0.5s_infinite_alternate]" style={{ height: "60%", animationDelay: "0.4s" }} />
          </div>
          <span>IMMERSIVE</span>
        </>
      )}

      {/* Embedded CSS animation for equalizers of the dynamic speaker */}
      <style>{`
        @keyframes soundWave {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </button>
  );
}
