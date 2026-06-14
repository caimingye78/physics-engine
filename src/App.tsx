import { lazy, Suspense, useState } from 'react';

const DualRodSandbox = lazy(() => import('./models/dual_rod/DualRodSandbox'));
const FaradaySandbox = lazy(() => import('./models/faraday/FaradaySandbox'));
const CyclotronSandbox = lazy(() => import('./models/cyclotron/CyclotronSandbox'));
const MassSpecSandbox = lazy(() => import('./models/mass_spec/MassSpecSandbox'));

type ModelId = 'dual_rod' | 'faraday' | 'cyclotron' | 'mass_spec';

interface ModelMeta {
  id: ModelId;
  name: string;
  desc: string;
  intro: string;
}

const MODELS: ModelMeta[] = [
  {
    id: 'dual_rod',
    name: '双杆切割',
    desc: '不等宽导轨 · 能量守恒',
    intro:
      '两根金属杆在不等宽导轨上切割磁感线。杆A减速、杆B加速, 稳态速度比收敛于轨宽反比 (LA*vA=LB*vB)。右侧图表: v-t 曲线收敛于理论稳态; 能量图中"动能+焦耳热"顶边恒为一条水平线 E₀(能量守恒)。导轨已加长, 可用滚轮缩小、长时间观察减速过程。',
  },
  {
    id: 'faraday',
    name: '法拉第圆盘',
    desc: '单极发电机 · 电磁阻尼',
    intro:
      '人类第一台发电机。铜盘旋转切割磁感线产生电动势 EMF=½BωR², 电流经磁场受反向阻力矩而非线性减速。灯泡亮度 ∝ I²R, 暗得比转速更快。玩法: B 推大=电磁急刹, B=0=永不停。',
  },
  {
    id: 'cyclotron',
    name: '回旋加速器',
    desc: '相对论 · 失步天花板',
    intro:
      '带电粒子在交变电场与磁场中加速, 轨迹是半径递增的"半圆串"(非连续螺旋, 因磁力不做功)。相对论下积分动量 F=dp/dt, v=p/(γm₀) 恒<c。提速后 γ↑ 使回旋周期变长、粒子失步被减速, 速率锁死在光速之下 —— 右侧 β-t 曲线趋近 β=1 的红线却永不触及, 即"加速天花板"。',
  },
  {
    id: 'mass_spec',
    name: '质谱仪',
    desc: '速度选择器 · 按质量分离',
    intro:
      '速度选择器(正交 E、B)只放行 v=E/B 的离子, 随后进入纯磁场区做半圆, 半径 r=mv/(qB)。三种同电荷不同质量的离子因半径不同, 落在探测板上不同位置而被分离 —— 这正是质谱仪测定离子质荷比的原理。',
  },
];

export default function App() {
  const [active, setActive] = useState<ModelId>('dual_rod');
  const [showHelp, setShowHelp] = useState(false);
  const activeMeta = MODELS.find((m) => m.id === active)!;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 物理沙盒 */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={<Loading />}>
          {active === 'dual_rod' && <DualRodSandbox />}
          {active === 'faraday' && <FaradaySandbox />}
          {active === 'cyclotron' && <CyclotronSandbox />}
          {active === 'mass_spec' && <MassSpecSandbox />}
        </Suspense>
      </div>

      {/* 顶部标题 + 模型切换标签 */}
      <header
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: '#9b9ba6' }}>
            PHYSICS&nbsp;ENGINE&nbsp;· 向量微积分驱动的电磁学沙盒
          </span>
          <button
            onClick={() => setShowHelp((v) => !v)}
            style={{
              padding: '3px 10px',
              borderRadius: 7,
              border: '1px solid #2c2c33',
              background: showHelp ? 'rgba(0,210,255,0.16)' : 'rgba(18,18,22,0.8)',
              color: showHelp ? '#00e0ff' : '#c8c8d0',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {showHelp ? '关闭说明' : '? 说明'}
          </button>
        </div>

        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 560 }}>
          {MODELS.map((m) => {
            const on = m.id === active;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                title={m.desc}
                style={{
                  padding: '8px 14px',
                  borderRadius: 9,
                  border: on ? '1px solid #00d2ff' : '1px solid #2c2c33',
                  background: on ? 'rgba(0,210,255,0.14)' : 'rgba(18,18,22,0.8)',
                  color: on ? '#00e0ff' : '#c8c8d0',
                  backdropFilter: 'blur(6px)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                  lineHeight: 1.25,
                }}
              >
                <div>{m.name}</div>
                <div style={{ fontSize: 10.5, fontWeight: 400, opacity: 0.7 }}>{m.desc}</div>
              </button>
            );
          })}
        </nav>

        {showHelp && (
          <div
            style={{
              marginTop: 4,
              width: 420,
              maxWidth: '80vw',
              background: 'rgba(14,14,18,0.92)',
              border: '1px solid #2c2c33',
              borderRadius: 10,
              padding: 16,
              backdropFilter: 'blur(8px)',
              color: '#d8d8de',
              fontSize: 12.5,
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6, fontSize: 14 }}>
              当前模型 · {activeMeta.name}
            </div>
            <div style={{ color: '#bdbdc6' }}>{activeMeta.intro}</div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #2c2c33', color: '#8a8a92' }}>
              架构: 数学层(向量/微积分纯函数) → 物理层(电磁学/相对论纯函数) → 表现层(R3F)。
              全部固定步长积分(RK4)、与渲染解耦。鼠标拖拽旋转视角, 滚轮缩放。
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

function Loading() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#5a5a64',
        fontSize: 14,
        letterSpacing: 1,
      }}
    >
      正在加载物理沙盒…
    </div>
  );
}
