export default (props: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={["h-4 w-4",props.className].join(" ")}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
  </svg>
);