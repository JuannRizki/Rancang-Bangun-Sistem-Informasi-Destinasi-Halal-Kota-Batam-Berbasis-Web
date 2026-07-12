import type L from "leaflet";

// Lazy load leaflet on client side only
let leafletModule: typeof L | null = null;

const getLeaflet = async (): Promise<typeof L> => {
  if (typeof window === "undefined") {
    throw new Error("Leaflet can only be used on client side");
  }
  if (!leafletModule) {
    leafletModule = (await import("leaflet")).default;
  }
  return leafletModule;
};

export const defaultIcon = (() => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const L = require("leaflet");
    return L.icon({
      iconUrl: "/marker-icon.png",
      iconRetinaUrl: "/marker-icon-2x.png",
      shadowUrl: "/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
  } catch {
    return null;
  }
})();

let isLeafletIconConfigured = false;

export function configureLeafletIcon() {
  if (typeof window === "undefined" || isLeafletIconConfigured) return;

  try {
    const L = require("leaflet");
    
    L.Icon.Default.mergeOptions({
      iconUrl: "/marker-icon.png",
      iconRetinaUrl: "/marker-icon-2x.png",
      shadowUrl: "/marker-shadow.png",
    });

    if (defaultIcon) {
      L.Marker.prototype.options.icon = defaultIcon;
    }
    isLeafletIconConfigured = true;
  } catch (err) {
    console.error("Error configuring leaflet:", err);
  }
}
