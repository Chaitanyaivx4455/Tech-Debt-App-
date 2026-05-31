import mongoose from "mongoose";

const DebtSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
  createdAt: { type: Date, default: Date.now }
});

const Debt = mongoose.models.Debt || mongoose.model("Debt", DebtSchema);

export default Debt;