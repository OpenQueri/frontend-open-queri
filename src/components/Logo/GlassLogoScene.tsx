import React, { useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Center, OrbitControls } from '@react-three/drei';
import { SVGLoader } from 'three-stdlib';
import { LOGO_DATA } from './LogoData';

interface ShapeProps {
  d: string;
  color: string;
  thickness?: number;
}

// Компонент окремої деталі логотипа
const Shape: React.FC<ShapeProps> = ({ d, color, thickness = 2 }) => {
  const geometry = useMemo(() => {
    const loader = new SVGLoader();
    const svgData = loader.parse(`<svg><path d="${d}" /></svg>`);
    const shape = SVGLoader.createShapes(svgData.paths[0])[0];
    
    return new THREE.ExtrudeGeometry(shape, { 
        depth: thickness, 
        bevelEnabled: true, 
        bevelThickness: 1.2, // Грані ловлять іскри
        bevelSize: 0.6, 
        bevelSegments: 3 // Гострі іскри на ребрах
    });
  }, [d, thickness]);

  return (
    <mesh geometry={geometry} rotation={[Math.PI, 0, 0]} scale={0.01}>
      <MeshTransmissionMaterial 
        /* ОСНОВНЕ СКЛО */
        backside 
        samples={12} 
        thickness={1.5}      // Трохи збільшив для глибини
        ior={1.4}             // Реальне скло
        transmission={1} 
        color={color}         // Основний колір (синій/помаранчевий)
        roughness={0}         // Повний глянець
        chromaticAberration={0.12} // Райдуга на контурі
        
        /* --- ПАРАМЕТРИ САМОСВІТІННЯ (Emissive) --- */
        // Це змушує скло генерувати колір зсередини
        emissive={new THREE.Color(color)}
        emissiveIntensity={1.2} // Сила внутрішнього неону
        
        /* ВНУТРІШНЯ ТОВЩА (Glow Effect) */
        // Налаштовуємо внутрішню "туманність", щоб світло застрягало
        attenuationDistance={0.5}
        attenuationColor={new THREE.Color(color)} // Світло "зафарбовується" кольором

        reflectivity={0.3} 
        clearcoat={1} 
        envMapIntensity={0} // Ігноруємо карти
      />
    </mesh>
  );
};

interface GlassLogoProviderProps {
  is3D?: boolean;
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
}

export const GlassLogoProvider: React.FC<GlassLogoProviderProps> = ({ 
  is3D = false, 
  width = "100%", 
  height = "150px", // Розміри зберігаємо
  children 
}) => {
  if (!is3D) return <div style={{ width, height }} className="flex items-center justify-center">{children}</div>;

  return (
    <div style={{ width, height }} className="relative bg-transparent"> 
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 35 }} 
        dpr={[1, 2]}
        gl={{ 
            antialias: true, 
            alpha: true, 
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping 
        }} 
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); 
        }}
      >
        <Suspense fallback={null}>
          {/* СВІТЛО: ТІЛЬКИ ДЛЯ ОБ'ЄМУ */}
          <ambientLight intensity={0.05} /> 
          
          {/* Фронтальний блік (зберігаємо) */}
          <pointLight position={[10, 10, 15]} intensity={3} color="#ffffff" decay={2} />
          
          {/* Контурний блік (зберігаємо) */}
          <pointLight position={[-10, 5, 10]} intensity={2.5} color="#e0f2fe" decay={2} />
          
          {/* --- НОВЕ СВІТЛО "З-ПІД НЬОГО" (Underlight) --- */}
          {/* Ця лампа стоїть знизу і пробиває корпус крізь скло */}
          <pointLight position={[0, -3, 0.5]} intensity={10} color={LOGO_DATA.hull.color} decay={1.5} />

          {/* ЦЕНТРУВАННЯ (зберігаємо) */}
          <Center disableY={false} disableX={false}>
            <group scale={1.1}>
              <Shape d={LOGO_DATA.hull.d} color={LOGO_DATA.hull.color} thickness={15} />
              <Shape d={LOGO_DATA.cabin.d} color={LOGO_DATA.cabin.color} thickness={18} />
              <Shape d={LOGO_DATA.mast.d} color={LOGO_DATA.mast.color} thickness={12} />
              <Shape d={LOGO_DATA.sailLeft.d} color={LOGO_DATA.sailLeft.color} thickness={6} />
              <Shape d={LOGO_DATA.sailRight.d} color={LOGO_DATA.sailRight.color} thickness={6} />
            </group>
          </Center>

          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={1.0} 
            makeDefault 
          />
        </Suspense>
      </Canvas>
    </div>
  );
};