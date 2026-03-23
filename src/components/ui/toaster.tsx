"use client";
// src/components/ui/toaster.tsx
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map(({ id, title, description, variant, action, ...props }) => (
        <ToastPrimitive.Root
          key={id}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-2",
            "overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all",
            "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
            "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
            variant === "destructive"
              ? "destructive group border-red-800 bg-red-950 text-red-200"
              : "border-gray-700 bg-gray-900 text-white"
          )}
          {...props}
        >
          <div className="grid gap-1">
            {title && (
              <ToastPrimitive.Title className="text-sm font-semibold">
                {title}
              </ToastPrimitive.Title>
            )}
            {description && (
              <ToastPrimitive.Description className="text-sm opacity-90">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
          {action}
          <ToastPrimitive.Close
            className={cn(
              "absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity",
              "hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
              variant === "destructive"
                ? "focus:ring-red-400 focus:ring-offset-red-600 text-red-200 hover:text-white"
                : "focus:ring-gray-600 text-gray-400 hover:text-white"
            )}
          >
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport
        className={cn(
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4",
          "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        )}
      />
    </ToastPrimitive.Provider>
  );
}
