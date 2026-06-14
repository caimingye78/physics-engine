// 通用控制面板: 由滑块规格驱动, 双杆/法拉第/回旋等模型共用。
// 自定义实现而非引入 leva, 以彻底掌控样式并避免额外 peer 依赖风险。

export interface SliderSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

interface ControlPanelProps<K extends string> {
  title: string;
  specs: SliderSpec[];
  values: Record<K, number>;
  onChange: (key: K, value: number) => void;
  onReset?: () => void;
  resetLabel?: string;
}

const wrap: React.CSSProperties = {
  background: 'rgba(18,18,22,0.82)',
  borderRadius: 10,
  padding: '12px 14px',
  border: '1px solid #2c2c33',
  backdropFilter: 'blur(6px)',
  color: '#e8e8ea',
};

export default function ControlPanel<K extends string>({
  title,
  specs,
  values,
  onChange,
  onReset,
  resetLabel = '重置 / 重新发射',
}: ControlPanelProps<K>) {
  return (
    <div style={wrap}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, letterSpacing: 0.3 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {specs.map((spec) => {
          const v = values[spec.key as K];
          return (
            <label key={spec.key} style={{ fontSize: 11.5, display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ color: '#b9b9c0' }}>{spec.label}</span>
                <span style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                  {v}
                  {spec.unit ?? ''}
                </span>
              </div>
              <input
                type="range"
                min={spec.min}
                max={spec.max}
                step={spec.step}
                value={v}
                onChange={(e) => onChange(spec.key as K, Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00d2ff' }}
              />
            </label>
          );
        })}
      </div>
      {onReset && (
        <button
          onClick={onReset}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '8px 0',
            background: 'linear-gradient(90deg,#00d2ff,#3a7bd5)',
            color: '#0a0a0a',
            fontWeight: 700,
            fontSize: 12.5,
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
}
