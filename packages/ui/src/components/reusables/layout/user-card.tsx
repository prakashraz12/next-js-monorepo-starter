import { Briefcase, Users, Plus, User, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Avatar } from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/lib/utils";
import Loader from "../loader";
import MenuItem from "./menu-item";

type UserCardProps = {
  name: string;
  email: string;
  url: string;
  containerClassName?: string;
  currentBusiness?: string;
  collapsed?: boolean;
  isLoading?: boolean;
};

const UserCard = ({
  name,
  email,
  url,
  containerClassName,
  currentBusiness = "Acme Co.",
  collapsed,
  isLoading,
}: UserCardProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-sm border p-1",
            containerClassName,
            collapsed ? "px-0 py-0" : "",
          )}
        >
          {isLoading ? (
            <Loader className="h-[55px] w-[55px] rounded-sm border" />
          ) : (
            <Avatar src={url} name={name} size="md" />
          )}

          <div
            className={
              collapsed ? "hidden" : "flex min-w-0 flex-1 flex-col items-start"
            }
          >
            {isLoading ? (
              <Loader className="h-3 w-full rounded-sm" />
            ) : (
              <p className="w-full truncate text-xs font-semibold">{name}</p>
            )}

            {isLoading ? (
              <Loader className="mt-3 h-2 w-full rounded-sm" />
            ) : (
              <p className="mt-1 w-full truncate text-[10px] text-muted-foreground">
                {email}
              </p>
            )}
          </div>
          {!collapsed && (
            <ChevronRight
              size={16}
              className="shrink-0 text-muted-foreground"
            />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" side="left" className="min-w-62 p-0">
        <div className="flex items-center gap-2.5 border-b px-3.5 py-3">
          {/* <Avatar src={url} name={name} size="sm" /> */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="px-2 pt-2 pb-2">
          <MenuItem icon={Briefcase} label="Business settings" />

          <MenuItem icon={Users} label="Switch business">
            <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              {currentBusiness}
            </span>
          </MenuItem>

          <MenuItem icon={Plus} label="Create business" />
          <MenuItem icon={User} label="Profile" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserCard;
