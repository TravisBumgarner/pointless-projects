import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ColorGraph = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true });

      const colors = [];
      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const color = new THREE.Color(i / geometry.attributes.position.count, i / geometry.attributes.position.count, i / geometry.attributes.position.count);
        colors.push(color.r, color.g, color.b);
      }

      // Set the center vertex to be transparent
      const centerIndex = Math.floor(geometry.attributes.position.count / 2);
      colors[centerIndex * 3] = 0;
      colors[centerIndex * 3 + 1] = 0;
      colors[centerIndex * 3 + 2] = 0;
      material.opacity = 0.5;

      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      meshRef.current.geometry = geometry;
      meshRef.current.material = material;
    }
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef} />
      <OrbitControls />
    </>
  );
};

const ColorGraphWrapped = () => {
    return (<Canvas style={{width: 1000, height: 1000}}>
        <ColorGraph />
    </Canvas>)
}

export default ColorGraphWrapped;