import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useCyclotronTelemetry } from './store';

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

export default function TelemetryChart() {
  const { samples } = useCyclotronTelemetry();

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>加速天花板 · β=v/c 与 γ 随时间</h3>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={samples} margin={{ top: 4, right: 6, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="t" stroke="#888" tick={{ fontSize: 11 }} unit="s" />
          {/* 左轴: β = v/c, 固定 0~1, 顶部即光速 */}
          <YAxis
            yAxisId="beta"
            domain={[0, 1]}
            stroke="#00e0ff"
            tick={{ fontSize: 11 }}
            width={34}
          />
          {/* 右轴: 洛伦兹因子 γ */}
          <YAxis
            yAxisId="gamma"
            orientation="right"
            domain={[1, 'auto']}
            stroke="#ffcc33"
            tick={{ fontSize: 11 }}
            width={30}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 11 }} />
          {/* 光速天花板: β=1 这条线粒子永远碰不到 */}
          <ReferenceLine
            yAxisId="beta"
            y={1}
            stroke="#ff4d4d"
            strokeDasharray="5 4"
            label={{ value: '光速 c (β=1)', fill: '#ff6b6b', fontSize: 10, position: 'insideTopRight' }}
          />
          <Line
            yAxisId="beta"
            type="monotone"
            dataKey="beta"
            name="v/c (β)"
            stroke="#00e0ff"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="gamma"
            type="monotone"
            dataKey="gamma"
            name="洛伦兹因子 γ"
            stroke="#ffcc33"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
