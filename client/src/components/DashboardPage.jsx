import { useState } from "react";
import TransactionForm from "./TransactionForm";
import Dashboard from "./Dashboard";
import AnalyticsPanel from "./AnalyticsPanel";

const DashboardPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleTransactionAdded = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <>
            {/* ── Workflow Banner ─────────────────────────── */}
            <div className="bg-surface-800/40 border-b border-surface-600/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
                        <span className="whitespace-nowrap px-2 py-1 bg-brand-500/10 text-brand-400 rounded-md font-medium">React</span>
                        <span>→</span>
                        <span className="whitespace-nowrap px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md font-medium">Express</span>
                        <span>→</span>
                        <span className="whitespace-nowrap px-2 py-1 bg-green-500/10 text-green-400 rounded-md font-medium">ML (Python)</span>
                        <span>→</span>
                        <span className="whitespace-nowrap px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md font-medium">Gemini AI</span>
                        <span>→</span>
                        <span className="whitespace-nowrap px-2 py-1 bg-teal-500/10 text-teal-400 rounded-md font-medium">MongoDB</span>
                    </div>
                </div>
            </div>

            {/* ── Main Content ───────────────────────────── */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Top Row — Form + Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <TransactionForm onTransactionAdded={handleTransactionAdded} />
                    </div>
                    <div className="lg:col-span-3">
                        <Dashboard refreshKey={refreshKey} onTransactionDeleted={handleTransactionAdded} />
                    </div>
                </div>

                {/* Bottom Row — Analytics */}
                <AnalyticsPanel refreshKey={refreshKey} />
            </main>
        </>
    );
};

export default DashboardPage;
