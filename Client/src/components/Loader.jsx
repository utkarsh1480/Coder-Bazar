const Loader = ({
  text = "",
  size = "md",
  fullScreen = false,
}) => {
  const sizes = {
    sm: {
      spinner: "h-4 w-4 border-2",
      text: "text-xs",
    },
    md: {
      spinner: "h-6 w-6 border-2",
      text: "text-sm",
    },
    lg: {
      spinner: "h-8 w-8 border-[3px]",
      text: "text-sm",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const content = (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3"
    >
      <div
        className={`${currentSize.spinner} animate-spin rounded-full border-black/10 border-t-[#8B9A72]`}
        aria-hidden="true"
      />

      {text ? (
        <span className={`${currentSize.text} text-[#6B6B63]`}>
          {text}
        </span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 sm:px-6">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;