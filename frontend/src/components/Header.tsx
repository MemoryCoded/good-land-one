import { useState } from "react";

interface ManilaHeaderProps {
  title: string;
  date: string;
}

export function ManHeader({ title, date }: ManilaHeaderProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full drop-shadow-md">
      <div
        className="w-full h-24 flex relative transition-all duration-500 ease-in-out"
        style={{
          clipPath: isOpen
            ? "polygon(0 0, 100% 0, 100% 60%, 30% 60%, 20% 100%, 0 100%)"
            : "polygon(0 0, 30% 0, 30% 60%, 30% 100%, 20% 100%, 0 100%)", // Only the tab remains

          // 1. The Metallic Gradient (Manila colors)
          background:
            "linear-gradient(135deg, #C5A86A 55%, #F5E6C4 25%, #E8D5A5 50%, #D4BA7A 85%, #B89B5E 100%)",
          // 2. The Bevel Effect (Light on top, shadow on bottom)
          boxShadow:
            "inset 0 2px 3px rgba(255, 255, 255, 0.6), inset 0 -3px 5px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left Tab: Clickable to toggle */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-[30%] flex flex-col justify-center items-center cursor-pointer z-10 hover:bg-black/5 transition-colors font-obitron"
          title="Toggle Header"
        >
          {/* Using clamp() to scale text, removing truncate */}
          <h1 className="text-[clamp(0.75rem,1.5vw,1.1rem)] font-bold tracking-tight text-gray-200 leading-tight text-center font-orbitron">
            {title}
          </h1>
          <p className="text-[clamp(0.7rem,1vw,0.8rem)] font-medium text-gray-200 mt-1 drop-shadow-[0_1_1px_rgba(255,255,255,0.5)] text-center font-orbitron">
            {date}
          </p>
        </div>

        {/* Right Body: Nav links */}
        <div
          className={`w-[70%] flex items-center pl-12 pr-8 pb-7 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex w-full justify-evenly text-sm font-semibold text-gray-200 font-orbitron">
            <button className="hover:text-black transition-colors">
              Search
            </button>
            <button className="hover:text-black transition-colors">
              Select
            </button>
            <button className="hover:text-black transition-colors">Seek</button>
            <button className="hover:text-black transition-colors">
              Collections
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
