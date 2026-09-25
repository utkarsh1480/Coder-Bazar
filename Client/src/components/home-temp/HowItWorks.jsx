const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Find something",
      description:
        "Explore products listed by people around you.",
    },
    {
      number: "02",
      title: "Connect",
      description:
        "Message the seller and ask questions before buying.",
    },
    {
      number: "03",
      title: "Give it a home",
      description:
        "Complete the exchange and give a useful item another life.",
    },
  ];

  return (
    <section className="px-5 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">

        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6B6B63] sm:text-sm">
            Simple by design
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#151515] sm:text-4xl">
            How Ecoloom works
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
            >
              <span className="text-sm font-medium text-[#8B9A72]">
                {step.number}
              </span>

              <h3 className="mt-8 text-xl font-semibold text-[#151515]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#6B6B63]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;