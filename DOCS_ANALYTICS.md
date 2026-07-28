# 🌿 SentientEthos SaaS Analytics Engine Deployment Guide

Comprehensive system metrics aggregator incorporating Client Session attribution (0% client-trust model), protected reporting routes, and direct Codex daily automated delivery.

---

## 🔑 Crucial Environment Configuration Checklist
Configure all of the following four secret variables inside your hosting platform (Vercel, Supabase, and Stripe dashboard settings):

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - *Description*: The public endpoint interface for your hosted backend database instance.
2. **`SUPABASE_SERVICE_ROLE_KEY`**
   - *Description*: High-privilege database authentication token bypass key permitting fast internal insert/query pipelines. **Keep strictly secret and server-side only.**
3. **`ADMIN_API_KEY`**
   - *Description*: Custom secret key string authorizing communication between internal ingestion metrics routes, administrative dashboard panels, and the daily Codex automaton.
4. **`STRIPE_SECRET_KEY`**
   - *Description*: Official Stripe Dashboard authorization secret API token loaded to securely fetch transaction purchase values on events without relying on client parameters.

---

## 🤖 Codex Daily Report Automation setup
To fetch the daily report, configure a recurring Codex daily automation to trigger at **11:00 AM Hawaii Standard Time (HST)** with the previous Hawaii calendar day:

*   **HTTP Request Method**: `GET`
*   **Target URL**: `https://your-production-domain.com/api/analytics/daily-report?date={{ hawaii_yesterday_date }}`
*   **HTTP Request Headers**:
    ```http
    Authorization: <ADMIN_API_KEY>
    ```

> ⚠️ **Security Warning**: The `ADMIN_API_KEY` must always be read from a protected local environment file, dashboard setting, or key vault. It must **never** appear hardcoded inside the automation prompt, logs, HTTP raw outputs, or public URL query strings to ensure optimal system hardening.

---

## 🛠 File Dependency Tree
```
├── tests/
│   ├── analytics-hardening.test.ts       - Fully mocked backend test suites asserting core ingestion & math
│   └── analytics-running-context.ts      - Execution script wrapper importing TSX
├── src/app/
│   ├── lib/
│   │   ├── db.ts                         - Environment verification and conditional build stubbing
│   │   └── analytics.ts                  - Common metrics formats structures
│   ├── api/
│   │   └── analytics/
│   │       ├── event/
│   │       │   └── route.ts              - Event ingest tracking (Stripped of production Stripe bypasses)
│   │       └── daily-report/
│   │           └── route.ts              - Metric and ratio aggregator (Protected by ADMIN_API_KEY)
```

---

## ⚡️ Manual Test Execution Verifications
Run the following script to audit, calculate, and test all requirements prior to compiling:
```bash
npm run test:analytics
```
*Note: Any validation failure automatically returns exit code 1 to prevent pipeline leaks.*
