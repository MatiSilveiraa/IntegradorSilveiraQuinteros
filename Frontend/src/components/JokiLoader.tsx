export default function JokiLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="40 10 150 190" className="w-32 h-32">
        <path
          id="jokiPath"
          d="
    M105 25
    L105 185
    L68 170
    L68 92

    M120 25
    L120 185
    L157 170
    L157 92
  "
          fill="none"
          stroke="#7FDA58"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
        />
        <circle r="6" fill="#7FDA58" className="drop-shadow-[0_0_10px_#7FDA58]">
          <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#jokiPath" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}
