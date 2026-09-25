const Hero = () => {
  return (
    <section className="px-5 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B63] sm:mb-6 sm:text-sm sm:tracking-[0.2em]">
            Buy. Sell. Give things a second life.
          </p>

          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-[#151515] sm:text-6xl md:text-7xl lg:text-8xl">
            Things worth
            <br />
            finding again.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-6 text-[#6B6B63] sm:mt-8 sm:text-base sm:leading-7 md:text-lg">
            Discover unique products from people around you,
            or give something you no longer need a new home.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;