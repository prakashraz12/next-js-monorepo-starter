import { Avatar } from "@repo/ui/components/avatar";

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Pool House" src="https://github.com/shadcn.png" />
      <Avatar name="Jane Doe" />
      <Avatar name="Alex" size="56px" />
    </div>
  );
}
