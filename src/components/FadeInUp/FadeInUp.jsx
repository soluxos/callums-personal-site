// Lifts a section into place as it fades in. The motion is CSS (.rise-in in globals.css), so
// it starts with the first paint. It used to be a Motion animation, which waited for the page's
// scripts, stuttered while they ran and blinked off for a frame as it finished.
export default function FadeInUp({ children, className = "", delay = 0, style }) {
  return (
    <div
      className={`rise-in ${className}`}
      style={delay ? { "--rise-delay": `${delay}s`, ...style } : style}
    >
      {children}
    </div>
  );
}
