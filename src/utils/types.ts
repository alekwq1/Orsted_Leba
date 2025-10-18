// utils/types.ts

export type InfoPointData = {
  id: string;
  label: string;
  icon: string; // emoji / short label
  content: string;
  position: [number, number, number];
  cameraPosition?: [number, number, number];
  imageUrl?: string;
  imageAlt?: string;
  /** NOWE: nazwa grupy, do filtrowania widoczności */
  group?: string; // np. "ETAP 1", "Bezpieczeństwo", itp.
};
