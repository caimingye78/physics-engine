import type { StateVector } from '../../engine/math';
import { CalculusCore } from '../../engine/math';
import { diskEMF, diskTorque, diskMomentOfInertia, joulePower } from '../../engine/physics';

// 法拉第圆盘(单极发电机)模型。
// 半径 R 的铜盘绕 Y 轴旋转, 匀强磁场沿 Y。各点线速度 v=ωr 随半径变化,
// 故电动势需对半径积分: EMF = ½BωR²。阻力矩 τ = ½BIR², 与 ω 反向。
// 转动牛顿第二定律: α = -τ/J, J = ½mR²。ω 呈指数衰减。

export const DISK_RADIUS = 5; // 圆盘半径 (m)
export const MIN_RESISTANCE = 0.01;

export interface FaradayParams {
  B: number; // 磁感应强度 (T)
  mass: number; // 圆盘质量 (kg)
  resistance: number; // 回路总电阻 (Ω)
  initialOmega: number; // 初始角速度 (rad/s)
}

export const DEFAULT_PARAMS: FaradayParams = {
  B: 1.2,
  mass: 2.0,
  resistance: 0.5,
  initialOmega: 20,
};

export interface FaradayState {
  t: number;
  theta: number; // 角位移 (rad)
  omega: number; // 角速度 (rad/s)
}

export function createInitialState(p: FaradayParams): FaradayState {
  return { t: 0, theta: 0, omega: p.initialOmega };
}

/** 即时电流 I = EMF / R = ½BωR² / R */
export function current(p: FaradayParams, omega: number): number {
  const R = Math.max(p.resistance, MIN_RESISTANCE);
  return diskEMF(p.B, omega, DISK_RADIUS) / R;
}

/** 即时灯泡电功率 P = I²R */
export function power(p: FaradayParams, omega: number): number {
  const R = Math.max(p.resistance, MIN_RESISTANCE);
  return joulePower(current(p, omega), R);
}

function makeDerivative(p: FaradayParams) {
  const J = diskMomentOfInertia(p.mass, DISK_RADIUS);
  return (y: StateVector): StateVector => {
    const omega = y[1];
    const I = current(p, omega); // 随 ω 带符号
    const torque = diskTorque(p.B, I, DISK_RADIUS); // 与 ω 同号
    const alpha = -torque / J; // 阻力矩, 反向
    return [omega, alpha];
  };
}

/** 用 RK4 推进一个固定步长 dt。 */
export function stepFaraday(p: FaradayParams, s: FaradayState, dt: number): FaradayState {
  const y1 = CalculusCore.rk4([s.theta, s.omega], makeDerivative(p), dt);
  return { t: s.t + dt, theta: y1[0], omega: y1[1] };
}
