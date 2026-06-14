import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import FaradayScene from './FaradayScene';
import type { FaradaySample } from './FaradayScene';
import ControlPanel from '../../components/ControlPanel';
import type { SliderSpec } from '../../components/ControlPanel';
import type { FaradayParams } from './simulation';
import { DEFAULT_PARAMS } from './simulation';

const SPECS: SliderSpec[] = [
  { key: 'B', label: '磁场 B', min: 0, max: 3, step: 0.1, unit: ' T' },
  { key: 'mass', label: '圆盘质量 m', min: 0.5, max: 10, step: 0.5, unit: ' kg' },
  { key: 'resistance', label: '外接电阻 R', min: 0.05, max: 5, step: 0.05, unit: ' Ω' },
  { key: 'initialOmega', label: '初始转速 ω₀ (需重发)', min: 5, max: 50, step: 1, unit: ' rad/s' },
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

export default function FaradaySandbox() {
  const [params, setParams] = useState<FaradayParams>(DEFAULT_PARAMS);
  const [resetKey, setResetKey] = useState(0);
  const [sample, setSample] = useState<FaradaySample>({ omega: 0, current: 0, power: 0 });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#070709' }}>
      <Canvas camera={{ position: [0, 13, 19], fov: 45 }}>
        <FaradayScene params={params} resetKey={resetKey} onSample={setSample} />
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
          title="法拉第圆盘 · 实验参数"
          specs={SPECS}
          values={params as unknown as Record<string, number>}
          onChange={(k, v) => setParams((p) => ({ ...p, [k]: v }))}
          onReset={() => setResetKey((k) => k + 1)}
        />
        <div style={readoutStyle}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>实时遥测</div>
          <Row label="角速度 ω" value={`${sample.omega.toFixed(2)} rad/s`} color="#ff6b6b" />
          <Row label="回路电流 I" value={`${sample.current.toFixed(1)} A`} color="#00d2ff" />
          <Row label="灯泡功率 P (∝亮度)" value={`${(sample.power / 1000).toFixed(2)} kW`} color="#ffdd55" />
          <div style={{ marginTop: 4, color: '#7a7a82', fontSize: 11, lineHeight: 1.5 }}>
            P ∝ I²R, 故转速下降时灯泡变暗比转速更快。B=0 时无阻力矩, 圆盘永不停。
          </div>
        </div>
      </aside>
    </div>
  );
}
