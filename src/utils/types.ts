// utils/types.ts
export interface InfoPointData {
  id: string;
  position: [number, number, number];
  label: string;
  icon: string;
  content: string;
  cameraPosition?: [number, number, number];

  // NOWE – opcjonalne pola dla zdjęcia
  imageUrl?: string;
  imageAlt?: string;
}
