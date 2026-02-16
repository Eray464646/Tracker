'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CustomAlertProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
}

export default function CustomAlert({
  isOpen,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Abbrechen',
  onConfirm,
  onCancel,
  variant = 'default',
}: CustomAlertProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel || handleConfirm}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center"
        >
          {/* Alert Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[calc(100%-32px)] max-w-[270px] overflow-hidden"
          >
              {/* Content */}
              <div className="px-4 pt-5 pb-4 text-center">
                <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                {message && (
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className={`${onCancel ? 'grid grid-cols-2' : ''} border-t border-gray-200 dark:border-gray-700`}>
                {onCancel && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-3 text-[17px] font-medium text-primary-500 dark:text-primary-400 border-r border-gray-200 dark:border-gray-700 ios-button active:bg-gray-100 dark:active:bg-gray-800"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-3 text-[17px] font-semibold ios-button active:bg-gray-100 dark:active:bg-gray-800 ${
                    variant === 'destructive'
                      ? 'text-red-500'
                      : 'text-primary-500 dark:text-primary-400'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
