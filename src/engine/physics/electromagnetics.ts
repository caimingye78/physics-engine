import type { Vector3D } from '../math';
import { VectorEngine } from '../math';

/**
 * 电磁学纯函数群。不依赖 React / three。
 * 尽量用向量真值(叉乘·点乘)书写, 必要处提供标量简约。
 */

/**
 * 洛伦兹力 F = q (v × B)。
 * 此力始终垂直于速度, 故不做功(F·v = 0)。
 */
export function lorentzForce(q: number, v: Vector3D, B: Vector3D): Vector3D {
  return VectorEngine.multiplyScalar(VectorEngine.cross(v, B), q);
}

/**
 * 动生电动势(向量真值) EMF = (v × B) · L。
 * L 为导体棒向量(长度 × 方向)。
 */
export function motionalEMF(v: Vector3D, B: Vector3D, L: Vector3D): number {
  return VectorEngine.dot(VectorEngine.cross(v, B), L);
}

/**
 * 安培力 F = I (L × B)。
 * L 为带电流方向的导体向量。
 */
export function ampereForce(I: number, L: Vector3D, B: Vector3D): Vector3D {
  return VectorEngine.multiplyScalar(VectorEngine.cross(L, B), I);
}

/** 欧姆定律 I = EMF / R(R 由调用方钳制以避免除零)。 */
export function loopCurrent(emf: number, resistance: number): number {
  return emf / resistance;
}

/** 瞬时电功率(焦耳发热率) P = I^2 R。 */
export function joulePower(I: number, resistance: number): number {
  return I * I * resistance;
}

/** 单根直导体棒的标量动生电动势 EMF = B L v(B⊥v⊥L 标准配置)。 */
export function rodEMF(B: number, length: number, v: number): number {
  return B * length * v;
}

/**
 * 圆盘(法拉第圆盘)的动生电动势 EMF = ∫₀ᴿ B(ωr) dr = ½ B ω R²。
 * 半径方向线速度 v=ωr 变化, 故需对半径积分。
 */
export function diskEMF(B: number, omega: number, radius: number): number {
  return 0.5 * B * omega * radius * radius;
}

/**
 * 圆盘所受安培阻力矩 τ = ½ B I R²
 * (电流沿半径方向流过的理想化力矩)。
 */
export function diskTorque(B: number, I: number, radius: number): number {
  return 0.5 * B * I * radius * radius;
}

/** 实心圆盘转动惯量 J = ½ m R²。 */
export function diskMomentOfInertia(mass: number, radius: number): number {
  return 0.5 * mass * radius * radius;
}

/** 平动动能 ½ m v²。 */
export function kineticEnergy(mass: number, speed: number): number {
  return 0.5 * mass * speed * speed;
}

/** 转动动能 ½ J ω²。 */
export function rotationalEnergy(inertia: number, omega: number): number {
  return 0.5 * inertia * omega * omega;
}
