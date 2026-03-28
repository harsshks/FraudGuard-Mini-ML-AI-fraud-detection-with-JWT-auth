import { Link } from "react-router-dom";

const HomePage = () => {
    const features = [
        {
            icon: "🧠",
            title: "ML Anomaly Detection",
            desc: "IsolationForest algorithm trained on transaction patterns to flag statistical outliers in real-time.",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            icon: "✨",
            title: "Gemini AI Reasoning",
            desc: "Google Gemini 2.0 Flash provides human-readable explanations for each flagged transaction.",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            icon: "⚡",
            title: "Real-Time Monitoring",
            desc: "Socket.io-powered live dashboard updates the moment a new transaction is analyzed.",
            gradient: "from-amber-500 to-orange-500",
        },
        {
            icon: "📄",
            title: "PDF Report Generation",
            desc: "Selectively export single or multiple transactions into professional PDF reports.",
            gradient: "from-emerald-500 to-teal-500",
        },
    ];

    const steps = [
        {
            num: "01",
            title: "Submit Transaction",
            desc: "Enter transaction amount, category, and time through the intuitive form interface.",
            icon: "💳",
        },
        {
            num: "02",
            title: "ML + AI Analysis",
            desc: "IsolationForest scores the transaction, then Gemini AI provides detailed reasoning.",
            icon: "🔬",
        },
        {
            num: "03",
            title: "Instant Verdict",
            desc: "Get an Approved or Flagged status in real-time with AI-powered explanations.",
            icon: "✅",
        },
    ];

    return (
        <div className="animate-fade-in-up">
            {/* ── Hero ────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        Powered by ML + Generative AI
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                        Detect Fraud with{" "}
                        <span className="hero-gradient-text">
                            AI Precision
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        FraudGuard Mini combines <strong className="text-white">IsolationForest ML</strong> with{" "}
                        <strong className="text-white">Google Gemini 2.0 Flash</strong> to analyze transactions in
                        real-time and explain every decision.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 text-lg hover:scale-105"
                        >
                            Launch Dashboard →
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 rounded-xl font-bold text-slate-300 bg-surface-800/60 border border-surface-600/50 hover:border-brand-500/40 hover:text-white transition-all duration-300 text-lg"
                        >
                            How It Works
                        </a>
                    </div>

                    {/* Tech Pipeline Mini */}
                    <div className="mt-16 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
                        {["React", "Express", "Python ML", "Gemini AI", "MongoDB"].map((tech, i) => (
                            <span key={tech} className="flex items-center gap-2">
                                <span className="px-3 py-1.5 bg-surface-800/80 border border-surface-600/40 rounded-lg font-medium text-slate-400">
                                    {tech}
                                </span>
                                {i < 4 && <span className="text-brand-500">→</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Why FraudGuard Mini?
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        A two-layer detection pipeline that catches what rule-based systems miss.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                            >
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ────────────────────────── */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Three simple steps from transaction to verdict.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={step.num} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                            {/* Connector line */}
                            {i < 2 && (
                                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-brand-500/40 to-transparent z-10" />
                            )}
                            <div className="glass rounded-2xl p-8 text-center hover:border-brand-500/30 transition-all duration-300 h-full">
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold mb-4">
                                    Step {step.num}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Stats Banner ────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="glass rounded-3xl p-10 sm:p-14">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "2-Layer", label: "Detection Pipeline" },
                            { value: "<1s", label: "Analysis Speed" },
                            { value: "Real-Time", label: "Live Monitoring" },
                            { value: "AI", label: "Explainable Verdicts" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl sm:text-4xl font-black hero-gradient-text mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Ready to Detect Fraud?
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto mb-8">
                    Submit your first transaction and see the two-layer pipeline in action.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 text-lg hover:scale-105"
                >
                    Go to Dashboard →
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
