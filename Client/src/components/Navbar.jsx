import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import authService from "../service/auth.service.js";
import { logout } from "../stores/slices/auth.slice.js";

const navBar = [
    { name: "Explore", path: "/listings" },
    { name: "Favorites", path: "/favorites" },
    { name: "Messages", path: "/messages" },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await authService.logout();
        } catch (error) {
        } finally {
            dispatch(logout());
            closeMenu();
            setLoggingOut(false);

            navigate("/", {
                replace: true,
            });
        }
    };

    return (
        <nav className="border-b border-black/10 bg-[#F7F6F2]">
            <div className="mx-auto max-w-7xl px-5 sm:px-6">
                <div className="flex min-h-[76px] items-center justify-between">
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[#151515]"
                    >
                        Ecoloom
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {navBar.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative py-2 text-sm transition ${
                                    isActive(item.path)
                                        ? "text-[#151515]"
                                        : "text-[#6B6B63] hover:text-[#151515]"
                                }`}
                            >
                                {item.name}

                                {isActive(item.path) && (
                                    <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-5 bg-[#151515]" />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-5 md:flex">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`text-sm transition ${
                                        isActive("/profile")
                                            ? "text-[#151515]"
                                            : "text-[#6B6B63] hover:text-[#151515]"
                                    }`}
                                >
                                    Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="text-sm text-[#6B6B63] transition hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loggingOut
                                        ? "Logging out..."
                                        : "Logout"}
                                </button>

                                <Link
                                    to="/create-listing"
                                    className="rounded-full bg-[#151515] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
                                >
                                    Sell
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm text-[#151515] transition hover:text-[#6B6B63]"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="text-sm text-[#6B6B63] transition hover:text-[#151515]"
                                >
                                    Sign Up
                                </Link>

                                <Link
                                    to="/create-listing"
                                    className="rounded-full bg-[#151515] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
                                >
                                    Sell
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(
                                (previous) => !previous
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#151515] transition hover:border-black/20 md:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <span className="text-xl leading-none">
                                ×
                            </span>
                        ) : (
                            <span className="text-lg leading-none">
                                ☰
                            </span>
                        )}
                    </button>
                </div>

                {menuOpen && (
                    <div className="border-t border-black/10 py-5 md:hidden">
                        <div className="flex flex-col">
                            {navBar.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={`border-b border-black/5 py-4 text-sm transition ${
                                        isActive(item.path)
                                            ? "font-medium text-[#151515]"
                                            : "text-[#6B6B63] hover:text-[#151515]"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={closeMenu}
                                        className={`border-b border-black/5 py-4 text-sm ${
                                            isActive("/profile")
                                                ? "font-medium text-[#151515]"
                                                : "text-[#6B6B63]"
                                        }`}
                                    >
                                        Profile
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="border-b border-black/5 py-4 text-left text-sm text-[#6B6B63] transition hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loggingOut
                                            ? "Logging out..."
                                            : "Logout"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className="border-b border-black/5 py-4 text-sm text-[#151515]"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMenu}
                                        className="border-b border-black/5 py-4 text-sm text-[#6B6B63]"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            <Link
                                to="/create-listing"
                                onClick={closeMenu}
                                className="mt-5 rounded-full bg-[#151515] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#333]"
                            >
                                Sell an item
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;