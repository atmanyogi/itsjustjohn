import { fallbackDB } from "../src/app/lib/db";
import { POST as handleEventPost, stripeInstanceTrackerPlaceholder } from "../src/app/api/analytics/event/route";
import { GET as handleReportGet } from "../src/app/api/analytics/daily-report/route";
import { NextRequest } from "next/server";

export async function runHardenedTests() {
  console.log("=== STARTING ARCHITECTURAL ANALYTICS HARDENING TEST SUITE ===");
  
  let passed = true;
  const assert = (condition: boolean, message: string) => {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      passed = false;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  };

  try {
    const originalEnv = { ...process.env };

    // Set standard sandbox baseline
    process.env.ADMIN_API_KEY = "test_env_secret_key_987";

    // -------------------------------------------------------------
    // Test 1: Ingest large payloads limits Check
    // -------------------------------------------------------------
    const giantPayload = JSON.stringify({
      eventName: "page_view",
      sessionId: "s".repeat(15000),
    });
    const sizeReq = new NextRequest("http://localhost:3000/api/analytics/event", {
      method: "POST",
      body: giantPayload,
    });
    const sizeRes = await handleEventPost(sizeReq);
    assert(
      sizeRes.status === 413,
      "Ingestion API blocks payloads greater than 10KB safely with 413"
    );

    // -------------------------------------------------------------
    // Test 2: Ingest daily report checks that admin keys fail closed
    // -------------------------------------------------------------
    delete process.env.ADMIN_API_KEY;
    const reportBlockedReq = new NextRequest("http://localhost:3000/api/analytics/daily-report");
    const reportBlockedRes = await handleReportGet(reportBlockedReq);
    assert(
      reportBlockedRes.status === 500,
      "Daily-report fails closed with 500 status when server environment lacks ADMIN_API_KEY"
    );
    process.env.ADMIN_API_KEY = "test_env_secret_key_987";

    // -------------------------------------------------------------
    // Test 3: Mock Stripe Retrieve prototype spy (Stripe Client Sandbox Mocking)
    // -------------------------------------------------------------
    let stripeRetrievedSpy = false;
    let stripePassedStatus = "failed";
    
    // Inject mock into Stripe instance prototype retrieved during event POST executions
    const mockStripeClientInstance = stripeInstanceTrackerPlaceholder();
    mockStripeClientInstance.paymentIntents.retrieve = async (id: string) => {
      stripeRetrievedSpy = true;
      return {
        id,
        status: stripePassedStatus,
        amount: 2500,
        currency: "usd",
      } as any;
    };

    // Attempt purchase event tracking (Injecting Stripe verification failure check)
    const ingestPurchasePayload = JSON.stringify({
      eventName: "purchase_completed",
      sessionId: "sess_purchase_test",
      pagePath: "/",
      orderId: "pi_prod_mock_real_retrieval",
    });

    const verifyStripeFailReq = new NextRequest("http://localhost:3000/api/analytics/event", {
      method: "POST",
      body: ingestPurchasePayload,
    });
    const verifyStripeFailRes = await handleEventPost(verifyStripeFailReq);
    assert(
      stripeRetrievedSpy && verifyStripeFailRes.status === 400,
      "Post-Route enforces zero-compromise Stripe verification logic when transaction retrieval status is not succeeded"
    );

    // Verify raw "pi_test" fails normally (No production-code bypass allowed)
    stripeRetrievedSpy = false; // Reset
    const verifyRawPiTestReq = new NextRequest("http://localhost:3000/api/analytics/event", {
      method: "POST",
      body: JSON.stringify({
        eventName: "purchase_completed",
        sessionId: "sess_purchase_test",
        pagePath: "/",
        orderId: "pi_test",
      }),
    });
    const verifyRawPiTestRes = await handleEventPost(verifyRawPiTestReq);
    assert(
      stripeRetrievedSpy && verifyRawPiTestRes.status === 400,
      "Production code is completely bare of environment 'pi_test' bypass shortcuts"
    );

    // Make mock Stripe succeed to populate db rows correctly
    stripePassedStatus = "succeeded";

    // -------------------------------------------------------------
    // Test 4: Populate analytical mock logs asserting CTCR / CAR mathematical precision
    // -------------------------------------------------------------
    fallbackDB.clearEvents();
    const testOcurredAt = "2026-07-09T14:30:00.000Z";

    // SESS 1: Adds to Cart AND Starts Checkout but abandons (No purchase event)
    fallbackDB.insertEvent({ eventName: "cart_item_added", sessionId: "sess_1", pagePath: "/", occurredAt: testOcurredAt });
    fallbackDB.insertEvent({ eventName: "checkout_started", sessionId: "sess_1", pagePath: "/", occurredAt: testOcurredAt });

    // SESS 3: Adds to Cart AND Starts Checkout AND Purchases (Succeeded conversion)
    fallbackDB.insertEvent({ eventName: "cart_item_added", sessionId: "sess_3", pagePath: "/", occurredAt: testOcurredAt });
    fallbackDB.insertEvent({ eventName: "checkout_started", sessionId: "sess_3", pagePath: "/", occurredAt: testOcurredAt });
    // Ingest purchase completed through API POST router ensuring Stripe checks evaluate 100% correctly
    const mockSuccessIngestReq = new NextRequest("http://localhost:3000/api/analytics/event", {
      method: "POST",
      body: JSON.stringify({
        eventName: "purchase_completed",
        sessionId: "sess_3",
        pagePath: "/",
        orderId: "pi_success_secured_mock",
      }),
    });
    // Ingest now succeeds with mock Stripe
    const mockSuccessIngestRes = await handleEventPost(mockSuccessIngestReq);
    assert(mockSuccessIngestRes.status === 200, "Event post ingestion with successful verified Stripe mock succeeds with 200");

    // Manually force occurred_at timestamp inside in-memory store so daily-report matches Hawaiian limits bounds
    const rawEvents = fallbackDB.getEvents();
    const mockCompletedRow = rawEvents.find(e => e.eventName === "purchase_completed" && e.sessionId === "sess_3");
    if (mockCompletedRow) {
      mockCompletedRow.occurredAt = testOcurredAt;
    }

    // -------------------------------------------------------------
    // Test 5: Verify CTCR & CAR mathematical ratios via protected reporting route
    // -------------------------------------------------------------
    const checkReportReq = new NextRequest("http://localhost:3000/api/analytics/daily-report?date=2026-07-09", {
      headers: { Authorization: process.env.ADMIN_API_KEY },
    });
    const checkReportRes = await handleReportGet(checkReportReq);
    assert(checkReportRes.status === 200, "Daily-report endpoints executes and returns stats cleanly");
    
    const reportData = await checkReportRes.json();
    const stats = reportData.targetDayReport;
    
    assert(stats.cartToCheckoutConversionRate === "100.00%", "CTCR math resolves correctly to 100.00%");
    assert(stats.checkoutAbandonmentRate === "50.00%", "CAR math resolves correctly to 50.00%");

    // Restore environmental base state configurations
    process.env = { ...originalEnv };

    if (passed) {
      console.log("\n🥇 ALL HARDENED PERSISTENT ARCHITECTURE TESTS PASSED SUCCESSFULLY!");
    } else {
      console.error("\n💔 SOME INTEGRITY VERIFICATIONS FAILED.");
    }
    return passed;
  } catch (err: any) {
    console.error("Test framework caught run exception during execution:", err);
    return false;
  }
}

if (require.main === module) {
  runHardenedTests().then((passed) => {
    process.exit(passed ? 0 : 1);
  });
}
