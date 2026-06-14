import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import MassSpecScene from './MassSpecScene';
import type { MassSpecSample } from './MassSpecScene';
import ControlPanel from '../../components/ControlPanel';
import type { SliderSpec } from '../../components/ControlPanel';
import type { MassSpecParams } from './simulation';
import { DEFAULT_PARAMS, MASSES } from './simulation';

const SPECS: SliderSpec[] = [
  { key: 'B', label: '磁场 B', min: 1, max: 8, step: 0.5, unit: ' T' },
  { key: 'E', label: '选择器电场 E', min: 10, max: 120, step: 5 },
  { key: 'charge', label: '离子电荷 q', min: 1, max: 4, step: 1 },
];

const COLORS = ['#00e0ff', '#ffcc33', '#ff6b6b'];

const readoutStyle: React.CSSProperties = {
  background: 'rgba(18,18,22,0.82)',
  borderRadius: 10,
  padding: '12px 14px',
  border: '1px solid #2c2c33',
  backdropFilter: 'blur(6px)',
  color: '#e8e8ea',
  fontSize: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#b9b9c0' }}>{label}</span>
      <span style={{ color, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function MassSpecSandbox() {
  const [params, setParams] = useState<MassSpecParams>(DEFAULT_PARAMS);
  const [resetKey, setResetKey] = useState(0);
  const [sample, setSample] = useState<MassSpecSample>({ vSel: 0, radii: MASSES.map(() => 0) });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#08080c' }}>
      <Canvas camera={{ position: [8, 34, 30], fov: 45 }}>
        <MassSpecScene params={params} resetKey={resetKey} onSample={setSample} />
      </Canvas>

      <aside
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 340,
          height: '100%',
          overflowY: 'auto',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxSizing: 'border-box',
        }}
      >
        <ControlPanel
          title="质谱仪 · 实验参数"
          specs={SPECS}
          values={params as unknown as Record<string, number>}
          onChange={(k, v) => setParams((p) => ({ ...p, [k]: v }))}
          onReset={() => setResetKey((k) => k + 1)}
        />
        <div style={readoutStyle}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>实时遥测</div>
          <Row label="通过速度 v = E/B" value={`${sample.vSel.toFixed(2)} m/s`} color="#e8e8ea" />
          {MASSES.map((m, i) => (
            <Row
              key={m}
              label={`m=${m} 半径 r / 落点 2r`}
              value={`${(sample.radii[i] ?? 0).toFixed(2)} / ${(2 * (sample.radii[i] ?? 0)).toFixed(2)} m`}
              color={COLORS[i]}
            />
          ))}
          <div style={{ marginTop: 4, color: '#7a7a82', fontSize: 11, lineHeight: 1.5 }}>
            选择器只放行 v=E/B 的离子(上下电场板平衡磁力)。进入纯磁场区后半径 r=mv/(qB),
            质量越大圆越大、落点 2r 越远 —— 三种离子在探测板上被分离开。
          </div>
        </div>
      </aside>
    </div>
  );
}
