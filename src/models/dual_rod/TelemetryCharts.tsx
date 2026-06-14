import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { DualRodParams } from './config';
import { initialEnergy, steadyStateVelocities } from './simulation';
import { useTelemetry } from './store';

const panelStyle: React.CSSProperties = {
  background: 'rgba(18,18,22,0.82)',
  borderRadius: 10,
  padding: '10px 12px 4px',
  border: '1px solid #2c2c33',
  backdropFilter: 'blur(6px)',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 6px',
  fontSize: 13,
  fontWeight: 600,
  color: '#e8e8ea',
  textAlign: 'center',
};

const tooltipStyle = { backgroundColor: '#1a1a1f', border: '1px solid #333', borderRadius: 6 };

export default function TelemetryCharts({ params }: { params: DualRodParams }) {
  const { samples } = useTelemetry();
  const steady = steadyStateVelocities(params);
  const E0 = initialEnergy(params);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 速度-时间图: 验证 vB/vA 收敛于轨宽反比 LA/LB */}
      <div style={panelStyle}>
        <h3 style={titleStyle}>速度-时间 (v-t) · 稳态 vB:vA = LA:LB</h3>
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={samples} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="t" stroke="#888" tick={{ fontSize: 11 }} unit="s" />
            <YAxis stroke="#888" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={steady.vA} stroke="#ff4d4d" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ReferenceLine y={steady.vB} stroke="#4dff7a" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Line type="monotone" dataKey="vA" name="杆A 速度" stroke="#ff4d4d" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="vB" name="杆B 速度" stroke="#4dff7a" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 能量守恒堆叠面积图: 动能+焦耳热, 顶边恒为 E0 一条水平线 */}
      <div style={panelStyle}>
        <h3 style={titleStyle}>能量守恒 (J) · 动能 + 焦耳热 ≡ E₀</h3>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={samples} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="t" stroke="#888" tick={{ fontSize: 11 }} unit="s" />
            <YAxis stroke="#888" tick={{ fontSize: 11 }} domain={[0, Number((E0 * 1.05).toFixed(1))]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="kineticEnergy" name="系统动能 Ek" stackId="e" stroke="#00d2ff" fill="#00d2ff" fillOpacity={0.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="heat" name="累计焦耳热 Q" stackId="e" stroke="#ffaa00" fill="#ffaa00" fillOpacity={0.5} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
