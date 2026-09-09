"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { win, draw } from "@/lib/game";
import type { B } from "@/lib/game";

type Mode = "1P" | "2P";

function best(b: B, bot: "X" | "O" = "O"): number {
  const emp = b.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  const hum = bot === "O" ? "X" : "O";
  for (const i of emp) {
    const t = [...b] as B; t[i] = bot;
    if (win(t)?.p === bot) return i;
  }
  for (const i of emp) {
    const t = [...b] as B; t[i] = hum;
    if (win(t)?.p === hum) return i;
  }
  if (b[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => b[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const sides = [1, 3, 5, 7].filter((i) => b[i] === null);
  return sides[Math.floor(Math.random() * sides.length)] ?? emp[0];
}

export default function App() {
  const [b, setB] = useState<B>(Array(9).fill(null));
  const [x, setX] = useState(false);
  const [s, setS] = useState({ X: 1, O: 1, D: 0 });
  const [muted, setMuted] = useState(false);
  const [mode, setMode] = useState<Mode>("2P");
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [starter, setStarter] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const w = win(b);
  const d = !w && draw(b);
  const done = !!w || d;
  const ctxRef = useRef<AudioContext | null>(null);

  const snd = useCallback((t: "tap" | "win" | "draw") => {
    if (muted) return;
    try {
      const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      if (!ctxRef.current) ctxRef.current = new AC();
      const ctx: AudioContext = ctxRef.current!;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      if (t === "tap") {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination);
        o.type = "sine"; o.frequency.setValueAtTime(x ? 760 : 640, now); o.frequency.exponentialRampToValueAtTime(x ? 980 : 820, now + 0.08);
        g.gain.setValueAtTime(0.22, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        o.start(now); o.stop(now + 0.13);
      } else if (t === "win") {
        [523, 659, 784].forEach((f, i) => {
          const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination);
          const st = now + i * 0.09; osc.type = "sine"; osc.frequency.setValueAtTime(f, st); gain.gain.setValueAtTime(0.28, st); gain.gain.exponentialRampToValueAtTime(0.001, st + 0.32); osc.start(st); osc.stop(st + 0.33);
        });
        const bOsc = ctx.createOscillator(), bGain = ctx.createGain(); bOsc.connect(bGain); bGain.connect(ctx.destination);
        bOsc.type = "sine"; bOsc.frequency.setValueAtTime(140, now); bOsc.frequency.exponentialRampToValueAtTime(70, now + 0.25);
        bGain.gain.setValueAtTime(0.18, now); bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3); bOsc.start(now); bOsc.stop(now + 0.31);
      } else {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination);
        o.type = "sine"; o.frequency.setValueAtTime(300, now); o.frequency.linearRampToValueAtTime(220, now + 0.18); g.gain.setValueAtTime(0.2, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.22); o.start(now); o.stop(now + 0.23);
        const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.connect(g2); g2.connect(ctx.destination); o2.frequency.setValueAtTime(180, now + 0.08); g2.gain.setValueAtTime(0.14, now + 0.08); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.28); o2.start(now + 0.08); o2.stop(now + 0.29);
      }
    } catch {}
  }, [x, muted]);

  const rst = useCallback((nextX?: boolean) => {
    setB(Array(9).fill(null));
    let nx: boolean;
    if (nextX !== undefined) nx = nextX;
    else if (mode === "1P") nx = false;
    else nx = !x;
    setX(nx);
    setStarter(nx);
  }, [mode, x]);

  const pickMode = (m: Mode) => {
    const nx = m === "1P" ? false : false;
    setMode(m);
    setB(Array(9).fill(null));
    setX(nx);
    setStarter(nx);
    setShowMain(false);
  };

  const clk = (i: number) => {
    if (showMain || showMenu || showSettings) return;
    if (done) { snd("tap"); rst(); return; }
    if (mode === "1P" && x) return;
    if (b[i]) return;
    const nb = [...b] as B; nb[i] = x ? "X" : "O";
    const r = win(nb); const isD = !r && nb.every(Boolean);
    if (r) setS((p) => ({ ...p, [r.p]: (p as any)[r.p] + 1 }));
    else if (isD) setS((p) => ({ ...p, D: p.D + 1 }));
    setB(nb); setX(!x);
    if (r) setTimeout(() => snd("win"), 60);
    else if (isD) setTimeout(() => snd("draw"), 60);
    else snd("tap");
  };

  useEffect(() => {
    if (mode !== "1P" || done || !x) return;
    const t = setTimeout(() => {
      const idx = best(b, "X");
      if (b[idx] !== null) return;
      const nb = [...b] as B; nb[idx] = "X";
      const r = win(nb); const isD = !r && nb.every(Boolean);
      if (r) setS((p) => ({ ...p, X: p.X + 1 }));
      else if (isD) setS((p) => ({ ...p, D: p.D + 1 }));
      setB(nb); setX(false);
      if (r) setTimeout(() => snd("win"), 60);
      else if (isD) setTimeout(() => snd("draw"), 60);
      else snd("tap");
    }, 420);
    return () => clearTimeout(t);
  }, [b, x, mode, done, snd]);

  useEffect(() => {
    if (!showMenu || stars !== null) return;
    fetch("https://api.github.com/repos/faizan-2005/oxo-game").then((r) => r.json()).then((j) => {
      if (j && typeof j.stargazers_count === "number") setStars(j.stargazers_count);
    }).catch(() => setStars(0));
  }, [showMenu, stars]);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  return (
    <div className="min-h-[100dvh] min-h-screen bg-[#f2f2f2] flex justify-center px-0 sm:px-4">
      <div className="w-full max-w-[420px] min-h-[100dvh] min-h-screen bg-white flex flex-col relative shadow-[0_0_0_1px_#e5e5e5] overflow-hidden sm:rounded-2xl sm:my-4 sm:min-h-[calc(100dvh-32px)] sm:max-h-[860px]">
        
        <div className="h-[56px] sm:h-[60px] flex items-center justify-between px-3 sm:px-4 shrink-0">
          <button onClick={() => setShowMenu(true)} className="w-10 h-10 rounded-full bg-[#00bcd4] grid place-items-center shadow-[0_2px_0_rgba(0,0,0,.18)] active:scale-95">
            <span className="flex flex-col gap-[3px]"><span className="block w-[18px] h-[3px] bg-white rounded-full" /><span className="block w-[18px] h-[3px] bg-white rounded-full" /><span className="block w-[18px] h-[3px] bg-white rounded-full" /></span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 font-bold text-[22px] tracking-tight text-slate-900">
              <span className={`w-6 h-6 rounded-full border-[3px] ${starter ? "border-[#e53935] text-[#e53935]" : "border-[#3a9ad9] text-[#3a9ad9]"} grid place-items-center leading-none text-[13px]`}>{starter ? "✕" : "○"}</span>
              <span className="-ml-0.5">Turn</span>
            </span>
            
          </div>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-[#00bcd4] grid place-items-center shadow-[0_2px_0_rgba(0,0,0,.18)] active:scale-95">
            <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="3"/><path d="M12 8.5V7M12 17v-1.5M8.5 12H7M17 12h-1.5M9.5 9.5 8.6 8.6M15.4 15.4l-.9-.9M15.4 8.6l-.9.9M9.5 14.5l-.9.9"/></svg>
          </button>
        </div>

        
        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-2 relative min-h-0 overflow-auto" onClick={done ? () => { snd("tap"); rst(); } : undefined}>
          <div className="relative w-full aspect-square max-w-[360px] max-h-[min(92vw,56vh,360px)] sm:max-h-[360px] mx-auto">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-[33.33%] top-0 bottom-0 w-[7px] -ml-[3.5px] bg-[#bcbcbc]" />
              <div className="absolute left-[66.66%] top-0 bottom-0 w-[7px] -ml-[3.5px] bg-[#bcbcbc]" />
              <div className="absolute top-[33.33%] left-0 right-0 h-[7px] -mt-[3.5px] bg-[#bcbcbc]" />
              <div className="absolute top-[66.66%] left-0 right-0 h-[7px] -mt-[3.5px] bg-[#bcbcbc]" />
            </div>
            <div className={`absolute inset-0 grid grid-cols-3 grid-rows-3 ${d ? "opacity-[0.82]" : ""}`} style={d ? { animation: "tieShake 520ms ease both" } : undefined}>
              {b.map((v, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); clk(i); }} className="flex items-center justify-center p-2 active:scale-[0.98] transition-transform" style={d ? { animation: `drawFade 520ms ease ${i * 22}ms both` } : w?.l.includes(i) ? { animation: `pop 280ms cubic-bezier(.34,1.56,.64,1) ${i % 3 * 50}ms both` } : undefined}>
                  {v === "O" ? <O dim={!!d} win={!!w?.l.includes(i)} /> : v === "X" ? <X dim={!!d} win={!!w?.l.includes(i)} /> : null}
                </button>
              ))}
            </div>
            {w && <WinLine l={w.l} />}
            {done && w && (
              <div className="absolute left-0 right-0 top-1/2 bg-[rgba(30,30,30,0.92)] text-white text-center py-3 px-2 z-20 pointer-events-none" style={{ animation: "bannerIn 220ms ease both" }}>
                <p className="text-[20px] font-bold leading-none">Player {w.p === "O" ? "1" : "2"} Wins!</p>
                <p className="text-[13px] opacity-90 mt-1">Press anywhere to play again.</p>
              </div>
            )}
            {done && !w && (
              <div className="absolute left-0 right-0 top-1/2 bg-[rgba(30,30,30,0.92)] text-white text-center py-3 px-2 z-20 pointer-events-none" style={{ animation: "bannerIn 220ms ease both" }}>
                <p className="text-[20px] font-bold leading-none">Draw!</p>
                <p className="text-[13px] opacity-90 mt-1">Press anywhere to play again.</p>
              </div>
            )}
          </div>
        </div>

        
        <div className="h-[64px] sm:h-[68px] border-t border-[#e5e5e5] grid grid-cols-3 text-center shrink-0 bg-white">
          <div className="flex flex-col items-center justify-center relative py-2">
            <span className="text-[18px] font-bold leading-none text-slate-800">{s.O}</span>
            <span className="text-[11px] font-bold tracking-wide flex items-center gap-1 mt-1"><span className="w-3 h-3 rounded-full border-[2px] border-[#3a9ad9] inline-block" /> {mode === "1P" ? "YOU" : "PLAYER 1"}</span>
            {!starter && !done && <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#3a9ad9]" />}
          </div>
          <div className="flex flex-col items-center justify-center relative py-2 border-x border-[#f0f0f0]">
            <span className="text-[18px] font-bold leading-none text-slate-800">{s.D}</span>
            <span className="text-[11px] font-bold tracking-wide mt-1 text-slate-700">TIES</span>
          </div>
          <div className="flex flex-col items-center justify-center relative py-2">
            <span className="text-[18px] font-bold leading-none text-slate-800">{s.X}</span>
            <span className="text-[11px] font-bold tracking-wide flex items-center gap-1 mt-1"><span className="text-[#e53935] text-[12px]">✕</span> {mode === "1P" ? "BOT" : "PLAYER 2"}</span>
            {starter && !done && (
              <>
                <span className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#3a9ad9]" />
                <span className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#3a9ad9]" />
              </>
            )}
          </div>
        </div>

        
        {showMenu && (
          <div className="absolute inset-0 z-40 bg-white flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <div className="absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-[#111]" />
              <div className="absolute left-[66.66%] top-0 bottom-0 w-[1px] bg-[#111]" />
              <div className="absolute top-[33.33%] left-0 right-0 h-[1px] bg-[#111]" />
              <div className="absolute top-[66.66%] left-0 right-0 h-[1px] bg-[#111]" />
            </div>
            <button onClick={() => setShowMenu(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 grid place-items-center text-slate-700 active:scale-95">✕</button>
            <div className="relative w-full max-w-[300px] flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-full border-[2.5px] border-[#3a9ad9] grid place-items-center bg-white">
                    <span className="w-3 h-3 rounded-full border-[2px] border-[#3a9ad9] block" />
                  </span>
                  <span className="text-[28px] font-black leading-none text-[#e53935]">✕</span>
                  <span className="w-7 h-7 rounded-full border-[2.5px] border-[#3a9ad9] grid place-items-center bg-white">
                    <span className="w-3 h-3 rounded-full border-[2px] border-[#3a9ad9] block" />
                  </span>
                </div>
                <h2 className="text-[16px] font-black tracking-[0.14em] text-slate-900">MENU</h2>
              </div>
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white">
                  <img src="https://avatars.githubusercontent.com/u/181568711?v=4" alt="faizan" className="w-10 h-10 rounded-full border object-cover shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"; }} />
                  <div className="min-w-0">
                    <p className="font-black text-sm leading-none">Faizan Baig</p>
                  </div>
                </div>
                <a href="https://github.com/faizan-2005/oxo-game" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-full bg-slate-900 text-white">
                  <span className="font-bold text-sm flex items-center gap-2 text-[#0097a7]"><svg viewBox="0 0 16 16" className="w-4 h-4 fill-white shrink-0"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg> Star this repo</span>
                  <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full flex items-center gap-1"><svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> {stars !== null ? fmt(stars) : "--"}</span>
                </a>
                <button onClick={() => { setShowMenu(false); setShowMain(true); }} className="w-full py-4 rounded-full bg-[#00bcd4] text-white font-black text-[15px] tracking-wide border-2 border-[#00a8bd] shadow-[0_4px_0_rgba(0,140,160,1)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,140,160,1)] transition-all">MAIN MENU →</button>
              </div>
            </div>
          </div>
        )}

        
        {showSettings && (
          <div className="absolute inset-0 z-40 bg-white flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <div className="absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-[#111]" />
              <div className="absolute left-[66.66%] top-0 bottom-0 w-[1px] bg-[#111]" />
              <div className="absolute top-[33.33%] left-0 right-0 h-[1px] bg-[#111]" />
              <div className="absolute top-[66.66%] left-0 right-0 h-[1px] bg-[#111]" />
            </div>
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 grid place-items-center text-slate-700 active:scale-95">✕</button>
            <div className="relative w-full max-w-[300px] flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-full border-[2.5px] border-[#3a9ad9] grid place-items-center bg-white">
                    <span className="w-3 h-3 rounded-full border-[2px] border-[#3a9ad9] block" />
                  </span>
                  <span className="text-[28px] font-black leading-none text-[#e53935]">✕</span>
                  <span className="w-7 h-7 rounded-full border-[2.5px] border-[#3a9ad9] grid place-items-center bg-white">
                    <span className="w-3 h-3 rounded-full border-[2px] border-[#3a9ad9] block" />
                  </span>
                </div>
                <h2 className="text-[16px] font-black tracking-[0.14em] text-slate-900">SETTINGS</h2>
              </div>
              <div className="w-full flex flex-col gap-3">
                <button onClick={() => setMuted((m) => !m)} className={`w-full flex items-center justify-between p-3 rounded-full border-2 ${muted ? "bg-[#e0f7fa] border-[#00bcd4]/30" : "bg-[#e0f7fa] border-[#00bcd4]/30"}`}>
                  <span className="font-bold text-sm flex items-center gap-2 text-[#0097a7]">{muted ? <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> : <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>} {muted ? "Sound Off" : "Sound On"}</span>
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${muted ? "bg-slate-300" : "bg-[#00bcd4]"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${muted ? "translate-x-1" : "translate-x-5"}`} />
                  </span>
                </button>
                <button onClick={() => setShowSettings(false)} className="w-full py-4 rounded-full bg-slate-900 text-white font-black text-[15px] tracking-wide shadow-[0_4px_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,1)] transition-all">Return to Game</button>
                <button onClick={() => { setS({ X: 0, O: 0, D: 0 }); setShowSettings(false); }} className="w-full py-3.5 rounded-full bg-white border-2 border-slate-200 font-black text-sm">Reset Scores</button>
              </div>
            </div>
          </div>
        )}

        
        {showMain && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
            
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <div className="absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-[#111]" />
              <div className="absolute left-[66.66%] top-0 bottom-0 w-[1px] bg-[#111]" />
              <div className="absolute top-[33.33%] left-0 right-0 h-[1px] bg-[#111]" />
              <div className="absolute top-[66.66%] left-0 right-0 h-[1px] bg-[#111]" />
            </div>

            <div className="relative w-full max-w-[300px] flex flex-col items-center gap-8">
              
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-9 h-9 rounded-full border-[3px] border-[#3a9ad9] grid place-items-center bg-white">
                    <span className="w-4 h-4 rounded-full border-[2px] border-[#3a9ad9] block" />
                  </span>
                  <span className="text-[42px] font-black leading-none text-[#e53935]">✕</span>
                  <span className="w-9 h-9 rounded-full border-[3px] border-[#3a9ad9] grid place-items-center bg-white">
                    <span className="w-4 h-4 rounded-full border-[2px] border-[#3a9ad9] block" />
                  </span>
                </div>
                <h1 className="text-[22px] font-black tracking-[0.14em] text-slate-900">OXO</h1>
              </div>

              
              <div className="w-full flex flex-col gap-4">
                <button
                  onClick={() => pickMode("1P")}
                  className="w-full py-4 rounded-full bg-[#00bcd4] text-white font-black text-[17px] tracking-wide border-2 border-[#00a8bd] shadow-[0_4px_0_rgba(0,140,160,1)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,140,160,1)] transition-all"
                >
                  One Player
                </button>
                <button
                  onClick={() => pickMode("2P")}
                  className="w-full py-4 rounded-full bg-[#00bcd4] text-white font-black text-[17px] tracking-wide border-2 border-[#00a8bd] shadow-[0_4px_0_rgba(0,140,160,1)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,140,160,1)] transition-all"
                >
                  Two Player
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function X({ dim, win }: { dim?: boolean; win?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={`w-[68%] h-[68%] transition ${dim ? "opacity-60" : ""} ${win ? "drop-shadow-[0_2px_6px_rgba(229,57,53,.35)]" : ""}`}>
      <path d="M10 10 L30 30" stroke="#e53935" strokeWidth="5" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100} style={{ animation: "draw 240ms ease forwards" }} />
      <path d="M30 10 L10 30" stroke="#e53935" strokeWidth="5" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100} style={{ animation: "draw 240ms ease 90ms forwards" }} />
    </svg>
  );
}
function O({ dim, win }: { dim?: boolean; win?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={`w-[68%] h-[68%] transition ${dim ? "opacity-60" : ""} ${win ? "drop-shadow-[0_2px_8px_rgba(58,154,217,.35)]" : ""}`}>
      <circle cx="20" cy="20" r="12" fill="none" stroke="#3a9ad9" strokeWidth="4.2" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100} style={{ animation: "draw 320ms cubic-bezier(.4,0,.2,1) forwards", transform: "scaleX(-1) rotate(-90deg)", transformOrigin: "center" } as any} />
    </svg>
  );
}
function WinLine({ l }: { l: number[] }) {
  const k = l.join(",");
  if (k === "0,3,6") return <div className="absolute left-[16.66%] top-[4%] bottom-[4%] w-[8px] -ml-[4px] bg-[#f5c518] rounded-full z-10 pointer-events-none" />;
  if (k === "1,4,7") return <div className="absolute left-1/2 top-[4%] bottom-[4%] w-[8px] -ml-[4px] bg-[#f5c518] rounded-full z-10 pointer-events-none" />;
  if (k === "2,5,8") return <div className="absolute left-[83.33%] top-[4%] bottom-[4%] w-[8px] -ml-[4px] bg-[#f5c518] rounded-full z-10 pointer-events-none" />;
  if (k === "0,1,2") return <div className="absolute top-[16.66%] left-[4%] right-[4%] h-[8px] -mt-[4px] bg-[#f5c518] rounded-full z-10 pointer-events-none" />;
  if (k === "3,4,5") return <div className="absolute top-1/2 left-[4%] right-[4%] h-[8px] -mt-[4px] bg-[#f5c518] rounded-full z-10 pointer-events-none" />;
  if (k === "6,7,8") return <div className="absolute top-[83.33%] left-[4%] right-[4%] h-[8px] -mt-[4px] bg-[#f5c518] rounded-full z-10 pointer-events-none" />;
  if (k === "0,4,8") return <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"><div className="w-[115%] h-[8px] bg-[#f5c518] rotate-45 rounded-full" /></div>;
  if (k === "2,4,6") return <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"><div className="w-[115%] h-[8px] bg-[#f5c518] -rotate-45 rounded-full" /></div>;
  return null;
}