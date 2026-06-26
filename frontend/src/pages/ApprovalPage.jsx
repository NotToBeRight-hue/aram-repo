import { useState } from 'react'
import { postApproval } from '../services/api'

function ApprovalPage() {
  const [result, setResult] = useState(null)
  const [statusText, setStatusText] = useState('Review the recommendation and finalize allocation.')

  const handleDecision = async (decision) => {
    const response = await postApproval(decision)
    setResult(response)
    setStatusText(response.status === 'Approved' ? 'Allocation completed successfully.' : 'Allocation rejected. No transfer was generated.')
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Approval Workflow</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Approve or reject the AI redistribution recommendation for execution.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Finalize Allocation</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Confirm whether the recommendation should be executed.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleDecision('Reject')} className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Reject
            </button>
            <button onClick={() => handleDecision('Approve')} className="rounded-2xl bg-aramBlue-500 px-5 py-3 text-white hover:bg-aramBlue-700 dark:bg-aramBlue-600 dark:hover:bg-aramBlue-700">
              Approve
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-slate-700 dark:bg-slate-900 dark:text-slate-100">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Status</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{statusText}</p>
        </div>

        {result && result.allocationGenerated && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-200">
            <p className="text-sm font-semibold">Success</p>
            <p className="mt-2 text-base">Allocation processed. The recommendation has been approved and the transfer workflow is complete.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApprovalPage
