import * as React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
} from 'react-router-dom';

import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Patients } from './components/Patients';
import "./Assets/scss/styles.scss";


const AuthContext = React.createContext(null);

export const useAuth = () => {
    return React.useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [token, setToken] = React.useState(null);

    const handleLogin = async (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": email,
                "password": password
            })
        };

        return fetch("https://localhost:44392/login", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    console.log("login KO")
                    alert("Authentication failed")
                    return
                }
                else return response.json();
            })
            .then((data) => {
                console.log("login OK")
                setToken(data.token);
                const origin = location.state?.from?.pathname || '/patients';
                navigate(origin);
            })
            .catch((error) => {
               
            });
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route index element={<Login />} />
                <Route exact path='/Login' element={<Login />} />
                <Route
                    path="patients"
                    element={
                        <ProtectedRoute>
                            <Patients />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
};