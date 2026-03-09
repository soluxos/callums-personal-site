export default function LogoMark({ size = 24, color = "currentColor", className = "" }) {
  // 8 horizontal strips of height 2px with 1px gaps across 24px viewBox
  const strips = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <clipPath id="lm-strips">
          {strips.map(y => (
            <rect key={y} x="0" y={y} width="24" height="2" />
          ))}
        </clipPath>
      </defs>
      <path
        clipPath="url(#lm-strips)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.66658 16.9888C9.65328 17.6481 10.8133 18 12 18V24C9.62664 24 7.30656 23.2962 5.33316 21.9776C3.35976 20.6591 1.82172 18.7849 0.913441 16.5922C0.00522041 14.3995 -0.232439 11.9867 0.230581 9.65892C0.693602 7.33116 1.83648 5.19294 3.51474 3.51474C5.19294 1.83648 7.33116 0.693602 9.65892 0.230581C11.9867 -0.232439 14.3995 0.00522041 16.5922 0.913441C18.7849 1.82172 20.6591 3.35976 21.9776 5.33316C23.2962 7.30656 24 9.62664 24 12H18C18 10.8133 17.6481 9.65328 16.9888 8.66658C16.3295 7.67988 15.3925 6.91086 14.2961 6.45672C13.1998 6.00258 11.9933 5.88378 10.8295 6.11532C9.66558 6.3468 8.5965 6.91824 7.75734 7.75734C6.91824 8.5965 6.3468 9.66558 6.11532 10.8295C5.88378 11.9933 6.00258 13.1998 6.45672 14.2961C6.91086 15.3925 7.67988 16.3295 8.66658 16.9888Z"
        fill={color}
      />
    </svg>
  );
}
