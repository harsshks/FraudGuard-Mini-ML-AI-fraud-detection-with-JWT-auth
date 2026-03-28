import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth`;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("fg_token") || null);
    const [loading, setLoading] = useState(true);

    // On mount, validate stored token by fetching profile
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.get(`${API}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(data.data);
            } catch {
                // Token invalid — clear it
                localStorage.removeItem("fg_token");
                setToken(null);
                setUser(null);
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const signup = async (name, email, password) => {
        const { data } = await axios.post(`${API}/register`, { name, email, password });
        const { token: newToken, ...userData } = data.data;
        localStorage.setItem("fg_token", newToken);
        setToken(newToken);
        setUser(userData);
        return data;
    };

    const login = async (email, password) => {
        const { data } = await axios.post(`${API}/login`, { email, password });
        const { token: newToken, ...userData } = data.data;
        localStorage.setItem("fg_token", newToken);
        setToken(newToken);
        setUser(userData);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("fg_token");
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const { data } = await axios.put(`${API}/profile`, updates, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.data);
        return data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!user,
                signup,
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
