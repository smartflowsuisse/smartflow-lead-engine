"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Search, XCircle } from "lucide-react";
import type { DiscoveryResult } from "@/lib/discovery/types";
import { DiscoveryResults } from "./DiscoveryResults";

const DEFAULT_LIMIT = 10;

export function DiscoveryForm() {
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [limit, setLimit] = useState(String(DEFAULT_LIMIT));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/discovery/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          city,
          limit: Number(limit),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Discovery search failed");
      }

      setResult(data as DiscoveryResult);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="industry"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Gastro, IT, Immobilien"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Zürich, Basel, Genève"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label
              htmlFor="limit"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Limit
            </label>
            <input
              id="limit"
              name="limit"
              type="number"
              min={1}
              max={50}
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Run Discovery
          </button>
          <p className="text-xs text-slate-500">
            Mock data only — no external APIs
          </p>
        </div>
      </form>

      {notification && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          {notification.message}
        </div>
      )}

      {result && (
        <DiscoveryResults result={result} onNotification={handleNotification} />
      )}
    </div>
  );
}
