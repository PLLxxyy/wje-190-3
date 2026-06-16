import React, { useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from './Room';
import { FurnitureItem } from './FurnitureItem';
import { useStore } from '../store';
import { getFurnitureDef, STYLE_PRESETS, ROOM_CONFIGS } from '../data';
import type { PlacedFurniture, MaterialType } from '../types';

function CameraController() {
  const { camera } = useThree();
  const view = useStore(s => s.cameraView);
  const currentRoom = useStore(s => s.currentRoom);
  const config = ROOM_CONFIGS[currentRoom];
  const targetPos = useMemo(() => new THREE.Vector3(6, 8, 6), []);

  useEffect(() => {
    if (view === 'top') {
      const maxDim = Math.max(config.size.w, config.size.d);
      targetPos.set(0, maxDim * 1.5, 0.01);
    } else {
      targetPos.set(6, 8, 6);
    }
  }, [view, config, targetPos]);

  useFrame(() => {
    camera.position.lerp(targetPos, 0.05);
  });

  return null;
}

function FloorDropZone() {
  const currentRoom = useStore(s => s.currentRoom);
  const addFurniture = useStore(s => s.addFurniture);
  const currentStyle = useStore(s => s.currentStyle);
  const setSelectedId = useStore(s => s.setSelectedId);
  const { camera, gl } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const defId = e.dataTransfer?.getData('text/plain');
      if (!defId) return;

      const def = getFurnitureDef(defId);
      if (!def) return;

      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);

      const config = ROOM_CONFIGS[currentRoom];
      const hw = config.size.w / 2 - 0.3;
      const hd = config.size.d / 2 - 0.3;
      intersect.x = Math.max(-hw, Math.min(hw, intersect.x));
      intersect.z = Math.max(-hd, Math.min(hd, intersect.z));

      const preset = STYLE_PRESETS[currentStyle];
      const color = preset.furniture[defId] || def.defaultColor;

      const newItem: PlacedFurniture = {
        instanceId: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        defId,
        position: [intersect.x, 0, intersect.z],
        rotation: 0,
        color,
        material: 'wood' as MaterialType,
      };

      addFurniture(currentRoom, newItem);
      setSelectedId(newItem.instanceId);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragover', handleDragOver);
    return () => {
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('dragover', handleDragOver);
    };
  }, [gl, camera, raycaster, plane, currentRoom, currentStyle, addFurniture, setSelectedId]);

  return null;
}

function SceneBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color('#1a1a2e');
  }, [scene]);
  return null;
}

function ClickToDeselect() {
  const setSelectedId = useStore(s => s.setSelectedId);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      onClick={() => setSelectedId(null)}
    >
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export function Scene() {
  const currentRoom = useStore(s => s.currentRoom);
  const roomFurniture = useStore(s => s.roomFurniture);
  const cameraView = useStore(s => s.cameraView);
  const furniture = roomFurniture[currentRoom]?.furniture || [];

  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneBackground />
      <PerspectiveCamera
        makeDefault
        position={cameraView === 'top' ? [0, 12, 0.01] : [6, 8, 6]}
        fov={50}
      />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate={cameraView !== 'top'}
        maxPolarAngle={cameraView === 'top' ? Math.PI / 2.01 : Math.PI / 2.1}
        minDistance={2}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      <CameraController />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 5, -3]} intensity={0.3} color="#b3e5fc" />

      {/* Room */}
      <Room roomType={currentRoom} />
      <ClickToDeselect />

      {/* Furniture */}
      {furniture.map(item => (
        <FurnitureItem key={item.instanceId} item={item} />
      ))}

      {/* Drop zone handler */}
      <FloorDropZone />
    </Canvas>
  );
}
