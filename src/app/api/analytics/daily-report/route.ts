import { NextRequest, NextResponse } from "next/server";
import { supabase, fallbackDB, isDatabaseConfigured } from "@/app/lib/db";

// Helper to convert dynamic date queries into Hawaii Standard Time (HST/UTC-10) boundaries.
// HST is UTC - 10 hours.
function getHawaiiLimits(dateStr: string) {
  const parts = dateStr.split("-").map((p) => parseInt(p, 10));
  const year = parts[0];
  const month = parts[1] - 1;
  const day = parts[2];

  // 00:00:00 HST translates to 10:00:00 AM UTC of same day
  const start = new Date(Date.UTC(year, month, day, 10, 0, 0, 0));

  // 23:59:59 HST translates to 09:59:59 AM UTC of the next day
  const end = new Date(Date.UTC(year, month, day + 1, 9, 59, 59, 999));

  return { start, end };
}

export async function GET(req: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    // [P1 FIX] Return 503 Service Unavailable if production db client is missing in runtime
    if (isProduction && !isDatabaseConfigured) {
      return NextResponse.json(
        { error: "Service Temporarily Unavailable: Target database is unconfigured" },
        { status: 503 }
      );
    }

    const { searchParams } = req.nextUrl;
    
    // Auth Check: Fail closed immediately if ADMIN_API_KEY env is missing
    const token = req.headers.get("Authorization") || searchParams.get("token");
    const adminKey = process.env.ADMIN_API_KEY;
    
    if (!adminKey) {
      console.error("ADMIN_API_KEY is not defined. Failing closed.");
      return NextResponse.json(
        { error: "Configuration Error: Admin reporting API is disabled. ADMIN_API_KEY must be configured on the host environment." },
        { status: 500 }
      );
    }
    
    if (!token || token !== adminKey) {
      return NextResponse.json({ error: "Unauthorized access path." }, { status: 401 });
    }

    const requestedDateStr =
      searchParams.get("date") ||
      new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Build Hawaii Standard Time boundaries
    const { start: startOfTarget, end: endOfTarget } = getHawaiiLimits(requestedDateStr);

    // Previous HST Day boundaries math
    const prevDate = new Date(startOfTarget.getTime() - 24 * 60 * 60 * 1000);
    const prevDateStr = prevDate.toISOString().split("T")[0];
    const { start: startOfPrev, end: endOfPrev } = getHawaiiLimits(prevDateStr);

    let targetEvents: any[] = [];
    let prevEvents: any[] = [];

    if (supabase) {
      const { data: targetData, error: targetError } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("occurred_at", startOfTarget.toISOString())
        .lte("occurred_at", endOfTarget.toISOString());

      if (targetError) {
        throw new Error(`Database target day query error: ${targetError.message}`);
      }

      const { data: prevData, error: prevError } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("occurred_at", startOfPrev.toISOString())
        .lte("occurred_at", endOfPrev.toISOString());

      if (prevError) {
        throw new Error(`Database previous day query error: ${prevError.message}`);
      }

      targetEvents = targetData || [];
      prevEvents = prevData || [];
    } else {
      const rawEvents = fallbackDB.getEvents();
      targetEvents = rawEvents.filter((e) => {
        const d = new Date(e.occurredAt);
        return d >= startOfTarget && d <= endOfTarget;
      });
      prevEvents = rawEvents.filter((e) => {
        const d = new Date(e.occurredAt);
        return d >= startOfPrev && d <= endOfPrev;
      });
    }

    // Accumulate aggregate metrics mapping using uniquely identified sessions for conversion ratios
    const aggregateMetrics = (eventsList: any[]) => {
      const pageViews = eventsList.filter(
        (e) => e.eventName === "page_view" || e.event_name === "page_view"
      ).length;
      
      const uniqueSessions = new Set(
        eventsList.map((e) => e.sessionId || e.session_id)
      ).size;
      
      const trackStarts = eventsList.filter(
        (e) => e.eventName === "music_track_started" || e.event_name === "music_track_started"
      );
      
      const trackCompletes = eventsList.filter(
        (e) => e.eventName === "music_completed" || e.event_name === "music_completed"
      );
      
      const cartAddsEvents = eventsList.filter(
        (e) => e.eventName === "cart_item_added" || e.event_name === "cart_item_added"
      );
      
      const checkoutStartsEvents = eventsList.filter(
        (e) => e.eventName === "checkout_started" || e.event_name === "checkout_started"
      );
      
      const purchasesEvents = eventsList.filter(
        (e) => e.eventName === "purchase_completed" || e.event_name === "purchase_completed"
      );

      // Unique Session Sets
      const sessionsWithCart = new Set(cartAddsEvents.map((e) => e.sessionId || e.session_id));
      const sessionsWithCheckout = new Set(checkoutStartsEvents.map((e) => e.sessionId || e.session_id));
      const sessionsWithPurchase = new Set(purchasesEvents.map((e) => e.sessionId || e.session_id));

      const cartSessions = sessionsWithCart.size;
      const checkoutSessions = sessionsWithCheckout.size;
      const purchaseSessions = sessionsWithPurchase.size;

      const grossRevenue = purchasesEvents.reduce(
        (sum, p) => sum + (p.valueCents || p.value_cents || 0) / 100,
        0
      );

      // Top Pages
      const pagesMap: Record<string, number> = {};
      eventsList
        .filter((e) => e.eventName === "page_view" || e.event_name === "page_view")
        .forEach((e) => {
          const path = e.pagePath || e.page_path || "/";
          pagesMap[path] = (pagesMap[path] || 0) + 1;
        });
      const topPages = Object.entries(pagesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));

      // Track music aggregation
      const musicStats: Record<string, { starts: number; completes: number }> = {};
      trackStarts.forEach((e) => {
        const tId = e.trackId || e.track_id || "Unknown";
        if (!musicStats[tId]) musicStats[tId] = { starts: 0, completes: 0 };
        musicStats[tId].starts++;
      });
      trackCompletes.forEach((e) => {
        const tId = e.trackId || e.track_id || "Unknown";
        if (!musicStats[tId]) musicStats[tId] = { starts: 0, completes: 0 };
        musicStats[tId].completes++;
      });

      // Accurate conversion rates using unique session Set Intersections.
      // Cart-To-Checkout Conversion Rate (CTCR): Sessions that added to cart AND moved to checkout, divided by total cart sessions.
      // Set Intersection: Session IDs present in both checkout and cart
      const cartAndCheckoutIntersect = new Set(
        [...sessionsWithCheckout].filter((id) => sessionsWithCart.has(id))
      ).size;
      
      const cartToCheckoutConversionRate =
        cartSessions > 0
          ? Math.max(0, Math.min(100, (cartAndCheckoutIntersect / cartSessions) * 100))
          : 0.0;

      // Checkout Abandonment Rate (CAR): Sessions that started checkout but did NOT purchase, divided by total checkout sessions.
      // Set Intersection: Session IDs present in both checkout and purchase
      const checkoutAndPurchaseIntersect = new Set(
        [...sessionsWithPurchase].filter((id) => sessionsWithCheckout.has(id))
      ).size;

      const checkoutAbandonmentRate =
        checkoutSessions > 0
          ? Math.max(0, Math.min(100, ((checkoutSessions - checkoutAndPurchaseIntersect) / checkoutSessions) * 100))
          : 0.0;

      return {
        uniqueSessions,
        pageViews,
        topPages,
        trackStarts: trackStarts.length,
        trackCompletes: trackCompletes.length,
        cartSessions,
        checkoutSessions,
        purchaseSessions,
        grossRevenue,
        musicStats,
        checkoutAbandonmentRate,
        cartToCheckoutConversionRate,
      };
    };

    const targetAgg = aggregateMetrics(targetEvents);
    const prevAgg = aggregateMetrics(prevEvents);

    const conversionRate =
      targetAgg.uniqueSessions > 0
        ? (targetAgg.purchaseSessions / targetAgg.uniqueSessions) * 100
        : 0.0;
    const prevConversionRate =
      prevAgg.uniqueSessions > 0
        ? (prevAgg.purchaseSessions / prevAgg.uniqueSessions) * 100
        : 0.0;

    return NextResponse.json({
      date: requestedDateStr,
      timeZone: "Hawaii Standard Time (Pacific/Honolulu, UTC-10)",
      targetDayReport: {
        uniqueSessions: targetAgg.uniqueSessions,
        pageViews: targetAgg.pageViews,
        topPages: targetAgg.topPages,
        trackStarts: targetAgg.trackStarts,
        trackCompletes: targetAgg.trackCompletes,
        grossRevenue: targetAgg.grossRevenue,
        musicStats: targetAgg.musicStats,
        conversionRate: `${conversionRate.toFixed(2)}%`,
        checkoutAbandonmentRate: `${targetAgg.checkoutAbandonmentRate.toFixed(2)}%`,
        cartToCheckoutConversionRate: `${targetAgg.cartToCheckoutConversionRate.toFixed(2)}%`,
      },
      comparisonWithPreviousDay: {
        sessionsChange: targetAgg.uniqueSessions - prevAgg.uniqueSessions,
        pageViewsChange: targetAgg.pageViews - prevAgg.pageViews,
        revenueChange: targetAgg.grossRevenue - prevAgg.grossRevenue,
        purchasesChange: targetAgg.purchaseSessions - prevAgg.purchaseSessions,
        prevConversionRate: `${prevConversionRate.toFixed(2)}%`,
      },
      meta: {
        revenueAttributionModel: "Client-Attributed & Stripe-Verified API",
        attributionStatus: "provisional",
        warning:
          "All purchase events tracked here represent client-side success page triggers and are marked as provisional. For absolute reporting coverage including off-site abandonment, please connect a Stripe invoice/payment Webhook.",
      },
    });
  } catch (error: any) {
    console.error("Aggregation endpoint failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during aggregation query" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
