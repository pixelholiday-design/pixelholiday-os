import * as React from "react";
export function Table({ children, className, ...props }: any) { return <table className={className} {...props}>{children}</table>; }
export function TableHeader({ children, className, ...props }: any) { return <thead className={className} {...props}>{children}</thead>; }
export function TableBody({ children, className, ...props }: any) { return <tbody className={className} {...props}>{children}</tbody>; }
export function TableFooter({ children, className, ...props }: any) { return <tfoot className={className} {...props}>{children}</tfoot>; }
export function TableRow({ children, className, ...props }: any) { return <tr className={className} {...props}>{children}</tr>; }
export function TableHead({ children, className, ...props }: any) { return <th className={className} {...props}>{children}</th>; }
export function TableCell({ children, className, ...props }: any) { return <td className={className} {...props}>{children}</td>; }
export function TableCaption({ children, className, ...props }: any) { return <caption className={className} {...props}>{children}</caption>; }
</table>
