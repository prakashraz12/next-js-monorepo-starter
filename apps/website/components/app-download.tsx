import { DownloadQr } from "./download-qr";
import { StoreButtons } from "./store-buttons";

export function AppDownload({
  variant = "light",
  centered = false,
}: {
  variant?: "hero" | "light";
  centered?: boolean;
}) {
  return (
    <div
      className={`flex w-fit flex-col gap-4 ${centered ? "items-center" : "items-start"}`}
    >
      <DownloadQr variant={variant} />
      <StoreButtons variant={variant} />
    </div>
  );
}
