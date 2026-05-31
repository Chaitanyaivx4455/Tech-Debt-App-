"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [debts, setDebts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const fetchDebts = async () => {
    const res = await fetch("/api/debt");
    const data = await res.json();
    setDebts(data);
  };

  useEffect(() => { fetchDebts(); }, []);

  const handleDelete = async (id: string) => {
    await fetch("/api/debt", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchDebts();
  };

  const handleStatus = async (id: string, currentStatus: string) => {
    const next =
      currentStatus === "open" ? "in-progress" :
      currentStatus === "in-progress" ? "resolved" : "open";
    await fetch("/api/debt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    fetchDebts();
  };

  const filtered = filter === "all" ? debts : debts.filter((d: any) => d.priority === filter);

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛠 Tech Debt </h1>
        <Link href="/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
          + Add Debt
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "high", "medium", "low"].map(p => (
          <button key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-1 rounded-full text-sm capitalize font-medium ${
              filter === p ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}>
            {p}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-gray-400">No debts found.</p>}

      {filtered.map((debt: any) => (
        <div key={debt._id} className="border border-gray-700 p-4 mb-3 rounded-xl shadow-lg bg-gray-900">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg text-white">{debt.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{debt.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleStatus(debt._id, debt.status)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm">
                {debt.status === "open" ? "▶️ Start" :
                 debt.status === "in-progress" ? "✅ Resolve" : "🔄 Reopen"}
              </button>
              <button
                onClick={() => router.push(`/edit/${debt._id}`)}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-lg text-sm">
                ✏️
              </button>
              <button
                onClick={() => handleDelete(debt._id)}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                🗑
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span style={{backgroundColor: debt.priority === "high" ? "#ef4444" : debt.priority === "medium" ? "#eab308" : "#22c55e"}}
              className="text-xs px-2 py-1 rounded-full text-white font-medium">
              {debt.priority}
            </span>
            <span style={{backgroundColor: debt.status === "open" ? "#3b82f6" : debt.status === "in-progress" ? "#f97316" : "#16a34a"}}
              className="text-xs px-2 py-1 rounded-full text-white font-medium">
              {debt.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}