import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getFurnitureDef, ROOM_CONFIGS } from '../data';
import { useStore } from '../store';
import type { PlacedFurniture, MaterialType } from '../types';

interface FurnitureItemProps {
  item: PlacedFurniture;
}

function getMaterialProps(material: MaterialType) {
  switch (material) {
    case 'wood': return { roughness: 0.8, metalness: 0.0 };
    case 'metal': return { roughness: 0.3, metalness: 0.8 };
    case 'fabric': return { roughness: 1.0, metalness: 0.0 };
    case 'marble': return { roughness: 0.2, metalness: 0.1 };
    case 'plastic': return { roughness: 0.5, metalness: 0.0 };
    default: return { roughness: 0.7, metalness: 0.0 };
  }
}

export function FurnitureItem({ item }: FurnitureItemProps) {
  const def = getFurnitureDef(item.defId);
  const selectedId = useStore(s => s.selectedId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const currentRoom = useStore(s => s.currentRoom);
  const updateFurniture = useStore(s => s.updateFurniture);
  const { camera, gl } = useThree();

  const isSelected = selectedId === item.instanceId;
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragDataRef = useRef({
    plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    offset: new THREE.Vector3(),
    raycaster: new THREE.Raycaster(),
  });

  const matProps = getMaterialProps(item.material);

  // Set up drag handlers on the canvas DOM element
  useEffect(() => {
    if (!isDragging) return;

    const canvas = gl.domElement;
    const { plane, offset, raycaster: rc } = dragDataRef.current;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      rc.setFromCamera(mouse, camera);
      const intersect = new THREE.Vector3();
      rc.ray.intersectPlane(plane, intersect);
      intersect.add(offset);

      const config = ROOM_CONFIGS[currentRoom];
      const hw = config.size.w / 2 - 0.3;
      const hd = config.size.d / 2 - 0.3;
      intersect.x = Math.max(-hw, Math.min(hw, intersect.x));
      intersect.z = Math.max(-hd, Math.min(hd, intersect.z));

      updateFurniture(currentRoom, item.instanceId, {
        position: [intersect.x, item.position[1], intersect.z],
      });
    };

    const onUp = () => {
      setIsDragging(false);
      canvas.style.cursor = 'auto';
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, gl, camera, currentRoom, item.instanceId, item.position, updateFurniture]);

  if (!def) return null;

  const { w, h, d } = def.size;
  const rotRad = (item.rotation * Math.PI) / 180;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setSelectedId(item.instanceId);

    if (meshRef.current) {
      const { plane, offset, raycaster: rc } = dragDataRef.current;
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      rc.setFromCamera(mouse, camera);
      const intersect = new THREE.Vector3();
      rc.ray.intersectPlane(plane, intersect);
      offset.copy(meshRef.current.position).sub(intersect);
      setIsDragging(true);
      gl.domElement.style.cursor = 'grabbing';
    }
  };

  return (
    <group
      ref={meshRef}
      position={item.position}
      rotation={[0, rotRad, 0]}
      onPointerDown={handlePointerDown}
    >
      {/* Main body */}
      {def.primitive === 'box' ? (
        <mesh castShadow position={[0, h / 2, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={item.color}
            roughness={matProps.roughness}
            metalness={matProps.metalness}
          />
        </mesh>
      ) : (
        <mesh castShadow position={[0, h / 2, 0]}>
          <cylinderGeometry args={[w / 2, w / 2, h, 16]} />
          <meshStandardMaterial
            color={item.color}
            roughness={matProps.roughness}
            metalness={matProps.metalness}
          />
        </mesh>
      )}

      {/* Selection outline */}
      {isSelected && (
        <mesh position={[0, h / 2, 0]}>
          {def.primitive === 'box' ? (
            <boxGeometry args={[w + 0.06, h + 0.06, d + 0.06]} />
          ) : (
            <cylinderGeometry args={[w / 2 + 0.03, w / 2 + 0.03, h + 0.06, 16]} />
          )}
          <meshBasicMaterial color="#7ec8e3" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
