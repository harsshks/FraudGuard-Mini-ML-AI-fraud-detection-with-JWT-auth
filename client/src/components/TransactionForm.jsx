import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
    "entertainment", "food_dining", "gas_transport", "grocery_net", "grocery_pos",
    "health_fitness", "home", "kids_pets", "misc_net", "misc_pos",
    "personal_care", "shopping_net", "shopping_pos", "travel",
];

const TransactionForm = ({ onTransactionAdded }) => {
    const { token } = useAuth();
    const [amount, setAmount] = useState("");
    const [time, setTime] = useState("12");
    const [category, setCategory] = useState("misc_net");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount)) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await axios.post("/api/transactions", {
                amount: parseFloat(amount),
                time: parseInt(time, 10),
                category,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setResult(response.data.data);
            if (onTransactionAdded) onTransactionAdded();
            setAmount("");
        } catch (error) {
            console.error("Transaction error:", error);
            setResult({ error: "Failed to process transaction. Make sure all services are running." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 lg:p-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-lg">
                    💳
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">New Transaction</h2>
                    <p className="text-sm text-slate-400">Submit a transaction for fraud analysis</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
                        Transaction Amount ($)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-9 pr-4 py-3 bg-surface-800 border border-surface-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200"
                            required
                        />
                    </div>
                </div>

                {/* Category Dropdown */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-800 border border-surface-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-surface-800">
                                {cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time */}
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-300 mb-2">
                        Transaction Hour
                    </label>
                    <select
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-800 border border-surface-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200 appearance-none cursor-pointer"
                        required
                    >
                        {Array.from({ length: 24 }, (_, i) => {
                            const ampm = i < 12 ? "AM" : "PM";
                            const h12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
                            return (
                                <option key={i} value={i} className="bg-surface-800">
                                    {h12}:00 {ampm} ({i}:00)
                                </option>
                            );
                        })}
                    </select>
                    <p className="text-xs text-slate-500 mt-1.5">Late-night hours (12 AM – 4 AM) are higher risk</p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 cursor-pointer"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing…
                        </span>
                    ) : (
                        "Analyze Transaction"
                    )}
                </button>
            </form>

            {/* Result Card */}
            {result && !result.error && (
                <div
                    className={`mt-6 p-5 rounded-xl border animate-fade-in-up ${result.status === "Flagged"
                        ? "bg-danger-500/10 border-danger-500/30"
                        : "bg-success-500/10 border-success-500/30"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${result.status === "Flagged"
                                ? "bg-danger-500/20 text-danger-400"
                                : "bg-success-500/20 text-success-400"
                                }`}
                        >
                            {result.status === "Flagged" ? "🚨 FLAGGED" : "✅ APPROVED"}
                        </span>
                        <span className="text-sm text-slate-400">
                            Score: {result.mlScore?.toFixed(4)}
                        </span>
                    </div>
                    <p className="text-lg font-bold text-white">${result.amount?.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        {(result.category || "").replace(/_/g, " ")}
                    </p>
                    {result.aiReason && (
                        <div className="mt-3 p-3 bg-surface-800/60 rounded-lg border border-surface-600/50">
                            <p className="text-xs font-semibold text-brand-400 mb-1">🤖 AI Analysis</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{result.aiReason}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error */}
            {result?.error && (
                <div className="mt-6 p-4 bg-danger-500/10 border border-danger-500/30 rounded-xl animate-fade-in-up">
                    <p className="text-sm text-danger-400">{result.error}</p>
                </div>
            )}
        </div>
    );
};

export default TransactionForm;
