import type { StateVector, Vector3D } from '../../engine/math';
import { CalculusCore } from '../../engine/math';
import { lorentzForce, lorentzFactorFromMomentum, velocityFromMomentum } from '../../engine/physics';

// 回旋加速器(Cyclotron) —— 相对论版。
// 粒子在 XZ 平面运动, 磁场 B 沿 +Y。
//   - 缝隙区 |x| < GAP/2: 交变电场沿 ±X 做功使其加速。
//   - D 盒区 |x| >= GAP/2: 只受洛伦兹力 F=q(v×B), 不做功 -> 速率恒定 -> 半圆。
//
// 相对论核心: 积分"动量"而非速度(F=dp/dt 才是普适的牛顿第二定律)。
//   γ = √(1 + |p|²/(m₀c)²),  v = p/(γm₀)  -> v 恒 < c, 数值不会因 v→c 崩溃。
// 低速时 γ→1, 自动退化为经典回旋加速器。
//
// "加速天花板"(失步): 电场频率固定为静止质量下的回旋频率 ω₀=qB/m₀。
// 但粒子越快 γ 越大, 实际回旋周期 T=2πγm₀/(qB) 变长 -> 粒子"迟到" ->
// 穿过缝隙时电场已反向 -> 反被减速。速率被锁死在 c 附近, 半径不再扩张。

export const CHARGE = 1; // 电荷 q
export const REST_MASS = 1; // 静止质量 m₀
export const C_LIGHT = 100; // 沙盒宇宙光速(设为 100 以便几十秒内见证天花板)
export const GAP_WIDTH = 1.0; // 缝隙宽度 d

export interface CyclotronParams {
  B: number; // 磁感应强度 (T)
  eMax: number; // 缝隙最大电场强度
  initialSpeed: number; // 初始速率 (沿 +X)
}

export const DEFAULT_PARAMS: CyclotronParams = {
  B: 4.0,
  eMax: 40,
  initialSpeed: 3,
};

// 状态向量布局: [x, z, px, pz]
export interface CyclotronState {
  t: number;
  x: number;
  z: number;
  px: number; // X 方向动量
  pz: number; // Z 方向动量
}

export function createInitialState(p: CyclotronParams): CyclotronState {
  // 初始动量 p = γm₀v。
  const betaV = p.initialSpeed / C_LIGHT;
  const gamma0 = 1 / Math.sqrt(1 - betaV * betaV);
  return { t: 0, x: 0, z: 0, px: gamma0 * REST_MASS * p.initialSpeed, pz: 0 };
}

/** 固定的电场翻转角频率 ω₀ = qB/m₀(按静止质量, 不随 γ 变 -> 这正是失步根源)。 */
export function cyclotronFrequency(p: CyclotronParams): number {
  return (CHARGE * p.B) / REST_MASS;
}

function momentumMag(s: CyclotronState): number {
  return Math.hypot(s.px, s.pz);
}

/** 相对论速率 |v| = |p|/(γm₀)，恒 < c。 */
export function speed(s: CyclotronState): number {
  const pMag = momentumMag(s);
  const g = lorentzFactorFromMomentum(pMag, REST_MASS, C_LIGHT);
  return pMag / (g * REST_MASS);
}

/** 洛伦兹因子 γ。 */
export function gamma(s: CyclotronState): number {
  return lorentzFactorFromMomentum(momentumMag(s), REST_MASS, C_LIGHT);
}

/** 速度与光速之比 β = v/c。 */
export function beta(s: CyclotronState): number {
  return speed(s) / C_LIGHT;
}

/** 回旋半径 R = p/(qB)(相对论下用动量, 而非 m₀v)。 */
export function gyroRadius(p: CyclotronParams, s: CyclotronState): number {
  return momentumMag(s) / (CHARGE * p.B);
}

function makeDerivative(p: CyclotronParams, omega: number) {
  return (y: StateVector, t: number): StateVector => {
    const x = y[0];
    const pVec: Vector3D = [y[2], 0, y[3]];
    // 由动量反推相对论速度
    const v = velocityFromMomentum(pVec, REST_MASS, C_LIGHT);
    let Fx: number;
    let Fz: number;
    if (Math.abs(x) < GAP_WIDTH / 2) {
      // 缝隙: 交变电场(方波), 相位锁定于物理绝对时间 t
      Fx = CHARGE * p.eMax * Math.sign(Math.cos(omega * t));
      Fz = 0;
    } else {
      // D 盒: 洛伦兹力 F=q(v×B), 用 VectorCore 叉乘
      const F = lorentzForce(CHARGE, v, [0, p.B, 0]);
      Fx = F[0];
      Fz = F[2];
    }
    // dx/dt=vx, dz/dt=vz, dpx/dt=Fx, dpz/dt=Fz
    return [v[0], v[2], Fx, Fz];
  };
}

/** 用 RK4 推进一个固定步长 dt。积分对象是动量。 */
export function stepCyclotron(p: CyclotronParams, s: CyclotronState, dt: number): CyclotronState {
  const omega = cyclotronFrequency(p);
  const y1 = CalculusCore.rk4([s.x, s.z, s.px, s.pz], makeDerivative(p, omega), dt, s.t);
  return { t: s.t + dt, x: y1[0], z: y1[1], px: y1[2], pz: y1[3] };
}
