'use client'

function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/40
          backdrop-blur-sm
        "
      />

      {/* Dialog */}
      <div
        className="
          relative
          w-full max-w-md
          bg-white
          rounded-2xl
          shadow-2xl
          p-6
          mx-4
        "
      >
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Delete City
        </h3>

        <p className="text-slate-500 mb-6">
          Are you sure you want to delete this city?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">

          <button
            disabled={isLoading}
            onClick={onClose}
            className="
              px-4 py-2
              rounded-xl
              border border-slate-200
              text-slate-700
              hover:bg-slate-50
              transition-colors
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="
              px-4 py-2
              rounded-xl
              bg-red-600
              text-white
              hover:bg-red-700
              transition-colors
            "
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteDialog