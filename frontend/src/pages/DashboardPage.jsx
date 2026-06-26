import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  getDashboardSummary,
  getInventory,
  getSystemStatus,
  getRecommendation,
  postGrievance,
} from '../services/api'

const summaryFallback = {
  totalShops: 12,
  availableRiceStock: 8450,
  highRiskShops: 2,
  pendingApprovals: 1,
}

const grievanceOptions = [
  'Inventory Mismatch',
  'Incorrect Shop Data',
  'Analytics Error',
  'System Error',
  'Other',
]

const statusLabels = [
  { label: 'Backend Online', key: 'backend' },
  { label: 'Database Connected', key: 'database' },
  { label: 'CSV Export Ready', key: 'exportReady' },
  { label: 'Analytics Engine Ready', key: 'analytics' },
  { label: 'AI Recommendation Pending', key: 'ai' },
]

function getStockStatus(stock, demand) {
  if (stock > demand) {
    return { label: 'Normal', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' }
  }
  if (stock >= demand * 0.95) {
    return { label: 'Low', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200' }
  }
  return { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' }
}

function getPriority(stock, demand) {
  if (stock < demand) {
    return { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' }
  }
  if (stock <= demand * 1.1) {
    return { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200' }
  }
  return { label: 'Low', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' }
}

function computeInventoryStats(items) {
  if (!items.length) {
    return { averageStock: 0, lowestStockShop: 'n/a', highestDemandShop: 'n/a' }
  }
  const totalStock = items.reduce((sum, item) => sum + (item.CurrentStock || 0), 0)
  const averageStock = Math.round(totalStock / items.length)
  const lowestStock = items.reduce((min, item) => (item.CurrentStock < min.CurrentStock ? item : min), items[0])
  const highestDemand = items.reduce((max, item) => (item.MonthlyDemand > max.MonthlyDemand ? item : max), items[0])
  return {
    averageStock,
    lowestStockShop: lowestStock.ShopName,
    highestDemandShop: highestDemand.ShopName,
  }
}

function DashboardPage({ username }) {
  const [summary, setSummary] = useState(summaryFallback)
  const [inventory, setInventory] = useState([])
  const [systemStatus, setSystemStatus] = useState({ backend: true, database: true, exportReady: true, analytics: false, ai: false })
  const [recommendation, setRecommendation] = useState(null)
  const [grievanceOpen, setGrievanceOpen] = useState(false)
  const [grievanceType, setGrievanceType] = useState(grievanceOptions[0])
  const [description, setDescription] = useState('')
  const [grievanceStatus, setGrievanceStatus] = useState('')
  const [loadingRecommendation, setLoadingRecommendation] = useState(false)
  const [submittingGrievance, setSubmittingGrievance] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const summaryResult = await getDashboardSummary()
        setSummary(summaryResult)
      } catch {
        setSummary(summaryFallback)
      }

      try {
        const inventoryResult = await getInventory()
        setInventory(inventoryResult.inventory || [])
      } catch {
        setInventory([])
      }

      try {
        const statusResult = await getSystemStatus()
        setSystemStatus(statusResult)
      } catch {
        setSystemStatus((prev) => ({ ...prev, analytics: false, ai: false }))
      }
    }

    loadDashboard()
  }, [])

  const handleRunRecommendation = async () => {
    setLoadingRecommendation(true)
    try {
      const recommendationResult = await getRecommendation()
      if (recommendationResult?.recommendation) {
        setRecommendation(recommendationResult.recommendation)
        setSystemStatus((prev) => ({ ...prev, analytics: true, ai: true }))
      }
    } catch {
      setRecommendation(null)
    } finally {
      setLoadingRecommendation(false)
    }
  }

  const handleGrievanceSubmit = async () => {
    if (!description.trim()) {
      setGrievanceStatus('Please add a brief description of the issue.')
      return
    }

    setSubmittingGrievance(true)
    try {
      await postGrievance({ type: grievanceType, description })
      setGrievanceStatus('Issue submitted successfully. A support ticket has been created.')
      setDescription('')
      setGrievanceType(grievanceOptions[0])
    } catch {
      setGrievanceStatus('Unable to submit the issue right now. Please try again later.')
    } finally {
      setSubmittingGrievance(false)
    }
  }

  const latestInventory = inventory.slice(0, 5)
  const updatedAt = useMemo(
    () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    [inventory]
  )
  const displayName = useMemo(() => {
    if (!username) return 'District'
    return username
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }, [username])
  const adminTitle = useMemo(() => `${displayName} Administrator`, [displayName])
  const inventoryStats = computeInventoryStats(inventory)

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aramBlue-700">Good Morning</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{adminTitle}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Last Updated: {updatedAt}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Predict. Prioritize. Redistribute.

          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total Shops</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">{summary.totalShops}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">District-wide resource nodes currently monitored.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Available Rice Stock</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">{summary.availableRiceStock} KG</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Total warehouse and shop rice inventory available for allocation.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">High Risk Shops</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">{summary.highRiskShops}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Shops with inventory below forecast demand and requiring attention.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pending Approvals</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">{summary.pendingApprovals}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Approval actions pending for redistribution plans and inventory adjustments.</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-aramBlue-700">Inventory Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Latest shop inventory</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Showing latest 5 shops</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Average Stock</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{inventoryStats.averageStock} KG</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Lowest Stock Shop</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{inventoryStats.lowestStockShop}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Highest Demand Shop</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{inventoryStats.highestDemandShop}</p>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 text-slate-900 dark:border-slate-700 dark:text-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Shop Name</th>
                  <th className="px-4 py-3 font-medium">Current Stock</th>
                  <th className="px-4 py-3 font-medium">Monthly Demand</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {latestInventory.length > 0 ? (
                  latestInventory.map((item) => {
                    const stockStatus = getStockStatus(item.CurrentStock, item.MonthlyDemand)
                    return (
                      <tr key={item.ShopID} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-4 py-4 text-slate-900 dark:text-slate-100">{item.ShopName}</td>
                        <td className="px-4 py-4">{item.CurrentStock} KG</td>
                        <td className="px-4 py-4">{item.MonthlyDemand} KG</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.color}`}>{stockStatus.label}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriority(item.CurrentStock, item.MonthlyDemand).color}`}>
                            {getPriority(item.CurrentStock, item.MonthlyDemand).label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No inventory data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-aramBlue-700">System Status</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Operational health</h3>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Updated automatically</span>
            </div>
            <div className="mt-6 space-y-3">
              {statusLabels.map((item) => {
                const statusValue = systemStatus[item.key]
                return (
                  <div key={item.key} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <span className={`h-3.5 w-3.5 rounded-full ${statusValue ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span className={statusValue ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>{item.label}</span>
                    </div>
                    <span className={statusValue ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}>{statusValue ? 'Active' : 'Pending'}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/recommendation')}
                disabled={loadingRecommendation}
                className="rounded-2xl bg-aramBlue-500 px-20 py-2 text-sm font-medium text-white transition hover:bg-aramBlue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-aramBlue-600 dark:hover:bg-aramBlue-700"
              >
                View AI Recommendation
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {recommendation ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">

  <p className="text-sm text-slate-500 dark:text-slate-400">
    {recommendation.reason || "AI-generated allocation recommendation."}
  </p>

  <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
    Transfer{" "}
    <span className="text-aramBlue-600">
      {recommendation.transferAmount} KG
    </span>{" "}
    of rice from{" "}
    <span className="font-bold">
      {recommendation.sourceShop}
    </span>{" "}
    to{" "}
    <span className="font-bold">
      {recommendation.targetShop}
    </span>.
  </p>

  <div className="mt-4 grid gap-3 sm:grid-cols-2">
    <div className="rounded-2xl bg-white p-4 text-sm dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Source</p>
      <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{recommendation.sourceShop}</p>
    </div>
    <div className="rounded-2xl bg-white p-4 text-sm dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Target</p>
      <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{recommendation.targetShop}</p>
    </div>
    <div className="rounded-2xl bg-white p-4 text-sm dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Transfer</p>
      <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{recommendation.transferAmount || '—'} KG</p>
    </div>
    <div className="rounded-2xl bg-white p-4 text-sm dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Priority</p>
      <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{recommendation.priority || 'HIGH'}</p>
    </div>
  </div>
</div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Analytics has not been executed.
                                                            </p>
                  <p className="mt-3 text-base leading-7">Run analytics to receive AI-powered allocation suggestions and priority actions for rice distribution.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-aramBlue-700">Grievance Portal</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Report an issue</h3>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Report inventory discrepancies, data issues, or system errors directly to support.</p>
            <button
              type="button"
              onClick={() => setGrievanceOpen(true)}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Create
            </button>
          </div>
        </div>
      </section>

      {grievanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Report an issue</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select the issue type and provide details for follow-up.</p>
              </div>
              <button
                type="button"
                onClick={() => setGrievanceOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Issue Type
                <select
                  value={grievanceType}
                  onChange={(e) => setGrievanceType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {grievanceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Describe the issue in a few sentences"
                />
              </label>

              {grievanceStatus && (
                <p className="text-sm text-slate-600 dark:text-slate-300">{grievanceStatus}</p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setGrievanceOpen(false)}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGrievanceSubmit}
                  disabled={submittingGrievance}
                  className="rounded-2xl bg-aramBlue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-aramBlue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-aramBlue-600 dark:hover:bg-aramBlue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
