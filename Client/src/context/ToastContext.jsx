import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/Toast.jsx";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        setToast({
            id: Date.now(),
            message,
            type,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                hideToast,
            }}
        >
            {children}

            {toast && (
                <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex justify-center px-4 sm:bottom-7 sm:justify-end sm:px-6">
                    <Toast
                        key={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={hideToast}
                    />
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
};