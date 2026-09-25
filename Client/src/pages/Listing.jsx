import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import listingService from "../service/listing.service.js";
import categoryService from "../service/category.service.js";
import { useToast } from "../context/ToastContext.jsx";
import {
  Input,
  Select,
  Button,
  Loader,
  ErrorMessage,
} from "../components/index.js";
import ListingCard from "../components/listing/ListingCard";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || ""
  );
  const [city, setCity] = useState(
    searchParams.get("city") || ""
  );
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [sort, setSort] = useState(
    searchParams.get("sort") || "latest"
  );

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [error, setError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {showToast} = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        const params = Object.fromEntries(searchParams.entries());

        let response;

        if (Object.keys(params).length === 0) {
          response = await listingService.getAllListings();
        } else {
          response = await listingService.filterListings(params);
        }

        setListings(
          response?.data?.listing ||
            response?.data?.listings ||
            []
        );
      } catch (error) {
        setListings([]);
        setError(
          error.response?.data?.message ||
            "Failed to load listings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

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

  const handleFilter = (event) => {
    event.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (categoryId) {
      params.categoryId = categoryId;
    }

    if (city.trim()) {
      params.city = city.trim();
    }

    if (minPrice) {
      params.minPrice = minPrice;
    }

    if (maxPrice) {
      params.maxPrice = maxPrice;
    }

    if (sort) {
      params.sort = sort;
    }

    setSearchParams(params);
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setSort("latest");
    setSearchParams({});
    setFiltersOpen(false);
  };

  const filterContent = (
    <>
      <div className="border-b border-black/10 pb-6">
        <h3 className="mb-4 text-sm font-medium text-[#151515]">
          Category
        </h3>

        {categoriesLoading ? (
          <Loader text="Loading categories..." />
        ) : categoriesError ? (
          <p className="text-sm leading-6 text-[#6B6B63]">
            {categoriesError}
          </p>
        ) : categories.length === 0 ? (
          <p className="text-sm leading-6 text-[#6B6B63]">
            No categories available.
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-[#6B6B63] transition hover:text-[#151515]"
              >
                <input
                  type="checkbox"
                  checked={categoryId === category.id}
                  onChange={() =>
                    setCategoryId(
                      categoryId === category.id
                        ? ""
                        : category.id
                    )
                  }
                  className="h-4 w-4 rounded border-black/20 accent-[#151515]"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-black/10 py-6">
        <h3 className="mb-4 text-sm font-medium text-[#151515]">
          City
        </h3>

        <Input
          name="city"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Enter city"
          className="w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="border-b border-black/10 py-6">
        <h3 className="mb-4 text-sm font-medium text-[#151515]">
          Price range
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Input
            name="minPrice"
            type="number"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(event.target.value)
            }
            placeholder="Min"
            className="w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-3 py-3 text-sm outline-none"
          />

          <Input
            name="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
            placeholder="Max"
            className="w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-3 py-3 text-sm outline-none"
          />
        </div>
      </div>

      <div className="py-6">
        <h3 className="mb-4 text-sm font-medium text-[#151515]">
          Sort by
        </h3>

        <Select
          name="sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          options={[
            {
              value: "latest",
              label: "Latest",
            },
            {
              value: "oldest",
              label: "Oldest",
            },
            {
              value: "price_asc",
              label: "Price: Low to High",
            },
            {
              value: "price_desc",
              label: "Price: High to Low",
            },
          ]}
          className="w-full rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none"
        />
      </div>
    </>
  );

  return (
    <section className="min-h-screen bg-[#F7F6F2] px-5 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl sm:mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B6B63] sm:text-sm">
            Marketplace
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-[#151515] sm:text-5xl md:text-6xl">
            Find something
            <br className="hidden sm:block" />
            worth keeping.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[#6B6B63] sm:text-base sm:leading-7">
            Explore products from people around you and discover
            things that deserve a second life.
          </p>
        </div>

        <form onSubmit={handleFilter}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <Input
              name="search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search for something..."
              className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-6 py-4 text-sm outline-none transition focus:border-black/30"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full rounded-full bg-[#151515] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#333] sm:w-auto"
            >
              Search
            </Button>
          </div>

          <div className="mb-8 flex items-center justify-between lg:hidden">
            <p className="text-sm text-[#6B6B63]">
              {listings.length} listings
            </p>

            <Button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-[#151515]"
            >
              Filters
            </Button>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="mb-6 hidden items-center justify-between lg:flex">
                <p className="text-sm text-[#6B6B63]">
                  {listings.length} listings
                </p>

                <p className="text-xs uppercase tracking-[0.16em] text-[#6B6B63]">
                  Curated marketplace
                </p>
              </div>

              {loading && (
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-black/10 bg-white px-6">
                  <Loader text="Loading listings..." />
                </div>
              )}

              {!loading && error && (
                <div className="rounded-3xl border border-black/10 bg-white">
                  <ErrorMessage message={error} />
                </div>
              )}

              {!loading &&
                !error &&
                listings.length === 0 && (
                  <div className="rounded-3xl border border-black/10 bg-white px-6 py-20 text-center sm:px-10">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63]">
                      Nothing here yet
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-[#151515] sm:text-3xl">
                      No listings found
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B6B63]">
                      Try changing your search or filters to
                      discover something else.
                    </p>

                    <Button
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-7 rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333]"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}

              {!loading &&
                !error &&
                listings.length > 0 && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                      />
                    ))}
                  </div>
                )}
            </div>

            <aside className="hidden h-fit rounded-[1.5rem] border border-black/10 bg-white p-6 lg:block">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#6B6B63]">
                    Refine
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-[#151515]">
                    Filters
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-[#6B6B63] underline underline-offset-4 transition hover:text-[#151515]"
                >
                  Clear
                </button>
              </div>

              {filterContent}

              <Button
                type="submit"
                loading={loading}
                className="w-full rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333]"
              >
                Apply Filters
              </Button>
            </aside>
          </div>
        </form>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-[2rem] bg-[#F7F6F2] p-6 shadow-2xl sm:p-8">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#6B6B63]">
                    Refine
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-[#151515]">
                    Filters
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xl text-[#151515]"
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>

              {filterContent}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#151515]"
                >
                  Clear
                </Button>

                <Button
                  type="button"
                  loading={loading}
                  onClick={() => {
                    const params = {};

                    if (search.trim()) {
                      params.search = search.trim();
                    }

                    if (categoryId) {
                      params.categoryId = categoryId;
                    }

                    if (city.trim()) {
                      params.city = city.trim();
                    }

                    if (minPrice) {
                      params.minPrice = minPrice;
                    }

                    if (maxPrice) {
                      params.maxPrice = maxPrice;
                    }

                    if (sort) {
                      params.sort = sort;
                    }

                    setSearchParams(params);
                    setFiltersOpen(false);
                  }}
                  className="flex-1 rounded-full bg-[#151515] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333]"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Listings;