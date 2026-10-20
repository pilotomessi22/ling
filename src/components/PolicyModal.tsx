import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2D5A43] flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              Ling Petshop Policy
            </span>
            <h3 className="text-lg font-black text-stone-900">{title}</h3>
          </div>
        </div>

        <div className="text-xs text-stone-600 leading-relaxed whitespace-pre-line space-y-3 pt-3 border-t border-stone-100">
          {content}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2D5A43] hover:bg-[#254A37] text-white font-bold text-xs px-5 py-2.5 rounded-full"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
