import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navLinks = [
        { to: "/", label: "Home", icon: "🏠" },
        { to: "/dashboard", label: "Dashboard", icon: "📊" },
    ];

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate("/");
    };

    return (
        <header className="border-b border-surface-600/50 bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-brand-500/30 animate-pulse-glow">
                        🛡️
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-brand-400 transition-colors">
                            FraudGuard <span className="text-brand-400">Mini</span>
                        </h1>
                        <p className="text-xs text-slate-500">Hybrid ML + Generative AI Detection</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden sm:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                location.pathname === link.to
                                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-surface-700/50"
                            }`}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}

                    <span className="ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-success-500/10 border border-success-500/20 rounded-full text-xs text-success-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                        System Online
                    </span>

                    {/* Auth Buttons / User Menu */}
                    <div className="ml-3 flex items-center gap-2">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-700/50 hover:bg-surface-600/50 border border-surface-600/30 transition-all cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-slate-300 max-w-[100px] truncate">
                                        {user?.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-800 border border-surface-600/50 shadow-xl shadow-black/30 py-2 animate-fade-in-up z-50">
                                        <div className="px-4 py-3 border-b border-surface-600/30">
                                            <p className="text-sm font-medium text-white">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-surface-700/50 transition-colors"
                                        >
                                            <span>👤</span> My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-400 hover:bg-danger-500/10 transition-colors cursor-pointer"
                                        >
                                            <span>🚪</span> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-surface-700/50 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg hover:from-brand-600 hover:to-purple-700 shadow-md shadow-brand-500/20 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="sm:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-surface-700/50 transition-colors cursor-pointer"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-surface-600/30 bg-surface-900/95 backdrop-blur-xl animate-fade-in-up">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    location.pathname === link.to
                                        ? "bg-brand-500/15 text-brand-400"
                                        : "text-slate-400 hover:text-white hover:bg-surface-700/50"
                                }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Auth */}
                        <div className="pt-3 border-t border-surface-600/30 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{user?.name}</p>
                                            <p className="text-xs text-slate-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-surface-700/50"
                                    >
                                        <span>👤</span> My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-danger-400 hover:bg-danger-500/10 cursor-pointer"
                                    >
                                        <span>🚪</span> Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-surface-700/50"
                                    >
                                        <span>🔐</span> Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-brand-400 hover:bg-brand-500/10"
                                    >
                                        <span>✨</span> Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="pt-2">
                            <span className="flex items-center gap-1.5 px-4 py-2 text-xs text-success-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                                System Online
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
