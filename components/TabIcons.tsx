type TabIconProps = {
  name: "home" | "plan" | "tensaku" | "kakomon" | "qa" | "senpai" | "sites";
  active?: boolean;
};

export function TabIcon({ name, active }: TabIconProps) {
  const stroke = active ? "var(--accent)" : "currentColor";

  switch (name) {
    case "home":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M3 10.5 12 3l9 7.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 9.5V20h13V9.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "plan":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <rect
            x="4"
            y="5"
            width="16"
            height="15"
            rx="2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 3.5v3M16 3.5v3M4 9.5h16M8 13h3M8 16.5h6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tensaku":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m13 7 4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "kakomon":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <rect
            x="6"
            y="4"
            width="12"
            height="16"
            rx="2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9.5h6M9 13h4.5M9 16.5h3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "qa":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M7 18.5H4.5A1.5 1.5 0 0 1 3 17V6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5V17a1.5 1.5 0 0 1-1.5 1.5H11l-4 3v-3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 10.5h.01M14.5 10.5h.01"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "senpai":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M9 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 19a4.5 4.5 0 0 1 9 0M14 19a3.5 3.5 0 0 1 7 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "sites":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8v8M8 12h8"
            fill="none"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
