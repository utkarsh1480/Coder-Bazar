import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../context/ToastContext.jsx";

import authService from "../service/auth.service.js";

import {
    Input,
    Button,
    ErrorMessage,
} from "../components/index.js";

const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters"),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Enter a valid email"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const Register = () => {
    const navigate = useNavigate();
    const {showToast} = useToast();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        setServerError("");

        try {
            const {
                confirmPassword,
                ...registerData
            } = data;

            await authService.register(registerData);
            showToast("Successfully Regististered")
            navigate("/login");
        } catch (error) {
            showToast("Registration failed. Please try again.", "info")
            setServerError(
                error?.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        }
    };

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#F7F6F2] px-5 py-14 sm:px-6 sm:py-20 md:py-24">
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#6B6B63] sm:text-sm">
                        Join Ecoloom
                    </p>

                    <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight text-[#151515] sm:text-6xl md:text-7xl">
                        Give good things
                        <br />
                        another life.
                    </h1>

                    <p className="mt-6 max-w-md text-sm leading-6 text-[#6B6B63] sm:mt-8 sm:text-base sm:leading-7">
                        Create your account and start discovering,
                        selling, and connecting with people around you.
                    </p>

                    <div className="mt-10 hidden border-t border-black/10 pt-6 sm:mt-14 lg:block">
                        <div className="flex gap-10">
                            <div>
                                <p className="text-2xl font-semibold text-[#151515]">
                                    01
                                </p>
                                <p className="mt-1 text-xs text-[#6B6B63]">
                                    Create
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold text-[#151515]">
                                    02
                                </p>
                                <p className="mt-1 text-xs text-[#6B6B63]">
                                    Discover
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
                                Create account
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
                                label="Name"
                                type="text"
                                placeholder="Your name"
                                autoComplete="name"
                                disabled={isSubmitting}
                                {...register("name")}
                                error={errors.name?.message}
                                className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

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
                                placeholder="Create a password"
                                autoComplete="new-password"
                                disabled={isSubmitting}
                                {...register("password")}
                                error={errors.password?.message}
                                className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                disabled={isSubmitting}
                                {...register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                                className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    className="w-full rounded-full bg-[#151515] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    Create Account
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 border-t border-black/10 pt-6">
                            <p className="text-center text-sm text-[#6B6B63]">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-[#151515] underline decoration-[#8B9A72] underline-offset-4 transition hover:text-[#6B6B63]"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;