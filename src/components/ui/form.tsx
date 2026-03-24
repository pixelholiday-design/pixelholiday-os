import * as React from "react";
export function Form({ children, ...props }: any) { return <form {...props}>{children}</form>form>; }
export function FormField({ render, name, control }: any) {
    const field = { name, value: "", onChange: () => {}, onBlur: () => {}, ref: () => {} };
    return render({ field });
}
export function FormItem({ children, className, ...props }: any) { return <div className={className} {...props}>{children}</div>div>; }
export function FormLabel({ children, className, ...props }: any) { return <label className={className} {...props}>{children}</label>label>; }
export function FormControl({ children }: any) { return <>{children}</>>; }
export function FormDescription({ children, className, ...props }: any) { return <p className={className} {...props}>{children}</p>p>; }
export function FormMessage({ children, className, ...props }: any) { return children ? <p className={className} {...props}>{children}</p>p> : null; }
</></form>
