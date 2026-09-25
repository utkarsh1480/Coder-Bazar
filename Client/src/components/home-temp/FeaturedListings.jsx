import { useEffect, useState } from "react";
import listingService from "../../service/listing.service.js";
import ListingCard from "../listing/ListingCard.jsx";
import {Loader, ErrorMessage} from '../index.js'
const FeaturedListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingService.getAllListings();
        console.log(response);

        setListings(response?.data?.listing || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load listings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
  <section className="px-5 py-14 sm:px-6 sm:py-16 md:py-20">
    <div className="mx-auto max-w-7xl">

      {/* Heading */}
      <div className="mb-7 flex items-end justify-between sm:mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63] sm:text-sm">
            Discover
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl md:text-4xl">
            Featured listings
          </h2>
        </div>

        {/* Desktop only */}
        {!loading && !error && listings.length > 0 && (
          <a
            href="/listings"
            className="hidden text-sm font-medium text-[#151515] transition hover:text-[#6B6B63] sm:block"
          >
            View all
          </a>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-8">
          <Loader text="Loading listings..." />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && listings.length === 0 && (
        <p className="py-4 text-sm text-[#6B6B63]">
          No listings available yet.
        </p>
      )}

      {/* Listings */}
      {!loading && !error && listings.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {listings.slice(0, 8).map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
              />
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-8 sm:hidden">
            <a
              href="/listings"
              className="block rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-medium text-[#151515] transition hover:bg-[#F7F6F2]"
            >
              View all listings
            </a>
          </div>
        </>
      )}

    </div>
  </section>
);
};

export default FeaturedListings;