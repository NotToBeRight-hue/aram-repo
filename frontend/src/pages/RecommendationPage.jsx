import { useEffect, useState } from 'react'
import { getRecommendation } from '../services/api'

function RecommendationPage() {
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    async function loadRecommendation() {
      const result = await getRecommendation()
      setRecommendation(result.recommendation)
    }
    loadRecommendation()
  }, [])

  if (!recommendation) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">Loading recommendation...</div>
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">AI Recommendation Engine</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate redistribution recommendations based on forecasted risk and availability.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommendation</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">The AI agent suggests an optimized transfer plan to reduce shortages.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Confidence</p>
            <p className="mt-2 text-4xl font-semibold text-aramBlue-700 dark:text-aramBlue-300">{recommendation.confidence}%</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Source Shop', value: recommendation.sourceShop },
            { label: 'Target Shop', value: recommendation.targetShop },
            { label: 'Transfer Amount', value: recommendation.transferAmount },
            { label: 'Recommendation ID', value: recommendation.recommendationId },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              <p className="text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Reason</p>
          <p className="mt-3 text-base leading-7 text-slate-900 dark:text-slate-100">{recommendation.reason}</p>
        </div>
      </div>
    </div>
  )
}

export default RecommendationPage
