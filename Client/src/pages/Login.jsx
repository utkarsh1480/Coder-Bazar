import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";


import authService from "../service/auth.service.js";
import { login as loginSlice } from "../stores/slices/auth.slice.js";

import {
    Input,
    Button,
    ErrorMessage,
} from "../components/index.js";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),

    password: z
        .string()
        .min(8, "Password is required"),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [serverError, setServerError] = useState("");
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        setServerError("");

        try {
            const response = await authService.login(data);


            const user =
                response?.data?.user ||
                response?.user;


            if (!user) {
                showToast("Login succeeded, but your account information could not be loaded.");
                setServerError(
                    "Login succeeded, but your account information could not be loaded."
                );
                return;
            }
            showToast("You logied in succesfully");
            dispatch(loginSlice(user));

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            showToast("Please Enter valid crediantials", "error");
            setServerError(
                error?.response?.data?.message ||
                    "Login failed. Please check your credentials and try again."
            );
        }
    };

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#F7F6F2] px-5 py-14 sm:px-6 sm:py-20 md:py-24">
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#6B6B63] sm:text-sm">
                        Welcome back
                    </p>

                    <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight text-[#151515] sm:text-6xl md:text-7xl">
                        Good to
                        <br />
                        see you again.
                    </h1>

                    <p className="mt-6 max-w-md text-sm leading-6 text-[#6B6B63] sm:mt-8 sm:text-base sm:leading-7">
                        Sign in to continue discovering useful things,
                        connecting with sellers, and giving products
                        another life.
                    </p>

                    <div className="mt-10 hidden border-t border-black/10 pt-6 sm:mt-14 lg:block">
                        <div className="flex gap-10">
                            <div>
                                <p className="text-2xl font-semibold text-[#151515]">
                                    01
                                </p>
                                <p className="mt-1 text-xs text-[#6B6B63]">
                                    Sign in
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold text-[#151515]">
                                    02
                                </p>
                                <p className="mt-1 text-xs text-[#6B6B63]">
                                    Explore
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold text-[#151515]">
                                    03
                                </p>
                                <p className="mt-1 text-xs text-[#6B6B63]">
                                    Connect
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8 md:p-10">
                        <div className="mb-8 border-b border-black/10 pb-6 sm:mb-9 sm:pb-7">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B63]">
                                Account
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl">
                                Sign in
                            </h2>
                        </div>

                        {serverError && (
                            <div className="mb-6">
                                <ErrorMessage message={serverError} />
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={isSubmitting}
                                {...register("email")}
                                error={errors.email?.message}
                                className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={isSubmitting}
                                {...register("password")}
                                error={errors.password?.message}
                                className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    className="w-full rounded-full bg-[#151515] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 border-t border-black/10 pt-6">
                            <p className="text-center text-sm text-[#6B6B63]">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-[#151515] underline decoration-[#8B9A72] underline-offset-4 transition hover:text-[#6B6B63]"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;