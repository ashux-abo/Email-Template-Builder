"use client";

import { toast as reactToastify } from "react-toastify";
import React, { createContext, useContext } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

// Original toast context structure for compatibility
type ToastActionElement = React.ReactElement;

export type Toast = {
  id?: string; // Make id optional to fix all the toast calls
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  onClose?: () => void;
};

// Add a ToastProps type for the Toast component
type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  onClose?: () => void;
};

type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const ToastContext = createContext<{
  toast: (props: Toast) => void;
  dismiss: (toastId?: string) => void;
}>({
  toast: () => {},
  dismiss: () => {},
});

// Create a provider that uses react-toastify
export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Now using react-toastify
  const toast = ({ title, description, variant }: Toast) => {
    const message = title || description || "";
    if (variant === "destructive") {
      reactToastify.error(message as string);
    } else {
      reactToastify.success(message as string);
    }
  };

  const dismiss = () => {
    reactToastify.dismiss();
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook for components that already use useToast
export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    // Instead of throwing an error, we'll return a wrapper around react-toastify
    return {
      toast: ({ title, description, variant }: Toast) => {
        const message = title || description || "";
        if (variant === "destructive") {
          reactToastify.error(message as string);
        } else {
          reactToastify.success(message as string);
        }
      },
      dismiss: (toastId?: string) => {
        if (toastId) {
          reactToastify.dismiss(toastId);
        } else {
          reactToastify.dismiss();
        }
      },
    };
  }

  return context;
}

function Toast({
  title,
  description,
  variant = "default",
  onClose,
}: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all duration-200 bg-white",
        variant === "destructive" &&
          "border-destructive bg-destructive/10 text-destructive",
      )}
    >
      <div className="flex flex-col gap-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
