import type { Vector3D } from '../math';
import { VectorEngine } from '../math';

// 狭义相对论运动学。
// 关键: 牛顿第二定律的真身是动量定理 F = dp/dt(任意速度成立),
// 而非 F = ma(质量恒定才成立)。故沙盒积分"动量", 再由动量反推速度:
//   γ = sqrt(1 + |p|² / (m₀c)²)      —— 用动量表达的洛伦兹因子(避免 v→c 除零)
//   v = p / (γ m₀)                   —— 速度恒 < c
// 低速时 γ→1, 自动退化为经典力学(经典是相对论的低速极限)。

/** 由动量大小求洛伦兹因子 γ = √(1 + |p|²/(m₀c)²)。永远 ≥ 1 且良态。 */
export function lorentzFactorFromMomentum(pMag: number, restMass: number, c: number): number {
  return Math.sqrt(1 + (pMag * pMag) / (restMass * restMass * c * c));
}

/** 由动量向量反推相对论速度 v = p/(γm₀)。模长恒 < c。 */
export function velocityFromMomentum(p: Vector3D, restMass: number, c: number): Vector3D {
  const pMag = VectorEngine.magnitude(p);
  const gamma = lorentzFactorFromMomentum(pMag, restMass, c);
  return VectorEngine.multiplyScalar(p, 1 / (gamma * restMass));
}

/** 相对论动能 Ek = (γ − 1) m₀ c²。 */
export function relativisticKineticEnergy(pMag: number, restMass: number, c: number): number {
  const gamma = lorentzFactorFromMomentum(pMag, restMass, c);
  return (gamma - 1) * restMass * c * c;
}
