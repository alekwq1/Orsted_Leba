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
    position: [-70.36382450190602, 2, 38.16737609681029],
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
    position: [26.75652399011745, 2, -43.50977680757802],
    label: "No Entry – Fuel Storage Area",
    icon: "⛽",
    content: "⛔⛽ No Entry – Fuel Storage Area",
    cameraPosition: [17.16468680707392, 37.13162039603709, -15.365127050624675],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "H&S Board (Health & Safety)",
    position: [35.350499494070576, 2, -11.772105632853563],
    label: "H&S Board (Health & Safety)",
    icon: "⛑️",
    content:
      "• Lifebuoy with rope: 🛟\n       • First aid kit + assigned personnel list: 💊📜",
    cameraPosition: [57.01997448514952, 29.1655793073127, -21.745386173333834],
    group: "🔵 SAFETY & HSE (BHP)",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/H%26S%20Board.png",
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
    group: "🔵 SAFETY & HSE (BHP)",
  },
  {
    id: "34f5fcad-3186-4c5f-881a-023b79a0d78b",
    label: "Smoking place",
    icon: "🚬",
    content: "Designated area for smoking",
    position: [36.20405551246592, 2, -18.395489725939946],
    cameraPosition: [
      58.775684014357154, 29.213823024479616, -28.773461175432402,
    ],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "adce84bb-bef7-4ecb-9329-7d09253d0fef",
    label: "Security post",
    icon: "🛡️",
    content: "Control point for site entry and exit",
    position: [20.01571717297572, 2, -29.647092721252875],
    cameraPosition: [62.19297143364475, 53.61873614599245, -43.472406851267024],
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
    position: [-66.42638839201182, 2, 29.213284271785167],
    cameraPosition: [-100.77694666971213, 44.98690751679261, 42.47226709238501],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "78d3b759-0054-4b19-828b-24993a862c50",
    label: "Gatehouse",
    icon: "🏢",
    content: "Registration point for all entering personnel",
    position: [19.54198076158974, 2, -35.75757668614504],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
    cameraPosition: [51.21273012964426, 39.13597938664215, -20.934098578859665],
  },
  {
    id: "160762c5-66a8-4646-af40-db719f10d58e",
    label: "Fire access road",
    icon: "🚒",
    content: "🛞 Fire access road – dedicated emergency service access",
    position: [-9.566378164889194, 2, -61.575555120775725],
    cameraPosition: [
      -40.934801934744485, 79.81963645792516, -94.13854755056903,
    ],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "9f8decf0-1910-4d04-8cb8-c28a2559343c",
    label: "Crane & heavy machinery zone",
    icon: "⚙️",
    content:
      "Crane and heavy equipment zone – designated area for heavy lifting operations",
    position: [41.89504835290006, 2, -38.830367325407465],
    cameraPosition: [32.47697207622693, 38.71073900664743, -15.543177666683945],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "0fd8ad62-0a3b-4f83-9dfa-5c4a1e8fae04",
    label: "Office & welfare containers",
    icon: "🛖",
    content:
      "Office and welfare containers – site offices, locker rooms, canteen",
    position: [21.711060202815744, 2, -24.119864749991155],
    cameraPosition: [53.54543456586339, 36.882958227591445, -35.09516447153649],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
  },
  {
    id: "92d23e1c-31e9-48b6-b045-3d6225a1d61a",
    label: "Selective waste collection point",
    icon: "♻️",
    content:
      "Selective waste collection – designated recycling and separation area",
    position: [27.1229334872704, 2.000000000000007, -21.79133566290652],
    group: "🟢 INFRASTRUCTURE & LOGISTICS",
    cameraPosition: [55.52805512705507, 31.54851690463512, -35.422597471997996],
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
    position: [-68.41762054386874, 2, 34.2277629862898],
    cameraPosition: [-92.04743941215833, 69.93508448314276, 38.230647621873366],
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
    cameraPosition: [-51.5758943502059, 121.3317703766492, -72.2606216286748],
    group: "🟡 INFORMATION & SIGNAGE",
    imageUrl:
      "https://huggingface.co/datasets/Alekso/Orsted/resolve/main/Warning%20signage.png",
  },
  {
    id: "f50def39-a399-4d37-ae80-9b172dbf0d29",
    label: "Tree cutting and removal",
    icon: "🌳",
    content: "Clearing vegetation and trees in accordance with permits",
    position: [12.982736574555235, 2, 33.063420380288704],
    cameraPosition: [15.920092045315855, 70.75710931049593, 34.13582282241805],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "e126ed05-3b24-4782-b7d9-8d3f2cb80498",
    label: "Demolition of existing structures and fences",
    icon: "🔨",
    content: "Removing old, non-functional elements",
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
    content: "Constructing site access and transport surfaces",
    position: [17.46715282924717, 2, 16.08212079514803],
    cameraPosition: [36.88946695192215, 79.30249188562306, 23.167906223420456],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "e26e3e83-d194-44c5-a2e2-c2ebbd571eba",
    label: "Container bunkering support structures",
    icon: "🏗️",
    content: "Building foundations and support frames",
    position: [31.468796933699007, 2, 11.715369356613948],
    cameraPosition: [65.19243078654213, 57.471610565147195, 24.221465645783134],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "c99f4e7d-e2ce-4f7f-952e-391cb94f1ad8",
    label: "Construction of sheds and storage facilities",
    icon: "🏚️",
    content: "Domestic and construction waste shelters",
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
    content: "Distribution boards, cables, and power circuits",
    position: [-13.017657248330284, 2, 12.429471563215216],
    cameraPosition: [-29.48659230252466, 55.80277856622264, 50.46681298148947],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "5366c85f-d693-4275-a7ae-175fc9526104",
    label: "Installation of lighting poles",
    icon: "💡",
    content: "Including foundations, cabling, and network connection",
    position: [47.570306844057754, 2, -42.659185240140594],
    cameraPosition: [35.186760985739, 43.56242450762002, -13.853960775570897],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "48d8b36a-3ad0-4889-9a5d-051931575193",
    label: "Fire hydrant installation",
    icon: "🔥",
    content: "Above-ground hydrants for fire protection",
    position: [-11.387023199793015, 2, 23.28502945709052],
    cameraPosition: [-18.71806232759524, 57.45036348914774, 39.55327368096923],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "f1a79c2b-01f6-4aad-b986-1823e9a8c1f5",
    label: "Sewage systems installation",
    icon: "🚰",
    content: "Manholes, gravity sewage network, fittings",
    position: [-22.346959457094705, 2, 16.745141425396547],
    cameraPosition: [
      -24.953778602791573, 48.63095440076574, 33.192607232893536,
    ],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "5299ca19-b84b-468e-b73f-2c52106256c5",
    label: "🛠️ CONSTRUCTION WORKS EXECUTION",
    icon: "🌧️",
    content: "Piping, catch basins, and rainwater discharge network",
    position: [23.072254479129374, 2, 4.509676133492562],
    cameraPosition: [44.99267168239004, 43.938612239561024, 4.2811003539762025],
    group: "🛠️ CONSTRUCTION WORKS EXECUTION",
  },
  {
    id: "2781036c-a69e-4c8b-9aeb-5e2eedf70a58",
    label: "Potable water piping installation",
    icon: "💧",
    content: "Water pipelines, fittings, and connection points",
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
];

// też bez wiodącego "/"
export const PUBLIC_GLB = { label: "Building", url: "models/building.glb" };
