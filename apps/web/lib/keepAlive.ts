// Keep-Alive Service to prevent Render free tier from sleeping
// Pings the backend every 10 minutes

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

  start() {
    if (this.intervalId) return; // Already running

    console.log("[KeepAlive] Starting keep-alive service");

    // Ping immediately
    this.ping();

    // Then ping every 10 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[KeepAlive] Stopped keep-alive service");
    }
  }

  private async ping() {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("[KeepAlive] Backend is alive:", {
          status: data.status,
          uptime: data.uptime,
        });
      } else {
        console.warn(
          "[KeepAlive] Backend returned non-OK status:",
          response.status
        );
      }
    } catch (error) {
      console.error("[KeepAlive] Failed to ping backend:", error);
    }
  }
}

// Singleton instance
export const keepAliveService = new KeepAliveService();
