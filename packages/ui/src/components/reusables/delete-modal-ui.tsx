import { Trash2 } from "lucide-react";
import { Button } from "../button";

export interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  /** Label for the confirm button. Defaults to "Delete" */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel" */
  cancelLabel?: string;
  /** Shows a loading spinner on the confirm button while an async action runs */
  isLoading?: boolean;
}

export const DeleteModalUi = ({
  onConfirm,
  onCancel,
  title = "Delete item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
}: DeleteModalProps) => {
  return (
    <div>
      <div className="animate-slide-up w-full max-w-md">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>

        <h2
          id="dm-title"
          className="text-md mb-4 text-center font-medium text-gray-900 lg:text-xl dark:text-gray-200"
        >
          {title}
        </h2>

        <p
          id="dm-desc"
          className="mb-7 text-center text-sm leading-relaxed text-gray-500"
        >
          {description}
        </p>

        <div className="flex gap-3">
          <Button
            variant={"outline"}
            onClick={onCancel}
            disabled={isLoading}
            className="h-12 flex-1 rounded-md text-sm font-medium text-gray-700 transition-colors"
          >
            {cancelLabel}
          </Button>

          <Button
            isLoading={isLoading}
            onClick={onConfirm}
            disabled={isLoading}
            variant={"destructive"}
            className="flex h-12 flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModalUi;
