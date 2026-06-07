import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CopyButton = ({ value }: { value: string | number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex size-4 cursor-pointer items-center justify-center"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
};

export default CopyButton;
