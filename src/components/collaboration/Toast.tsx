import { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast = ({ toasts, onDismiss }: ToastProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none max-w-md w-[calc(100vw-32px)]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#000000] text-white rounded-full shadow-2xl border border-neutral-800 text-xs sm:text-sm animate-fade-rise w-auto">
      <div className="flex items-center gap-2.5">
        {toast.type === 'success' || !toast.type ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Info className="w-3.5 h-3.5" />
          </div>
        )}
        <div className="flex items-center gap-1.5 font-sans">
          {toast.title && <span className="font-semibold text-white">{toast.title}</span>}
          <span className="text-neutral-200">{toast.message}</span>
        </div>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-white p-1 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
