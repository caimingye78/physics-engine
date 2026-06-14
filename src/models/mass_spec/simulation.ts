import type { StateVector, Vector3D } from '../../engine/math';
import { CalculusCore } from '../../engine/math';
import { lorentzForce } from '../../engine/physics';

// 质谱仪模型。
// 坐标: 离子沿 +X 射入, 磁场 B 沿 +Y。
//   区域1 速度选择器 (x<0): 正交 E、B。E 沿 -Z, 大小 qE; 磁力 q(v×B) 对 +X 运动给 +Z。
//     仅当 qE = qvB, 即 v = E/B 时受力平衡走直线通过; 其余速度被偏转滤除。
//   区域2 偏转区 (x>=0): 只有 B。离子做半圆, 半径 r = m v / (qB)。
//     入口 (0,0) -> 半圆 -> 落点 (0, 2r)。质量越大 r 越大, 落点越远 => 按质量分离。

export const MIN_B = 0.05;
export const SELECTOR_LEN = 10; // 速度选择器长度 (m), 离子源在 x=-SELECTOR_LEN
export const MASSES = [2, 3, 4]; // 三种同电荷离子的质量(如同位素), 用于演示分离

export interface MassSpecParams {
  B: number; // 磁感应强度 (T)
  E: number; // 选择器电场强度 (决定通过速度 v=E/B)
  charge: number; // 离子电荷量 q
}

export const DEFAULT_PARAMS: MassSpecParams = {
  B: 4,
  E: 40,
  charge: 1,
};

export interface Particle {
  x: number;
  z: number;
  vx: number;
  vz: number;
  enteredB: boolean; // 是否已进入偏转区(用于判定落点/回收)
}

/** 选择器通过速度 v = E / B */
export function selectedSpeed(p: MassSpecParams): number {
  return p.E / Math.max(p.B, MIN_B);
}

/** 某质量离子在偏转区的回旋半径 r = m v / (qB) */
export function radiusFor(p: MassSpecParams, mass: number): number {
  return (mass * selectedSpeed(p)) / (p.charge * Math.max(p.B, MIN_B));
}

/** 在离子源生成一个新离子(以通过速度沿 +X 射出) */
export function spawn(p: MassSpecParams): Particle {
  return { x: -SELECTOR_LEN, z: 0, vx: selectedSpeed(p), vz: 0, enteredB: false };
}

function makeDerivative(p: MassSpecParams, mass: number) {
  return (y: StateVector): StateVector => {
    const x = y[0];
    const v: Vector3D = [y[2], 0, y[3]];
    // 磁力 q(v×B), 复用 VectorCore 叉乘
    const Fmag = lorentzForce(p.charge, v, [0, p.B, 0]);
    const Fx = Fmag[0];
    let Fz = Fmag[2];
    if (x < 0) {
      // 选择器区: 叠加电场力 qE, 方向 -Z(平衡 +X 运动的 +Z 磁力)
      Fz += p.charge * -p.E;
    }
    return [y[2], y[3], Fx / mass, Fz / mass];
  };
}

/** RK4 推进一个离子一个固定步长 */
export function stepParticle(
  p: MassSpecParams,
  mass: number,
  part: Particle,
  dt: number,
): Particle {
  const y = CalculusCore.rk4([part.x, part.z, part.vx, part.vz], makeDerivative(p, mass), dt);
  return {
    x: y[0],
    z: y[1],
    vx: y[2],
    vz: y[3],
    enteredB: part.enteredB || y[0] > 0.05,
  };
}

/** 进入过偏转区后又回到 x<=0, 视为已打到 x=0 处的探测板(落点 z≈2r) */
export function hasLanded(part: Particle): boolean {
  return part.enteredB && part.x <= 0;
}
