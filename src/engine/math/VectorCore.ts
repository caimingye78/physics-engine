import { create, all } from 'mathjs';

// 单一的 mathjs 实例。复数·矩阵·高维向量原生支持。
const math = create(all);

/** 严格的 3D 向量类型: [x, y, z] */
export type Vector3D = [number, number, number];

export const ZERO: Vector3D = [0, 0, 0];

/**
 * 物理世界的基础向量运算。
 * 薄封装 mathjs, 将返回值固定为 Vector3D。
 * 全部为纯函数(无副作用), 不依赖 React / three。
 */
export class VectorEngine {
  /** 叉乘 v1 × v2。用于洛伦兹力·安培力方向、平面法向量。 */
  static cross(v1: Vector3D, v2: Vector3D): Vector3D {
    return math.cross(v1, v2) as unknown as Vector3D;
  }

  /** 点乘 v1 · v2。用于磁通 B·S、做功 F·s。 */
  static dot(v1: Vector3D, v2: Vector3D): number {
    return math.dot(v1, v2) as unknown as number;
  }

  /** 加法(力的合成·位移叠加)。 */
  static add(v1: Vector3D, v2: Vector3D): Vector3D {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
  }

  /** 减法 v1 - v2(相对速度·差分)。 */
  static subtract(v1: Vector3D, v2: Vector3D): Vector3D {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
  }

  /** 标量倍(a = F/m, v = a*t 等)。 */
  static multiplyScalar(v: Vector3D, scalar: number): Vector3D {
    return [v[0] * scalar, v[1] * scalar, v[2] * scalar];
  }

  /** 模长 |v|。 */
  static magnitude(v: Vector3D): number {
    return Math.hypot(v[0], v[1], v[2]);
  }

  /** 模长平方(避免开方的比较·动能计算)。 */
  static magnitudeSq(v: Vector3D): number {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  }

  /** 单位向量化。零向量返回 [0,0,0]。 */
  static normalize(v: Vector3D): Vector3D {
    const m = VectorEngine.magnitude(v);
    if (m === 0) return [0, 0, 0];
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  /** v 沿 unit 方向的投影标量(EMF = (v×B)·dl 投影等)。 */
  static projectScalar(v: Vector3D, unit: Vector3D): number {
    return VectorEngine.dot(v, VectorEngine.normalize(unit));
  }
}
