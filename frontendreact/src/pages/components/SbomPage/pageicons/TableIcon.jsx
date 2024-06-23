export function TableIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.width || "1em"}
      height={props?.height || "1em"}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={props?.color || "#888888"}
        d="M8 16h5v-5H8v5Zm0-7h12V4H8v5Zm7 7h5v-5h-5v5Zm-7 2q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H8Zm-4 4q-.825 0-1.412-.587T2 20V7q0-.425.288-.712T3 6q.425 0 .713.288T4 7v13h13q.425 0 .713.288T18 21q0 .425-.288.713T17 22H4Z"
      ></path>
    </svg>
  );
}
