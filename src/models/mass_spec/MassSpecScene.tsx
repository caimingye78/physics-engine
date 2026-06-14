import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Box, Sphere, Cone, Cylinder, Torus, Grid, OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import type { MassSpecParams, Particle } from './simulation';
import {
  MASSES,
  SELECTOR_LEN,
  selectedSpeed,
  radiusFor,
  spawn,
  stepParticle,
  hasLanded,
} from './simulation';

const PHYSICS_DT = 1 / 240;
const MAX_FRAME_TIME = 0.1;
const Y0 = 0.25; // 离子运动平面离网格的高度
const COLORS = ['#00e0ff', '#ffcc33', '#ff6b6b'];

export interface MassSpecSample {
  vSel: number;
  radii: number[];
}

interface Props {
  params: MassSpecParams;
  resetKey: number;
  onSample: (s: MassSpecSample) => void;
}

/** 半圆轨迹点: 入口(0,0)沿 +X 切入, 圆心(0,r), 出口(0,2r) */
function arcPoints(r: number): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const phi = (Math.PI * i) / N;
    pts.push([r * Math.sin(phi), Y0, r * (1 - Math.cos(phi))]);
  }
  return pts;
}

export default function MassSpecScene({ params, resetKey, onSample }: Props) {
  const paramsRef = useRef(params);
  const particlesRef = useRef<Particle[]>(MASSES.map(() => spawn(params)));
  const accRef = useRef(0);
  const dots = useRef<(Mesh | null)[]>([]);
  const lastSampleRef = useRef(0);

  // 参数变化或重置: 重新发射整束离子(使运动与按参数计算的轨迹一致)
  useEffect(() => {
    paramsRef.current = params;
    particlesRef.current = MASSES.map(() => spawn(params));
    accRef.current = 0;
  }, [params, resetKey]);

  useFrame((_, delta) => {
    accRef.current += Math.min(delta, MAX_FRAME_TIME);
    const p = paramsRef.current;
    while (accRef.current >= PHYSICS_DT) {
      const arr = particlesRef.current;
      for (let i = 0; i < arr.length; i++) {
        let part = stepParticle(p, MASSES[i], arr[i], PHYSICS_DT);
        if (hasLanded(part)) part = spawn(p); // 打到探测板后回收, 重新发射
        arr[i] = part;
      }
      accRef.current -= PHYSICS_DT;
    }
    const arr = particlesRef.current;
    for (let i = 0; i < arr.length; i++) {
      const m = dots.current[i];
      if (m) m.position.set(arr[i].x, Y0, arr[i].z);
    }
    // 节流上报遥测(供右侧读数)
    lastSampleRef.current += 1;
    if (lastSampleRef.current >= 12) {
      onSample({ vSel: selectedSpeed(p), radii: MASSES.map((mass) => radiusFor(p, mass)) });
      lastSampleRef.current = 0;
    }
  });

  const geo = useMemo(() => {
    const radii = MASSES.map((m) => radiusFor(params, m));
    return {
      radii,
      arcs: radii.map((r) => arcPoints(r)),
      maxLanding: 2 * Math.max(...radii),
    };
  }, [params]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 18, 8]} intensity={0.9} />
      <directionalLight position={[-8, 6, -6]} intensity={0.3} />

      {/* 离子源 */}
      <Box args={[1.2, 1.2, 1.2]} position={[-SELECTOR_LEN - 0.6, Y0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </Box>

      {/* 速度选择器: 上下两块电场板(电场 E 沿 -Z) */}
      <Box args={[SELECTOR_LEN, 0.15, 0.4]} position={[-SELECTOR_LEN / 2, Y0, 2.4]}>
        <meshStandardMaterial color="#2a6f97" metalness={0.3} roughness={0.6} />
      </Box>
      <Box args={[SELECTOR_LEN, 0.15, 0.4]} position={[-SELECTOR_LEN / 2, Y0, -2.4]}>
        <meshStandardMaterial color="#9a3b3b" metalness={0.3} roughness={0.6} />
      </Box>
      {/* 选择器直线通道引导线 */}
      <Line points={[[-SELECTOR_LEN, Y0, 0], [0, Y0, 0]]} color="#5a5a64" lineWidth={1} dashed dashScale={3} />

      {/* 探测板(位于 x=0 平面, 沿 z 展开) */}
      <Box args={[0.3, 2.2, geo.maxLanding + 3]} position={[-0.2, Y0, geo.maxLanding / 2]}>
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.35} />
      </Box>

      {/* 每种质量: 半圆轨迹引导线 + 落点标记环 + 物理驱动的离子点 */}
      {MASSES.map((mass, i) => (
        <group key={mass}>
          <Line points={geo.arcs[i]} color={COLORS[i]} lineWidth={1.5} transparent opacity={0.4} />
          <Torus
            args={[0.55, 0.12, 8, 24]}
            position={[0, Y0, 2 * geo.radii[i]]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color={COLORS[i]} emissive={COLORS[i]} emissiveIntensity={0.6} />
          </Torus>
          <Sphere ref={(el) => { dots.current[i] = el; }} args={[0.32, 16, 16]}>
            <meshStandardMaterial color="#ffffff" emissive={COLORS[i]} emissiveIntensity={2} />
          </Sphere>
        </group>
      ))}

      {/* 偏转区磁场 B 沿 +Y 的箭头(穿出平面向上) */}
      <MagneticFieldUp maxZ={geo.maxLanding} />

      <Grid
        position={[0, -0.4, 0]}
        args={[140, 140]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1c1c1c"
        sectionSize={5}
        sectionColor="#333"
        fadeDistance={140}
        infiniteGrid
      />
      <OrbitControls makeDefault enableDamping />
    </>
  );
}

function MagneticFieldUp({ maxZ }: { maxZ: number }) {
  const pts: Array<[number, number]> = [];
  for (let x = 2; x <= 14; x += 6) {
    for (let z = 4; z <= maxZ; z += 8) pts.push([x, z]);
  }
  return (
    <group>
      {pts.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cylinder args={[0.025, 0.025, 3]} position={[0, 1.5, 0]}>
            <meshBasicMaterial color="#9b6bff" transparent opacity={0.35} />
          </Cylinder>
          <Cone args={[0.18, 0.5]} position={[0, 3, 0]}>
            <meshBasicMaterial color="#9b6bff" transparent opacity={0.6} />
          </Cone>
        </group>
      ))}
    </group>
  );
}
