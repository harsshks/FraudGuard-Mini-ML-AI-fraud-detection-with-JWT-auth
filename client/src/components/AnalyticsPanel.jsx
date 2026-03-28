import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area,
} from "recharts";

const COLORS_PIE = ["#10b981", "#ef4444"];
const COLORS_BAR = ["#6366f1", "#f87171"];

const AnalyticsPanel = ({ refreshKey }) => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/transactions/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(res.data.data);
            } catch (err) {
                console.error("Stats fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [refreshKey]);

    if (loading || !stats) {
        return (
            <div className="glass rounded-2xl p-6 lg:p-8 animate-fade-in-up">
                <div className="h-48 bg-surface-800/50 rounded-xl animate-pulse" />
            </div>
        );
    }

    const pieData = [
        { name: "Approved", value: stats.approved },
        { name: "Flagged", value: stats.flagged },
    ];

    return (
        <div className="glass rounded-2xl p-6 lg:p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-lg">
                    📈
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Analytics</h2>
                    <p className="text-sm text-slate-400">{stats.total} transactions analyzed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pie Chart — Approved vs Flagged */}
                <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-600/30">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Status Breakdown</h3>
                    {stats.total > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS_PIE[idx]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e1e33", border: "1px solid #3a3a55", borderRadius: "8px", fontSize: "12px" }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-slate-500 text-sm py-16">No data yet</p>
                    )}
                </div>

                {/* Bar Chart — Fraud by Category */}
                <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-600/30">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Fraud by Category</h3>
                    {stats.byCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.byCategory.slice(0, 8)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" />
                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} angle={-30} textAnchor="end" height={50} />
                                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e1e33", border: "1px solid #3a3a55", borderRadius: "8px", fontSize: "12px" }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                />
                                <Bar dataKey="total" fill={COLORS_BAR[0]} radius={[4, 4, 0, 0]} name="Total" />
                                <Bar dataKey="flagged" fill={COLORS_BAR[1]} radius={[4, 4, 0, 0]} name="Flagged" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-slate-500 text-sm py-16">No data yet</p>
                    )}
                </div>

                {/* Area Chart — Volume by Hour */}
                <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-600/30">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Volume by Hour</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={stats.byHour} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradFlagged" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" />
                            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94a3b8" }} interval={3} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e1e33", border: "1px solid #3a3a55", borderRadius: "8px", fontSize: "12px" }}
                                itemStyle={{ color: "#e2e8f0" }}
                            />
                            <Area type="monotone" dataKey="approved" stroke="#10b981" fill="url(#gradApproved)" name="Approved" />
                            <Area type="monotone" dataKey="flagged" stroke="#ef4444" fill="url(#gradFlagged)" name="Flagged" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
