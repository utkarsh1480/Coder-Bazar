import React,{ useEffect } from 'react'
import './App.css'


import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes.jsx";
import authService from "./service/auth.service.js";
import socket from "./service/socket.js";

import {
    login,
    finishAuthCheck,
} from "./stores/slices/auth.slice.js";

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

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

    useEffect(() => {
        if (!user?.id) return;

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, [user?.id]);

    return <AppRoutes />;
}

export default App;