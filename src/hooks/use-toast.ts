// src/hooks/use-toast.ts
// Minimal shadcn/ui-compatible toast hook — no circular deps.
// Adapted from https://ui.shadcn.com/docs/components/toast
"use client";

import * as React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ToastProps {
  id:           string;
  title?:       React.ReactNode;
  description?: React.ReactNode;
  variant?:     "default" | "destructive";
  action?:      React.ReactNode;
  open?:        boolean;
  duration?:    number;
}

type ToastInput = Omit<ToastProps, "id" | "open">;

interface ToastState {
  toasts: ToastProps[];
}

// ─── Action types ─────────────────────────────────────────────────────────────
type Action =
  | { type: "ADD";    toast: ToastProps }
  | { type: "UPDATE"; toast: Partial<ToastProps> & { id: string } }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string };

const TOAST_LIMIT   = 3;
const TOAST_TIMEOUT = 5000;

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state: ToastState, action: Action): ToastState {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "UPDATE":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case "DISMISS":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, open: false } : t
        ),
      };
    case "REMOVE":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// ─── Global singleton state ───────────────────────────────────────────────────
let count = 0;
function genId() { return `toast-${++count}`; }

type Listener = (state: ToastState) => void;
const listeners: Listener[] = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function toast(input: ToastInput) {
  const id = genId();

  function dismiss() {
    dispatch({ type: "DISMISS", id });
    setTimeout(() => dispatch({ type: "REMOVE", id }), 300);
  }

  dispatch({
    type:  "ADD",
    toast: { ...input, id, open: true },
  });

  const duration = input.duration ?? TOAST_TIMEOUT;
  if (duration !== Infinity) {
    setTimeout(d)smiss, duration);
  }

  return { id, dismiss, update: (props: Partial<ToastInput>) =>
    dispatch({ type: "UPDATE", toast: { ...props, id } }) };
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id: string) => {
      dispatch({ type: "DISMISS", id });
      setTimeout(() => dispatch({ type: "REMOVE", id }), 300);
    },
  };
}
