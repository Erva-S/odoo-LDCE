import { Collaborator } from '../../types/collaboration';
import { AlertCircle } from 'lucide-react';

interface RemoveCollaboratorModalProps {
  isOpen: boolean;
  collaborator: Collaborator | null;
  onClose: () => void;
  onConfirmRemove: (userId: string) => void;
}

export const RemoveCollaboratorModal = ({
  isOpen,
  collaborator,
  onClose,
  onConfirmRemove,
}: RemoveCollaboratorModalProps) => {
  if (!isOpen || !collaborator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-rise">
      <div
        className="w-full max-w-md bg-white border border-[#E7E5E2] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-instrument text-2xl text-black leading-none">
              Remove {collaborator.name}?
            </h4>
            <p className="text-xs text-[#6F6F6F] font-inter mt-1">
              Confirm collaborator access revocation
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7E5E2]">
          They will no longer have access to view, edit, or contribute to this journey archive. You can invite them back at any time.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-medium transition-colors cursor-pointer border border-[#E7E5E2]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmRemove(collaborator.userId);
              onClose();
            }}
            className="rounded-full px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-sm"
          >
            Remove Access
          </button>
        </div>
      </div>
    </div>
  );
};
