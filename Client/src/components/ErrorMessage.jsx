const ErrorMessage = ({ message = "Something went wrong." }) => {
  return (
    <div className="flex w-full items-center justify-center px-5 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-xl rounded-3xl border border-black/10 bg-white px-6 py-8 text-center shadow-sm sm:px-10 sm:py-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EEE7] text-[#8B9A72]">
          <span className="text-xl font-semibold">!</span>
        </div>

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B63]">
          Something went wrong
        </p>

        <p className="mt-3 text-sm leading-6 text-[#6B6B63] sm:text-base">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;