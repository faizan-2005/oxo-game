import Link from "next/link";

export default function ReadmePage() {
  return (
    <div className="min-h-[100dvh] min-h-screen bg-[#f2f2f2] flex justify-center px-0 sm:px-4 py-4">
      <div className="w-full max-w-[720px] bg-white shadow-[0_0_0_1px_#e5e5e5] sm:rounded-2xl overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full border-[3px] border-[#3a9ad9] grid place-items-center bg-white">
              <span className="w-3.5 h-3.5 rounded-full border-[2px] border-[#3a9ad9] block" />
            </span>
            <span className="text-[28px] font-black leading-none text-[#e53935]">✕</span>
            <span className="text-[18px] font-black tracking-[0.12em] text-slate-900 ml-1">OXO</span>
            <span className="text-[11px] font-bold tracking-widest text-slate-400 ml-2">README</span>
          </div>
          <Link href="/" className="text-xs font-bold text-[#00bcd4] border border-[#00bcd4]/30 px-3 py-1.5 rounded-full hover:bg-[#e0f7fa]">Back to Game →</Link>
        </div>
        <article className="prose prose-slate max-w-none px-6 sm:px-8 py-6 text-[14px] leading-relaxed">
          <h1 className="text-[24px] font-black tracking-tight text-slate-900">OXO — Tic Tac Toe</h1>
          <p className="text-slate-600">Clean, fast, mobile-first Tic Tac Toe built with Next.js. Player 1 = <b>O</b> (blue), Player 2 / BOT = <b>X</b> (red). O goes first and its indicator stays.</p>
          <p className="text-sm">
            <b>Live:</b> <a href="https://faizan.is-a.dev/oxo-game/" className="text-[#00bcd4] underline">https://faizan.is-a.dev/oxo-game/</a> · <a href="https://faizan-2005.github.io/oxo-game/" className="text-[#00bcd4] underline">https://faizan-2005.github.io/oxo-game/</a><br/>
            <b>Repo:</b> <a href="https://github.com/faizan-2005/oxo-game" className="text-[#00bcd4] underline">https://github.com/faizan-2005/oxo-game</a>
          </p>

          <h2 className="text-[16px] font-black mt-6 text-slate-900">Screenshots</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="border border-slate-200 rounded-xl overflow-hidden"><img src="./screenshots/game.png" alt="Game" className="w-full" /><p className="text-[11px] font-bold text-center py-1.5 bg-slate-50">Game</p></div>
            <div className="border border-slate-200 rounded-xl overflow-hidden"><img src="./screenshots/win.png" alt="Win" className="w-full" /><p className="text-[11px] font-bold text-center py-1.5 bg-slate-50">Win (P1 O)</p></div>
            <div className="border border-slate-200 rounded-xl overflow-hidden"><img src="./screenshots/loss.png" alt="Loss" className="w-full" /><p className="text-[11px] font-bold text-center py-1.5 bg-slate-50">Loss (P2 X)</p></div>
            <div className="border border-slate-200 rounded-xl overflow-hidden"><img src="./screenshots/draw.png" alt="Draw" className="w-full" /><p className="text-[11px] font-bold text-center py-1.5 bg-slate-50">Draw</p></div>
          </div>

          <h2 className="text-[16px] font-black mt-6 text-slate-900">Features</h2>
          <ul className="list-disc pl-5 text-slate-700 marker:text-slate-400">
            <li><b>Two modes:</b> One Player vs BOT (win → block → center → corner → side) and Two Players</li>
            <li><b>BOT always second</b> — YOU (O) starts every game in 1P</li>
            <li><b>OXO theme:</b> teal #00bcd4, blue #3a9ad9 (O), red #e53935 (X), yellow #f5c518 win line</li>
            <li><b>Full-screen menus:</b> Main / Menu / Settings (gearbox) — minimal 2-button layout</li>
            <li><b>Live repo stars:</b> Star this repo shows faizan-2005/oxo-game stars</li>
            <li><b>Fully responsive:</b> 100dvh, min(92vw,56vh) board, max-w 420px card</li>
          </ul>

          <h2 className="text-[16px] font-black mt-6 text-slate-900">How to Play</h2>
          <ul className="list-disc pl-5 text-slate-700">
            <li>Player 1 is <b>O</b>, Player 2 / BOT is <b>X</b>. 3 in a row wins.</li>
            <li>Tap cell to place mark. Press anywhere after Win/Draw to reset.</li>
          </ul>

          <h2 className="text-[16px] font-black mt-6 text-slate-900">Getting Started</h2>
          <pre className="bg-slate-900 text-slate-100 rounded-xl p-3 text-xs overflow-auto">npm install{"\n"}npm run dev   # http://localhost:3000{"\n"}npm run build # out/</pre>

          <h2 className="text-[16px] font-black mt-6 text-slate-900">Credits</h2>
          <p className="text-slate-700">Author: <b>Faizan Baig</b> — <a href="https://avatars.githubusercontent.com/u/181568711?v=4" className="text-[#00bcd4] underline">avatar</a></p>
        </article>
        <div className="px-6 sm:px-8 py-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          OXO • <a href="https://faizan.is-a.dev/oxo-game/" className="text-[#00bcd4] underline">faizan.is-a.dev/oxo-game/</a> • <a href="https://github.com/faizan-2005/oxo-game" className="text-[#00bcd4] underline">github.com/faizan-2005/oxo-game</a>
        </div>
      </div>
    </div>
  );
}
