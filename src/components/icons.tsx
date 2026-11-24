// One icon set: 16px grid, 1.5 stroke, currentColor.
type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const Check = (p: IconProps) => <Svg {...p}><path d="M3.5 8.5 6.5 11.5 12.5 4.5" /></Svg>;
export const Cross = (p: IconProps) => <Svg {...p}><path d="M4 4l8 8M12 4l-8 8" /></Svg>;
export const Question = (p: IconProps) => (
  <Svg {...p}><path d="M6 6a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2V10" /><path d="M8 12.5v.01" /></Svg>
);
export const Pending = (p: IconProps) => <Svg {...p}><circle cx="8" cy="8" r="5" opacity="0.4" /></Svg>;
export const ArrowUpRight = (p: IconProps) => <Svg {...p}><path d="M5 11l6-6M6 5h5v5" /></Svg>;
export const ArrowRight = (p: IconProps) => <Svg {...p}><path d="M3 8h10M9 4l4 4-4 4" /></Svg>;

export function Spinner({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" className={`animate-spin motion-reduce:animate-none ${className ?? ""}`}>
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M13 8a5 5 0 0 0-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
