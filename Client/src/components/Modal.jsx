const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;