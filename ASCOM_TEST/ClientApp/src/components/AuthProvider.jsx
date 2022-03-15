
import { React, useState } from "react";
import {
    useLocation,
    useNavigate
} from 'react-router-dom';

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const AuthContext = React.createContext(null);
    const [token, setToken] = useState(null);

    const handleLogin = async (email, password) => {
        doLogin(email, password)
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    const doLogin = async (email, password) => {
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
                    alert("Invalid credentials")
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
                console.log("login Error")
                alert("Login Error")
            });
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
