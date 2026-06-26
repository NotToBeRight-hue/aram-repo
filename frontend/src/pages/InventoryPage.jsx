import { useEffect, useState } from 'react'
import { getInventory, addInventory } from '../services/api'

const initialForm = {
  shopName: '',
  district: '',
  currentStock: 0,
  monthlyDemand: 0,
  population: 0,
  lastMonthConsumption: 0,
}

function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    async function loadInventory() {
      const result = await getInventory()
      setInventory(result.inventory || [])
    }
    loadInventory()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await addInventory(form)
    const result = await getInventory()
    setInventory(result.inventory || [])
    setForm(initialForm)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Inventory Management</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Add and review shop-level inventory data for analytics.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-700 dark:bg-slate-950">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Add Inventory Record</h3>
          {[{
            label: 'Shop Name',
            field: 'shopName',
          }, {
            label: 'District',
            field: 'district',
          }, {
            label: 'Current Stock',
            field: 'currentStock',
            type: 'number',
          }, {
            label: 'Monthly Demand',
            field: 'monthlyDemand',
            type: 'number',
          }, {
            label: 'Population',
            field: 'population',
            type: 'number',
          }, {
            label: 'Last Month Consumption',
            field: 'lastMonthConsumption',
            type: 'number',
          }].map((item) => (
            <div key={item.field}>
              <label className="block text-sm font-medium text-slate-700">{item.label}</label>
              <input
                type={item.type || 'text'}
                value={form[item.field]}
                onChange={(e) => handleChange(item.field, item.type === 'number' ? Number(e.target.value) : e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          ))}
          <button className="mt-3 rounded-2xl bg-aramBlue-500 px-5 py-3 text-white hover:bg-aramBlue-700">Save Record</button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Inventory Table</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 text-slate-900 dark:border-slate-700 dark:text-slate-100">
                <tr>
                  {['Shop', 'District', 'Stock', 'Demand', 'Population', 'Last Month'].map((header) => (
                    <th key={header} className="px-3 py-3 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                 <tr key={item.ShopID} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-3">{item.ShopName}</td>
                    <td className="px-3 py-3">{item.District}</td>
                    <td className="px-3 py-3">{item.CurrentStock}</td>
                    <td className="px-3 py-3">{item.MonthlyDemand}</td>
                    <td className="px-3 py-3">{item.Population}</td>
                    <td className="px-3 py-3">{item.LastMonthConsumption}</td>
                 </tr>
                ))}
              </tbody>
            </table>
            {inventory.length === 0 && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No inventory records yet.</p>}
          </div>
        </div>
      </section>
    </div>
  )
}

export default InventoryPage
