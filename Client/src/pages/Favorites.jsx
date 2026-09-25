import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

import favoriteService from "../service/favorite.service.js";

import ListingCard from "../components/listing/ListingCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const {showToast} = useToast();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await favoriteService.getMyFavourites();

                const favouriteData =
                    response?.data?.favourite ||
                    response?.data?.favourites ||
                    [];

                setFavorites(favouriteData);
            } catch (error) {
                setFavorites([]);
                setError(
                    error.response?.data?.message ||
                        "Failed to load favourites"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFavourite = async (favouriteId) => {
        if (removingId) return;

        try {
            setRemovingId(favouriteId);
            setActionError("");

            await favoriteService.removeFavourite(favouriteId);

            setFavorites((previous) =>
                previous.filter(
                    (favorite) => favorite.id !== favouriteId
                )
            
            );
            showToast("Favourite delete successfully")
        } catch (error) {
            showToast(  error.response?.data?.message ||
                    "Failed to remove favourite", "error")
            setActionError(
                error.response?.data?.message ||
                    "Failed to remove favourite"
            );
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-16 sm:px-6 md:py-24">
                <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center">
                    <Loader text="Loading favourites..." />
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-[70vh] bg-[#F7F6F2] px-5 py-12 sm:px-6 sm:py-16 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B63] sm:text-sm">
                        Saved
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-[#151515] sm:text-5xl md:text-6xl">
                        Your favourites
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-6 text-[#6B6B63] sm:text-base sm:leading-7">
                        Keep track of the things you don't want
                        to lose.
                    </p>
                </div>

                <div className="mt-10 h-px bg-black/10 sm:mt-12" />

                {error && (
                    <div className="mt-8">
                        <ErrorMessage message={error} />
                    </div>
                )}

                {actionError && !error && (
                    <div className="mt-8 rounded-2xl border border-black/10 bg-white px-5 py-4">
                        <div className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F1EEE7] text-xs font-semibold text-[#151515]">
                                !
                            </span>

                            <p className="text-sm leading-6 text-[#151515]">
                                {actionError}
                            </p>
                        </div>
                    </div>
                )}

                {favorites.length === 0 && !error && (
                    <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDECE7] text-3xl text-[#6B6B63]">
                            ♡
                        </div>

                        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl">
                            Nothing saved yet
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-6 text-[#6B6B63]">
                            When you find something you like,
                            save it here so you can come back to it.
                        </p>

                        <Link
                            to="/listings"
                            className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333] sm:w-auto"
                        >
                            Explore listings
                        </Link>
                    </div>
                )}

                {favorites.length > 0 && (
                    <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                        {favorites.map((favorite) => {
                            const listing =
                                favorite.listing || favorite;

                            const isRemoving =
                                removingId === favorite.id;

                            return (
                                <div
                                    key={favorite.id}
                                    className="group"
                                >
                                    <div
                                        className={
                                            isRemoving
                                                ? "pointer-events-none opacity-60 transition-opacity"
                                                : "transition-opacity"
                                        }
                                    >
                                        <ListingCard
                                            listing={listing}
                                        />
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B63]">
                                            Saved item
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveFavourite(
                                                    favorite.id
                                                )
                                            }
                                            disabled={isRemoving}
                                            className="text-sm text-[#6B6B63] transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isRemoving
                                                ? "Removing..."
                                                : "Remove"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Favorites;