export type StashCardProps = {
  title?: string;
  value?: string;
  addComma?: boolean;
  trend: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  badge?: string;
  variant?: "success" | "info" | "warning" | "error";
};
