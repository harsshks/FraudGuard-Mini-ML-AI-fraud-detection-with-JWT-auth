import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = ({ refreshKey, onTransactionDeleted }) => {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, flagged: 0, approved: 0 });
    const [downloading, setDownloading] = useState(false);
    const [selected, setSelected] = useState(new Set());
    const [deletingId, setDeletingId] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get("/api/transactions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.data || [];
            setTransactions(data);
            setStats({
                total: data.length,
                flagged: data.filter((t) => t.status === "Flagged").length,
                approved: data.filter((t) => t.status === "Approved").length,
            });
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch + refresh on key change
    useEffect(() => {
        fetchTransactions();
    }, [refreshKey]);

    // Socket.io real-time listener
    useEffect(() => {
        const socket = io(API_URL);

        socket.on("newTransaction", (txn) => {
            setTransactions((prev) => [txn, ...prev].slice(0, 50));
            setStats((prev) => ({
                total: prev.total + 1,
                flagged: prev.flagged + (txn.status === "Flagged" ? 1 : 0),
                approved: prev.approved + (txn.status === "Approved" ? 1 : 0),
            }));
        });

        socket.on("transactionDeleted", (id) => {
            setTransactions((prev) => prev.filter((t) => t._id !== id));
            setSelected((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        });

        return () => socket.disconnect();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ── Selection logic ──────────────────────────────
    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === transactions.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(transactions.map((t) => t._id)));
        }
    };

    // ── Download Report ──────────────────────────────
    const handleDownloadReport = () => {
        const params = selected.size > 0 ? `?ids=${[...selected].join(",")}` : "";
        // For PDF download with auth, we need to pass token as query param
        window.open(`${API_URL}/api/transactions/report${params}${params ? "&" : "?"}token=${token}`, "_blank");
    };

    // ── Delete Transaction ───────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            await axios.delete(`/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions((prev) => prev.filter((t) => t._id !== id));
            setSelected((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            setStats((prev) => {
                const txn = transactions.find((t) => t._id === id);
                return {
                    total: prev.total - 1,
                    flagged: prev.flagged - (txn?.status === "Flagged" ? 1 : 0),
                    approved: prev.approved - (txn?.status === "Approved" ? 1 : 0),
                };
            });
            if (onTransactionDeleted) onTransactionDeleted();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete transaction.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 lg:p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-lg">
                        📊
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Live Dashboard</h2>
                        <p className="text-sm text-slate-400">Real-time transaction activity</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Selection info */}
                    {selected.size > 0 && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            {selected.size} selected
                        </span>
                    )}

                    {/* Download Report Button */}
                    <button
                        onClick={handleDownloadReport}
                        disabled={downloading || transactions.length === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600/20 text-brand-400 border border-brand-500/30 hover:bg-brand-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        title={selected.size > 0 ? `Generate report for ${selected.size} selected` : "Generate report for all transactions"}
                    >
                        {downloading ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Generating…
                            </>
                        ) : (
                            <>📄 {selected.size > 0 ? `PDF (${selected.size})` : "PDF (All)"}</>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-surface-800/80 rounded-xl p-4 text-center border border-surface-600/50">
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-slate-400 mt-1">Total</p>
                </div>
                <div className="bg-success-500/10 rounded-xl p-4 text-center border border-success-500/20">
                    <p className="text-2xl font-bold text-success-400">{stats.approved}</p>
                    <p className="text-xs text-success-400/80 mt-1">Approved</p>
                </div>
                <div className="bg-danger-500/10 rounded-xl p-4 text-center border border-danger-500/20">
                    <p className="text-2xl font-bold text-danger-400">{stats.flagged}</p>
                    <p className="text-xs text-danger-400/80 mt-1">Flagged</p>
                </div>
            </div>

            {/* Select All */}
            {transactions.length > 0 && (
                <div className="flex items-center gap-3 mb-4 px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selected.size === transactions.length && transactions.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/50 cursor-pointer accent-[#6366f1]"
                        />
                        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            Select All ({transactions.length})
                        </span>
                    </label>
                    {selected.size > 0 && (
                        <button
                            onClick={() => setSelected(new Set())}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            {/* Transaction List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-surface-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-slate-400 text-sm">No transactions yet</p>
                    <p className="text-slate-500 text-xs mt-1">Submit a transaction to get started</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {transactions.map((txn, index) => (
                        <div
                            key={txn._id || index}
                            className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                                selected.has(txn._id) ? "ring-1 ring-brand-500/40 " : ""
                            }${
                                txn.status === "Flagged"
                                    ? "bg-danger-500/5 border-danger-500/20 hover:border-danger-500/40"
                                    : "bg-success-500/5 border-success-500/20 hover:border-success-500/40"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selected.has(txn._id)}
                                        onChange={() => toggleSelect(txn._id)}
                                        className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/50 cursor-pointer accent-[#6366f1]"
                                    />
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full ${
                                            txn.status === "Flagged" ? "bg-danger-500 animate-pulse" : "bg-success-500"
                                        }`}
                                    />
                                    <span className="text-lg font-bold text-white">
                                        ${txn.amount?.toFixed(2)}
                                    </span>
                                    {txn.category && (
                                        <span className="text-xs text-slate-500 px-2 py-0.5 bg-surface-700/50 rounded-md">
                                            {txn.category.replace(/_/g, " ")}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                            txn.status === "Flagged"
                                                ? "bg-danger-500/20 text-danger-400"
                                                : "bg-success-500/20 text-success-400"
                                        }`}
                                    >
                                        {txn.status}
                                    </span>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(txn._id)}
                                        disabled={deletingId === txn._id}
                                        className="p-1.5 rounded-lg text-slate-600 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-200 cursor-pointer disabled:opacity-40"
                                        title="Delete transaction"
                                    >
                                        {deletingId === txn._id ? (
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    {formatDate(txn.createdAt || txn.timestamp)}
                                </span>
                                {txn.mlScore !== undefined && (
                                    <span className="text-xs text-slate-500">
                                        Score: {txn.mlScore?.toFixed(4)}
                                    </span>
                                )}
                            </div>

                            {txn.aiReason && (
                                <div className="mt-2.5 p-2.5 bg-surface-800/60 rounded-lg border border-surface-600/40">
                                    <p className="text-xs text-brand-400 font-semibold mb-0.5">🤖 AI Reasoning</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{txn.aiReason}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
