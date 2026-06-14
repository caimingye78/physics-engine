import type { StateVector } from '../../engine/math';
import { CalculusCore } from '../../engine/math';
import { joulePower, kineticEnergy } from '../../engine/physics';
import type { DualRodParams } from './config';
import { MIN_RESISTANCE } from './config';

// 状态向量布局: [zA, zB, vA, vB, heat]
// zA,zB: 两杆位置(沿 Z); vA,vB: 两杆速度; heat: 累计焦耳热
const I_ZA = 0;
const I_ZB = 1;
const I_VA = 2;
const I_VB = 3;
const I_HEAT = 4;

export interface DualRodState {
  t: number; // 物理绝对时间 (s)
  zA: number;
  zB: number;
  vA: number;
  vB: number;
  heat: number; // 累计焦耳热 (J)
}

/** 即时诊断量(用于图表与 HUD) */
export interface DualRodDiagnostics {
  emf: number; // 净电动势 (V)
  current: number; // 回路电流 (A)
  kineticEnergy: number; // 系统总动能 (J)
  heat: number; // 累计焦耳热 (J)
  totalEnergy: number; // 动能 + 焦耳热 (J), 应恒等于初始动能
}

export function createInitialState(p: DualRodParams): DualRodState {
  return { t: 0, zA: 0, zB: 0, vA: p.initialVA, vB: p.initialVB, heat: 0 };
}

/** 初始总机械能 E0 = 系统初始动能(后续动能+焦耳热应恒等于它) */
export function initialEnergy(p: DualRodParams): number {
  return kineticEnergy(p.massA, p.initialVA) + kineticEnergy(p.massB, p.initialVB);
}

/** 净电动势 = B*(LA*vA - LB*vB)。两杆各自切割磁感线, 不等宽时不能合并长度。 */
function netEMF(p: DualRodParams, vA: number, vB: number): number {
  return p.B * (p.lengthA * vA - p.lengthB * vB);
}

/** 由状态计算即时诊断量 */
export function diagnose(p: DualRodParams, s: DualRodState): DualRodDiagnostics {
  const R = Math.max(p.resistance, MIN_RESISTANCE);
  const emf = netEMF(p, s.vA, s.vB);
  const current = emf / R;
  const ke = kineticEnergy(p.massA, s.vA) + kineticEnergy(p.massB, s.vB);
  return {
    emf,
    current,
    kineticEnergy: ke,
    heat: s.heat,
    totalEnergy: ke + s.heat,
  };
}

/**
 * 状态导数 dy/dt。整个物理的核心, 纯函数。
 * d(zA)=vA, d(zB)=vB, d(vA)=aA, d(vB)=aB, d(heat)=P=I²R。
 *
 * 能量守恒可解析验证:
 *   d(KE)/dt = vA*F_A + vB*F_B = -I*净EMF = -I*(I*R) = -I²R = -P = -d(heat)/dt
 * 故 d(KE+heat)/dt = 0, RK4 数值上极接近精确守恒。
 */
function makeDerivative(p: DualRodParams) {
  const R = Math.max(p.resistance, MIN_RESISTANCE);
  return (y: StateVector): StateVector => {
    const vA = y[I_VA];
    const vB = y[I_VB];
    const emf = netEMF(p, vA, vB);
    const current = emf / R;
    // 安培力: A 杆受力 -B*I*LA(阻碍其相对运动), B 杆受力 +B*I*LB
    const forceA = -p.B * current * p.lengthA;
    const forceB = p.B * current * p.lengthB;
    const accA = forceA / p.massA;
    const accB = forceB / p.massB;
    const power = joulePower(current, R);
    const dy = new Array(5).fill(0) as StateVector;
    dy[I_ZA] = vA;
    dy[I_ZB] = vB;
    dy[I_VA] = accA;
    dy[I_VB] = accB;
    dy[I_HEAT] = power;
    return dy;
  };
}

/** 用 RK4 推进一个固定步长 dt。纯函数, 返回新状态。 */
export function stepDualRod(p: DualRodParams, s: DualRodState, dt: number): DualRodState {
  const y0: StateVector = [s.zA, s.zB, s.vA, s.vB, s.heat];
  const y1 = CalculusCore.rk4(y0, makeDerivative(p), dt);
  return {
    t: s.t + dt,
    zA: y1[I_ZA],
    zB: y1[I_ZB],
    vA: y1[I_VA],
    vB: y1[I_VB],
    heat: y1[I_HEAT],
  };
}

/** 连续推进 n 步(主要用于不变量测试)。 */
export function simulateSteps(
  p: DualRodParams,
  s0: DualRodState,
  steps: number,
  dt: number,
): DualRodState {
  let s = s0;
  for (let i = 0; i < steps; i++) s = stepDualRod(p, s, dt);
  return s;
}

/** 理论稳态速度: LA*vA = LB*vB 且守恒量 mA*vA/LA + mB*vB/LB 不变。 */
export function steadyStateVelocities(p: DualRodParams): { vA: number; vB: number } {
  // 守恒量 C = mA*vA0/LA + mB*vB0/LB
  const C = (p.massA * p.initialVA) / p.lengthA + (p.massB * p.initialVB) / p.lengthB;
  // 稳态 LA*vA = LB*vB => vB = (LA/LB) vA。代入 C:
  // mA*vA/LA + mB*(LA/LB)vA/LB = C => vA*(mA/LA + mB*LA/LB²) = C
  const vA = C / (p.massA / p.lengthA + (p.massB * p.lengthA) / (p.lengthB * p.lengthB));
  const vB = (p.lengthA / p.lengthB) * vA;
  return { vA, vB };
}
