'use client';

import { useState ,useEffect } from "react";

type Debt = {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  dueDate: string;
  progress: number;
};

const initialDebts: Debt[] = [
  {
    id: 1,
    title: "fix login bugs",
    description: "login page crashes on mobile 📱",
    severity: "high",
    status: "open",
    dueDate: "Dec 21",
    progress: 55,
  },
  {
    id: 2,
    title: "refactor database",
    description: "clear up queries",
    severity: "medium",
    status: "open",
    dueDate: "13 Jun",
    progress: 40,
  },
  {
    id: 3,
    title: "update dependencies",
    description: "npm packages are outdated",
    severity: "low",
    status: "open",
    dueDate: "27 Apr",
    progress: 20,
  },
];

const severityStyles: Record<string, string> = {
  high: "bg-red-500 text-white",
  medium: "bg-orange-400 text-white",
  low: "bg-green-500 text-white",
};

const progressBarColor: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-blue-400",
  low: "bg-blue-400",
};

const filterStyles: Record<string, string> = {
  All: "bg-blue-500 text-white border-blue-500",
  High: "bg-red-500 text-white border-red-500",
  Medium: "bg-orange-400 text-white border-orange-400",
  Low: "bg-green-500 text-white border-green-500",
};

function Avatar({ initial }: { initial: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800 -ml-2 first:ml-0 select-none">
      {initial}
    </div>
  );
}

function DebtCard({
  debt, onDelete, onStart, onResolve, onReopen, onEdit,
}: {
  debt: Debt;
  onDelete: (id: number) => void;
  onStart: (id: number) => void;
  onResolve: (id: number) => void;
  onReopen: (id: number) => void;
  onEdit: (debt: Debt) => void;
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 mb-4 hover:border-gray-500 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-lg font-semibold mb-1">{debt.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{debt.description}</p>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityStyles[debt.severity]}`}>
              {debt.severity}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              debt.status === "open"
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : debt.status === "in progress"
                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                : "bg-green-500/20 text-green-400 border-green-500/30"
            }`}>
              {debt.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          {debt.status === "open" && (
            <button onClick={() => onStart(debt.id)}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              ▶️ Start
            </button>
          )}
          {debt.status === "in progress" && (
            <button onClick={() => onResolve(debt.id)}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              ✅ Resolve
            </button>
          )}
          {debt.status === "resolved" && (
            <button onClick={() => onReopen(debt.id)}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              🔄 Reopen
            </button>
          )}
          <button onClick={() => onEdit(debt)}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-sm">
            ✏️
          </button>
          <button onClick={() => onDelete(debt.id)}
            className="bg-gray-700 hover:bg-red-900/60 text-gray-300 hover:text-red-400 w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-sm">
            🗑️
          </button>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${progressBarColor[debt.severity]}`}
          style={{ width: `${debt.progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-gray-500 text-xs">Due date: {debt.dueDate}</span>
        <div className="flex items-center">
          <Avatar initial="C" />
          <Avatar initial="B" />
        </div>
      </div>
    </div>
  );
}

function AddDebtModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (debt: Debt) => void;
}) {
  const [form, setForm] = useState({
    title: "", description: "", severity: "medium", dueDate: "",
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd({
      id: Date.now(),
      title: form.title,
      description: form.description,
      severity: form.severity,
      status: "open",
      dueDate: form.dueDate || "TBD",
      progress: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white text-xl font-bold mb-5">Add New Debt</h2>
        <input
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 placeholder-gray-500"
          placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none"
          placeholder="Description" rows={3} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500"
          value={form.severity}
          onChange={e => setForm({ ...form, severity: e.target.value })}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-5 focus:outline-none focus:border-blue-500"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
        />
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl font-medium transition-colors">
            Add Debt
          </button>
        </div>
      </div>
    </div>
  );
}

function EditDebtModal({ debt, onClose, onSave }: {
  debt: Debt;
  onClose: () => void;
  onSave: (updated: Debt) => void;
}) {
  const [form, setForm] = useState({
    title: debt.title,
    description: debt.description,
    severity: debt.severity,
    dueDate: debt.dueDate,
  });

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({ ...debt, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white text-xl font-bold mb-5">Edit Debt</h2>
        <input
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 placeholder-gray-500"
          placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none"
          placeholder="Description" rows={3} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500"
          value={form.severity}
          onChange={e => setForm({ ...form, severity: e.target.value })}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 mb-5 focus:outline-none focus:border-blue-500"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
        />
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const navItems = [
  { label: "Dash-\nboards", icon: "📊", id: "dash" },
  { label: "Team\nReports", icon: "👥", id: "team" },
  { label: "Settings", icon: "⚙️", id: "settings" },
  { label: "Templates", icon: "📁", id: "templates" },
];

export default function Home() {
const [debts, setDebts] = useState<Debt[]>(initialDebts);
const [filter, setFilter] = useState("All");
const [search, setSearch] = useState("");
const [showModal, setShowModal] = useState(false);
const [editDebt, setEditDebt] = useState<Debt | null>(null);
const [activeNav, setActiveNav] = useState("dash");



useEffect(() => {
  try {
    const saved = localStorage.getItem("tech-debts");
    if (saved) setDebts(JSON.parse(saved));
  } catch {}
}, []);


useEffect(() => {
  localStorage.setItem("tech-debts", JSON.stringify(debts));
}, [debts]);

const filters = ["All", "High", "Medium", "Low"]; 

  const filtered = debts.filter(d => {
    const matchFilter = filter === "All" || d.severity === filter.toLowerCase();
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete  = (id: number) => setDebts(debts.filter(d => d.id !== id));
  const handleStart   = (id: number) => setDebts(debts.map(d => d.id === id ? { ...d, status: "in progress" } : d));
  const handleResolve = (id: number) => setDebts(debts.map(d => d.id === id ? { ...d, status: "resolved" } : d));
  const handleReopen  = (id: number) => setDebts(debts.map(d => d.id === id ? { ...d, status: "open" } : d));
  const handleAdd     = (debt: Debt) => setDebts([...debts, debt]);
  const handleEdit    = (debt: Debt) => setEditDebt(debt);
  const handleSave    = (updated: Debt) => setDebts(debts.map(d => d.id === updated.id ? updated : d));

  return (
    <div className="flex min-h-screen bg-gray-900 font-sans">

      {/* Sidebar */}
      <aside className="w-16 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4 gap-5 shrink-0">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-900 font-black text-sm select-none">
          TD
        </div>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-12 ${
              activeNav === item.id ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
            }`}>
            <span className="text-base">{item.icon}</span>
            <span className="text-[9px] leading-tight text-center whitespace-pre-line">{item.label}</span>
          </button>
        ))}
        <div className="mt-auto text-gray-600 font-black text-lg select-none">TD</div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 gap-4">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 flex-1 max-w-sm">
            <span className="text-gray-500 mr-2 text-sm">🔍</span>
            <input
              className="bg-transparent text-white text-sm focus:outline-none flex-1 placeholder-gray-500"
              placeholder="Search" value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shrink-0 cursor-pointer" />
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-white text-3xl font-bold">Tech-Debt</h1>
              <p className="text-gray-400 mt-1 text-sm">
                Track, prioritize, and resolve technical debt efficiently
              </p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors shrink-0">
              + Add Debt
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  filter === f
                    ? filterStyles[f]
                    : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"
                }`}>
                {f}
              </button>
            ))}
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-600 text-gray-400 hover:border-gray-400 transition-all">
              Assignee ▾
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-600 text-gray-400 hover:border-gray-400 transition-all">
              Tag ▾
            </button>
          </div>

          {/* Cards */}
          {filtered.length === 0
            ? <div className="text-center text-gray-500 py-20 text-sm">No debts found. Add one!</div>
            : filtered.map(debt => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onDelete={handleDelete}
                onStart={handleStart}
                onResolve={handleResolve}
                onReopen={handleReopen}
                onEdit={handleEdit}
              />
            ))
          }
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-gray-800 flex items-center justify-between">
          <span className="text-gray-600 text-xs">Last sync: 2 mins ago</span>
          <div className="flex gap-4">
            <button className="text-gray-500 text-xs hover:text-gray-300 underline">Feedback</button>
            <button className="text-gray-500 text-xs hover:text-gray-300 underline">Help</button>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {showModal && (
        <AddDebtModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
      {editDebt && (
        <EditDebtModal
          debt={editDebt}
          onClose={() => setEditDebt(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}