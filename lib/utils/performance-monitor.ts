interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  target: number;
  status: 'pending' | 'completed' | 'timeout';
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();

  start(requestId: string, target: number = 2500): void {
    this.metrics.set(requestId, {
      startTime: Date.now(),
      target,
      status: 'pending'
    });
  }

  complete(requestId: string): number {
    const metric = this.metrics.get(requestId);
    if (!metric) return 0;

    const endTime = Date.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;
    metric.status = 'completed';

    // Log performance metrics
    console.log(`パフォーマンス [${requestId}]: ${duration}ms (目標: ${metric.target}ms)`);
    
    if (duration > metric.target) {
      console.warn(`パフォーマンス警告 [${requestId}]: 応答時間が目標を${duration - metric.target}ms超過しました`);
    }

    return duration;
  }

  timeout(requestId: string): void {
    const metric = this.metrics.get(requestId);
    if (metric) {
      metric.status = 'timeout';
      console.error(`パフォーマンスタイムアウト [${requestId}]: リクエストが${metric.target}msを超過しました`);
    }
  }

  getMetrics(requestId: string): PerformanceMetrics | undefined {
    return this.metrics.get(requestId);
  }

  cleanup(): void {
    // Remove old metrics (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 300000;
    for (const [requestId, metric] of this.metrics.entries()) {
      if (metric.startTime < fiveMinutesAgo) {
        this.metrics.delete(requestId);
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Cleanup old metrics every 5 minutes
setInterval(() => {
  performanceMonitor.cleanup();
}, 300000);
