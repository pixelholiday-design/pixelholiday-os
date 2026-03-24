import * as React from "react";
export function Tabs({ children, defaultValue, value, onValueChange, className, ...props }: any) { return <div className={className} {...props}>{children}</div>div>; }
export function TabsList({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>div>; }
export function TabsTrigger({ children, value, className, disabled, ...props }: any) { return <button className={className} type="button" {...props}>{children}</button>button>; }
export function TabsContent({ children, value, className, ...props }: any) { return <div className={className} {...props}>{children}</div>div>; }
</div>
