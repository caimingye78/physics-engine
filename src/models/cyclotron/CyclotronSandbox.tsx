import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CyclotronScene from './CyclotronScene';
import type { CyclotronSample } from './CyclotronScene';
import TelemetryChart from './TelemetryChart';
import ControlPanel from '../../components/ControlPanel';
import type { SliderSpec } from '../../components/ControlPanel';
import type { CyclotronParams } from './simulation';
import { DEFAULT_PARAMS } from './simulation';

const SPECS: SliderSpec[] = [
  { key: 'B', label: '磁场 B', min: 0.5, max: 5, step: 0.1, unit: ' T' },
  { key: 'eMax', label: '缝隙电场 E', min: 10, max: 200, step: 5 },
  { key: 'initialSpeed', label: '初始速率 v₀ (需重发)', min: 1, max: 10, step: 0.5, unit: ' m/s' },
];

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

export default function CyclotronSandbox() {
  const [params, setParams] = useState<CyclotronParams>(DEFAULT_PARAMS);
  const [resetKey, setResetKey] = useState(0);
  const [sample, setSample] = useState<CyclotronSample>({ speed: 0, radius: 0, gamma: 1, beta: 0 });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#06060a' }}>
      <Canvas camera={{ position: [0, 48, 56], fov: 45 }}>
        <CyclotronScene params={params} resetKey={resetKey} onSample={setSample} />
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
          title="回旋加速器 · 实验参数"
          specs={SPECS}
          values={params as unknown as Record<string, number>}
          onChange={(k, v) => setParams((p) => ({ ...p, [k]: v }))}
          onReset={() => setResetKey((k) => k + 1)}
        />
        <div style={readoutStyle}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>实时遥测 (相对论)</div>
          <Row label="速率 |v|" value={`${sample.speed.toFixed(2)} m/s`} color="#00e0ff" />
          <Row label="v/c (β)" value={sample.beta.toFixed(4)} color="#ff6b6b" />
          <Row label="洛伦兹因子 γ" value={sample.gamma.toFixed(4)} color="#ffcc33" />
          <Row label="回旋半径 R" value={`${sample.radius.toFixed(2)} m`} color="#9b6bff" />
          <div style={{ marginTop: 4, color: '#7a7a82', fontSize: 11, lineHeight: 1.5 }}>
            积分动量 F=dp/dt, v=p/(γm₀) 恒&lt;c (沙盒光速 c=100)。提速后 γ↑ 使回旋周期变长 →
            粒子迟到 → 穿缝时电场已反向 → 失步被减速, 速率锁死在 c 附近(加速天花板)。
          </div>
        </div>
        <TelemetryChart />
      </aside>
    </div>
  );
}
