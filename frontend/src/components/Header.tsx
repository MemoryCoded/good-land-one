import { useState } from "react";
import { Link } from "react-router-dom";
import { useGalleryStore } from "../store/useGalleryStore";

interface ManilaHeaderProps {
  title: string;
  date: string;
}

export function ManHeader({ title, date }: ManilaHeaderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const {
    pageTheme,
    togglePageTheme,
    defaultPolaroidTheme,
    toggleDefaultPolaroidTheme,
    resetThemes,
  } = useGalleryStore();

  return (
    <header className="sticky top-0 z-50 w-full drop-shadow-md">
      <div
        className="w-full h-24 flex relative transition-all duration-500 ease-in-out"
        style={{
          clipPath: isOpen
            ? "polygon(0 0, 100% 0, 100% 63%, 30% 60%, 18% 100%, 0 100%)"
            : "polygon(0 0, 30% 0, 30% 60%, 30% 100%, 20% 100%, 0 100%)",
          background:
            "linear-gradient(135deg, #bac2ea 0%, #969bdb 10%, #121727 55%, #0c0c0c 56%, #a68021 57%, #D4BA7A 85%, #e3dccf 100%)",
          boxShadow:
            "inset 0 3px 3px rgba(249, 248, 248, 0.6), inset 0 -3px 5px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left Tab */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-[30%] flex flex-col justify-center items-center cursor-pointer z-10 hover:bg-black/70 transition-colors"
          title="Toggle Header"
        >
          <h1 className="text-[clamp(1.2rem,1.5vw,1.1rem)] font-extrabold tracking-tight text-[#ffffff] leading-tight text-center font-alternate">
            {title}
          </h1>
          <p className="text-[clamp(0.7rem,1vw,0.8rem)] font-medium text-gray-200 mt-1 text-center font-orbitron">
            {date}
          </p>
        </div>

        {/* Right Body */}
        <div
          // Removed pb-7 so it vertically centers inside the 63% height constraint
          className={`w-[70%] flex items-center pl-12 pr-8 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {!showConfig ? (
            /* --- DEFAULT NAVIGATION --- */
            <nav className="flex w-full justify-evenly text-sm font-semibold text-gray-200 font-orbitron pb-7">
              <Link
                to="/"
                className="hover:text-black transition-colors drop-shadow-sm"
              >
                Gallery
              </Link>
              <button
                onClick={() => setShowConfig(true)}
                className="hover:text-black transition-colors drop-shadow-sm uppercase tracking-widest font-bold"
              >
                Config
              </button>
              <Link
                to="/collections"
                className="hover:text-black transition-colors drop-shadow-sm"
              >
                Collections
              </Link>
              <button className="hover:text-black transition-colors drop-shadow-sm">
                Seek
              </button>
            </nav>
          ) : (
            /* --- CONFIG MENU (Horizontal Row) --- */
            <div className="flex items-center justify-between w-full font-orbitron text-gray-200 pb-7">
              {/* Horizontal Buttons */}
              <div className="flex flex-row items-center gap-6">
                <button
                  onClick={togglePageTheme}
                  className="text-left hover:text-white transition-all flex items-center gap-2 text-xs"
                >
                  <span className="uppercase tracking-widest text-gray-400">
                    Page Theme
                  </span>
                  <span className="border border-gray-500 px-2 py-0.5 rounded bg-black/40 text-white">
                    {pageTheme}
                  </span>
                </button>

                <button
                  onClick={toggleDefaultPolaroidTheme}
                  className="text-left hover:text-white transition-all flex items-center gap-2 text-xs"
                >
                  <span className="uppercase tracking-widest text-gray-400">
                    Frame Theme
                  </span>
                  <span className="border border-gray-500 px-2 py-0.5 rounded bg-black/40 text-white">
                    {defaultPolaroidTheme === "white-matte" ? "WHITE" : "METAL"}
                  </span>
                </button>

                {/* RESET BUTTON */}
                <button
                  onClick={resetThemes}
                  className="text-left border border-gray-200 px-2 py-0.5 rounded bg-black/40 text-red-400 hover:text-red-900 transition-all text-xs uppercase tracking-widest font-bold"
                >
                  Reset
                </button>
              </div>

              {/* Close Config Button */}
              <button
                onClick={() => setShowConfig(false)}
                className="text-red-400 hover:text-red-200 font-bold text-2xl transition-colors ml-4"
                title="Close Config"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
