import { InfoPointData } from "./types";

export const ADD_INFOPOINT_PASSWORD = "1111";
export const APP_PASSWORD = "Orsted";

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
    imageAlt: "AED & Eye Wash Station",
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "Pedestrian Communication Route",
    position: [38.964701599016905, 2, 2.4803882876162318],
    label: "Pedestrian Communication Route",
    icon: "🚸",
    content: "Pedestrian Communication Route",
    cameraPosition: [80.63499164030522, 73.03410237586289, 17.701770530291387],
    imageAlt: "Pedestrian Route",
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "Emergency Board – Nearest Hospital Phone Number",
    position: [-49.89867950091776, 2, 27.45932638352281],
    label: "NEmergency Board – Nearest Hospital Phone Number",
    icon: "📞",
    content: "📞🏥 Emergency Board – Nearest Hospital Phone Number",
    group: "🟡 INFORMATION & SIGNAGE",
    cameraPosition: [
      -104.12413097736234, 51.023783990138256, 50.583347186159926,
    ],
  },
  {
    id: "No Entry – Fuel Storage Area",
    position: [28.85552850985124, 2, -46.52177067189187],
    label: "Fuel Storage and Refueling Area",
    icon: "⛽",
    content: "⛔⛽ Secured, Fenced Fuel Storage and Refueling Area",
    cameraPosition: [21.242122639819517, 45.77152745563941, -27.34542043594579],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "H&S Board (Health & Safety)",
    position: [38.052050276493254, 2, -12.31381604157529],
    label: "H&S Board (Health & Safety)",
    icon: "⛑️",
    content:
      "• Lifebuoy with rope: 🛟\n       • First aid kit + assigned personnel list: 💊📜",
    cameraPosition: [56.36290078713302, 46.44271638253251, -5.8992113224244465],
    group: "🔵 SAFETY & HSE (BHP)",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/H%26S%20Board.png",
  },
  {
    id: "Safety Board",
    position: [38.90163184372005, 2, -14.604054171388384],
    label: "Safety Board",
    icon: "📢",
    content:
      "• Evacuation assembly point 🚨\n• First aid kit 💊🩹\n• Fire extinguisher 🔥🧯\n• Fire blanket 🧯🛡️\n",
    cameraPosition: [57.950187915524964, 36.60397597689412, -7.295426790356244],
    group: "🔵 SAFETY & HSE (BHP)",
  },
  {
    id: "34f5fcad-3186-4c5f-881a-023b79a0d78b",
    label: "Smoking place",
    icon: "🚬",
    content: "Designated area for smoking",
    position: [23.652261588365363, 2, 42.18106754050149],
    cameraPosition: [49.95361719357935, 44.630807537987685, 12.641719373247728],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "bb911195-a6a2-402a-99b0-28005c6ccdb6",
    label: "Existing fence",
    icon: "🪜",
    content: "Boundary of the property or adjacent area",
    position: [-15.735567266990826, 2, 29.514378982378407],
    cameraPosition: [
      -15.735457328298278, 120.11691785864136, 29.514422169068087,
    ],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "e9a245f7-6bfc-457b-b040-128068c12a04",
    label: "Construction site fencing/Main site entrance",
    icon: "🚧",
    content: "Barrier securing the site and controlled vehicle access point",
    position: [-50.74965698404177, 1.9999999999999964, 23.199225890646957],
    cameraPosition: [-86.28804107408516, 32.53703768030698, 36.89040814565502],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "78d3b759-0054-4b19-828b-24993a862c50",
    label: "Gate entrance",
    icon: "🏢",
    content: "Gate entrance",
    position: [19.54198076158974, 2, -35.75757668614504],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
    cameraPosition: [
      -28.352954374147153, 86.33701797358486, -64.22265861572839,
    ],
  },
  {
    id: "160762c5-66a8-4646-af40-db719f10d58e",
    label: "Fire access road",
    icon: "🚒",
    content: "🛞 Fire access road – dedicated emergency service access",
    position: [-9.566378164889194, 2, -61.575555120775725],
    cameraPosition: [-50.23374228608008, 80.38704737492883, -78.9496336145196],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "9f8decf0-1910-4d04-8cb8-c28a2559343c",
    label: "Crane and Heavy Equipment Parking Area",
    icon: "⚙️",
    content:
      "Crane and Heavy Equipment Parking Zone – Designated Area for Machinery Parking",
    position: [37.72899667555536, 2, -41.73747307388659],
    cameraPosition: [28.38801668416825, 39.05082073479554, -17.214300188542335],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "0fd8ad62-0a3b-4f83-9dfa-5c4a1e8fae04",
    label: "Office & welfare containers",
    icon: "🛖",
    content:
      "Office and welfare containers – site offices, locker rooms, canteen",
    position: [29.549672504557705, 2, 43.64624779750949],
    cameraPosition: [69.24323235912998, 64.20847759676354, 58.89324819472813],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "92d23e1c-31e9-48b6-b045-3d6225a1d61a",
    label: "Selective waste collection point",
    icon: "♻️",
    content:
      "Selective waste collection – designated recycling and separation area",
    position: [18.57686472369931, 2, -28.40127744083936],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
    cameraPosition: [
      46.477328608786834, 39.11863948513215, -16.930663846169544,
    ],
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Selective%20waste%20collection%20point.png",
  },
  {
    id: "cdaf2ee0-40a6-4120-94c6-f459d05214f1",
    label: "Construction waste container",
    icon: "🗑️",
    content:
      "Construction waste container – container for mixed and residual waste",
    position: [-5.517687085543063, 2.000000000000014, 4.872138726575652],
    cameraPosition: [20.53203307115864, 50.59361604413893, 17.015035881123143],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "946bf2cc-8cf1-43d4-b87f-55f078d01a93",
    label: "Construction information board",
    icon: "📋",
    content:
      "Construction information board – mandatory site data and project info",
    position: [-50.38604488036132, 2, 26.203443105195348],
    cameraPosition: [
      -65.32106832791875, 26.353771424841646, 30.515026610352834,
    ],
    group: "🟡 INFORMATION & SIGNAGE",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Construction%20information%20board.png",
  },
  {
    id: "9f0805dc-f8d3-4c6b-939b-2faf86701b7a",
    label: "H&S Board (Health & Safety)",
    icon: "⛑️",
    content: "🧯⛑️ (fire extinguisher + first aid kit)",
    position: [-31.246478842204425, 2, 40.479444104966966],
    group: "🔵 SAFETY & HSE (BHP)",
    cameraPosition: [-62.84682013943962, 42.3280836723857, 39.24916525605978],
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/First%20aid%20station_2.png",
  },
  {
    id: "0a0a6fa3-e84a-457e-bb3e-ba8cf776dedd",
    label: "First aid station",
    icon: "🏥",
    content:
      "🚑 First aid station – first aid kit, stretcher, medical equipment",
    position: [-1.89983004872985, 2, -1.3924982573100237],
    cameraPosition: [13.37399229688359, 60.874889804412604, 7.271038972849624],
    group: "🔵 SAFETY & HSE (BHP)",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/First%20aid%20station.png",
  },
  {
    id: "ea0c6f53-ee67-47b2-9a56-fd75f3171f9a",
    label: "Warning signage",
    icon: "⚠️",
    content: "Warning signage – danger and caution signs",
    position: [-64.27470077363043, 2, 15.39147685425861],
    cameraPosition: [
      -111.54208634664379, 87.36344329677537, 0.16012360486612742,
    ],
    group: "🟡 INFORMATION & SIGNAGE",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Warning%20signage.png",
  },
  {
    id: "32e63f71-83e8-4bb3-b87c-078a1131e313",
    label: "Warning signage",
    icon: "⚠️",
    content: "Warning signage – danger and caution signs",
    position: [21.837110950597307, 1.9999999999999858, -44.60617359227047],
    cameraPosition: [-30.314016883370535, 86.77089837239286, -64.2513393066424],
    group: "🟡 INFORMATION & SIGNAGE",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Warning%20signage.png",
  },
  {
    id: "f50def39-a399-4d37-ae80-9b172dbf0d29",
    label: "Tree cutting and removal",
    icon: "🌳",
    content:
      "Clearing vegetation and trees in accordance with permits\n\nFINISH: 22.12.2025",
    position: [12.982736574555235, 2, 33.063420380288704],
    cameraPosition: [15.920092045315855, 70.75710931049593, 34.13582282241805],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "e126ed05-3b24-4782-b7d9-8d3f2cb80498",
    label: "Demolition of existing structures and fences",
    icon: "🔨",
    content:
      "Removing old, non-functional elements\nMobilization to Site\n\nFINISH: 21.11.2025",
    position: [27.372592735726517, 2, -16.105449142473542],
    cameraPosition: [
      59.17797781524004, 53.499826960581785, -29.364722542781106,
    ],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "6d24c822-1f6d-4756-9a0d-9127b8cc6919",
    label: "Roads, parking & pavement surfacing",
    icon: "🛣️",
    content:
      "Constructing site access and transport surfaces\n\nFINISH: 16.02.2026",
    position: [17.46715282924717, 2, 16.08212079514803],
    cameraPosition: [36.88946695192215, 79.30249188562306, 23.167906223420456],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "e26e3e83-d194-44c5-a2e2-c2ebbd571eba",
    label: "Container bunkering support structures",
    icon: "🏗️",
    content: "Building foundations and support frames\n\nFINISH: 20.01.2026",
    position: [31.468796933699007, 2, 11.715369356613948],
    cameraPosition: [65.19243078654213, 57.471610565147195, 24.221465645783134],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "c99f4e7d-e2ce-4f7f-952e-391cb94f1ad8",
    label: "Construction of waste shelter",
    icon: "🏚️",
    content: "Construction waste shelter\n\nFINISH: 20.01.2026",
    position: [41.201945785593736, 2, -15.402785381935931],
    cameraPosition: [
      75.91733441006235, 50.696792033034704, -1.2902468561068634,
    ],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "f97c9ddc-2990-4642-abb0-4cb81852fe81",
    label: "Low-voltage electrical system installation",
    icon: "⚡",
    content:
      "Distribution boards, cables, and power circuits\n\nFINISH: 16.02.2026",
    position: [-13.017657248330284, 2, 12.429471563215216],
    cameraPosition: [-29.48659230252466, 55.80277856622264, 50.46681298148947],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "5366c85f-d693-4275-a7ae-175fc9526104",
    label: "Installation of lighting poles",
    icon: "💡",
    content:
      "Including foundations, cabling, and network connection\n\nFINISH: 16.02.2026",
    position: [47.570306844057754, 2, -42.659185240140594],
    cameraPosition: [35.186760985739, 43.56242450762002, -13.853960775570897],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "48d8b36a-3ad0-4889-9a5d-051931575193",
    label: "Fire hydrant installation",
    icon: "🔥",
    content: "Above-ground hydrants for fire protection\n\nFINISH: 16.02.2026",
    position: [-11.387023199793015, 2, 23.28502945709052],
    cameraPosition: [-18.71806232759524, 57.45036348914774, 39.55327368096923],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "f1a79c2b-01f6-4aad-b986-1823e9a8c1f5",
    label: "Sewage systems installation",
    icon: "🚰",
    content: "Manholes, gravity sewage network, fittings\n\nFINISH: 16.02.2026",
    position: [-22.346959457094705, 2, 16.745141425396547],
    cameraPosition: [
      -24.953778602791573, 48.63095440076574, 33.192607232893536,
    ],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "5299ca19-b84b-468e-b73f-2c52106256c5",
    label: "Stormwater Drainage Network",
    icon: "🌧️",
    content:
      "Piping, catch basins, and rainwater discharge network\n\nFINISH: 16.02.2026",
    position: [23.072254479129374, 2, 4.509676133492562],
    cameraPosition: [44.99267168239004, 43.938612239561024, 4.2811003539762025],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "2781036c-a69e-4c8b-9aeb-5e2eedf70a58",
    label: "Potable water piping installation",
    icon: "💧",
    content:
      "Water pipelines, fittings, and connection points\n\nFINISH: 16.02.2026",
    position: [3.756283363806638, 2, -3.3457513146314257],
    cameraPosition: [
      -16.445399859398826, 43.320756790988284, 9.470185569060535,
    ],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "67ee0877-ed54-43dd-ae3b-811f9f8a7fa4",
    label: "Material storage area",
    icon: "📦",
    content: "Designated area for storing construction materials",
    position: [12.682340663329402, 2, -6.356936912647125],
    cameraPosition: [54.681940449666456, 58.68037219948725, 8.741822023665756],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Material%20storage%20area.png",
  },
  {
    id: "59d78f44-30d2-43e4-b019-0ca679973047",
    label: "No access",
    icon: "🦺",
    content:
      "⛔ No access – work behind the fence only with a life jacket\n\nEntry prohibited without a life jacket beyond this point",
    position: [46.251899754862464, 2, 13.589995625963375],
    cameraPosition: [71.91972044586365, 35.47845259944466, 22.870797189611558],
    group: "🟡 INFORMATION & SIGNAGE",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/No%20access.png",
  },
  {
    id: "a715a26c-a544-412e-97d8-f59eb99abc60",
    label: "Evacuation assembly point",
    icon: "🚨",
    content: "Evacuation assembly point 🚨",
    position: [-52.934091948160685, 2, 29.6537296987592],
    cameraPosition: [-79.44391662049185, 26.9064889755686, 28.13496193702858],
    group: "🔵 SAFETY & HSE (BHP)",
  },
  {
    id: "2c7c505c-371f-4e93-9192-05aa7488cb1e",
    label: "Passenger Car Parking ",
    icon: "🚗",
    content: "Car Parking Area – Designated Zone for Passenger Vehicles 🚗",
    position: [27.020101477193492, 2, -22.664976814398507],
    cameraPosition: [
      44.109948398521794, 41.04008705786272, -15.623256863808956,
    ],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "85e84b3d-d651-4bfe-aa51-5cb87a1b11e9",
    label: "Construction Site Monitoring",
    icon: "📹",
    content: "24/7 Construction Site Monitoring via CCTV Cameras",
    position: [23.277104417400977, 2, -42.92416835412112],
    cameraPosition: [49.53821120623793, 44.101346106882275, -30.1069761870133],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "9b39b84d-6036-4e07-a528-403e3dcc1655",
    label: "H&S Board (Health & Safety)",
    icon: "⛑️",
    content: "🧯⛑️ (fire extinguisher + first aid kit)",
    position: [22.720476192709878, 2, 39.80852852579013],
    cameraPosition: [28.7005762722234, 35.09422642248284, 25.865027053836574],
    group: "🔵 SAFETY & HSE (BHP)",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/First%20aid%20station_2.png",
  },
  {
    id: "402c90c3-3b48-49a4-ab9e-266f680c332d",
    label: "Internal and external fences",
    icon: "𓈈",
    content: "Internal and external fences\n\nFINISH: 16.02.2026",
    position: [18.80241204933273, 2.0000000000000018, 34.137763428634955],
    cameraPosition: [49.37932664374944, 39.12377545635662, 45.37289839760544],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
];

// też bez wiodącego "/"
export const PUBLIC_GLB = { label: "Building", url: "models/building.glb" };
