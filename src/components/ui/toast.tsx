import * as React from "react";
export function ToastProvider({ children }: any) { return <>{children}</>>; }
export function ToastViewport({ className, ...props }: any) { return <div className={className} {...props} />; }
export function Toast({ children, className, variant, open, onOpenChange, ...props }: any) { return <div className={className} {...props}>{children}</div>; }
export function ToastTitle({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>; }
export function ToastDescription({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>; }
export function ToastClose({ className, ...props }: any) { return <button type="button" className={className} {...props}>×</button>; }
export function ToastAction({ children, altText, className, ...props }: any) { return <button type="button" className={className} {...props}>{children}</button>; }
export type ToastProps = any;
export type ToastActionElement = any;
</>
