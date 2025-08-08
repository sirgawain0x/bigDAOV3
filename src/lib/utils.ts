import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isUserRejectedError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }

  const anyError = error as any;

  const code = anyError?.code ?? anyError?.cause?.code;
  const name: string | undefined = anyError?.name ?? anyError?.cause?.name;
  const message: string | undefined =
    anyError?.message ?? anyError?.shortMessage ?? anyError?.cause?.message;

  const lowerName = name?.toLowerCase?.() || "";
  const lowerMsg = message?.toLowerCase?.() || "";

  if (code === 4001) {
    return true; // EIP-1193: user rejected the request
  }

  if (lowerName.includes("userrejected")) {
    return true;
  }

  if (
    lowerMsg.includes("user rejected") ||
    lowerMsg.includes("rejected the request") ||
    lowerMsg.includes("request rejected")
  ) {
    return true;
  }

  return false;
};

export const getReadableError = (
  error: unknown,
  fallbackMessage: string = "Something went wrong",
): string => {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  const anyError = error as any;
  const message: string | undefined =
    anyError?.message || anyError?.shortMessage || anyError?.cause?.message;

  if (message && typeof message === "string") {
    return message;
  }

  try {
    const stringified = JSON.stringify(error);
    if (stringified && stringified !== "{}") {
      return stringified;
    }
  } catch {
    // ignore JSON stringify errors
  }

  return fallbackMessage;
};
