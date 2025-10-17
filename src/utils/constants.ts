import { InfoPointData } from "./types";

export const ADD_INFOPOINT_PASSWORD = "1111";
export const APP_PASSWORD = "12345678";

export const DEFAULT_INFOPOINTS: InfoPointData[] = [
  {
    id: "AED on Site & Eye Wash Station",
    position: [-18.21325244283676, 2, 37.8319212804763],
    label: "Construction Office",
    icon: "💓",
    content: "• AED: 🏥⚡\n• Eye wash: 👁️🚿\n",
    cameraPosition: [
      -59.708374539336276, 31.046953675813363, 42.392283723171445,
    ],
  },
  {
    id: "Pedestrian Communication Route",
    position: [-38, 3, 20],
    label: "Pedestrian Communication Route",
    icon: "🚸",
    content: "Pedestrian Communication Route",
    cameraPosition: [0, 100, 35],
  },
  {
    id: "Emergency Board – Nearest Hospital Phone Number",
    position: [-57, 3, 22],
    label: "NEmergency Board – Nearest Hospital Phone Number",
    icon: "📞",
    content: "📞🏥 Emergency Board – Nearest Hospital Phone Number",
  },
  {
    id: "No Entry – Fuel Storage Area",
    position: [33.20761097495296, 2, -19.505605798673834],
    label: "No Entry – Fuel Storage Area",
    icon: "⛽",
    content: "⛔⛽ No Entry – Fuel Storage Area",
    cameraPosition: [0, 100, 35],
  },
  {
    id: "H&S Board (Health & Safety)",
    position: [35.350499494070576, 1.9999999999999964, -11.772105632853563],
    label: "H&S Board (Health & Safety)",
    icon: "⛑️",
    content:
      "• Lifebuoy with rope: 🛟\n       • First aid kit + assigned personnel list: 💊📜",
    cameraPosition: [57.01997448514952, 29.1655793073127, -21.745386173333834],
  },
  {
    id: "Safety Board",
    position: [27.275759221802353, 2, -18.54483067193394],
    label: "Safety Board",
    icon: "📢",
    content:
      "• Evacuation assembly point 🚨\n• First aid kit 💊🩹\n• Fire extinguisher 🔥🧯\n• Fire blanket 🧯🛡️\n",
    cameraPosition: [
      54.40471891951239, 30.157081459343313, -25.242299194210553,
    ],
  },
  {
    id: "34f5fcad-3186-4c5f-881a-023b79a0d78b",
    label: "Smoking place",
    icon: "🚬",
    content: "Designated area for smoking",
    position: [32.79685294499921, 2, -14.851538046413372],
    cameraPosition: [
      53.638028259768475, 34.37193947869187, -20.821803159070278,
    ],
  },
];
export const PUBLIC_GLB = { label: "Building", url: "/models/building.glb" };
