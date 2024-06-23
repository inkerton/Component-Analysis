export function TreeIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || "1em"}
      height={props?.height || "1em"}
      viewBox="0 0 14 14"
      {...props}
    >
      <g fill="none" stroke={props?.color || "#888888"} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="2.5" r="1.5"></circle>
        <circle cx="2" cy="11.5" r="1.5"></circle>
        <circle cx="7" cy="11.5" r="1.5"></circle>
        <circle cx="12" cy="11.5" r="1.5"></circle>
        <path d="M2 10V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2M7 4v6"></path>
      </g>
    </svg>
  );
}
