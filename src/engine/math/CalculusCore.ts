import type { Vector3D } from './VectorCore';
import { VectorEngine } from './VectorCore';

/** 平坦的状态向量(任意维度)。供 RK4 等通用积分使用。 */
export type StateVector = number[];

/** 由状态 y 和时刻 t 返回 dy/dt 的函数。 */
export type Derivative = (state: StateVector, t: number) => StateVector;

/**
 * 数值微积分引擎。
 * 不解析求解, 每帧累加微小量来"推演"物理。纯函数。
 */
export class CalculusCore {
  /** 数值微分: 瞬时变化率 (current - previous) / dt。v=ds/dt, a=dv/dt。 */
  static derivative(current: Vector3D, previous: Vector3D, dt: number): Vector3D {
    if (dt === 0) return [0, 0, 0];
    return VectorEngine.multiplyScalar(VectorEngine.subtract(current, previous), 1 / dt);
  }

  /** 向量前进欧拉: value + rate*dt。s = s0 + v*dt。 */
  static integrate(value: Vector3D, rate: Vector3D, dt: number): Vector3D {
    return VectorEngine.add(value, VectorEngine.multiplyScalar(rate, dt));
  }

  /** 标量积分: value + rate*dt。焦耳热 dQ = P*dt 的累积等。 */
  static integrateScalar(value: number, rate: number, dt: number): number {
    return value + rate * dt;
  }

  /**
   * 半隐式(辛)欧拉。先更新速度, 再用新速度更新位置。
   * 周期运动(振动·圆周)比前进欧拉的能量保存更好。
   */
  static semiImplicitStep(
    pos: Vector3D,
    vel: Vector3D,
    acc: Vector3D,
    dt: number,
  ): { pos: Vector3D; vel: Vector3D } {
    const newVel = CalculusCore.integrate(vel, acc, dt);
    const newPos = CalculusCore.integrate(pos, newVel, dt);
    return { pos: newPos, vel: newVel };
  }

  /**
   * 通用 4 阶龙格-库塔(RK4)。
   * 圆周·螺旋等欧拉会漂移半径的系统, 需要精度时使用。
   * state 为平坦数值数组, deriv 返回 dy/dt。
   */
  static rk4(state: StateVector, deriv: Derivative, dt: number, t = 0): StateVector {
    const add = (a: StateVector, b: StateVector, s: number): StateVector =>
      a.map((v, i) => v + b[i] * s);

    const k1 = deriv(state, t);
    const k2 = deriv(add(state, k1, dt / 2), t + dt / 2);
    const k3 = deriv(add(state, k2, dt / 2), t + dt / 2);
    const k4 = deriv(add(state, k3, dt), t + dt);

    return state.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
}
