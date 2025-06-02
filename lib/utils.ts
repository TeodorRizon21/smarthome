import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string) {
  if (url.startsWith('http')) {
    return url
  }
  return `${process.env.NEXT_PUBLIC_APP_URL}${url}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
  }).format(amount);
}

