import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createInlineStyle(className: string, styles: string) {
  if (document.getElementById(className)) return;
  const style = document.createElement("style");
  style.innerHTML = `.${className} { ${styles} }`;
  document.head.appendChild(style);
}
