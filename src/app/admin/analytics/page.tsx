"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

interface DashboardReport {
  date: string;
  timeZone: string;
  targetDayReport: {
    uniqueSessions: number;
    pageViews: number;
    topPages: Array<{ path: string; count: number }>;
    trackStarts: number;
    trackCompletes: number;
    grossRevenue: number;
    musicStats: Record<string, { starts: number; completes: number }>;
    conversionRate: string;
    checkoutAbandonmentRate: string;
    cartToCheckoutConversionRate: string;
  };
  comparisonWithPreviousDay: {
    sessionsChange: number;
    pageViewsChange: number;
    revenueChange: number;
    purchasesChange: number;
    prevConversionRate: string;
  };
  meta: {
    revenueAttributionModel: string;
    attributionStatus: string;
    warning: string;
  };
}

export default function AdminAnalyticsDashboard() {
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cachedToken = localStorage.getItem("ijj_admin_key_v2");
    if (cachedToken) {
      setAdminToken(cachedToken);
      fetchReportData(cachedToken);
    }
  }, []);

  const fetchReportData = async (tokenValue: string) => {
    setIsLoading(true);
    setErrorInput("");
    try {
      // [P1 FIX] We completely omit client UTC date construction to avoid requesting the wrong Hawaii date.
      // The daily-report endpoint intelligently defaults to the server's correct Hawaii-Standard-Time date offsets.
      const response = await fetch(`/api/analytics/daily-report`, {
        headers: {
          Authorization: tokenValue,
        },
      });

      if (!response.ok) {
        throw new Error("Access token verification failed");
      }

      const data = await response.json();
      setReport(data);
      setIsAdmin(true);
      localStorage.setItem("ijj_admin_key_v2", tokenValue);
    } catch (err: any) {
      setErrorInput(err.message || "Failed to load dashboard statistics.");
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReportData(adminToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("ijj_admin_key_v2");
    setAdminToken("");
    setReport(null);
    setIsAdmin(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <form onSubmit={handleLoginSubmit} className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
            <div>
              <h1 className="text-2xl font-black text-white">Admin Credentials Required</h1>
              <p className="text-gray-400 text-xs mt-1">Provide your server-side ADMIN_API_KEY to proceed.</p>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 mb-2">Admin Security Key</label>
              <input
                type="password"
                required
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {errorInput && (
              <p className="text-xs text-red-400 bg-red-500/15 border border-red-500/20 p-3 rounded-lg leading-snug">
                {errorInput}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-black font-extrabold uppercase tracking-wider rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "Verifying..." : "Enter Dashboard"}
            </button>
          </form>
        </main>
      </div>
    );
  }

  if (!report) return null;

  const target = report.targetDayReport;
  const comparison = report.comparisonWithPreviousDay;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-7xl text-left">
        {/* Header Options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-500">
              Personal Analytics Engine
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Timezone: {report.timeZone}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchReportData(adminToken)}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-sm font-bold text-teal-400 transition-all"
            >
              🔄 Refresh Live Data
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all"
            >
              🔐 Log Out
            </button>
          </div>
        </div>

        {/* Aggregate KPI Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-left">
          {/* Sess CARD */}
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Unique Sessions</span>
            <h3 className="text-4xl font-black mt-2 text-white">{target.uniqueSessions}</h3>
            <span className={`text-xs block mt-2 font-semibold ${comparison.sessionsChange >= 0 ? "text-teal-400" : "text-red-400"}`}>
              {comparison.sessionsChange >= 0 ? `+${comparison.sessionsChange}` : comparison.sessionsChange} vs yesterday
            </span>
          </div>

          {/* Views CARD */}
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Page Views</span>
            <h3 className="text-4xl font-black mt-2 text-white">{target.pageViews}</h3>
            <span className={`text-xs block mt-2 font-semibold ${comparison.pageViewsChange >= 0 ? "text-teal-400" : "text-red-400"}`}>
              {comparison.pageViewsChange >= 0 ? `+${comparison.pageViewsChange}` : comparison.pageViewsChange} vs yesterday
            </span>
          </div>

          {/* Music CARD */}
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Stream Starts</span>
            <h3 className="text-4xl font-black mt-2 text-indigo-400">{target.trackStarts}</h3>
            <span className="text-xs text-gray-400 block mt-2">
              {target.trackCompletes} tracks finished completely
            </span>
          </div>

          {/* Revenue CARD */}
          <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Gross Sales</span>
            <h3 className="text-4xl font-black mt-2 text-emerald-400">${target.grossRevenue.toFixed(2)}</h3>
            <span className={`text-xs block mt-2 font-semibold ${comparison.revenueChange >= 0 ? "text-teal-400" : "text-red-400"}`}>
              {comparison.revenueChange >= 0 ? `+$${comparison.revenueChange.toFixed(2)}` : `-$${Math.abs(comparison.revenueChange).toFixed(2)}`} vs yesterday
            </span>
          </div>
        </div>

        {/* Double Column funnel metrics block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Conversion Funnels column */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 lg:col-span-6">
            <h3 className="text-xl font-bold mb-6 text-white text-left">Conversion Funnels</h3>

            <div className="space-y-4 text-left">
              {/* Target 1: Session */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 font-medium">1. Unique Sessions</span>
                  <span className="font-bold">{target.uniqueSessions}</span>
                </div>
                <div className="w-full h-3 bg-zinc-850 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: "100%" }}></div>
                </div>
              </div>

              {/* Target 4: Completed checkout */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 font-medium">2. Client-Attributed Conversion Rate</span>
                  <span className="font-bold">{target.conversionRate}</span>
                </div>
                <div className="w-full h-3 bg-zinc-850 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: target.conversionRate }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 text-left">
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Cart-to-Checkout Conv.</span>
                <span className="block text-2xl font-black mt-1 text-teal-400">{target.cartToCheckoutConversionRate}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Checkout Abandonment</span>
                <span className="block text-2xl font-black mt-1 text-red-400">{target.checkoutAbandonmentRate}</span>
              </div>
            </div>
          </div>

          {/* Music Performance stats column */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 lg:col-span-6">
            <h3 className="text-xl font-bold mb-6 text-white text-left">Song Performance (Starts)</h3>
            {Object.keys(target.musicStats).length === 0 ? (
              <p className="text-sm text-gray-500 italic py-12 text-center">No audio interactions recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(target.musicStats)
                  .sort((a,b) => b[1].starts - a[1].starts)
                  .map(([trackId, stats]) => (
                    <div key={trackId} className="flex justify-between items-center p-3.5 bg-zinc-950/40 border border-white/5 rounded-2xl text-left">
                      <div>
                        <h4 className="font-bold text-sm text-white">{trackId}</h4>
                        <span className="text-xs text-indigo-400">{stats.completes} complete streams</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black block">{stats.starts} starts</span>
                        <span className="text-[10px] text-gray-500">
                          {stats.starts > 0 ? ((stats.completes / stats.starts) * 100).toFixed(0) : 0}% retention rate
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Attribution status alert box */}
        <div className="mt-8 p-6 bg-zinc-900/30 border border-amber-500/10 rounded-2xl">
          <h4 className="text-sm font-bold text-amber-500 flex items-center gap-2">
            ⚠️ Status: {report.meta.attributionStatus.toUpperCase()} ATTRIBUTION
          </h4>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            {report.meta.warning}
          </p>
        </div>
      </main>
    </div>
  );
}
