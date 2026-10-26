export const THEMES = {
  "white-matte": {
    name: "White Matte",
    base: "bg-[#f4f4f5] border border-[#e4e4e7]", // Light off-white
    shadow: "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    // An inner highlight to make it look like thick paper
    innerStyle:
      "inset 0px 0px rgb(22, 88, 231), inset 10px -10px 50px rgba(186, 186, 218, 0.8)",
  },
  "grey-metallic": {
    name: "Grey Metallic",
    // A gradient to simulate brushed gunmetal
    base: "bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600",
    shadow: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]",
    textPrimary: "text-zinc-100",
    textSecondary: "text-zinc-400",
    // Inset shadows to create a beveled metal edge
    innerStyle:
      "inset 0 1px 2px rgba(27, 112, 14, 0.4), inset 0px -10px 8px rgba(15, 14, 14, 0.4)",
  },
} as const;
