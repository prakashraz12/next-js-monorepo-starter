type StashCardProps = {
  title?: string;
  value?: string;
  addComma?: boolean;
  trend: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  badge?: string;
  variant?: "success" | "info" | "warning" | "error";
};

const config = {
  success: {
    iconBg: "#E1F5EE",
    badgeBg: "#E1F5EE",
    badgeColor: "#0F6E56",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M2 12l5-5 3.5 3.5L16 4"
          stroke="#0F6E56"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    iconBg: "#E6F1FB",
    badgeBg: "#E6F1FB",
    badgeColor: "#185FA5",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="#185FA5" strokeWidth="1.6" />
        <path
          d="M9 8.5v3.5M9 6v.5"
          stroke="#185FA5"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  warning: {
    iconBg: "#FAEEDA",
    badgeBg: "#FAEEDA",
    badgeColor: "#854F0B",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 3L15.5 15H2.5L9 3Z"
          stroke="#854F0B"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 8v3M9 12.5v.5"
          stroke="#854F0B"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  error: {
    iconBg: "#FCEBEB",
    badgeBg: "#FCEBEB",
    badgeColor: "#A32D2D",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="#A32D2D" strokeWidth="1.6" />
        <path
          d="M7 7l4 4M11 7l-4 4"
          stroke="#A32D2D"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

const trendChipStyles = {
  up: { bg: "#E1F5EE", color: "#0F6E56" },
  down: { bg: "#FCEBEB", color: "#A32D2D" },
  neutral: { bg: "#F1EFE8", color: "#5F5E5A" },
};

const TrendIcon = ({
  trend,
  color,
}: {
  trend: "up" | "down" | "neutral";
  color: string;
}) => {
  if (trend === "up")
    return (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M5.5 9V2M2 5.5l3.5-3.5 3.5 3.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (trend === "down")
    return (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M5.5 2v7M2 5.5l3.5 3.5 3.5-3.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M2 5.5h7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

function formatValue(value?: string, addComma?: boolean): string {
  if (!value) return "—";
  if (!addComma) return value;
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return value;
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.]+$/)?.[0] ?? "";
  return prefix + num.toLocaleString() + suffix;
}

const StashCard = ({
  title,
  value,
  addComma,
  trend,
  trendValue,
  trendLabel = "vs last period",
  badge,
  variant = "info",
}: StashCardProps) => {
  const v = config[variant];
  const chip = trendChipStyles[trend];

  return (
    <div
      style={{
        background: "#ffffff",
        border: "0.5px solid #e5e5e5",
        borderRadius: 8,
        padding: "20px",
        width: "100%",
      }}
    >
      {/* Top: icon + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: v.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {v.icon}
        </div>
        {badge && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 9px",
              borderRadius: 8,
              background: v.badgeBg,
              color: v.badgeColor,
              letterSpacing: "0.02em",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      {title && (
        <p
          style={{
            fontSize: 14,
            color: "#888",
            letterSpacing: "0.04em",
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          {title}
        </p>
      )}

      {/* Value */}
      <p
        style={{
          fontSize: 23,
          fontWeight: 500,
          color: "#111",
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
          marginBottom: 14,
        }}
      >
        {formatValue(value, addComma)}
      </p>

      {/* Divider */}
      <div
        style={{ height: "0.5px", background: "#e5e5e5", marginBottom: 12 }}
      />

      {/* Trend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            borderRadius: 20,
            background: chip.bg,
            color: chip.color,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <TrendIcon trend={trend} color={chip.color} />
          {trendValue ?? (trend === "neutral" ? "Unchanged" : "")}
        </div>
        <span style={{ fontSize: 12, color: "#aaa" }}>{trendLabel}</span>
      </div>
    </div>
  );
};

export default StashCard;
