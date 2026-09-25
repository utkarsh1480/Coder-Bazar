import { Link } from "react-router-dom";
const SellCTA = () => {
  return (
    <section className="px-5 pb-16 sm:px-6 md:pb-24">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-black/10 bg-white px-6 py-12 sm:px-10 sm:py-16 md:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63] sm:text-sm">
              Ready to let go?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#151515] sm:text-4xl md:text-5xl">
              Someone might be looking
              <br className="hidden sm:block" />
              for exactly what you have.
            </h2>
          </div>

          <Link
            to="/create-listing"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#151515] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333] md:w-auto"
          >
            Sell an item
          </Link>

        </div>
      </div>
    </section>
  );
};

export default SellCTA;