"use client";

import * as React from "react";
import Dropzone, {
  type DropzoneProps,
  type DropzoneRef,
  type FileRejection,
} from "react-dropzone";
import {
  FileText,
  FileType,
  RefreshCcw,
  Trash2,
  UploadIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../button";
import Image from "next/image";
import { cn, formatBytes, getUrlExtension } from "@repo/ui/lib/utils";

type TServerFile = {
  id: string;
  name: string;
  url: string;
  size: number;
};

type TFileInputProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: (File | TServerFile)[];

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<(File | TServerFile)[]>>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps["maxFiles"];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;

  /**
   * Variant of the file input.
   * - "default": full drag-and-drop zone (h-44)
   * - "input": compact h-11 button, no DnD
   */
  variant: "input" | "default";
};

type FileCardProps = {
  file: File | TServerFile;
  onRemove: () => void;
  onReplace?: () => void;
  hideImageDetails?: boolean;
  hideFileSize?: boolean;
  hideInputMultiple?: boolean;
  disabled?: boolean;
};

export function isFileWithPreview(
  file: File | TServerFile,
): file is File & { preview: string } {
  if (file instanceof File) {
    return "preview" in file && typeof file.preview === "string";
  }

  return false;
}

function isFileFromServer(file: File | TServerFile): file is TServerFile {
  return "url" in file;
}

const previewFile = ["png", "jpg", "jpeg", "webp", "gif"];

const getFileIcon = ({ extension }: { extension: string }) => {
  switch (extension) {
    case "ttf":
    case "otf":
      return <FileType className="my-0.5 size-6 text-red-500/80" />;
    default:
      return <FileText className="my-0.5 size-6 text-red-500/80" />;
  }
};

const getfileName = (fileName: string) => {
  // catt_new_7012783.jpeg to catt_new.jpeg
  const ext = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase()
    : "";
  const file = fileName.split(".")[0] || "file";
  const newName = file.includes("_")
    ? fileName.substring(0, file.lastIndexOf("_"))
    : file;
  return ext ? `${newName}.${ext}` : newName;
};

export function FileCard({
  file,
  onRemove,
  onReplace,
  hideImageDetails,
  hideFileSize = false,
  hideInputMultiple,
  disabled = false,
}: FileCardProps) {
  return (
    <div className="group relative flex h-fit flex-1 items-center space-x-4 rounded-md border px-2 py-2">
      <div className="flex flex-1 items-center space-x-4">
        {isFileWithPreview(file) && (
          <div>
            {!previewFile?.find((item) => file?.name?.includes(item)) ? (
              getFileIcon({
                extension: getUrlExtension(file?.name),
              })
            ) : (
              <Image
                src={file.preview}
                alt={file.name}
                width={30}
                height={30}
                loading="lazy"
                className={cn(
                  "3xl:size-[50px] aspect-square size-[49px] shrink-0 rounded-md object-contain",
                  hideInputMultiple && "3xl:h-12 h-11",
                )}
              />
            )}
          </div>
        )}
        {isFileFromServer(file) && (
          <div>
            {!previewFile?.find((item) =>
              getUrlExtension(file?.url).includes(item),
            ) ? (
              getFileIcon({
                extension: getUrlExtension(file?.url),
              })
            ) : (
              <Image
                src={file.url}
                alt={file.name}
                loading="lazy"
                className={cn(
                  "3xl:size-[55px] aspect-square size-[49px] shrink-0 rounded-md object-contain",
                  hideInputMultiple && "3xl:h-12 h-11",
                )}
              />
            )}
          </div>
        )}
        {!hideImageDetails && (
          <div className="flex w-full flex-col">
            <div className="space-y-px">
              <p
                className={cn(
                  "3xl:text-base line-clamp-1 text-sm font-semibold break-all text-foreground/80",
                  disabled && "opacity-50",
                )}
              >
                {isFileFromServer(file) ? getfileName(file.name) : file.name}
              </p>
              {!hideFileSize && (
                <p className="3xl:text-sm text-[10px] text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {!hideImageDetails && (
        <div className={cn("flex items-center gap-2")}>
          {!hideInputMultiple && (
            <Button
              variant="ghost"
              size="icon"
              className="!size-6 hover:bg-accent/10"
              onClick={(e) => {
                e.preventDefault();
                onReplace?.();
              }}
              disabled={disabled}
            >
              <RefreshCcw className="3xl:size-4 size-3" aria-hidden="true" />
              <span className="sr-only">Replace file</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "!size-6 p-1 text-destructive hover:bg-accent/10",
              !disabled && "group-hover:opacity-100",
            )}
            onClick={(e) => {
              e.preventDefault();
              onRemove?.();
            }}
            disabled={disabled}
          >
            <Trash2 className="3xl:size-4 size-3" aria-hidden="true" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}

      {hideInputMultiple && (
        <Button
          variant="destructive"
          size="xs"
          className={cn(
            "p-1 group-hover:opacity-100",
            hideInputMultiple && "absolute -top-1 -right-1 !size-4",
            hideInputMultiple && "opacity-0 group-hover:opacity-0",
          )}
          onClick={onRemove}
        >
          <X className="text-white" size={16} aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      )}
    </div>
  );
}

const FileInput = React.forwardRef<DropzoneRef, TFileInputProps>(
  (props, ref) => {
    const {
      value: valueProp,
      onValueChange,
      accept = { "image/*": [] },
      maxSize = 1024 * 1024 * 2,
      maxFiles = 1,
      multiple = false,
      variant,
      disabled = false,
      className,
      ...dropzoneProps
    } = props;

    const [files, setFiles] = React.useState<(TServerFile | File)[]>(
      valueProp ?? [],
    );
    const isFirstRenderRef = React.useRef(true);
    const suppressOnValueChangeRef = React.useRef(false);

    // --- Replace logic ---
    const replaceInputRef = React.useRef<HTMLInputElement>(null);
    const replaceIndexRef = React.useRef<number | null>(null);

    // --- Input variant file ref ---
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    function onReplace(index: number) {
      replaceIndexRef.current = index;
      replaceInputRef.current?.click();
    }

    function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file || replaceIndexRef.current === null || !files) return;

      if (file.size > maxSize) {
        toast.error(
          `File ${file.name} exceeds the ${formatBytes(maxSize)} size limit.`,
        );
        e.target.value = "";
        return;
      }

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      const updatedFiles = [...files];
      updatedFiles[replaceIndexRef.current] = newFile;
      setFiles(updatedFiles);

      replaceIndexRef.current = null;
      e.target.value = "";
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const selected = Array.from(e.target.files ?? []);
      if (!selected.length) return;

      if ((files?.length ?? 0) + selected.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        e.target.value = "";
        return;
      }

      const oversized = selected.filter((f) => f.size > maxSize);
      if (oversized.length) {
        oversized.forEach((f) =>
          toast.error(
            `File ${f.name} exceeds the ${formatBytes(maxSize)} size limit.`,
          ),
        );
        e.target.value = "";
        return;
      }

      const newFiles = selected.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      );

      setFiles((prev) => [...(prev ?? []), ...newFiles]);
      e.target.value = "";
    }

    // --- Default variant: dropzone onDrop ---
    const onDrop = React.useCallback(
      (
        acceptedFiles: File[] | TServerFile[],
        rejectedFiles: FileRejection[],
      ) => {
        if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
          toast.error("Cannot upload more than 1 file at a time");
          return;
        }

        if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
          toast.error(`Cannot upload more than ${maxFiles} files`);
          return;
        }

        const newFiles = acceptedFiles.map((file) => {
          if (file instanceof File) {
            return Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
          }
          return file;
        });

        const updatedFiles = files ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);

        if (rejectedFiles.length > 0) {
          rejectedFiles.forEach(({ file }) => {
            if (file.size > maxSize) {
              toast.error(`File ${file.name} exceeds the 2 MB size limit.`);
            } else {
              toast.error(`File ${file.name} was rejected`);
            }
          });
        }
      },
      [files, maxFiles, maxSize, multiple, setFiles],
    );

    function onRemove(index: number) {
      if (!files) return;
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
    }

    const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

    React.useEffect(() => {
      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
        return;
      }
      // if files was updated because of an incoming `valueProp` update,
      // suppress calling `onValueChange` to avoid update loops.
      if (suppressOnValueChangeRef.current) {
        suppressOnValueChangeRef.current = false;
        return;
      }

      if (onValueChange) {
        onValueChange(files ?? []);
      }
    }, [files, onValueChange]);

    React.useEffect(() => {
      // mark that the next files update comes from the controlled prop
      // so the files->onValueChange effect can ignore it and avoid loops.
      suppressOnValueChangeRef.current = true;
      setFiles(valueProp ?? []);
    }, [valueProp]);

    return (
      <div className="flex flex-1 flex-col space-y-4">
        <input
          ref={replaceInputRef}
          type="file"
          className="hidden"
          accept={Object.keys(accept).join(",")}
          multiple={false}
          onChange={handleReplaceFile}
        />

        {variant === "input" ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={Object.keys(accept).join(",")}
              multiple={maxFiles > 1 || multiple}
              onChange={handleInputChange}
            />

            {!isDisabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                className={cn(
                  "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-muted/40",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                  disabled && "pointer-events-none opacity-60",
                  className,
                )}
              >
                <UploadIcon className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {files?.length ? "Add more files…" : "Click to upload a file"}
                </span>
                {maxFiles > 1 && (
                  <span className="ml-auto text-xs text-muted-foreground/60">
                    {files?.length ?? 0}/{maxFiles}
                  </span>
                )}
              </button>
            )}

            {files?.length ? (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <FileCard
                    key={index}
                    file={file}
                    onRemove={() => onRemove(index)}
                    onReplace={() => onReplace(index)}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Dropzone
              ref={ref}
              onDrop={onDrop}
              accept={accept}
              maxSize={maxSize}
              maxFiles={maxFiles}
              multiple={maxFiles > 1 || multiple}
              disabled={isDisabled}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={cn(
                    "group relative grid h-44 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                    "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                    isDragActive && "border-muted-foreground/50",
                    isDisabled && "pointer-events-none opacity-60",
                    className,
                  )}
                  {...dropzoneProps}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                      <div className="rounded-full border border-dashed p-3">
                        <UploadIcon
                          className="3xl:size-7 size-5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="3xl:text-base text-sm font-medium text-muted-foreground">
                        Drop the files here
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                      <div className="rounded-full border border-dashed p-3">
                        <UploadIcon
                          className="3xl:size-7 size-5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="3xl:text-base text-sm font-medium text-muted-foreground">
                          Drag {`'n'`} drop files here, or click to select files
                        </p>
                        <p className="3xl:text-sm text-xs text-muted-foreground/70">
                          You can upload
                          {maxFiles > 1
                            ? ` ${maxFiles === Infinity ? "multiple" : maxFiles} files (up to ${formatBytes(maxSize)} each)`
                            : ` a file with ${formatBytes(maxSize)}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>

            {files?.length ? (
              <div className="space-y-4">
                {files?.map((file, index) => (
                  <FileCard
                    key={index}
                    file={file}
                    onRemove={() => onRemove(index)}
                    onReplace={() => onReplace(index)}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    );
  },
);

FileInput.displayName = "FileInput";

export default FileInput;
