# Physics Engine · 向量微积分驱动的电磁学沙盒

一个用 React + Three.js 构建的交互式电磁学物理引擎。所有现象都不是关键帧动画，而是由底层数学（向量运算 + 数值积分）逐帧"推演"出来的真实物理过程。

**在线访问**: https://caimingye78.github.io/physics-engine/

---

## 四个模型

| 模型 | 现象 | 核心物理 |
|------|------|----------|
| 双杆切割 | 不等宽导轨上两杆相互作用，稳态速度比 = 轨宽反比 | 动生电动势、安培力、能量守恒 |
| 法拉第圆盘 | 铜盘旋转发电、电磁阻尼非线性减速、灯泡明暗 | EMF=½BωR²、阻力矩、P=I²R |
| 回旋加速器 | 半径递增的半圆串、相对论"加速天花板" | 洛伦兹力、相对论动量积分、失步 |
| 质谱仪 | 速度选择器 + 按质量分离的半圆偏转 | v=E/B、r=mv/(qB) |

---

## 架构（自底向上，纯函数与渲染解耦）

```
src/
  engine/
    math/        VectorCore(叉乘/点乘/归一化) · CalculusCore(欧拉/半隐式/RK4)
    physics/     electromagnetics(洛伦兹力/安培力/EMF...) · relativity(洛伦兹因子γ)
    __tests__/   不变量测试(能量守恒/洛伦兹力不做功/永不超光速)
  models/
    dual_rod/    simulation(纯函数) · RodScene(3D) · TelemetryCharts(recharts) · store
    faraday/     simulation · FaradayScene
    cyclotron/   simulation(相对论) · CyclotronScene · TelemetryChart · store
    mass_spec/   simulation · MassSpecScene
  components/    ControlPanel(通用滑块面板)
  App.tsx        模型切换 + 说明面板
```

### 关键工程决策

- **物理与渲染解耦**: 物理用纯函数实现，不依赖 React/three，可独立单元测试。
- **固定步长累加器**: 物理锁定 240/480Hz，与屏幕帧率彻底解耦，防止"切 Tab 回来粒子飞出宇宙"和高频电场失相。
- **统一 RK4 积分**: 圆周/相对论等对精度敏感的系统用四阶龙格-库塔，回旋轨迹是正确的"半圆串"而非欧拉漂移出的假螺旋。
- **相对论积分动量**: 牛顿第二定律的真身是 F=dp/dt；由动量反推 v=p/(γm₀) 恒小于 c，数值不会因 v→c 崩溃。
- **类型安全 ≠ 物理守恒**: 用不变量断言测试（能量守恒、洛伦兹力做功为零、永不超光速）来保证公式正确。
- **图表重渲染隔离**: 物理循环用 ref 直接驱动 mesh，遥测数据走外部 store + useSyncExternalStore，recharts 重渲染被限制在面板内。

---

## 本地开发

```bash
npm install
npm run dev        # 开发服务器
npm test           # 运行不变量测试 (vitest)
npm run build      # 构建并把产物铺到仓库根目录(GitHub Pages root 部署)
```

## 部署（GitHub Pages）

`npm run build` 通过 `prebuild`/`postbuild` 把编译产物直接输出到仓库**根目录**。在仓库 Settings → Pages 选择 **Deploy from a branch → main → / (root)** 即可发布，无需任何 GitHub Actions 工作流。每次推送到 main 自动重新发布。

## 技术栈

Vite · React 19 · TypeScript · Three.js · @react-three/fiber · @react-three/drei · recharts · mathjs · vitest
