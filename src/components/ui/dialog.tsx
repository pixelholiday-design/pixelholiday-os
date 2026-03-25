import * as React from "react";
export function Dialog({ children, open, onOpenChange }: any) { return <>{children}</>>; }
export function DialogTrigger({ children, asChild, ...props }: any) { return <>{children}</>>; }
export function DialogPortal({ children }: any) { return <>{children}</>>; }
export function DialogOverlay({ className, ...props }: any) { return <div className={className} {...props} />; }
export function DialogClose({ children, ...props }: any) { return <button type="button" {...props}>{children}</button>; }
export function DialogContent({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>; }
export function DialogHeader({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>; }
export function DialogFooter({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>; }
export function DialogTitle({ children, className, ...props }: any) { return <h2 className={className} {...props}>{children}</h2>; }
export function DialogDescription({ children, className, ...props }: any) { return <p className={className} {...props}>{children}</p>; }
</></></>
