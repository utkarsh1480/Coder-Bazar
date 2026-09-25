import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../context/ToastContext.jsx";

import listingService from "../service/listing.service.js";
import categoryService from "../service/category.service.js";

import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";



const createListingSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),

    price: z.coerce
        .number()
        .positive("Price must be greater than 0"),

    city: z
        .string()
        .min(2, "City is required"),

    categoryId: z
        .string()
        .min(1, "Please select a category"),
});

const CreateListing = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { showToast } = useToast();

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [imageError, setImageError] = useState("");
    const [images, setImages] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            city: "",
            categoryId: "",
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                setCategoriesError("");

                const response =
                    await categoryService.getAllCategory();

                setCategories(
                    response?.data?.categories || []
                );
            } catch (error) {
                setCategories([]);
                showToast(error.response?.data?.message ||
        "Failed to load categories",
        "error");
                setCategoriesError(
                    error.response?.data?.message ||
                        "Failed to load categories"
                );
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        return () => {
            images.forEach((image) => {
                if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, [images]);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        setImageError("");

        const remainingSlots = 6 - images.length;

        if (remainingSlots <= 0) {
            setImageError("You can add a maximum of 6 photos.");
            event.target.value = "";
            return;
        }

        const validFiles = files.filter((file) =>
            [
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(file.type)
        );

        if (validFiles.length !== files.length) {
            setImageError(
                "Only JPG, PNG, and WEBP images are supported."
            );
        }

        const filesToAdd = validFiles.slice(
            0,
            remainingSlots
        );

        if (validFiles.length > remainingSlots) {
            setImageError(
                "You can add a maximum of 6 photos."
            );
        }

        const newImages = filesToAdd.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((previousImages) => [
            ...previousImages,
            ...newImages,
        ]);

        event.target.value = "";
    };

    const removeImage = (indexToRemove) => {
        setImages((previousImages) => {
            const imageToRemove =
                previousImages[indexToRemove];

            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }

            return previousImages.filter(
                (_, index) => index !== indexToRemove
            );
        });

        setImageError("");
    };

    const onSubmit = async (data) => {
        try {
            setSubmitError("");

            const response =
                await listingService.createListing(data);

            const listingId =
                response?.data?.listing?.id;

            if (listingId) {
                showToast("Listing created successfully", "success");
                navigate(`/listings/${listingId}`);
                return;
            }
            showToast("Failed to create listing")
            navigate("/listings");
        } catch (error) {
            setSubmitError(
                error.response?.data?.message ||
                    "Failed to create listing"
            );
        }
    };

    return (
        <section className="min-h-[calc(100vh-80px)] bg-[#F7F6F2] px-5 py-10 sm:px-6 sm:py-14 md:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20 xl:gap-28">
                    <div className="lg:sticky lg:top-24 lg:pt-8">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#6B6B63] sm:text-sm">
                            Sell something
                        </p>

                        <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#151515] sm:text-6xl md:text-7xl">
                            Give it
                            <br />
                            another life.
                        </h1>

                        <p className="mt-6 max-w-md text-sm leading-6 text-[#6B6B63] sm:mt-8 sm:text-base sm:leading-7">
                            Put something you no longer need
                            into the hands of someone who will.
                        </p>

                        <div className="mt-10 border-t border-black/10 pt-6 sm:mt-14">
                            <p className="text-sm font-semibold text-[#151515]">
                                Simple. Honest. Local.
                            </p>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-[#6B6B63]">
                                Add clear photos and honest details
                                so buyers know exactly what they're
                                looking at.
                            </p>
                        </div>

                        <div className="mt-8 hidden border-t border-black/10 pt-6 lg:block">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-2xl font-semibold text-[#151515]">
                                        01
                                    </p>

                                    <p className="mt-1 text-xs text-[#6B6B63]">
                                        Add details
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-semibold text-[#151515]">
                                        02
                                    </p>

                                    <p className="mt-1 text-xs text-[#6B6B63]">
                                        Add photos
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-semibold text-[#151515]">
                                        03
                                    </p>

                                    <p className="mt-1 text-xs text-[#6B6B63]">
                                        Publish
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-[2rem] border border-black/[0.06] bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.06)] sm:p-8 md:p-10 lg:rounded-[2.25rem]">
                            <div className="mb-8 border-b border-black/[0.07] pb-6 sm:mb-9 sm:pb-7">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B63]">
                                    New listing
                                </p>

                                <div className="mt-2 flex items-end justify-between gap-4">
                                    <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#151515] sm:text-3xl">
                                        Listing details
                                    </h2>

                                    <span className="hidden text-xs text-[#8A8A82] sm:block">
                                        Required fields
                                    </span>
                                </div>
                            </div>

                            {submitError && (
                                <div className="mb-6">
                                    <ErrorMessage
                                        message={submitError}
                                    />
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-9"
                            >
                                <div>
                                    <div className="mb-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-[#151515]">
                                                Photos
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#8A8A82]">
                                                Add up to 6 photos
                                            </p>
                                        </div>

                                        <span className="text-xs font-medium text-[#8A8A82]">
                                            {images.length}/6
                                        </span>
                                    </div>

                                    {imageError && (
                                        <div className="mb-4 rounded-2xl border border-amber-200/70 bg-[#FBF9F3] px-4 py-3">
                                            <p className="text-sm leading-6 text-[#6B6B63]">
                                                {imageError}
                                            </p>
                                        </div>
                                    )}

                                    {images.length > 0 && (
                                        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {images.map(
                                                (image, index) => (
                                                    <div
                                                        key={`${image.preview}-${index}`}
                                                        className="group relative aspect-square overflow-hidden rounded-2xl bg-[#EDECE7] shadow-sm"
                                                    >
                                                        <img
                                                            src={
                                                                image.preview
                                                            }
                                                            alt={`Listing preview ${
                                                                index + 1
                                                            }`}
                                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/65 text-sm text-white shadow-sm backdrop-blur-sm transition duration-300 hover:scale-105 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                                                            aria-label={`Remove image ${
                                                                index + 1
                                                            }`}
                                                        >
                                                            ×
                                                        </button>

                                                        {index === 0 && (
                                                            <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#151515] backdrop-blur-sm">
                                                                Main photo
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {images.length < 6 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                disabled={isSubmitting}
                                                className="group flex min-h-44 w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-[#F7F6F2] px-6 py-8 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-black/25 hover:bg-[#F1F0EB] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-48"
                                            >
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm transition duration-300 group-hover:scale-105">
                                                    +
                                                </div>

                                                <p className="text-sm font-semibold text-[#151515]">
                                                    Add photos
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-[#8A8A82]">
                                                    JPG · PNG · WEBP
                                                </p>
                                            </button>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                multiple
                                                onChange={
                                                    handleImageChange
                                                }
                                                disabled={
                                                    isSubmitting
                                                }
                                                className="hidden"
                                            />
                                        </>
                                    )}
                                </div>

                                <Input
                                    label="Title"
                                    placeholder="What are you selling?"
                                    {...register("title")}
                                    error={errors.title?.message}
                                    className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition-all duration-300 placeholder:text-[#9A9A91] focus:border-black/25 focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,21,21,0.04)]"
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Tell people a little about the item..."
                                    rows={6}
                                    {...register("description")}
                                    error={
                                        errors.description?.message
                                    }
                                    className="mt-2 w-full resize-none rounded-2xl border border-black/[0.08] bg-[#F7F6F2] px-4 py-3.5 text-sm leading-6 text-[#151515] outline-none transition-all duration-300 placeholder:text-[#9A9A91] focus:border-black/25 focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,21,21,0.04)]"
                                />

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Input
                                        label="Price"
                                        type="number"
                                        placeholder="₹ 0"
                                        {...register("price")}
                                        error={
                                            errors.price?.message
                                        }
                                        className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition-all duration-300 placeholder:text-[#9A9A91] focus:border-black/25 focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,21,21,0.04)]"
                                    />

                                    <Input
                                        label="City"
                                        placeholder="e.g. Delhi"
                                        {...register("city")}
                                        error={
                                            errors.city?.message
                                        }
                                        className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition-all duration-300 placeholder:text-[#9A9A91] focus:border-black/25 focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,21,21,0.04)]"
                                    />
                                </div>

                                <div>
                                    {categoriesLoading ? (
                                        <div className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-4">
                                            <Loader text="Loading categories..." />
                                        </div>
                                    ) : categoriesError ? (
                                        <div className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-4">
                                            <p className="text-sm leading-6 text-[#6B6B63]">
                                                {categoriesError}
                                            </p>
                                        </div>
                                    ) : categories.length === 0 ? (
                                        <div className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-4">
                                            <p className="text-sm leading-6 text-[#6B6B63]">
                                                No categories are
                                                available right now.
                                            </p>
                                        </div>
                                    ) : (
                                        <Select
                                            label="Category"
                                            {...register(
                                                "categoryId"
                                            )}
                                            options={categories.map(
                                                (category) => ({
                                                    value:
                                                        category.id,
                                                    label:
                                                        category.name,
                                                })
                                            )}
                                            error={
                                                errors.categoryId
                                                    ?.message
                                            }
                                            className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#F7F6F2] px-4 py-3.5 text-sm text-[#151515] outline-none transition-all duration-300 focus:border-black/25 focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,21,21,0.04)]"
                                        />
                                    )}
                                </div>

                                <div className="border-t border-black/[0.07] pt-7">
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={
                                            isSubmitting ||
                                            categoriesLoading ||
                                            !!categoriesError ||
                                            categories.length === 0
                                        }
                                        className="w-full rounded-full bg-[#151515] px-6 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292929] hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Publish listing
                                    </Button>

                                    <p className="mt-4 text-center text-xs leading-5 text-[#8A8A82]">
                                        Your listing will be visible
                                        to people nearby.
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

export default CreateListing;