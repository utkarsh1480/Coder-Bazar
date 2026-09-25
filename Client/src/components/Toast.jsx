import { useEffect } from "react";

const Toast = ({ type = "success", message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3500);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: {
            container: "border-[#8B9A72]/20 bg-[#F4F6EF]",
            icon: "bg-[#8B9A72] text-white",
            title: "Success",
        },
        error: {
            container: "border-red-200 bg-red-50",
            icon: "bg-red-500 text-white",
            title: "Error",
        },
        warning: {
            container: "border-amber-200 bg-amber-50",
            icon: "bg-amber-500 text-white",
            title: "Warning",
        },
        info: {
            container: "border-black/10 bg-white",
            icon: "bg-[#151515] text-white",
            title: "Notice",
        },
    };

    const currentStyle = styles[type] || styles.success;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] ${currentStyle.container}`}
        >
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${currentStyle.icon}`}
            >
                {type === "success" && "✓"}
                {type === "error" && "!"}
                {type === "warning" && "!"}
                {type === "info" && "i"}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#151515]">
                    {currentStyle.title}
                </p>

                <p className="mt-1 text-sm leading-5 text-[#6B6B63]">
                    {message}
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="shrink-0 text-lg leading-none text-[#8A8A82] transition hover:text-[#151515]"
            >
                ×
            </button>
        </div>
    );
};

export default Toast;