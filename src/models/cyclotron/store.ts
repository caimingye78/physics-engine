import { useSyncExternalStore } from 'react';

// 回旋加速器遥测采样点(降频后存入, 用于 recharts 绘制"加速天花板"曲线)
export interface CyclotronTelemetrySample {
  t: number; // 本次发射以来的时间 (s)
  beta: number; // v/c, 永远 < 1
  gamma: number; // 洛伦兹因子 γ
}

export interface CyclotronTelemetrySnapshot {
  samples: CyclotronTelemetrySample[];
  latest: CyclotronTelemetrySample | null;
}

const MAX_SAMPLES = 600;

/**
 * 外部 store: 物理循环(useFrame)与图表(React 重渲染)之间的隔离总线。
 * 每次重新发射(逃逸/重置)都会 reset, 使曲线展示一段完整的"加速→趋近光速"过程。
 */
function createStore() {
  let snapshot: CyclotronTelemetrySnapshot = { samples: [], latest: null };
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const l of listeners) l();
  };
  return {
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot(): CyclotronTelemetrySnapshot {
      return snapshot;
    },
    push(sample: CyclotronTelemetrySample) {
      const samples = snapshot.samples.concat(sample);
      if (samples.length > MAX_SAMPLES) samples.splice(0, samples.length - MAX_SAMPLES);
      snapshot = { samples, latest: sample };
      emit();
    },
    reset() {
      snapshot = { samples: [], latest: null };
      emit();
    },
  };
}

export const cyclotronTelemetryStore = createStore();

export function useCyclotronTelemetry(): CyclotronTelemetrySnapshot {
  return useSyncExternalStore(cyclotronTelemetryStore.subscribe, cyclotronTelemetryStore.getSnapshot);
}
