import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
    const { user, token, updateProfile } = useAuth();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({ total: 0, flagged: 0, approved: 0 });

    // Populate form when user loads
    useEffect(() => {
        if (user) {
            setForm({ name: user.name, email: user.email });
        }
    }, [user]);

    // Fetch transaction stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/transactions/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.success) {
                    setStats({
                        total: data.data.total,
                        flagged: data.data.flagged,
                        approved: data.data.approved,
                    });
                }
            } catch {
                // Stats are optional — fail silently
            }
        };
        if (token) fetchStats();
    }, [token]);

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await updateProfile(form);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setEditing(false);
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to update profile" });
        }
        setSaving(false);
    };

    if (!user) return null;

    const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">My Account</h2>
                <p className="text-slate-400 mt-1">Manage your profile and view account statistics</p>
            </div>

            {/* Feedback */}
            {message.text && (
                <div
                    className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in-up ${
                        message.type === "success"
                            ? "bg-success-500/10 border border-success-500/20 text-success-400"
                            : "bg-danger-500/10 border border-danger-500/20 text-danger-400"
                    }`}
                >
                    <span>{message.type === "success" ? "✅" : "⚠️"}</span>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 glass rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span>👤</span> Profile Details
                        </h3>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 text-sm rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-all cursor-pointer"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setForm({ name: user.name, email: user.email });
                                        setMessage({ type: "", text: "" });
                                    }}
                                    className="px-4 py-2 text-sm rounded-lg bg-surface-700/50 text-slate-400 hover:text-white transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {saving ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Avatar + Info */}
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-brand-500/30">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-white">{user.name}</h4>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                            <p className="text-slate-500 text-xs mt-1">Member since {joinDate}</p>
                        </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                disabled={!editing}
                                className={`w-full px-4 py-3 rounded-xl border text-white outline-none transition-all ${
                                    editing
                                        ? "bg-surface-800/80 border-surface-600/50 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20"
                                        : "bg-surface-800/30 border-surface-700/30 text-slate-300 cursor-not-allowed"
                                }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                disabled={!editing}
                                className={`w-full px-4 py-3 rounded-xl border text-white outline-none transition-all ${
                                    editing
                                        ? "bg-surface-800/80 border-surface-600/50 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20"
                                        : "bg-surface-800/30 border-surface-700/30 text-slate-300 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                            <span>📊</span> Your Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/40">
                                <span className="text-slate-400 text-sm">Total Transactions</span>
                                <span className="text-white font-bold text-lg">{stats.total}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-success-500/5 border border-success-500/10">
                                <span className="text-success-400 text-sm">Approved</span>
                                <span className="text-success-400 font-bold text-lg">{stats.approved}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-danger-500/5 border border-danger-500/10">
                                <span className="text-danger-400 text-sm">Flagged</span>
                                <span className="text-danger-400 font-bold text-lg">{stats.flagged}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Security */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🔒</span> Security
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-success-500" />
                                <span className="text-slate-300">JWT Authentication</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-success-500" />
                                <span className="text-slate-300">Bcrypt Password Hashing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-success-500" />
                                <span className="text-slate-300">Per-User Data Isolation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
