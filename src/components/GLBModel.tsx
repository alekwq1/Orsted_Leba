import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

type GLBModelProps = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number]; // w stopniach
  scale?: [number, number, number];
  visible: boolean;
};

export default function GLBModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  visible,
}: GLBModelProps) {
  const gltf = useLoader(GLTFLoader, url);
  const rad = rotation.map(degToRad) as [number, number, number];

  if (!visible) return null;

  return (
    <group
      position={position}
      rotation={new THREE.Euler(rad[0], rad[1], rad[2], "XYZ")}
      scale={scale}
      // Brak onPointerOver/Out i innych handlerów — kursor się nie zmienia
    >
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
}
