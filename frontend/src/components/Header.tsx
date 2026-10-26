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

  const [titlePart1, titlePart2] = title.split("|").map((s) => s.trim());

  return (
    <header className="sticky top-0 z-50 w-full drop-shadow-md">
      <div
        className="w-full h-32 sm:h-24 flex relative transition-all duration-500 ease-in-out"
        style={{
          clipPath: isOpen
            ? "polygon(0 0, 100% 0, 100% 63%, 30% 60%, 18% 100%, 0 100%)"
            : "polygon(0 0, 30% 0, 30% 60%, 30% 100%, 20% 100%, 0 100%)",
          background:
            "linear-gradient(135deg, #333c67 0%, #31324e 7%, #2c479e 55%, #0c0c0c 56%, #1737d8 57%, #06080d 85%, #536287  100%)",
          boxShadow:
            "inset 0 3px 3px rgba(249, 248, 248, 0.6), inset 0 -3px 5px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left Tab */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-[30%] flex flex-col justify-center items-center cursor-pointer z-10 hover:bg-black/70 transition-colors pb-6 sm:pb-0"
          title="Toggle Header"
        >
          <div className="flex flex-col items-center w-full px-2">
            {titlePart1 && (
              <h1 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest font-alternate">
                {titlePart1}
              </h1>
            )}

            {/* Horizontal Line Separator */}
            {titlePart1 && titlePart2 && (
              <div className="w-12 h-[1px] bg-gray-400/50 my-1.5" />
            )}

            {/* Single Text Marquee with Fade Mask */}
            {titlePart2 && (
              <div className="w-full marquee-mask flex justify-center">
                <h2 className="text-[10px] sm:text-xs font-extrabold text-white animate-marquee-single uppercase tracking-wider font-orbitron">
                  {titlePart2}
                </h2>
              </div>
            )}

            <p className="text-[9px] sm:text-[10px] font-medium text-gray-300 mt-1 uppercase tracking-wider font-orbitron">
              {date}
            </p>
          </div>
        </div>

        {/* Right Body (Nav / Config) */}
        <div
          className={`w-[70%] flex items-center pl-4 sm:pl-12 pr-4 sm:pr-8 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {!showConfig ? (
            <nav className="flex w-full justify-between sm:justify-evenly text-[10px] sm:text-sm font-semibold text-gray-200 font-orbitron pb-6 sm:pb-7">
              <Link to="/" className="hover:text-black transition-colors">
                Gallery
              </Link>
              <button
                onClick={() => setShowConfig(true)}
                className="hover:text-black transition-colors drop-shadow-sm tracking-widest font-bold"
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
            <div className="flex items-center justify-between w-full font-orbitron text-gray-200 pb-6 sm:pb-7">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-6">
                <button
                  onClick={togglePageTheme}
                  className="text-left hover:text-white transition-all flex items-center gap-2 text-[9px] sm:text-xs"
                >
                  <span className="uppercase tracking-widest text-gray-300">
                    Page Theme
                  </span>
                  <span className="border border-gray-500 px-1.5 sm:px-2 py-0.5 rounded bg-black/40 text-white">
                    {pageTheme}
                  </span>
                </button>

                <button
                  onClick={toggleDefaultPolaroidTheme}
                  className="text-left hover:text-white transition-all flex items-center gap-2 text-[9px] sm:text-xs"
                >
                  <span className="uppercase tracking-widest text-gray-300">
                    Frame Theme
                  </span>
                  <span className="border border-gray-500 px-1.5 sm:px-2 py-0.5 rounded bg-black/40 text-white">
                    {defaultPolaroidTheme === "white-matte" ? "White" : "Metal"}
                  </span>
                </button>

                <button
                  onClick={resetThemes}
                  className="text-left border border-gray-200 px-1.5 sm:px-2 py-0.5 rounded bg-black/40 text-red-400 hover:text-red-900 transition-all text-[9px] sm:text-xs uppercase tracking-widest font-bold"
                >
                  Reset
                </button>
              </div>

              <button
                onClick={() => setShowConfig(false)}
                className="text-red-400 hover:text-red-200 font-bold text-xl sm:text-2xl transition-colors ml-2 sm:ml-4"
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
