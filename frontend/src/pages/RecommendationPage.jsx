import { useEffect, useState } from 'react'
import { ArrowRight, BrainCircuit, CheckCircle2, ShieldCheck, Sparkles, Store, XCircle } from 'lucide-react'
import { getRecommendation } from '../services/api'

function RecommendationPage() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRecommendation = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getRecommendation()
      if (result?.recommendation) {
        setRecommendation(result.recommendation)
      } else {
        setRecommendation(null)
        setError('Recommendation data is unavailable.')
      }
    } catch {
      setRecommendation(null)
      setError('Unable to fetch recommendation. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendation()
  }, [])

  const actionDisabled = loading || !recommendation

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.3em] text-aramBlue-400">
                <BrainCircuit className="h-4 w-4" />
                  AI Recommendation
              </div>

                  <h1 className="mt-4 text-3xl font-bold text-white">
                  AI Allocation Decision
                  </h1>

                  <p className="mt-3 max-w-2xl text-slate-400 leading-7">
                  Generated using current inventory, demand forecasting and consumption
                  trends to recommend the safest and most efficient resource allocation
                  across district shops.
                  </p>
                  </div>

          <button
            type="button"
            onClick={loadRecommendation}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-aramBlue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-aramBlue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            Run Analytics
          </button>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-300 shadow-sm">
          Loading recommendation...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-8 text-rose-100 shadow-sm">
          <p className="text-base font-semibold">Unable to load recommendation</p>
          <p className="mt-2 text-sm text-rose-200">{error}</p>
        </div>
      ) : (
        <>
          <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current recommendation</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <div className="rounded-3xl bg-slate-900 p-5 shadow-sm shadow-slate-950/40">
                    <div className="inline-flex items-center gap-2 text-slate-400">
                      <Store className="h-5 w-5 text-aramBlue-400" />
                      <span className="text-xs uppercase tracking-[0.3em]">Source</span>
                    </div>
                    <p className="mt-4 text-xl font-semibold text-white">{recommendation.sourceShop}</p>
                  </div>

                  <div className="rounded-3xl bg-slate-900 p-5 shadow-sm shadow-slate-950/40">
                    <div className="inline-flex items-center gap-2 text-slate-400">
                      <Store className="h-5 w-5 text-emerald-400" />
                      <span className="text-xs uppercase tracking-[0.3em]">Target</span>
                    </div>
                    <p className="mt-4 text-xl font-semibold text-white">{recommendation.targetShop}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-sm shadow-slate-950/40">
                <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheck className="h-5 w-5 text-aramBlue-400" />
                  <span className="text-xs uppercase tracking-[0.3em]">Transfer flow</span>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 text-center text-white sm:justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Store className="h-8 w-8 text-aramBlue-400" />
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Source</p>
                    <p className="font-semibold text-white">{recommendation.sourceShop}</p>
                  </div>

                  <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950 px-4 py-3 text-slate-300 shadow-sm shadow-slate-950/40">
                    <ArrowRight className="h-5 w-5 text-aramBlue-400" />
                    <span className="text-lg font-semibold text-white">{recommendation.transferAmount} KG</span>
                    <ArrowRight className="h-5 w-5 text-aramBlue-400" />
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <Store className="h-8 w-8 text-emerald-400" />
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Target</p>
                    <p className="font-semibold text-white">{recommendation.targetShop}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-white">
                <Sparkles className="h-5 w-5 text-aramBlue-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI Insight</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">AI Insight</h2>
                </div>
              </div>
              <p className="mt-5 text-slate-300">{recommendation.reason}</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Action center</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Review & decide</h2>
                </div>
                <div className="rounded-3xl bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">Recommendation ID {recommendation.recommendationId}</div>
              </div>

              <div className="mt-6 grid gap-4">
                <button
                  type="button"
                  onClick={() => {} }
                  disabled={actionDisabled}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Allocation
                </button>
                <button
                  type="button"
                  onClick={() => {} }
                  disabled={actionDisabled}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Recommendation
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-aramBlue-400" />
                  Generated by ARAM AI Engine
                </div>
                <ul className="mt-4 space-y-2 text-slate-500">
                  <li>Current Inventory</li>
                  <li>Demand Forecast</li>
                  <li>Consumption Trend</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Source',
                value: recommendation.sourceShop,
                icon: Store,
              },
              {
                title: 'Target',
                value: recommendation.targetShop,
                icon: Store,
              },
              {
                title: 'Transfer',
                value: `${recommendation.transferAmount} KG`,
                icon: ArrowRight,
              },
              {
                title: 'Confidence',
                value: `${recommendation.confidence}%`,
                icon: Sparkles,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 text-slate-400">
                    <Icon className="h-5 w-5 text-aramBlue-400" />
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.title}</p>
                  </div>
                  <p className="mt-5 text-xl font-semibold text-white">{item.value}</p>
                </div>
              )
            })}
          </section>

          <footer className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm text-slate-400">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">Generated by ARAM AI Engine</p>
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                <Sparkles className="h-4 w-4 text-aramBlue-400" />
                Intelligence summary
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-slate-500">
              <span>Current Inventory</span>
              <span>Demand Forecast</span>
              <span>Consumption Trend</span>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

export default RecommendationPage
