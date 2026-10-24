import { useState } from "react";
import { Link } from "react-router-dom";

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
          // 0 0 = Top Left corner
          // 100% 0 = Top Right corner
          // 100% 60% = Go down the right edge 60% of the way
          // 30% 60% = Move left to the 30% mark (creates the flat top of the right body)
          // 20% 100% = Cut diagonally down to the 20% mark at the bottom (the slanted cut)
          // 0 100% = Go to the Bottom Left corner
          clipPath: isOpen
            ? "polygon(0 0, 100% 0, 100% 63%, 30% 60%, 18% 100%, 0 100%)"
            : "polygon(0 0, 30% 0, 30% 60%, 30% 100%, 20% 100%, 0 100%)",
          // Only the tab remains

          // 135deg = Light shines diagonally from top-left to bottom-right
          // 57% #C5A86A = Dark Gold (Start)
          // 25% #F5E6C4 = Bright Highlight (Metallic shine)
          // 50% #E8D5A5 = Base Manila Color (Middle)
          // 85% #D4BA7A = Shadow Gold
          // 100% #B89B5E = Deep Edge Shadow (End)
          //background:
          //"linear-gradient(135deg, #121727 57%, #F5E6C4 25%, #a68021 50%, #D4BA7A 85%, #e3dccf 100%)",
          background:
            "linear-gradient(135deg, #bac2ea 0%, #969bdb 10%, #121727 57%, #F5E6C4 42%, #a68021 57%, #D4BA7A 85%, #e3dccf 100%)",

          // inset 0 2px 3px white = Light shining on the top inside edge
          // inset 0 -3px 5px black = Shadow on the bottom inside edge
          boxShadow:
            "inset 0 3px 3px rgba(249, 248, 248, 0.6), inset 0 -3px 5px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left Tab: Clickable to toggle */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-[30%] flex flex-col justify-center items-center cursor-pointer z-10 hover:bg-black/70 transition-colors font-obitron"
          title="Toggle Header"
        >
          {/* Using clamp() to scale text, removing truncate */}
          <h1 className="text-[clamp(1.2rem,1.5vw,1.1rem)] font-extrabold tracking-tight text-[#ffffff] leading-tight text-center font-alternate">
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
            {/* Replace button with Link */}
            <Link
              to="/"
              className="hover:text-black transition-colors drop-shadow-sm"
            >
              Gallery
            </Link>
            <button className="hover:text-black transition-colors drop-shadow-sm">
              Search
            </button>
            <button className="hover:text-black transition-colors drop-shadow-sm">
              Seek
            </button>
            <Link
              to="/collections"
              className="hover:text-black transition-colors drop-shadow-sm"
            >
              Collections
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
