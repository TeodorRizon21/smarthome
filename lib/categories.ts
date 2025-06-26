export const CATEGORIES = {
  VIDEO_DOOR_PHONE: "Video Door Phone",
  HOME_BUILDING_CONTROL: "Home and Building Control System",
  SALE: "SALE"
} as const;

export const VDP_SUBCATEGORIES = {
  IP_VDP: "IP VDP",
  SIP_VDP: "SIP VDP",
  TWO_WIRE_VDP: "2-WIRE VDP"
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];
export type VDPSubcategory = typeof VDP_SUBCATEGORIES[keyof typeof VDP_SUBCATEGORIES];

export const ALL_CATEGORIES = Object.values(CATEGORIES);
export const ALL_VDP_SUBCATEGORIES = Object.values(VDP_SUBCATEGORIES); 