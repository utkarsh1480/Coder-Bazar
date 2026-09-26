import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";

import {
    Input,
    ErrorMessage,
    Loader,
    Button,
} from "../components/index.js";

import userService from "../service/user.service.js";

const Profile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        city: "",
        phone: "",
    });

    const { user: authUser } = useSelector(
        (state) => state.auth
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const {showToast} = useToast();

    const id = authUser?.id;

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const response =
                    await userService.getMe(id);

                const user =
                    response?.data?.user ||
                    response?.user;

                if (!user) {
                    showToast("Unable to load profile", "info")
                    throw new Error(
                        "Unable to load profile."
                    );
                }
                setProfile({
                    name: user.name || "",
                    email: user.email || "",
                    city: user.city || "",
                    phone: user.phone || "",
                });
            } catch (error) {
                showToast("Profile loading error", "error")
                console.error(
                    "Profile loading error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [authUser, id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previousProfile) => ({
            ...previousProfile,
            [name]: value,
        }));

        setSuccess("");

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response =
                await userService.updateProfile(profile);

            const updatedUser =
                response?.data?.user ||
                response?.user;

            if (updatedUser) {
                showToast("Profile Update successfully")
                setProfile({
                    name: updatedUser.name || "",
                    email: updatedUser.email || "",
                    phone: updatedUser.phone || "",
                    city: updatedUser.city || "",
                });
            }

            setSuccess(
                "Profile updated successfully."
            );
        } catch (err) {
            showToast("Profile update error", "error")
            console.error(
                "Profile update error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center">
                    <Loader text="Loading profile..." />
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#F7F6F2] px-5 py-12 sm:px-6 sm:py-16 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B63] sm:text-sm">
                        Account
                    </p>

                    <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tight text-[#151515] sm:text-6xl md:text-7xl">
                        Your profile.
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-6 text-[#6B6B63] sm:text-base sm:leading-7">
                        Manage your personal information and
                        keep your Ecoloom account up to date.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-8">
                    <div className="relative min-h-[440px] overflow-hidden rounded-[1.75rem] bg-[#3F4635] p-7 text-white sm:rounded-[2rem] sm:p-10 lg:min-h-[560px]">
                        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />

                        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10" />

                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-medium ring-1 ring-white/10 sm:h-24 sm:w-24 sm:text-3xl">
                            {(
                                profile.name ||
                                profile.email ||
                                "U"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="relative mt-8">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                                Ecoloom member
                            </p>

                            <h2 className="mt-3 break-words text-3xl font-medium tracking-tight sm:text-4xl">
                                {profile.name ||
                                    "Your Name"}
                            </h2>

                            <p className="mt-3 break-all text-sm leading-6 text-white/60">
                                {profile.email ||
                                    "No email available"}
                            </p>
                        </div>

                        {profile.city && (
                            <div className="relative mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white/80">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                                    •
                                </span>

                                {profile.city}
                            </div>
                        )}

                        <div className="absolute bottom-7 left-7 right-7 border-t border-white/10 pt-6 sm:bottom-10 sm:left-10 sm:right-10">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                                        Community
                                    </p>

                                    <p className="mt-2 text-sm text-white/70">
                                        Part of the Ecoloom marketplace
                                    </p>
                                </div>

                                <span className="text-3xl font-light text-white/20">
                                    01
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8 md:p-10">
                        <div className="mb-8 border-b border-black/10 pb-6 sm:mb-9 sm:pb-7">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8B9A72]">
                                Personal details
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl">
                                Personal information
                            </h2>

                            <p className="mt-2 max-w-lg text-sm leading-6 text-[#6B6B63]">
                                Update the information associated
                                with your account.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="[&_.input-group]:flex [&_.input-group]:flex-col [&_.input-group]:gap-2 [&_.input-group>label]:text-xs [&_.input-group>label]:font-semibold [&_.input-group>label]:uppercase [&_.input-group>label]:tracking-[0.12em] [&_.input-group>label]:text-[#6B6B63] [&_.input-group>input]:w-full [&_.input-group>input]:rounded-xl [&_.input-group>input]:border [&_.input-group>input]:border-black/10 [&_.input-group>input]:bg-[#F7F6F2] [&_.input-group>input]:px-4 [&_.input-group>input]:py-3.5 [&_.input-group>input]:text-sm [&_.input-group>input]:text-[#151515] [&_.input-group>input]:outline-none [&_.input-group>input]:transition [&_.input-group>input]:placeholder:text-black/30 [&_.input-group>input]:focus:border-[#151515] [&_.input-group>input]:focus:bg-white">
                                <Input
                                    label="Name"
                                    name="name"
                                    type="text"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="[&_.input-group]:flex [&_.input-group]:flex-col [&_.input-group]:gap-2 [&_.input-group>label]:text-xs [&_.input-group>label]:font-semibold [&_.input-group>label]:uppercase [&_.input-group>label]:tracking-[0.12em] [&_.input-group>label]:text-[#6B6B63] [&_.input-group>input]:w-full [&_.input-group>input]:rounded-xl [&_.input-group>input]:border [&_.input-group>input]:border-black/10 [&_.input-group>input]:bg-[#F7F6F2] [&_.input-group>input]:px-4 [&_.input-group>input]:py-3.5 [&_.input-group>input]:text-sm [&_.input-group>input]:text-[#151515] [&_.input-group>input]:outline-none [&_.input-group>input]:transition [&_.input-group>input]:placeholder:text-black/30 [&_.input-group>input]:focus:border-[#151515] [&_.input-group>input]:focus:bg-white">
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="[&_.input-group]:flex [&_.input-group]:flex-col [&_.input-group]:gap-2 [&_.input-group>label]:text-xs [&_.input-group>label]:font-semibold [&_.input-group>label]:uppercase [&_.input-group>label]:tracking-[0.12em] [&_.input-group>label]:text-[#6B6B63] [&_.input-group>input]:w-full [&_.input-group>input]:rounded-xl [&_.input-group>input]:border [&_.input-group>input]:border-black/10 [&_.input-group>input]:bg-[#F7F6F2] [&_.input-group>input]:px-4 [&_.input-group>input]:py-3.5 [&_.input-group>input]:text-sm [&_.input-group>input]:text-[#151515] [&_.input-group>input]:outline-none [&_.input-group>input]:transition [&_.input-group>input]:placeholder:text-black/30 [&_.input-group>input]:focus:border-[#151515] [&_.input-group>input]:focus:bg-white">
                                    <Input
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        placeholder="Your phone number"
                                    />
                                </div>

                                <div className="[&_.input-group]:flex [&_.input-group]:flex-col [&_.input-group]:gap-2 [&_.input-group>label]:text-xs [&_.input-group>label]:font-semibold [&_.input-group>label]:uppercase [&_.input-group>label]:tracking-[0.12em] [&_.input-group>label]:text-[#6B6B63] [&_.input-group>input]:w-full [&_.input-group>input]:rounded-xl [&_.input-group>input]:border [&_.input-group>input]:border-black/10 [&_.input-group>input]:bg-[#F7F6F2] [&_.input-group>input]:px-4 [&_.input-group>input]:py-3.5 [&_.input-group>input]:text-sm [&_.input-group>input]:text-[#151515] [&_.input-group>input]:outline-none [&_.input-group>input]:transition [&_.input-group>input]:placeholder:text-black/30 [&_.input-group>input]:focus:border-[#151515] [&_.input-group>input]:focus:bg-white">
                                    <Input
                                        label="City"
                                        name="city"
                                        type="text"
                                        value={profile.city}
                                        onChange={handleChange}
                                        placeholder="Your city"
                                    />
                                </div>
                            </div>

                            {error && (
                                <ErrorMessage
                                    message={error}
                                />
                            )}

                            {success && (
                                <div className="rounded-xl border border-[#8B9A72]/20 bg-[#8B9A72]/10 px-4 py-3 text-sm leading-6 text-[#3F4635]">
                                    {success}
                                </div>
                            )}

                            <div className="border-t border-black/10 pt-6">
                                <Button
                                    type="submit"
                                    loading={saving}
                                    disabled={saving}
                                    className="w-full rounded-full bg-[#151515] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-50"
                                >
                                    Save Changes
                                </Button>

                                <p className="mt-4 text-center text-xs leading-5 text-[#8A8A82]">
                                    Your updated information will
                                    be saved to your Ecoloom account.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;