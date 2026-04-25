import { create } from 'zustand';

interface GPUMetric {
  gpu_index: number;
  name: string;
  utilization: number;
  memory_used: number;
  memory_total: number;
  temp: number;
  power_draw: number;
  fan_speed: number;
}

interface MetricsSummary {
  total_gpus: number;
  active_gpus: number;
  avg_temp: number;
  avg_utilization: number;
}

interface MetricsState {
  liveMetrics: GPUMetric[];
  summary: MetricsSummary | null;
  setLiveMetrics: (metrics: GPUMetric[]) => void;
  setSummary: (summary: MetricsSummary) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  liveMetrics: [],
  summary: null,
  setLiveMetrics: (metrics) => set({ liveMetrics: metrics }),
  setSummary: (summary) => set({ summary: summary }),
}));
