import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-surface-600/30 bg-surface-900/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-brand-500/20">
                                🛡️
                            </div>
                            <span className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                                FraudGuard <span className="text-brand-400">Mini</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Two-layer fraud detection pipeline combining IsolationForest ML with Google Gemini 2.0 Flash generative AI.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/" className="text-sm text-slate-500 hover:text-brand-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-sm text-slate-500 hover:text-brand-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Express", "Python", "Gemini AI", "MongoDB", "Socket.io"].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 text-xs rounded-md bg-surface-700/60 text-slate-400 border border-surface-600/40"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-surface-600/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                        © {currentYear} FraudGuard Mini · IsolationForest + Gemini 2.0 Flash
                    </p>
                    <p className="text-xs text-slate-600">
                        Two-layer fraud detection pipeline
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
