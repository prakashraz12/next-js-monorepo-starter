"use client";
import Link from "next/link"; // or your router's Link
import { useRouter } from "next/navigation";

type BackButtonProps = {
  type: "Link" | "button";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
};

const sizeStyles = {
  sm: { padding: "6px 10px", fontSize: "13px", iconSize: 12 },
  md: { padding: "8px 14px", fontSize: "14px", iconSize: 14 },
  lg: { padding: "10px 18px", fontSize: "15px", iconSize: 16 },
};

const ArrowIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 3L5 8L10 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const baseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "transparent",
  border: "0.5px solid #c0bfba",
  borderRadius: "8px",
  cursor: "pointer",
  color: "inherit",
  textDecoration: "none",
  fontFamily: "inherit",
  transition: "background 0.15s, border-color 0.15s",
};

const BackButton = ({
  type,
  href,
  onClick,
  disabled = false,
  size = "md",
  withLabel = false,
}: BackButtonProps) => {
  const router = useRouter();
  const { padding, fontSize, iconSize } = sizeStyles[size];
  const style: React.CSSProperties = {
    ...baseStyle,
    padding: withLabel ? padding : padding.split(" ")[0],
    fontSize,
    opacity: disabled ? 0.4 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };

  const content = (
    <>
      <ArrowIcon size={iconSize} />
      {withLabel && "Back"}
    </>
  );

  if (type === "Link" && href) {
    return (
      <Link href={href} style={style} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  const handleBackButtonClick = () => {
    if (window !== undefined && window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };
  return (
    <button
      className="shadow-sm"
      style={style}
      onClick={() => {
        handleBackButtonClick();
        if (onClick) {
          onClick();
        }
      }}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default BackButton;
