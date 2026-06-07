import { cn } from "@repo/ui/lib/utils";
import StashCard from "./stat-card";
import { StashCardProps } from "./type";
import Loader from "../../loader";

type StatGroupProps = {
  className?: string;
  stats: StashCardProps[];
  isLoading?: boolean;
};
const StatGroup = ({ className, stats, isLoading }: StatGroupProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Loader key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {stats.map((stat, index) => (
        <StashCard {...stat} key={index} />
      ))}
    </div>
  );
};

export default StatGroup;
