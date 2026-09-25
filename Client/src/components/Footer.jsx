import { Link } from "react-router-dom";

const footerLinks = [
    {
        name: "Explore",
        path: "/listings",
    },
    {
        name: "Favorites",
        path: "/favorites",
    },
    {
        name: "Messages",
        path: "/messages",
    },
    {
        name: "Sell an item",
        path: "/create-listing",
    },
];

const marketplaceLinks = [
    {
        name: "Browse listings",
        path: "/listings",
    },
    {
        name: "Saved items",
        path: "/favorites",
    },
    {
        name: "Your profile",
        path: "/profile",
    },
];

const Footer = () => {
    return (
        <footer className="border-t border-black/10 bg-[#F7F6F2]">
            <div className="mx-auto max-w-7xl px-5 sm:px-6">
                <div className="py-16 sm:py-20 md:py-24">
                    <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] md:gap-10 lg:gap-16">
                        <div className="max-w-md">
                            <Link
                                to="/"
                                className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[#151515]"
                            >
                                Ecoloom
                            </Link>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-[#6B6B63] sm:text-base">
                                A thoughtful marketplace for discovering useful
                                things, connecting with people nearby, and
                                giving good products another life.
                            </p>

                            <Link
                                to="/create-listing"
                                className="mt-7 inline-flex items-center rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333]"
                            >
                                Sell something
                            </Link>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B63]">
                                Explore
                            </p>

                            <div className="mt-6 flex flex-col gap-4">
                                {footerLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="w-fit text-sm text-[#151515] transition hover:text-[#8B9A72]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B63]">
                                Marketplace
                            </p>

                            <div className="mt-6 flex flex-col gap-4">
                                {marketplaceLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="w-fit text-sm text-[#151515] transition hover:text-[#8B9A72]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B63]">
                                Why Ecoloom
                            </p>

                            <div className="mt-6 space-y-5">
                                <div>
                                    <p className="text-sm font-medium text-[#151515]">
                                        Discover locally
                                    </p>

                                    <p className="mt-1.5 text-sm leading-6 text-[#6B6B63]">
                                        Find useful products from people around
                                        you.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#151515]">
                                        Give things another life
                                    </p>

                                    <p className="mt-1.5 text-sm leading-6 text-[#6B6B63]">
                                        Keep good products in use for longer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-black/10 pt-8 sm:mt-20">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <p className="text-xs leading-5 text-[#6B6B63]">
                                © {new Date().getFullYear()} Ecoloom. All rights
                                reserved.
                            </p>

                            <p className="text-xs leading-5 text-[#6B6B63]">
                                Buy thoughtfully. Sell simply.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;