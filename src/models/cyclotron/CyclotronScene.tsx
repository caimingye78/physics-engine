import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Trail, Grid, Cone, Cylinder, OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import type { CyclotronParams, CyclotronState } from './simulation';
import {
  GAP_WIDTH,
  createInitialState,
  stepCyclotron,
  speed,
  gyroRadius,
  gamma,
  beta,
} from './simulation';

const PHYSICS_DT = 1 / 480; // 高频交变电场 + 圆周运动, 用更细步长保证相位与半径精度
const MAX_FRAME_TIME = 0.1;
const SAMPLE_INTERVAL = 0.1;
const ESCAPE_RADIUS = 24; // 粒子飞出此半径则自动重新发射
const DEE_W = 22;
const DEE_DEPTH = 52;

export interface CyclotronSample {
  speed: number;
  radius: number;
  gamma: number;
  beta: number;
}

interface Props {
  params: CyclotronParams;
  resetKey: number;
  onSample: (s: CyclotronSample) => void;
}

export default function CyclotronScene({ params, resetKey, onSample }: Props) {
  const paramsRef = useRef(params);
  const stateRef = useRef<CyclotronState>(createInitialState(params));
  const accRef = useRef(0);
  const lastSampleRef = useRef(0);
  const particle = useRef<Mesh>(null);
  const [epoch, setEpoch] = useState(0); // Trail 重建计数(逃逸时清空轨迹)

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
      stateRef.current = stepCyclotron(paramsRef.current, stateRef.current, PHYSICS_DT);
      accRef.current -= PHYSICS_DT;
    }
    const s = stateRef.current;

    // 逃逸检测: 飞出加速腔则重新发射并清空轨迹
    if (Math.hypot(s.x, s.z) > ESCAPE_RADIUS) {
      stateRef.current = createInitialState(paramsRef.current);
      accRef.current = 0;
      setEpoch((e) => e + 1);
      return;
    }

    if (particle.current) particle.current.position.set(s.x, 0, s.z);

    if (s.t - lastSampleRef.current >= SAMPLE_INTERVAL) {
      onSample({
        speed: speed(s),
        radius: gyroRadius(paramsRef.current, s),
        gamma: gamma(s),
        beta: beta(s),
      });
      lastSampleRef.current = s.t;
    }
  });

  const halfGap = GAP_WIDTH / 2;
  const deeX = halfGap + DEE_W / 2;

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 18, 8]} intensity={0.6} />

      {/* 两个 D 形加速腔(半透明), 中间为加速缝隙 */}
      <Box args={[DEE_W, 0.3, DEE_DEPTH]} position={[deeX, -0.4, 0]}>
        <meshStandardMaterial color="#1c6fb5" transparent opacity={0.18} />
      </Box>
      <Box args={[DEE_W, 0.3, DEE_DEPTH]} position={[-deeX, -0.4, 0]}>
        <meshStandardMaterial color="#1c6fb5" transparent opacity={0.18} />
      </Box>
      {/* 加速缝隙高亮 */}
      <Box args={[GAP_WIDTH, 0.32, DEE_DEPTH]} position={[0, -0.4, 0]}>
        <meshStandardMaterial color="#ffcc33" transparent opacity={0.12} emissive="#ffcc33" emissiveIntensity={0.4} />
      </Box>

      {/* 带电粒子 + 拖尾轨迹(半径递增的半圆串) */}
      <Trail key={`${resetKey}-${epoch}`} width={1.6} length={9} color={'#00e0ff'} attenuation={(w) => w * w}>
        <Sphere ref={particle} args={[0.28, 16, 16]}>
          <meshStandardMaterial color="#ffffff" emissive="#00e0ff" emissiveIntensity={2.2} />
        </Sphere>
      </Trail>

      {/* 磁场 B 沿 +Y(穿出 XZ 平面向上)的箭头阵列 */}
      <MagneticFieldUp />

      <Grid
        position={[0, -0.6, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1a1a"
        sectionSize={5}
        sectionColor="#333"
        fadeDistance={90}
        infiniteGrid
      />
      <OrbitControls makeDefault enableDamping />
    </>
  );
}

/** 磁场 B 沿 +Y 的可视化箭头(穿出加速平面向上) */
function MagneticFieldUp() {
  const pts: Array<[number, number]> = [
    [-6, -6],
    [6, -6],
    [-6, 6],
    [6, 6],
  ];
  return (
    <group>
      {pts.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cylinder args={[0.03, 0.03, 4]} position={[0, 2, 0]}>
            <meshBasicMaterial color="#9b6bff" transparent opacity={0.4} />
          </Cylinder>
          <Cone args={[0.22, 0.6]} position={[0, 4, 0]}>
            <meshBasicMaterial color="#9b6bff" transparent opacity={0.65} />
          </Cone>
        </group>
      ))}
    </group>
  );
}
