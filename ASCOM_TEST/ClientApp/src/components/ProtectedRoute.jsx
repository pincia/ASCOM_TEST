import React from "react";
import { useAuth } from "../App";
import {
    useLocation,
    Navigate
} from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
};