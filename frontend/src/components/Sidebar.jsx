import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Recommendations', path: '/recommendations' },
  { label: 'Approval', path: '/approval' },
]

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-full md:w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-700 shadow-sm px-6 py-8">
      <div className="mb-10">
        <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">ARAM</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Resource Intelligence Dashboard</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium ${
                isActive
                  ? 'bg-aramBlue-500 text-white'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
