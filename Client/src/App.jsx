import React,{ useEffect } from 'react'
import './App.css'


import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes.jsx";
import authService from "./service/auth.service.js";

import {
    login,
    finishAuthCheck,
} from "./stores/slices/auth.slice.js";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                const response = await authService.getMe();

                const user =
                    response?.data?.user ||
                    response?.user;

                if (!mounted) return;

                if (user) {
                    dispatch(login(user));
                } else {
                    dispatch(finishAuthCheck());
                }
            } catch (error) {
                if (!mounted) return;

                dispatch(finishAuthCheck());
            }
        };

        checkAuth();

        return () => {
            mounted = false;
        };
    }, [dispatch]);

    return <AppRoutes />;
}

export default App;