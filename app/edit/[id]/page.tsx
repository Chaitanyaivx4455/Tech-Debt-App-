"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function EditDebt() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open"
  });

  useEffect(() => {
    const fetchDebt = async () => {
      const res = await fetch("/api/debt");
      const debts = await res.json();
      const debt = debts.find((d: any) => d._id === id);
      if (debt) setForm(debt);
    };
    fetchDebt();
  }, [id]);

  const handleSave = async () => {
    await fetch("/api/debt", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });
    router.push("/");
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Debt</h1>

      <input
        className="border p-2 mb-3 w-full rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({...form, title: e.target.value})}
      />

      <textarea
        className="border p-2 mb-3 w-full rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
      />

      <select
        className="border p-2 mb-3 w-full rounded"
        value={form.priority}
        onChange={(e) => setForm({...form, priority: e.target.value})}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <select
        className="border p-2 mb-3 w-full rounded"
        value={form.status}
        onChange={(e) => setForm({...form, status: e.target.value})}>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>
        <button onClick={() => router.push("/")}
          className="bg-gray-600 text-white px-4 py-2 rounded w-full">
          Cancel
        </button>
      </div>
    </div>
  );
}