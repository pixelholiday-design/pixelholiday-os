import * as React from "react";

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props}>{children}</select>;
}
export function SelectGroup({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>;
}
export function SelectTrigger({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}
export function SelectLabel({ children }: { children?: React.ReactNode }) {
  return <label>{children}</label>;
}
export function SelectItem({ children, value }: { children?: React.ReactNode; value: string }) {
  return <option value={value}>{children}</option>;
}
export function SelectSeparator() {
  return <hr />;
}
export function SelectScrollUpButton() { return null; }
export function SelectScrollDownButton() { return null; }
