import React from "react";

const CoverLetterModal = ({ open, onClose, letter }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full rounded-xl shadow-lg p-5 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold">Generated Cover Letter</h2>
          <button
            className="text-xs text-slate-500 hover:text-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <textarea
          className="flex-1 border border-slate-200 rounded-lg p-2 text-xs resize-none"
          defaultValue={letter}
        />
      </div>
    </div>
  );
};

export default CoverLetterModal;
