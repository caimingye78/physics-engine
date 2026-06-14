import { lazy, Suspense, useState } from 'react';

const DualRodSandbox = lazy(() => import('./models/dual_rod/DualRodSandbox'));
const FaradaySandbox = lazy(() => import('./models/faraday/FaradaySandbox'));
const CyclotronSandbox = lazy(() => import('./models/cyclotron/CyclotronSandbox'));

type ModelId = 'dual_rod' | 'faraday' | 'cyclotron';

interface ModelMeta {
  id: ModelId;
  name: string;
  desc: string;
}

const MODELS: ModelMeta[] = [
  { id: 'dual_rod', name: '双杆切割', desc: '不等宽导轨 · 能量守恒' },
  { id: 'faraday', name: '法拉第圆盘', desc: '单极发电机 · 电磁阻尼' },
  { id: 'cyclotron', name: '回旋加速器', desc: '相对论 · 失步天花板' },
];

export default function App() {
  const [active, setActive] = useState<ModelId>('dual_rod');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 物理沙盒 */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={<Loading />}>
          {active === 'dual_rod' && <DualRodSandbox />}
          {active === 'faraday' && <FaradaySandbox />}
          {active === 'cyclotron' && <CyclotronSandbox />}
        </Suspense>
      </div>

      {/* 顶部模型切换标签 */}
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
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: '#9b9ba6' }}>
          PHYSICS&nbsp;ENGINE&nbsp;· 向量微积分驱动的电磁学沙盒
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
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
