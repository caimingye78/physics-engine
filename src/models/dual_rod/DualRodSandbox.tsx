import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import RodScene from './RodScene';
import TelemetryCharts from './TelemetryCharts';
import ControlPanel from '../../components/ControlPanel';
import type { SliderSpec } from '../../components/ControlPanel';
import type { DualRodParams } from './config';
import { DEFAULT_PARAMS } from './config';

const SPECS: SliderSpec[] = [
  { key: 'B', label: '磁场 B', min: 0, max: 3, step: 0.1, unit: ' T' },
  { key: 'massA', label: '杆A 质量 mA', min: 1, max: 30, step: 1, unit: ' kg' },
  { key: 'massB', label: '杆B 质量 mB', min: 1, max: 30, step: 1, unit: ' kg' },
  { key: 'lengthA', label: '杆A 长度 LA', min: 2, max: 15, step: 0.5, unit: ' m' },
  { key: 'lengthB', label: '杆B 长度 LB', min: 2, max: 15, step: 0.5, unit: ' m' },
  { key: 'resistance', label: '回路电阻 R', min: 0.05, max: 5, step: 0.05, unit: ' Ω' },
  { key: 'initialVA', label: '杆A 初速度 (需重发)', min: 0, max: 30, step: 1, unit: ' m/s' },
  { key: 'initialVB', label: '杆B 初速度 (需重发)', min: 0, max: 30, step: 1, unit: ' m/s' },
];

export default function DualRodSandbox() {
  const [params, setParams] = useState<DualRodParams>(DEFAULT_PARAMS);
  const [resetKey, setResetKey] = useState(0);

  const handleChange = (key: keyof DualRodParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0c0c10' }}>
      <Canvas camera={{ position: [34, 30, 64], fov: 45 }}>
        <RodScene params={params} resetKey={resetKey} />
      </Canvas>

      <aside
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 380,
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
          title="双杆切割 · 实验参数"
          specs={SPECS}
          values={params as unknown as Record<string, number>}
          onChange={(k, v) => handleChange(k as keyof DualRodParams, v)}
          onReset={() => setResetKey((k) => k + 1)}
        />
        <TelemetryCharts params={params} />
      </aside>
    </div>
  );
}
