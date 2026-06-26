import { useEffect, useState } from 'react'
import { getAnalytics } from '../services/api'

function badgeClass(level) {
  switch (level) {
    case 'Safe':
      return 'bg-emerald-100 text-emerald-700'
    case 'Moderate':
      return 'bg-amber-100 text-amber-700'
    case 'High':
      return 'bg-orange-100 text-orange-700'
    case 'Critical':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({ shops: [], summary: {} })

  useEffect(() => {
    async function loadAnalytics() {
      const result = await getAnalytics()

      alert(JSON.stringify(result))

      setAnalytics(result)
    }
    loadAnalytics()
  }, [])

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics Insights</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Review forecast demand, risk levels, and priority score for every shop.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Shops</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{analytics.summary?.totalShops || 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Inventory</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{analytics.summary?.totalInventory || 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Critical Alerts</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{analytics.summary?.criticalAlerts || 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Predicted Shortages</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{analytics.summary?.predictedShortages || 0}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Shop Forecasts</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">AI analytics powered</span>
        </div>
        <div className="mt-6 space-y-4">
          {analytics.shops.map((shop) => (
            <div key={shop.ShopID} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{shop.ShopName}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Forecast demand: {shop.ForecastDemand}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass(shop.RiskLevel)}`}>{shop.RiskLevel}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">Priority {shop.PriorityScore}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                  <p className="text-slate-500 dark:text-slate-400">Current Stock</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{shop.CurrentStock}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                  <p className="text-slate-500 dark:text-slate-400">Surplus / Deficit</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{shop.SurplusOrDeficit}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                  <p className="text-slate-500 dark:text-slate-400">Forecast Demand</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{shop.ForecastDemand}</p>
                </div>
              </div>
            </div>
          ))}
          {analytics.shops.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No analytics data available yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
