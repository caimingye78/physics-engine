import { describe, it, expect } from 'vitest';
import { VectorEngine } from '../math';
import {
  createInitialState as createRodState,
  initialEnergy,
  diagnose,
  simulateSteps,
  steadyStateVelocities,
} from '../../models/dual_rod/simulation';
import type { DualRodParams } from '../../models/dual_rod/config';
import {
  createInitialState as createCycState,
  stepCyclotron,
  speed,
  C_LIGHT,
} from '../../models/cyclotron/simulation';
import type { CyclotronParams } from '../../models/cyclotron/simulation';

// 类型安全 ≠ 物理守恒。下面用不变量断言来保证物理正确性,
// 这才是"重构物理公式的真正底气"。

describe('VectorCore 基本恒等式', () => {
  it('洛伦兹力不做功: (v×B)·v ≡ 0', () => {
    const v: [number, number, number] = [10, -4, 7];
    const B: [number, number, number] = [0, 2, 0];
    const F = VectorEngine.cross(v, B);
    expect(VectorEngine.dot(F, v)).toBeCloseTo(0, 12);
  });

  it('叉乘反对称: a×b = -(b×a)', () => {
    const a: [number, number, number] = [1, 2, 3];
    const b: [number, number, number] = [-4, 5, 6];
    const ab = VectorEngine.cross(a, b);
    const ba = VectorEngine.cross(b, a);
    expect(ab).toEqual([-ba[0], -ba[1], -ba[2]]);
  });
});

describe('双杆: 能量守恒 (动能 + 焦耳热 ≡ E₀)', () => {
  // 温和(非刚性)参数: 衰减时间常数 τ≈O(0.1s), 远大于积分步长, RK4 近乎精确。
  const params: DualRodParams = {
    B: 1,
    massA: 5,
    massB: 5,
    lengthA: 8,
    lengthB: 4,
    resistance: 2,
    initialVA: 12,
    initialVB: 0,
  };

  it('任意时刻 动能+焦耳热 与初始动能相等', () => {
    const E0 = initialEnergy(params);
    const dt = 1 / 2000;
    let s = createRodState(params);
    for (let k = 0; k < 6; k++) {
      s = simulateSteps(params, s, 1000, dt); // 每段 0.5s
      const d = diagnose(params, s);
      expect(Math.abs(d.totalEnergy - E0) / E0).toBeLessThan(1e-4);
    }
  });

  it('不等宽稳态速度比收敛于轨宽反比 vB:vA = LA:LB', () => {
    const dt = 1 / 2000;
    const s = simulateSteps(params, createRodState(params), 40000, dt); // 20s
    const steady = steadyStateVelocities(params);
    expect(s.vA).toBeCloseTo(steady.vA, 2);
    expect(s.vB).toBeCloseTo(steady.vB, 2);
    // LA*vA ≈ LB*vB (电流趋于 0)
    expect(params.lengthA * s.vA).toBeCloseTo(params.lengthB * s.vB, 2);
  });
});

describe('回旋加速器(相对论): 不变量', () => {
  it('关闭电场(eMax=0)时, D 盒内速率守恒(洛伦兹力不做功)', () => {
    const params: CyclotronParams = { B: 2, eMax: 0, initialSpeed: 30 };
    const dt = 1 / 480;
    let s = createCycState(params);
    const v0 = speed(s);
    for (let i = 0; i < 4000; i++) s = stepCyclotron(params, s, dt);
    const v1 = speed(s);
    expect(Math.abs(v1 - v0) / v0).toBeLessThan(1e-3);
  });

  it('开电场加速时速率永远 < 沙盒光速 c, 且确实被加速(天花板)', () => {
    const params: CyclotronParams = { B: 4, eMax: 60, initialSpeed: 3 };
    const dt = 1 / 480;
    let s = createCycState(params);
    let vMax = 0;
    for (let i = 0; i < 40000; i++) {
      s = stepCyclotron(params, s, dt);
      const v = speed(s);
      expect(v).toBeLessThan(C_LIGHT); // 相对论: 永不超光速
      if (v > vMax) vMax = v;
    }
    expect(vMax).toBeGreaterThan(20); // 确实被显著加速(初速 3)
    expect(vMax).toBeLessThan(C_LIGHT); // 但被锁死在 c 之下
  });
});
