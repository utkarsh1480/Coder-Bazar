import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
    return (
        <Link
            to={`/listings/${listing.id}`}
            className="group block overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white transition duration-300 hover:-translate-y-1 hover:border-black/[0.14] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EDECE7]">
                {listing.imageUrl ? (
                    <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#8A8A82]">
                            Ecoloom
                        </span>

                        <span className="mt-2 text-sm text-[#6B6B63]">
                            Image unavailable
                        </span>
                    </div>
                )}

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6B6B63]">
                        {listing.category?.name || "Category"}
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="Add to favorites"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg text-[#151515] backdrop-blur-sm transition hover:bg-white"
                >
                    ♡
                </button>
            </div>

            <div className="p-5 sm:p-6">
                <h3 className="line-clamp-1 text-lg font-medium tracking-[-0.02em] text-[#151515] sm:text-xl">
                    {listing.title}
                </h3>

                <div className="mt-3 flex items-baseline justify-between gap-4">
                    <p className="text-lg font-semibold tracking-[-0.02em] text-[#151515]">
                        ₹{listing.price}
                    </p>

                    <span className="text-xs text-[#8A8A82]">
                        {listing.city}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;