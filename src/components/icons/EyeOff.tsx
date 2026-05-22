type Props = { className?: string };

export default function EyeOffIcon({ className = "h-5 w-5" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10.6 6.2A10.1 10.1 0 0 1 12 6c6.5 0 10 6 10 6a20.6 20.6 0 0 1-3.6 4.4M6.5 8.4A20.7 20.7 0 0 0 2 12s3.5 6 10 6c.5 0 1 0 1.5-.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
