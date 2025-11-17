interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request is allowed based on rate limit
   */
  isAllowed(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000,
    blockDurationMs: number = 300000 // 5 minutes block
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // If no entry exists, create one
    if (!entry) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs,
        blocked: false,
      };
    }

    // Check if currently blocked
    if (entry.blocked && now < entry.resetTime) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        blocked: true,
      };
    }

    // Reset if window has passed
    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
      entry.blocked = false;
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: entry.resetTime,
        blocked: false,
      };
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
      // Block for specified duration
      entry.blocked = true;
      entry.resetTime = now + blockDurationMs;
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        blocked: true,
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
      blocked: false,
    };
  }

  /**
   * Get current rate limit status
   */
  getStatus(
    identifier: string
  ): {
    count: number;
    limit: number;
    resetTime: number;
    blocked: boolean;
  } | null {
    const entry = this.limits.get(identifier);
    if (!entry) return null;

    return {
      count: entry.count,
      limit: 100, // Default limit
      resetTime: entry.resetTime,
      blocked: entry.blocked,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [identifier, entry] of this.limits.entries()) {
      if (now > entry.resetTime && !entry.blocked) {
        this.limits.delete(identifier);
      }
    }
  }

  /**
   * Destroy the rate limiter and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.limits.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Rate limit configurations for different endpoints
export const RATE_LIMITS = {
  CHAT: { limit: 100, windowMs: 60000, blockDurationMs: 300000 }, // 100 requests per minute
  VISION: { limit: 100, windowMs: 60000, blockDurationMs: 600000 }, // 50 requests per minute
  MODERATION: { limit: 200, windowMs: 60000, blockDurationMs: 300000 }, // 200 requests per minute
  GENERAL: { limit: 1000, windowMs: 3600000, blockDurationMs: 3600000 }, // 1000 requests per hour
} as const;
