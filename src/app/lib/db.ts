import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const isProduction = process.env.NODE_ENV === "production";

// Safe, deterministic detection of build static compilation phases (Not serverless runtime phases)
// Next.js sets NEXT_PHASE globally inside static compilation workers
const isNextBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_PHASE === "phase-export";

// True state flag determining if a valid persist connection can be verified at runtime
export const isDatabaseConfigured = !!(supabaseUrl && supabaseServiceKey);

const createProductionClient = () => {
  if (isProduction) {
    if (!isDatabaseConfigured) {
      if (isNextBuildPhase) {
        console.warn("Compilation Warning: Production Supabase keys are missing during build-time. Activating compilation stub.");
        return null;
      }
      throw new Error(
        "CRITICAL: Production analytics database configuration is missing on serverless runtime. " +
        "Ensure both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
      );
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  
  // Non-production modes can utilize a service role client or fall back safely to transient fallbacks
  if (isDatabaseConfigured) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return null;
};

export const supabase = createProductionClient();

// In-Memory fallback database - STRICTLY RESERVED for development/testing environments
class InMemoryFallbackDB {
  private static instance: InMemoryFallbackDB;
  private events: any[] = [];

  private constructor() {}

  public static getInstance(): InMemoryFallbackDB {
    if (!InMemoryFallbackDB.instance) {
      InMemoryFallbackDB.instance = new InMemoryFallbackDB();
    }
    return InMemoryFallbackDB.instance;
  }

  public insertEvent(event: any) {
    if (isProduction) {
      console.warn("Production anomaly: attempt to write to fallback memory was intercepted and blocked.");
      return;
    }
    if (this.events.length >= 50000) {
      this.events.shift();
    }
    this.events.push(event);
  }

  public getEvents() {
    if (isProduction) return [];
    return this.events;
  }

  public clearEvents() {
    this.events = [];
  }
}

export const fallbackDB = InMemoryFallbackDB.getInstance();
