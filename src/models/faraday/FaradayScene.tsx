import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Sphere, Grid, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { FaradayParams, FaradayState } from './simulation';
import { DISK_RADIUS, createInitialState, stepFaraday, current, power } from './simulation';

const PHYSICS_DT = 1 / 240;
const MAX_FRAME_TIME = 0.1;
const SAMPLE_INTERVAL = 0.1;

// 灯泡亮度的饱和映射: P/(P+Pref) ∈ [0,1), 防止大功率时过曝, 小功率时仍可分辨
const P_REF = 30000;
const MAX_EMISSIVE = 4;

export interface FaradaySample {
  omega: number;
  current: number;
  power: number;
}

interface Props {
  params: FaradayParams;
  resetKey: number;
  onSample: (s: FaradaySample) => void;
}

export default function FaradayScene({ params, resetKey, onSample }: Props) {
  const paramsRef = useRef(params);
  const stateRef = useRef<FaradayState>(createInitialState(params));
  const accRef = useRef(0);
  const lastSampleRef = useRef(0);

  const diskGroup = useRef<THREE.Group>(null);
  const bulbMat = useRef<THREE.MeshStandardMaterial>(null);
  const bulbLight = useRef<THREE.PointLight>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    stateRef.current = createInitialState(paramsRef.current);
    accRef.current = 0;
    lastSampleRef.current = 0;
  }, [resetKey]);

  useFrame((_, delta) => {
    accRef.current += Math.min(delta, MAX_FRAME_TIME);
    while (accRef.current >= PHYSICS_DT) {
      stateRef.current = stepFaraday(paramsRef.current, stateRef.current, PHYSICS_DT);
      accRef.current -= PHYSICS_DT;
    }
    const s = stateRef.current;
    const p = paramsRef.current;

    // 圆盘转动(ref 直接驱动, 不重渲染)
    if (diskGroup.current) diskGroup.current.rotation.y = s.theta;

    // 灯泡亮度 ∝ 电功率 P = I²R (饱和映射)
    const P = power(p, s.omega);
    const norm = P / (P + P_REF);
    if (bulbMat.current) bulbMat.current.emissiveIntensity = norm * MAX_EMISSIVE;
    if (bulbLight.current) bulbLight.current.intensity = norm * 6;

    if (s.t - lastSampleRef.current >= SAMPLE_INTERVAL) {
      onSample({ omega: s.omega, current: current(p, s.omega), power: P });
      lastSampleRef.current = s.t;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[6, 16, 6]} intensity={0.4} />

      {/* 中心固定转轴 */}
      <Cylinder args={[0.18, 0.18, 4, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.3} />
      </Cylinder>

      {/* 旋转的铜盘 + 红色测速辐条 */}
      <group ref={diskGroup}>
        <Cylinder args={[DISK_RADIUS, DISK_RADIUS, 0.25, 64]}>
          <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.25} />
        </Cylinder>
        <Box args={[DISK_RADIUS, 0.28, 0.35]} position={[DISK_RADIUS / 2, 0, 0]}>
          <meshStandardMaterial color="#ff3030" metalness={0.4} roughness={0.5} />
        </Box>
      </group>

      {/* 装饰导线: 圆盘边缘 -> 灯泡 */}
      <Box args={[3.5, 0.08, 0.08]} position={[7, 0, 0]}>
        <meshStandardMaterial color="#222" metalness={0.5} />
      </Box>

      {/* 发光小灯泡 */}
      <group position={[9, 1, 0]}>
        <pointLight ref={bulbLight} color="#ffdd55" distance={26} decay={2} intensity={0} />
        <Sphere args={[0.85, 32, 32]} position={[0, 1, 0]}>
          <meshStandardMaterial
            ref={bulbMat}
            color="#fff6d8"
            emissive="#ffdd55"
            emissiveIntensity={0}
            roughness={0.12}
            metalness={0}
            transparent
            opacity={0.92}
          />
        </Sphere>
        <Cylinder args={[0.42, 0.42, 0.8, 16]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#333" metalness={0.85} roughness={0.3} />
        </Cylinder>
      </group>

      <Grid
        position={[0, -2, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1e1e1e"
        sectionSize={5}
        sectionColor="#3a3a3a"
        fadeDistance={70}
        infiniteGrid
      />
      <OrbitControls makeDefault enableDamping />
    </>
  );
}
