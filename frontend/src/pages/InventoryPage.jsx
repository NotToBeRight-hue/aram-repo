import { useEffect, useState } from 'react'
import { getInventory, addInventory, updateInventory, deleteInventory, } from '../services/api'
import { Pencil, Trash2 } from "lucide-react"

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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedShop, setSelectedShop] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  useEffect(() => {
    async function loadInventory() {
      const result = await getInventory()
      console.log(result.inventory)
      setInventory(result.inventory || [])
    }
    loadInventory()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage(
    editingId
    ? 'Inventory updated successfully.'
    : 'Inventory added successfully.'
    )

    setTimeout(() => {
    setSuccessMessage('')
    }, 3000)

    if (editingId) {
    await updateInventory(editingId, form)
    setEditingId(null)
  } else {
    await addInventory(form)
  }

  const result = await getInventory()

    setInventory(result.inventory || [])
    setForm(initialForm)
}
  const handleDelete = async (shopId) => {
  const confirmDelete = setSelectedShop(shopId)
   setShowDeleteModal(true)

   if (!confirmDelete) return

   await deleteInventory(shopId)

  

  const result = await getInventory()
   setInventory(result.inventory || [])
}
const confirmDelete = async () => {
  await deleteInventory(selectedShop)

const result = await getInventory()
  setInventory(result.inventory || [])

  setShowDeleteModal(false)
  setSelectedShop(null)
}
const handleEdit = (item) => {
  setEditingId(item.ShopID)

  setForm({
    shopName: item.ShopName,
    district: item.District,
    currentStock: item.CurrentStock,
    monthlyDemand: item.MonthlyDemand,
    population: item.Population,
    lastMonthConsumption: item.LastMonthConsumption,
  })
}
  const [searchTerm, setSearchTerm] = useState('')

const filteredInventory = inventory.filter((item) =>
  (item.ShopName || '')
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  (item.District || '')
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
    )
   const getStatus = (stock, demand) => {
  if (stock >= demand) {
    return {
      label: "Safe",
      color: "bg-green-500/20 text-green-400",
    }
  }

  if (stock >= demand * 0.7) {
    return {
      label: "Low",
      color: "bg-yellow-500/20 text-yellow-400",
    }
  }

  return {
    label: "Critical",
    color: "bg-red-500/20 text-red-400",
  }
} 

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Inventory Management</h2>
        
        <p className="mt-2 text-slate-600 dark:text-slate-400">Add and review shop-level inventory data for analytics.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-700 dark:bg-slate-950">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {editingId ? 'Edit Inventory Record' : 'Add Inventory Record'}
                </h3>
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
            <div className="mt-4 flex gap-3">
            <button
            type="submit"
            className="rounded-2xl bg-aramBlue-500 px-5 py-3 text-white hover:bg-aramBlue-700"
          >
            {editingId ? 'Update Record' : 'Save Record'}
            </button>

            {editingId && (
            <button
            type="button"
            onClick={() => {
            setEditingId(null)
            setForm(initialForm)
            }}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
          >
            Cancel
            </button>
           )}
            </div>        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Inventory Table</h3>
          <div className="mb-4">
          <input
          type="text"
          placeholder="🔍 Search by shop or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 text-slate-900 dark:border-slate-700 dark:text-slate-100">
                <tr>
                  {['Shop', 'District', 'Stock', 'Demand', 'Population', 'Last Month', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="px-3 py-3 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
  {filteredInventory.map((item) => {
    const status = getStatus(item.CurrentStock, item.MonthlyDemand)

    return (
      <tr key={item.ShopID} className="border-b border-slate-100 dark:border-slate-800">
        <td className="px-3 py-3">{item.ShopName}</td>
        <td className="px-3 py-3">{item.District}</td>
        <td className="px-3 py-3">{item.CurrentStock} KG</td>
        <td className="px-3 py-3">{item.MonthlyDemand} KG</td>
        <td className="px-3 py-3">{item.Population}</td>
        <td className="px-3 py-3">{item.LastMonthConsumption}</td>
        

        <td className="px-3 py-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
          >
            {status.label}
          </span>
        </td>
        <td className="px-3 py-3">
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => handleEdit(item)}
      className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
      title="Edit"
    >
      <Pencil className="h-4 w-4" />
      </button>
        <button
    type="button"
    onClick={() => handleDelete(item.ShopID)}
    className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
    title="Delete"  
  >
    <Trash2 className="h-4 w-4" />
    </button>
  </div>
</td>
      </tr>
    )
  })}
</tbody>
            </table>
            {inventory.length === 0 && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No inventory records yet.</p>}
          </div>
        </div>
      </section>
      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">

      <h3 className="text-xl font-semibold">
        Delete Inventory
      </h3>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Are you sure you want to delete this inventory record?
      </p>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => setShowDeleteModal(false)}
          className="rounded-xl border px-5 py-2"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="rounded-xl bg-red-600 px-5 py-2 text-white"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}
{successMessage && (
  <div className="fixed top-6 right-6 z-50">
    <div className="flex items-start gap-4 rounded-2xl border border-green-500/30 bg-slate-900 px-5 py-4 shadow-2xl shadow-black/40">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
        ✅
      </div>

      <div>
        <h4 className="font-semibold text-white">
          Success
        </h4>

        <p className="mt-1 text-sm text-slate-300">
          {successMessage}
        </p>
      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default InventoryPage
