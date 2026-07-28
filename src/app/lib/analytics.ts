/**
 * SentientEthos Server-Side Persisted Analytics Client Service
 * Bridges client actions straight to our backend API pipeline via fetch.
 * Uses rolling, auto-expiring sessions to accurately trace distinct visits.
 */

export interface AnalyticsEvent {
  id?: string;
  eventName: string;
  occurredAt?: string;
  sessionId: string;
  pagePath: string;
  referrer: string;
  productId?: string;
  trackId?: string;
  orderId?: string;
  valueCents?: number;
  properties?: Record<string, any>;
}

const SESSION_STORAGE_KEY = "ijj_analytics_session_id_v3";
const SESSION_TIMESTAMP_KEY = "ijj_analytics_session_last_active";
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

// Safe dynamic ID generation logic
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get or create anonymous session identifier (persisted in localStorage with 30-min rolling expiration)
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const now = Date.now();
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    const lastActiveStr = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    
    let shouldReset = false;
    if (lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      if (now - lastActive > THIRTY_MINUTES_MS) {
        shouldReset = true; // Inactive for > 30 mins
      }
    } else {
      shouldReset = true; // No active timestamp
    }

    if (!sessionId || shouldReset) {
      sessionId = `sess_${generateUUID()}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }

    // Refresh active session time boundary
    localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    return sessionId;
  } catch (e) {
    return "session_fallback";
  }
}

// Stream client event payloads directly to server endpoints
export async function trackLocalEvent(
  eventName: string,
  data: Partial<Omit<AnalyticsEvent, "sessionId" | "pagePath" | "referrer" | "eventName">> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const sessionId = getOrCreateSessionId();
    const payload = {
      eventName,
      sessionId,
      pagePath: window.location.pathname,
      referrer: document.referrer || "",
      productId: data.productId,
      trackId: data.trackId,
      orderId: data.orderId,
      valueCents: data.valueCents,
      properties: data.properties,
    };

    fetch("/api/analytics/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((fetchErr) => {
      console.warn("Analytics telemetry connection deferred:", fetchErr);
    });
  } catch (error) {
    console.error("Local analytics error:", error);
  }
}
