/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { UseMutationOptions } from "@tanstack/react-query";

type TOpts = {
  successMessage?: string;
  disableDefaultToast?: boolean;
  disableErrorToast?: boolean;
};

export const parseBackendValidation = <T extends FieldValues, E>(
  res: T,
  setErrors: UseFormSetError<T>,
): void => {
  const errors = res as Partial<T> & E;

  Object.entries(errors).forEach(([key, _value]) => {
    setErrors(
      key as keyof T as Path<T>,
      {
        type: "manual",
        message:
          Array.isArray(_value) && _value.length === 1
            ? _value.toString()
            : "Something went wrong",
      },
      {
        shouldFocus: true,
      },
    );
  });
};

export const options = <T, Output>(
  setError?: UseFormSetError<T extends FieldValues ? T : FieldValues>,
  successCallback?: (data: Output) => void | Promise<void>,
  opts?: TOpts,
): Omit<UseMutationOptions<any, any, any, unknown>, "mutationFn"> => ({
  onSuccess(data) {
    if (!opts?.disableDefaultToast) {
      if (data.message) {
        toast.success(data.message);
      }
    }
    if (successCallback) {
      successCallback(data);
    }
  },
  onError(data) {
    console.warn(data, "this is payload data eerorr");
    const payload = data.stack;
    const statusCode = data.stack.statusCode;

    if (statusCode === 406 && typeof payload.message === "object") {
      if (setError) {
        parseBackendValidation(payload.message, setError);
      }
      if (!opts?.disableErrorToast) {
        toast.error("Validation error occured!");
      }
      return;
    }

    if (!opts?.disableErrorToast) {
      toast.error(payload.message || "Operation failed");
    }
  },
});
