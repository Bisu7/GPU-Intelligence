import random
from typing import List, Dict
from app.core.config import settings

try:
    import pynvml
    HAS_NVML = True
except ImportError:
    HAS_NVML = False

class GPUMonitor:
    def __init__(self):
        self.use_simulator = settings.USE_SIMULATOR or not HAS_NVML
        if not self.use_simulator:
            try:
                pynvml.nvmlInit()
            except Exception as e:
                print(f"Failed to initialize NVML: {e}. Falling back to simulator.")
                self.use_simulator = True

    def get_metrics(self) -> List[Dict]:
        if self.use_simulator:
            return self._get_simulated_metrics()
        return self._get_real_metrics()

    def _get_real_metrics(self) -> List[Dict]:
        metrics = []
        try:
            device_count = pynvml.nvmlDeviceGetCount()
            for i in range(device_count):
                handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                name = pynvml.nvmlDeviceGetName(handle)
                util = pynvml.nvmlDeviceGetUtilizationRates(handle)
                mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
                temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
                power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0  # Convert to Watts
                fan = pynvml.nvmlDeviceGetFanSpeed(handle)
                
                metrics.append({
                    "gpu_index": i,
                    "name": name if isinstance(name, str) else name.decode('utf-8'),
                    "utilization": util.gpu,
                    "memory_used": mem.used / (1024**2),  # MB
                    "memory_total": mem.total / (1024**2), # MB
                    "temp": temp,
                    "power_draw": power,
                    "fan_speed": fan
                })
        except Exception as e:
            print(f"Error fetching real metrics: {e}")
        return metrics

    def _get_simulated_metrics(self) -> List[Dict]:
        # Simulate 2 GPUs
        return [
            {
                "gpu_index": 0,
                "name": "NVIDIA GeForce RTX 4090 (Simulated)",
                "utilization": random.uniform(20, 80),
                "memory_used": random.uniform(4000, 12000),
                "memory_total": 24576,
                "temp": random.uniform(45, 75),
                "power_draw": random.uniform(100, 350),
                "fan_speed": random.uniform(30, 60)
            },
            {
                "gpu_index": 1,
                "name": "NVIDIA GeForce RTX 4090 (Simulated)",
                "utilization": random.uniform(10, 50),
                "memory_used": random.uniform(2000, 8000),
                "memory_total": 24576,
                "temp": random.uniform(40, 65),
                "power_draw": random.uniform(80, 250),
                "fan_speed": random.uniform(20, 50)
            }
        ]

gpu_monitor = GPUMonitor()
