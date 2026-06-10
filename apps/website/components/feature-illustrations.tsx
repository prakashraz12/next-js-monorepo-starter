import { cn } from "@repo/ui/lib/utils";

type IllustrationProps = {
  className?: string;
};

export function BookingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-24", className)}
      aria-hidden
    >
      <rect x="10" y="20" width="100" height="80" rx="12" fill="#1f8c66" />
      <rect x="18" y="28" width="84" height="64" rx="8" fill="#26a579" />
      <circle cx="40" cy="52" r="10" fill="#fbbf24" />
      <circle cx="80" cy="52" r="10" fill="#fbbf24" />
      <rect x="30" y="72" width="60" height="8" rx="4" fill="#a8e6cf" />
      <rect x="72" y="8" width="32" height="28" rx="6" fill="#fff" />
      <rect x="78" y="16" width="20" height="4" rx="2" fill="#26a579" />
      <rect x="78" y="24" width="14" height="4" rx="2" fill="#a8e6cf" />
    </svg>
  );
}

export function PlayerTrackingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-24", className)}
      aria-hidden
    >
      <circle cx="60" cy="60" r="48" fill="#e8f7f1" />
      <path
        d="M60 28l8 16h18l-14 11 5 17-17-12-17 12 5-17-14-11h18z"
        fill="#f59e0b"
      />
      <rect x="28" y="78" width="64" height="10" rx="5" fill="#26a579" />
      <rect x="36" y="92" width="20" height="6" rx="3" fill="#a8e6cf" />
      <rect x="64" y="92" width="20" height="6" rx="3" fill="#a8e6cf" />
    </svg>
  );
}

export function MembershipIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-24", className)}
      aria-hidden
    >
      <rect x="18" y="34" width="84" height="52" rx="10" fill="#1f8c66" />
      <rect x="26" y="42" width="68" height="36" rx="6" fill="#26a579" />
      <circle cx="42" cy="60" r="10" fill="#fbbf24" />
      <rect x="58" y="54" width="30" height="5" rx="2.5" fill="#fff" />
      <rect x="58" y="64" width="22" height="4" rx="2" fill="#a8e6cf" />
      <rect x="50" y="22" width="20" height="18" rx="4" fill="#f59e0b" />
    </svg>
  );
}

export function BillingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-24", className)}
      aria-hidden
    >
      <rect x="30" y="16" width="60" height="88" rx="8" fill="#fff" />
      <rect x="38" y="30" width="44" height="6" rx="3" fill="#d4f0e4" />
      <rect x="38" y="42" width="36" height="4" rx="2" fill="#e8f7f1" />
      <rect x="38" y="52" width="40" height="4" rx="2" fill="#e8f7f1" />
      <rect x="38" y="68" width="44" height="10" rx="5" fill="#26a579" />
      <circle cx="78" cy="78" r="22" fill="#fbbf24" />
      <text
        x="78"
        y="84"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#1f8c66"
      >
        Rs
      </text>
    </svg>
  );
}

export function LiveStatusIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-24", className)}
      aria-hidden
    >
      <rect x="12" y="36" width="42" height="48" rx="8" fill="#26a579" />
      <rect x="66" y="36" width="42" height="48" rx="8" fill="#1f8c66" />
      <circle cx="33" cy="52" r="6" fill="#a8e6cf" />
      <circle cx="87" cy="52" r="6" fill="#fca5a5" />
      <rect x="22" y="64" width="22" height="6" rx="3" fill="#d4f0e4" />
      <rect x="76" y="64" width="22" height="6" rx="3" fill="#fca5a5" />
      <circle cx="60" cy="18" r="8" fill="#ef4444" />
      <circle
        cx="60"
        cy="18"
        r="14"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
  );
}

export function AnalyticsIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-24", className)}
      aria-hidden
    >
      <rect x="16" y="20" width="88" height="72" rx="10" fill="#fff" />
      <rect x="28" y="72" width="12" height="12" rx="2" fill="#a8e6cf" />
      <rect x="46" y="58" width="12" height="26" rx="2" fill="#5bc49a" />
      <rect x="64" y="44" width="12" height="40" rx="2" fill="#26a579" />
      <rect x="82" y="34" width="12" height="50" rx="2" fill="#1f8c66" />
      <polyline
        points="28,50 46,46 64,38 82,30"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
