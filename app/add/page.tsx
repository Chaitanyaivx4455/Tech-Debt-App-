"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddDebt() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
  });

  const handleSubmit = async () => {
    if (!form.title) {
      alert("Please enter a title!");
      return;
    }

    const res = await fetch("/api/debt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Saved to DB ✅");
      router.push("/");
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Technical Debt</h1>

      <input
        className="border border-gray-600 bg-black text-white p-2 mb-3 w-full rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        className="border border-gray-600 bg-black text-white p-2 mb-3 w-full rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <select
        className="border border-gray-600 bg-black text-white p-2 mb-3 w-full rounded"
        value={form.priority}
        onChange={(e) =>
          setForm({ ...form, priority: e.target.value })
        }
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <select
        className="border border-gray-600 bg-black text-white p-2 mb-3 w-full rounded"
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Add Debt
      </button>
    </div>
  );
}