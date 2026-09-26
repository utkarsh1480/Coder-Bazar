import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";

import listingService from "../service/listing.service.js";
import favoriteService from "../service/favorite.service.js";
import conversationService from "../service/conversation.service.js";

import {
    Button,
    Loader,
    ErrorMessage,
    Modal,
} from "../components/index.js";

import { getTestListingImages } from "../utils/testListingImages.js";

const ListingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [favourite, setFavourite] = useState(false);
    const [favouriteLoading, setFavouriteLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const { user } = useSelector((state) => state.auth);

    const sellerId =
        listing?.seller?.id ||
        listing?.sellerId;

    const userId = user?.user?.id;

    const isOwner =
        sellerId &&
        userId &&
        sellerId === userId;

    const images = useMemo(() => {
        if (!listing) return [];

        const sources = [];

        if (Array.isArray(listing.images)) {
            listing.images.forEach((image) => {
                if (typeof image === "string") {
                    sources.push(image);
                } else if (image?.url) {
                    sources.push(image.url);
                } else if (image?.imageUrl) {
                    sources.push(image.imageUrl);
                }
            });
        }

        if (Array.isArray(listing.imageUrls)) {
            listing.imageUrls.forEach((image) => {
                if (typeof image === "string") {
                    sources.push(image);
                }
            });
        }

        if (listing.imageUrl) {
            sources.unshift(listing.imageUrl);
        }

        const realImages = [...new Set(sources)];

        if (realImages.length > 1) {
            return realImages;
        }

        return getTestListingImages();
    }, [listing]);

    useEffect(() => {
        setActiveImage(0);
    }, [listing?.id]);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setActiveImage((current) => {
                return (current + 1) % images.length;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [images.length]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await listingService.getListingById(id);

                setListing(
                    response?.data?.listing || null
                );
            } catch (error) {
                setListing(null);

                setError(
                    error.response?.data?.message ||
                    "Failed to load listing"
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id]);

    useEffect(() => {
        const checkFavourite = async () => {
            try {
                const response =
                    await favoriteService.getMyFavourites();

                const favourites =
                    response?.data?.favourite ||
                    response?.data?.favourites ||
                    [];

                const alreadyFavourite =
                    favourites.some(
                        (item) => item.listingId === id
                    );

                setFavourite(alreadyFavourite);
            } catch {
                setFavourite(false);
            }
        };

        if (id) {
            checkFavourite();
        }
    }, [id]);

    const handleFavorite = async () => {
        if (favouriteLoading) return;

        if (favourite) {
            showToast(
                "This listing is already in your favourites.",
                "info"
            );
            return;
        }

        try {
            setFavouriteLoading(true);

            await favoriteService.addFavourite(
                listing.id
            );

            setFavourite(true);

            showToast(
                "Added to your favourites.",
                "success"
            );
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Failed to add favourite.",
                "error"
            );
        } finally {
            setFavouriteLoading(false);
        }
    };

    const handleMessageSeller = async () => {
        if (messageLoading) return;

        try {
            setMessageLoading(true);
            
            const response =
                await conversationService.createConversation(
                    listing.id
                );

            const conversationId =
                response?.data?.conversation?.id;

            if (conversationId) {
                navigate(
                    `/messages/${conversationId}`
                );
                return;
            }

            navigate("/messages");
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Unable to start the conversation.",
                "error"
            );
        } finally {
            setMessageLoading(false);
        }
    };

    const handleDeleteListing = async () => {
        if (!listing?.id || deleting) return;

        try {
            setDeleting(true);

            await listingService.deleteListing(
                listing.id
            );

            showToast(
                "Listing deleted successfully.",
                "success"
            );

            navigate("/listings");
        } catch (error) {
            const status = error?.response?.status;

            const message =
                error?.response?.data?.message;

            if (status === 401) {
                showToast(
                    "Please login again.",
                    "warning"
                );
                return;
            }

            if (status === 403) {
                showToast(
                    message ||
                    "You are not authorized to delete this listing.",
                    "error"
                );
                return;
            }

            if (status === 404) {
                showToast(
                    "Listing not found.",
                    "info"
                );
                return;
            }

            showToast(
                message ||
                "Unable to delete listing.",
                "error"
            );
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    const handlePreviousImage = () => {
        if (images.length <= 1) return;

        setActiveImage((current) => {
            return current === 0
                ? images.length - 1
                : current - 1;
        });
    };

    const handleNextImage = () => {
        if (images.length <= 1) return;

        setActiveImage((current) => {
            return (current + 1) % images.length;
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: listing.title,
            text: `Check out ${listing.title} on Ecoloom.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(
                window.location.href
            );

            showToast(
                "Listing link copied.",
                "success"
            );
        } catch {
            showToast(
                "Unable to share this listing.",
                "error"
            );
        }
    };

    if (loading) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center">
                    <Loader text="Loading listing..." />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <ErrorMessage message={error} />
                </div>
            </section>
        );
    }

    if (!listing) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-5 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6B6B63]">
                        Marketplace
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#151515] sm:text-4xl">
                        Listing not found
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-6 text-[#6B6B63]">
                        The listing you are looking for may have
                        been removed or is no longer available.
                    </p>

                    <Link
                        to="/listings"
                        className="mt-7 inline-flex rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#292929] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                    >
                        Back to listings
                    </Link>
                </div>
            </section>
        );
    }

    const currentImage = images[activeImage];

    return (
        <section className="min-h-screen bg-[#F7F6F2] px-5 py-10 sm:px-6 sm:py-14 md:py-20">
            <div className="mx-auto max-w-7xl">
                <Link
                    to="/listings"
                    className="group mb-8 inline-flex items-center gap-2 text-sm text-[#6B6B63] transition duration-300 hover:text-[#151515] sm:mb-10"
                >
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>

                    Back to listings
                </Link>

                <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
                    <div>
                        <div className="flex gap-4">
                            {images.length > 1 && (
                                <div className="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
                                    {images
                                        .slice(0, 6)
                                        .map((image, index) => (
                                            <button
                                                key={`${image}-${index}`}
                                                type="button"
                                                onClick={() =>
                                                    setActiveImage(index)
                                                }
                                                className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ${
                                                    activeImage === index
                                                        ? "border-[#151515] opacity-100 shadow-sm"
                                                        : "border-transparent opacity-60 hover:scale-[1.02] hover:opacity-100"
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${listing.title} ${index + 1}`}
                                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                                />
                                            </button>
                                        ))}

                                    {images.length > 6 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveImage(6)
                                            }
                                            className="flex aspect-square items-center justify-center rounded-2xl border border-black/10 bg-white text-xs font-medium text-[#151515] transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm"
                                        >
                                            +{images.length - 6}
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-[#EDECE7] shadow-[0_25px_70px_rgba(0,0,0,0.06)] sm:rounded-[2rem]">
                                    <div className="aspect-[4/5] sm:aspect-[4/3]">
                                        {currentImage ? (
                                            <img
                                                key={currentImage}
                                                src={currentImage}
                                                alt={listing.title}
                                                className="h-full w-full object-cover transition-all duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center px-5 text-center text-sm text-[#6B6B63]">
                                                No image available
                                            </div>
                                        )}
                                    </div>

                                    {images.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handlePreviousImage}
                                                aria-label="Previous image"
                                                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/90 text-lg text-[#151515] shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95"
                                            >
                                                ←
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleNextImage}
                                                aria-label="Next image"
                                                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/90 text-lg text-[#151515] shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95"
                                            >
                                                →
                                            </button>
                                        </>
                                    )}

                                    <div className="absolute right-4 top-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleShare}
                                            aria-label="Share listing"
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/90 text-lg text-[#151515] shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95"
                                        >
                                            ↗
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleFavorite}
                                            disabled={favouriteLoading}
                                            aria-label={
                                                favourite
                                                    ? "Listing already saved"
                                                    : "Add listing to favorites"
                                            }
                                            className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md shadow-sm transition-all duration-300 ${
                                                favourite
                                                    ? "border-[#8B9A72]/30 bg-[#F4F6EF] text-[#596444]"
                                                    : "border-black/5 bg-white/90 text-[#151515] hover:scale-105 hover:bg-white"
                                            } disabled:cursor-not-allowed disabled:opacity-60`}
                                        >
                                            <span
                                                className={`text-xl transition-transform duration-300 ${
                                                    favourite
                                                        ? "scale-110"
                                                        : "scale-100"
                                                }`}
                                            >
                                                {favourite ? "♥" : "♡"}
                                            </span>
                                        </button>
                                    </div>

                                    {images.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
                                            {images
                                                .slice(0, 6)
                                                .map((_, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveImage(
                                                                index
                                                            )
                                                        }
                                                        aria-label={`View image ${index + 1}`}
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                                            activeImage === index
                                                                ? "w-5 bg-white"
                                                                : "w-1.5 bg-white/50"
                                                        }`}
                                                    />
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {images.length > 1 && (
                                    <div className="mt-4 flex gap-3 overflow-x-auto pb-1 sm:hidden">
                                        {images
                                            .slice(0, 6)
                                            .map((image, index) => (
                                                <button
                                                    key={`${image}-${index}`}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveImage(index)
                                                    }
                                                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                                                        activeImage === index
                                                            ? "border-[#151515] opacity-100"
                                                            : "border-transparent opacity-60"
                                                    }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${listing.title} ${index + 1}`}
                                                        className="h-full w-full object-cover transition duration-500"
                                                    />
                                                </button>
                                            ))}
                                    </div>
                                )}

                                <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#6B6B63]">
                                    <span>
                                        {listing.category?.name ||
                                            "Category"}
                                    </span>

                                    <span>
                                        {activeImage + 1} /{" "}
                                        {Math.max(images.length, 1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-8 xl:p-10">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8B9A72] sm:text-sm">
                                {listing.category?.name ||
                                    "Marketplace"}
                            </p>

                            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#151515] sm:text-5xl">
                                {listing.title}
                            </h1>

                            <p className="mt-7 text-3xl font-semibold tracking-[-0.03em] text-[#151515] sm:text-4xl">
                                ₹{listing.price}
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm text-[#6B6B63]">
                                <span className="text-base">
                                    ⌖
                                </span>

                                <span>{listing.city}</span>
                            </div>

                            <div className="my-8 h-px bg-black/10 sm:my-10" />

                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63]">
                                    Description
                                </p>

                                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B6B63] sm:text-base">
                                    {listing.description}
                                </p>
                            </div>

                            {!isOwner && (
                                <div className="mt-9 grid gap-3">
                                    <Button
                                        type="button"
                                        onClick={
                                            handleMessageSeller
                                        }
                                        loading={messageLoading}
                                        disabled={
                                            messageLoading ||
                                            favouriteLoading
                                        }
                                        className="w-full rounded-full bg-[#151515] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292929] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] active:translate-y-0"
                                    >
                                        Message Seller
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={handleFavorite}
                                        loading={
                                            favouriteLoading
                                        }
                                        disabled={
                                            favouriteLoading ||
                                            messageLoading
                                        }
                                        className={`w-full rounded-full border px-7 py-4 text-sm font-medium transition-all duration-300 active:scale-[0.98] ${
                                            favourite
                                                ? "border-[#8B9A72]/30 bg-[#F4F6EF] text-[#596444]"
                                                : "border-black/10 bg-[#F7F6F2] text-[#151515] hover:border-black/20 hover:bg-[#EDECE7]"
                                        }`}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <span
                                                className={
                                                    favourite
                                                        ? "text-[#596444]"
                                                        : "text-[#151515]"
                                                }
                                            >
                                                {favourite
                                                    ? "♥"
                                                    : "♡"}
                                            </span>

                                            {favourite
                                                ? "Favorited"
                                                : "Favorite"}
                                        </span>
                                    </Button>
                                </div>
                            )}

                            {isOwner && (
                                <div className="mt-9 border-t border-black/10 pt-7">
                                    <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63]">
                                        Your listing
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-[#6B6B63]">
                                        Manage this listing from
                                        the actions below.
                                    </p>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/edit/listing/${listing.id}`
                                                )
                                            }
                                            className="w-full rounded-full border border-black/10 bg-[#F7F6F2] px-6 py-3.5 text-sm font-medium text-[#151515] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EDECE7] sm:w-auto"
                                        >
                                            Edit Listing
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setDeleteModalOpen(
                                                    true
                                                )
                                            }
                                            className="w-full rounded-full bg-[#151515] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292929] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] sm:w-auto"
                                        >
                                            Delete Listing
                                        </Button>
                                    </div>

                                    <Modal
                                        isOpen={
                                            deleteModalOpen
                                        }
                                        onClose={() => {
                                            if (!deleting) {
                                                setDeleteModalOpen(
                                                    false
                                                );
                                            }
                                        }}
                                        title="Delete listing?"
                                    >
                                        <p className="text-sm leading-6 text-[#6B6B63]">
                                            This action cannot be
                                            undone. Your listing
                                            will be permanently
                                            removed from Ecoloom.
                                        </p>

                                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteModalOpen(
                                                        false
                                                    )
                                                }
                                                disabled={deleting}
                                                className="w-full rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#151515] transition hover:bg-[#F7F6F2] sm:w-auto"
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={
                                                    handleDeleteListing
                                                }
                                                loading={deleting}
                                                disabled={deleting}
                                                className="w-full rounded-xl bg-[#151515] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#292929] sm:w-auto"
                                            >
                                                Delete Listing
                                            </Button>
                                        </div>
                                    </Modal>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section className="mt-12 rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:mt-16 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E8E9E1] text-lg font-semibold text-[#151515]">
                                {listing.seller?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "S"}
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8A82]">
                                    Listed by
                                </p>

                                <h3 className="mt-1 text-lg font-medium tracking-[-0.02em] text-[#151515]">
                                    {listing.seller?.name ||
                                        "Ecoloom Seller"}
                                </h3>

                                <p className="mt-1 text-sm text-[#6B6B63]">
                                    {listing.city || "India"}
                                </p>
                            </div>
                        </div>

                        {!isOwner && (
                            <button
                                type="button"
                                onClick={
                                    handleMessageSeller
                                }
                                disabled={messageLoading}
                                className="w-full rounded-full border border-black/10 px-5 py-3.5 text-sm font-medium text-[#151515] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-[#F7F6F2] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {messageLoading
                                    ? "Opening..."
                                    : "Contact seller"}
                            </button>
                        )}
                    </div>

                    <div className="mt-8 grid gap-6 border-t border-black/[0.06] pt-7 sm:grid-cols-3">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8A82]">
                                Seller
                            </p>

                            <p className="mt-2 text-sm text-[#151515]">
                                Ecoloom member
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8A82]">
                                Location
                            </p>

                            <p className="mt-2 text-sm text-[#151515]">
                                {listing.city || "India"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8A82]">
                                Marketplace
                            </p>

                            <p className="mt-2 text-sm text-[#151515]">
                                Ecoloom
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-9 border-t border-black/10 pt-6">
                    <div className="flex flex-col gap-3 text-xs text-[#6B6B63] sm:flex-row sm:justify-between">
                        <span>
                            Buy from someone nearby
                        </span>

                        <span>
                            Give good things another life.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListingDetails;