import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../context/ToastContext.jsx";

import listingService from "../service/listing.service.js";
import categoryService from "../service/category.service.js";

import {
    Input,
    Select,
    Textarea,
    Button,
    Loader,
    ErrorMessage,
} from "../components/index.js";

const editListingSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must be less than 2000 characters"),

    price: z.coerce
        .number()
        .min(0, "Price cannot be negative"),

    city: z
        .string()
        .min(2, "City is required"),

    categoryId: z
        .string()
        .min(1, "Please select a category"),
});

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {showToast} = useToast();

    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pageError, setPageError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm({
        resolver: zodResolver(editListingSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            city: "",
            categoryId: "",
        },
    });

    useEffect(() => {
        const loadListing = async () => {
            if (!id) {
                setPageError("Invalid listing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setPageError("");

            try {
                const response = await listingService.getListingById(id);

                const listing =
                    response?.data?.listing ||
                    response?.listing;

                if (!listing) {
                    showToast("Listing not found", "info")
                    throw new Error("Listing not found.");
                }

                reset({
                    title: listing.title || "",
                    description: listing.description || "",
                    price: listing.price ?? "",
                    city: listing.city || "",
                    categoryId:
                        listing.categoryId ||
                        listing.category?.id ||
                        "",
                });
            } catch (error) {
                showToast( error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load listing.","error")
                setPageError(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load listing."
                );
            } finally {
                setLoading(false);
            }
        };

        loadListing();
    }, [id, reset]);

    useEffect(() => {
        const loadCategories = async () => {
            setCategoriesLoading(true);
            setCategoryError("");

            try {
                const response = await categoryService.getAllCategory();

                const categoryData =
                    response?.data?.categories ||
                    response?.data?.category ||
                    response?.categories ||
                    response?.category ||
                    [];

                if (!Array.isArray(categoryData)) {
                    throw new Error("Unable to load categories.");
                }

                setCategories(categoryData);
            } catch (error) {
                showToast(error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load categories.", "error")
                setCategories([]);
                setCategoryError(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Unable to load categories."
                );
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    const onSubmit = async (data) => {
        if (!id) {
            setSaveError("Invalid listing.");
            return;
        }

        if (categoriesLoading || categories.length === 0) {
            setSaveError("Please wait until categories are available.");
            return;
        }

        setSaving(true);
        setSaveError("");

        try {
            const payload = {
                title: data.title.trim(),
                description: data.description.trim(),
                price: Number(data.price),
                city: data.city.trim(),
                categoryId: data.categoryId,
            };

            await listingService.updateListing(id, payload);
            showToast("Listing update successfully")

            navigate(`/listings/${id}`);
        } catch (error) {
            showToast(error?.response?.data?.message ||
                        "You are not authorized to update this listing.", "error")
            if (error?.response?.status === 403) {
                setSaveError(
                    error?.response?.data?.message ||
                        "You are not authorized to update this listing."
                );
                return;
            }

            if (error?.response?.status === 401) {
                setSaveError("Please login again.");
                return;
            }

            setSaveError(
                error?.response?.data?.message ||
                    "Unable to update listing."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center">
                    <Loader text="Loading listing..." />
                </div>
            </section>
        );
    }

    if (pageError) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto max-w-3xl">
                    <ErrorMessage message={pageError} />

                    <div className="mt-6 flex justify-center">
                        <Button
                            type="button"
                            onClick={() => navigate("/listings")}
                            className="rounded-full bg-[#151515] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#333]"
                        >
                            Back to listings
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#F7F6F2] px-5 py-12 sm:px-6 sm:py-16 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 xl:gap-28">
                    <div className="lg:pt-8">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#6B6B63] sm:text-sm">
                            Your listing
                        </p>

                        <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight text-[#151515] sm:text-6xl md:text-7xl">
                            Edit
                            <br />
                            listing.
                        </h1>

                        <p className="mt-6 max-w-md text-sm leading-6 text-[#6B6B63] sm:mt-8 sm:text-base sm:leading-7">
                            Update the details of your listing
                            before saving your changes.
                        </p>

                        <div className="mt-10 border-t border-black/10 pt-6 sm:mt-14">
                            <p className="text-sm font-medium text-[#151515]">
                                Keep it accurate.
                            </p>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-[#6B6B63]">
                                Clear information helps buyers
                                understand exactly what you're offering.
                            </p>
                        </div>

                        <div className="mt-8 hidden border-t border-black/10 pt-6 lg:block">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-2xl font-semibold text-[#151515]">
                                        01
                                    </p>
                                    <p className="mt-1 text-xs text-[#6B6B63]">
                                        Review
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-semibold text-[#151515]">
                                        02
                                    </p>
                                    <p className="mt-1 text-xs text-[#6B6B63]">
                                        Update
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-semibold text-[#151515]">
                                        03
                                    </p>
                                    <p className="mt-1 text-xs text-[#6B6B63]">
                                        Save
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8 md:p-10">
                            <div className="mb-8 border-b border-black/10 pb-6 sm:mb-9 sm:pb-7">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B63]">
                                            Update
                                        </p>

                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl">
                                            Listing details
                                        </h2>
                                    </div>

                                    <span className="hidden text-xs text-[#8A8A82] sm:block">
                                        Edit mode
                                    </span>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <Input
                                    label="Title"
                                    type="text"
                                    placeholder="What are you selling?"
                                    {...register("title")}
                                    error={errors.title?.message}
                                    className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white"
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Describe your item..."
                                    rows={7}
                                    {...register("description")}
                                    error={errors.description?.message}
                                    className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm leading-6 text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white"
                                />

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Input
                                        label="Price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter price"
                                        {...register("price")}
                                        error={errors.price?.message}
                                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white"
                                    />

                                    <Input
                                        label="City"
                                        type="text"
                                        placeholder="Your city"
                                        {...register("city")}
                                        error={errors.city?.message}
                                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition placeholder:text-[#9A9A91] focus:border-[#151515] focus:bg-white"
                                    />
                                </div>

                                {categoryError ? (
                                    <ErrorMessage message={categoryError} />
                                ) : categoriesLoading ? (
                                    <div className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-5">
                                        <Loader
                                            size="sm"
                                            text="Loading categories..."
                                        />
                                    </div>
                                ) : categories.length === 0 ? (
                                    <ErrorMessage message="No categories are available right now." />
                                ) : (
                                    <Select
                                        label="Category"
                                        options={categoryOptions}
                                        {...register("categoryId")}
                                        error={errors.categoryId?.message}
                                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition focus:border-[#151515] focus:bg-white"
                                    />
                                )}

                                {saveError && (
                                    <ErrorMessage message={saveError} />
                                )}

                                <div className="border-t border-black/10 pt-6">
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/listings/${id}`)
                                            }
                                            disabled={saving}
                                            className="w-full rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-medium text-[#151515] transition hover:bg-[#F7F6F2] sm:w-auto"
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type="submit"
                                            loading={saving}
                                            disabled={
                                                saving ||
                                                categoriesLoading ||
                                                categories.length === 0
                                            }
                                            className="w-full rounded-full bg-[#151515] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] sm:w-auto"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>

                                    <p className="mt-4 text-center text-xs leading-5 text-[#8A8A82]">
                                        Your changes will be visible
                                        immediately after saving.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditListing;