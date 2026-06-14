import { useSyncExternalStore } from 'react';

// 遥测采样点(降频后存入, 用于 recharts 绘图)
export interface TelemetrySample {
  t: number; // 时间 (s)
  vA: number; // 杆 A 速度
  vB: number; // 杆 B 速度
  current: number; // 回路电流
  kineticEnergy: number; // 系统动能
  heat: number; // 累计焦耳热
}

export interface TelemetrySnapshot {
  samples: TelemetrySample[];
  latest: TelemetrySample | null;
}

const MAX_SAMPLES = 240; // 约 12 秒 @ 20Hz 采样窗口

/**
 * 外部 store: 物理循环(useFrame, 60fps)与图表(React 重渲染)之间的隔离总线。
 * 物理层用 ref 直接驱动 3D mesh(不触发重渲染);
 * 图表层通过 useSyncExternalStore 订阅本 store, 重渲染被限制在面板内。
 */
function createTelemetryStore() {
  let snapshot: TelemetrySnapshot = { samples: [], latest: null };
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const l of listeners) l();
  };

  return {
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot(): TelemetrySnapshot {
      return snapshot;
    },
    push(sample: TelemetrySample) {
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

export const telemetryStore = createTelemetryStore();

/** React Hook: 订阅遥测快照, 重渲染隔离在调用组件内。 */
export function useTelemetry(): TelemetrySnapshot {
  return useSyncExternalStore(telemetryStore.subscribe, telemetryStore.getSnapshot);
}
