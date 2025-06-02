export const COLLECTIONS = {
  ALL: "All products",
  SMART_RESIDENCE: "Smart Residence",
  SMART_COMERCIAL: "Smart Comercial",
  SMART_INTERCOM: "Smart Intercom",
  SMART_LIGHTNING: "Smart Lightning",
  SALES: "SALES"
} as const

export type Collection = keyof typeof COLLECTIONS

export const SORT_OPTIONS = {
  DEFAULT: "name-asc",
  NAME_DESC: "name-desc",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc"
} as const

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS]

export function isSortOption(value: string): value is SortOption {
  return Object.values(SORT_OPTIONS).includes(value as SortOption)
}

