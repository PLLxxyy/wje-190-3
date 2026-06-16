import React, { useRef } from 'react';
import * as THREE from 'three';
import { ROOM_CONFIGS, STYLE_PRESETS } from '../data';
import { useStore } from '../store';
import type { RoomType } from '../types';

interface RoomProps {
  roomType: RoomType;
}

export function Room({ roomType }: RoomProps) {
  const style = useStore(s => s.currentStyle);
  const preset = STYLE_PRESETS[style];
  const config = ROOM_CONFIGS[roomType];
  const { w, d, h } = config.size;

  const wallMat = useRef(new THREE.MeshStandardMaterial({
    color: preset.wall,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
  }));

  const floorMat = useRef(new THREE.MeshStandardMaterial({
    color: preset.floor,
    side: THREE.DoubleSide,
  }));

  // Update materials when style changes
  wallMat.current.color.set(preset.wall);
  floorMat.current.color.set(preset.floor);

  const wallEdges = useRef(new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
    new THREE.LineBasicMaterial({ color: '#4a4a6a', transparent: true, opacity: 0.5 })
  ));

  const hw = w / 2;
  const hd = d / 2;

  const walls = [
    // Back wall
    { pos: [0, h / 2, -hd] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [w, h] as [number, number] },
    // Left wall
    { pos: [-hw, h / 2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], size: [d, h] as [number, number] },
    // Right wall
    { pos: [hw, h / 2, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], size: [d, h] as [number, number] },
  ];

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <primitive object={floorMat.current} attach="material" />
      </mesh>

      {/* Walls (transparent) */}
      {walls.map((wall, i) => (
        <mesh key={i} position={wall.pos} rotation={wall.rot}>
          <planeGeometry args={wall.size} />
          <primitive object={wallMat.current} attach="material" />
        </mesh>
      ))}

      {/* Wall wireframe edges for visibility */}
      {walls.map((wall, i) => (
        <lineSegments key={`edge-${i}`} position={wall.pos} rotation={wall.rot}>
          <edgesGeometry args={[new THREE.PlaneGeometry(wall.size[0], wall.size[1])]} />
          <lineBasicMaterial color="#4a4a6a" transparent opacity={0.4} />
        </lineSegments>
      ))}

      {/* Floor grid lines */}
      <gridHelper args={[Math.max(w, d), Math.max(w, d), '#3a3a5c', '#2a2a3c']} position={[0, 0.001, 0]} />
    </group>
  );
}
