import L from "leaflet";

export const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

let isLeafletIconConfigured = false;

export function configureLeafletIcon() {
  if (isLeafletIconConfigured) return;

  L.Icon.Default.mergeOptions({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    shadowUrl: "/marker-shadow.png",
  });

  L.Marker.prototype.options.icon = defaultIcon;
  isLeafletIconConfigured = true;
}
