import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Cone, Grid, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { DualRodParams } from './config';
import {
  RAIL_LENGTH,
  RAIL_RADIUS,
  ROD_RADIUS,
  ROD_Y,
  ZA_INITIAL,
  ZB_INITIAL,
  VIEW_HALF,
} from './config';
import { createInitialState, stepDualRod, diagnose } from './simulation';
import type { DualRodState } from './simulation';
import { telemetryStore } from './store';

// 物理宇宙的绝对步长: 锁定 240Hz, 与渲染帧率彻底解耦
const PHYSICS_DT = 1 / 240;
const MAX_FRAME_TIME = 0.1; // 限制单帧最大时间, 防止切 Tab 回来的"死亡螺旋"
const SAMPLE_INTERVAL = 0.05; // 遥测采样间隔 (20Hz)

/** 把 v 循环折叠到 [lo, hi) 区间(纯视觉, 不影响物理) */
function wrap(v: number, lo: number, hi: number): number {
  const span = hi - lo;
  let r = (v - lo) % span;
  if (r < 0) r += span;
  return lo + r;
}

interface SceneProps {
  params: DualRodParams;
  resetKey: number;
}

export default function RodScene({ params, resetKey }: SceneProps) {
  const paramsRef = useRef(params);
  const stateRef = useRef<DualRodState>(createInitialState(params));
  const accRef = useRef(0);
  const lastSampleRef = useRef(0);

  const meshA = useRef<THREE.Mesh>(null);
  const meshB = useRef<THREE.Mesh>(null);

  // 参数实时同步: B/质量/电阻/长度 即时改变物理规律(无需重置)
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // 重置: 重新注入初始条件并清空遥测
  useEffect(() => {
    stateRef.current = createInitialState(paramsRef.current);
    accRef.current = 0;
    lastSampleRef.current = 0;
    telemetryStore.reset();
  }, [resetKey]);

  useFrame((_, delta) => {
    accRef.current += Math.min(delta, MAX_FRAME_TIME);

    // 固定步长推进: 渲染帧率波动, 物理时间匀速流逝
    while (accRef.current >= PHYSICS_DT) {
      stateRef.current = stepDualRod(paramsRef.current, stateRef.current, PHYSICS_DT);
      accRef.current -= PHYSICS_DT;
    }

    const s = stateRef.current;

    // 表现层: 用 ref 直接写 mesh 位置(循环显示), 不触发 React 重渲染
    if (meshA.current) {
      meshA.current.position.set(0, ROD_Y, wrap(ZA_INITIAL + s.zA, -VIEW_HALF, 0));
    }
    if (meshB.current) {
      meshB.current.position.set(0, ROD_Y, wrap(ZB_INITIAL + s.zB, 0, VIEW_HALF));
    }

    // 降频采样推给图表 store
    if (s.t - lastSampleRef.current >= SAMPLE_INTERVAL) {
      const d = diagnose(paramsRef.current, s);
      telemetryStore.push({
        t: Number(s.t.toFixed(2)),
        vA: Number(s.vA.toFixed(3)),
        vB: Number(s.vB.toFixed(3)),
        current: Number(d.current.toFixed(3)),
        kineticEnergy: Number(d.kineticEnergy.toFixed(3)),
        heat: Number(d.heat.toFixed(3)),
      });
      lastSampleRef.current = s.t;
    }
  });

  const halfRail = RAIL_LENGTH / 2;
  const xA = params.lengthA / 2;
  const xB = params.lengthB / 2;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.4} />

      {/* 宽段导轨 (轨距 LA, z<0) */}
      <Rail x={-xA} zFrom={-halfRail} zTo={0} />
      <Rail x={xA} zFrom={-halfRail} zTo={0} />
      {/* 窄段导轨 (轨距 LB, z>0) */}
      <Rail x={-xB} zFrom={0} zTo={halfRail} />
      <Rail x={xB} zFrom={0} zTo={halfRail} />
      {/* z=0 处宽窄过渡连接 */}
      <Connector x1={-xA} x2={-xB} />
      <Connector x1={xA} x2={xB} />

      {/* 动态金属杆: 杆 A(宽, 红) / 杆 B(窄, 绿) */}
      <Cylinder
        ref={meshA}
        args={[ROD_RADIUS, ROD_RADIUS, params.lengthA + 1, 20]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#ff4d4d" metalness={0.7} roughness={0.2} />
      </Cylinder>
      <Cylinder
        ref={meshB}
        args={[ROD_RADIUS, ROD_RADIUS, params.lengthB + 1, 20]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#4dff7a" metalness={0.7} roughness={0.2} />
      </Cylinder>

      <MagneticField />

      <Grid
        position={[0, -0.5, 0]}
        args={[220, 220]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2a2a2a"
        sectionSize={5}
        sectionColor="#444"
        fadeDistance={160}
        infiniteGrid
      />
      <OrbitControls makeDefault enableDamping />
    </>
  );
}

/** 单条导轨(沿 Z 延伸) */
function Rail({ x, zFrom, zTo }: { x: number; zFrom: number; zTo: number }) {
  const len = zTo - zFrom;
  return (
    <Cylinder
      args={[RAIL_RADIUS, RAIL_RADIUS, len, 12]}
      position={[x, 0, (zFrom + zTo) / 2]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.15} />
    </Cylinder>
  );
}

/** 宽窄导轨在 z=0 处的横向过渡连接 */
function Connector({ x1, x2 }: { x1: number; x2: number }) {
  const len = Math.abs(x1 - x2);
  if (len < 1e-6) return null;
  return (
    <Cylinder
      args={[RAIL_RADIUS, RAIL_RADIUS, len, 12]}
      position={[(x1 + x2) / 2, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
    >
      <meshStandardMaterial color="#b0b0b0" metalness={0.9} roughness={0.15} />
    </Cylinder>
  );
}

/** 匀强磁场 B(沿 -Y 垂直向下)的可视化箭头阵列, 沿加长后的导轨铺开 */
function MagneticField() {
  const positions: number[] = [];
  for (let z = -80; z <= 80; z += 16) positions.push(z);
  return (
    <group>
      {positions.map((z) => (
        <group key={z} position={[0, 4, z]}>
          <Cylinder args={[0.04, 0.04, 7]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#00d2ff" transparent opacity={0.35} />
          </Cylinder>
          <Cone args={[0.3, 0.8]} position={[0, -3.5, 0]} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial color="#00d2ff" transparent opacity={0.6} />
          </Cone>
        </group>
      ))}
    </group>
  );
}
