// 双杆切割磁感线模型 —— 坐标与物理约定
//
// 坐标系(右手系, three.js 标准):
//   X 轴: 水平向右  —— 金属杆沿 X 横跨两条导轨
//   Y 轴: 垂直向上
//   Z 轴: 穿出屏幕  —— 导轨沿 Z 延伸, 杆沿 Z 滑动
//   匀强磁场 B 沿 -Y(垂直向下)穿过导轨平面
//
// 不等宽导轨: 杆 A 有效切割长度 LA, 杆 B 有效切割长度 LB。
// 当 LA != LB 时系统动量不守恒, 但 (mA*vA/LA + mB*vB/LB) 守恒,
// 稳态条件为电流 I=0, 即 LA*vA = LB*vB(速度与轨宽成反比)。

/** 可由控制面板实时调节的物理参数 */
export interface DualRodParams {
  B: number; // 磁感应强度大小 (T)
  massA: number; // 杆 A 质量 (kg)
  massB: number; // 杆 B 质量 (kg)
  lengthA: number; // 杆 A 有效切割长度 / 宽导轨轨距 (m)
  lengthB: number; // 杆 B 有效切割长度 / 窄导轨轨距 (m)
  resistance: number; // 回路总电阻 (Ω)
  initialVA: number; // 杆 A 初速度 (m/s, 沿 +Z)
  initialVB: number; // 杆 B 初速度 (m/s, 沿 +Z)
}

// 默认参数选取使衰减时间常数 τ≈1.5s, 既可观赏整个暂态又不刚性。
export const DEFAULT_PARAMS: DualRodParams = {
  B: 0.5,
  massA: 15,
  massB: 15,
  lengthA: 10,
  lengthB: 5,
  resistance: 3,
  initialVA: 15,
  initialVB: 0,
};

/** 电阻下限, 防止除零(模拟短路时电流爆表但仍有限) */
export const MIN_RESISTANCE = 0.01;

// ---- 3D 渲染几何常量 ----
export const RAIL_LENGTH = 200; // 导轨长度 (m), 加长以便长时间观察棒的运动与减速
export const RAIL_RADIUS = 0.15;
export const ROD_RADIUS = 0.3;
export const ROD_Y = 0.3; // 杆中心离导轨平面的高度
export const ZA_INITIAL = -12; // 杆 A 初始 Z 坐标
export const ZB_INITIAL = 10; // 杆 B 初始 Z 坐标
// 杆位置在 ±VIEW_HALF 内做循环显示(纯视觉, 不影响物理), 防止跑出视野。
// 取较大值, 让棒在循环回绕前能滑行很长距离(配合鼠标滚轮缩小可观察更久)。
export const VIEW_HALF = 90;
