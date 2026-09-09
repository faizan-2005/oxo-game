import Link from "next/link";

export default function HomePath() {
  return (
    <div className="min-h-[100dvh] min-h-screen bg-[#f2f2f2] flex justify-center px-0 sm:px-4">
      <div className="w-full max-w-[420px] min-h-[100dvh] min-h-screen bg-white flex flex-col items-center justify-center relative shadow-[0_0_0_1px_#e5e5e5] overflow-hidden sm:rounded-2xl sm:my-4 sm:min-h-[calc(100dvh-32px)] sm:max-h-[860px] p-6">
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
            <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400">HOME</p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <Link href="/oneplayer" className="w-full py-4 rounded-full bg-[#00bcd4] text-white font-black text-[17px] tracking-wide border-2 border-[#00a8bd] shadow-[0_4px_0_rgba(0,140,160,1)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,140,160,1)] transition-all text-center">
              One Player
            </Link>
            <Link href="/two-player" className="w-full py-4 rounded-full bg-[#00bcd4] text-white font-black text-[17px] tracking-wide border-2 border-[#00a8bd] shadow-[0_4px_0_rgba(0,140,160,1)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,140,160,1)] transition-all text-center">
              Two Player
            </Link>
            <Link href="/" className="w-full py-3.5 rounded-full bg-white border-2 border-slate-200 font-black text-sm text-center">
              Back to Game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
