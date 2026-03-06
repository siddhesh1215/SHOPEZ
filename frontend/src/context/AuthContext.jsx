import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('shopez_token');
        if (token) {
            getProfile()
                .then((res) => setUser(res.data.user))
                .catch(() => localStorage.removeItem('shopez_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await loginUser({ email, password });
        localStorage.setItem('shopez_token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password, role = 'customer') => {
        const res = await registerUser({ name, email, password, role });
        localStorage.setItem('shopez_token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('shopez_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
