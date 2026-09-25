
import React, { useState, useEffect } from 'react'
import categoryService from '../../service/category.service.js'
import {Loader, ErrorMessage} from '../index.js'


function Categories() {
    const [categories, SetCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchCategory = async () => {
            try {
                const response = await categoryService.getAllCategory();

                SetCategories(response?.data?.categories || [])

            } catch (error) {
                setError(error.response?.data?.message ||
                    "Failed to load categories")
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [])

    if (loading) {
        return (
            <section className="px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <Loader text="Loading categories..." />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <ErrorMessage message={error} />
                </div>
            </section>
        );
    }

    return (
    <section className="px-5 py-14 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">

            {/* Heading */}
            <div className="mb-7 sm:mb-8">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63] sm:text-sm">
                    Browse
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#151515] sm:text-3xl md:text-4xl">
                    Explore by category
                </h2>
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4 md:grid md:grid-cols-4 md:overflow-visible">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        className="min-w-[160px] rounded-2xl border border-black/10 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-md sm:min-w-[180px] sm:p-6 md:min-w-0"
                    >
                        <h3 className="text-sm font-medium text-[#151515] sm:text-base">
                            {category.name}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-[#6B6B63] sm:text-sm">
                            Explore listings
                        </p>
                    </button>
                ))}
            </div>

        </div>
    </section>
);

}

export default Categories;