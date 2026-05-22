type Props = { className?: string };

export default function CalendarIcon({ className = "h-5 w-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 3v4M8 3v4M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
