// components/profile/ProfileEditModal.tsx
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileEditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<T>;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
  }>;
}

export function ProfileEditModal<T>({
  isOpen,
  onClose,
  formData,
  errors,
  onInputChange,
  onSubmit,
  isSaving,
  fields,
}: ProfileEditModalProps<T>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-center mb-4">Edit Profile</h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <input
                    name={field.name}
                    value={(formData[field.name as keyof T] as string) || ''}
                    onChange={onInputChange}
                    placeholder={field.label}
                    type={field.type || 'text'}
                    className="border rounded-md px-3 py-2 w-full"
                    required={field.required}
                  />
                  {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="border px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}