import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgramItem } from '../../types';
import { X, CheckCircle, Target, Users, ArrowRight } from 'lucide-react';

interface ProgramDetailModalProps {
  program: ProgramItem | null;
  onClose: () => void;
  onInquire: (programTitle: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onInquire,
}) => {
  return (
    <AnimatePresence>
      {program && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col"
          >
        {/* Header Banner Image */}
        <div className="relative h-56 sm:h-64 w-full bg-purple-900 overflow-hidden">
          <img
            src={program.image || undefined}
            alt={program.title}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="px-3 py-1 rounded-full bg-purple-600/90 text-xs font-bold uppercase tracking-wider text-purple-100">
              Program 0{program.number} • {program.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">
              {program.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-2">
              Overview & Objectives
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {program.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase text-purple-900">
                  Target Audience
                </h4>
                <p className="text-xs text-gray-700 mt-0.5">{program.targetAudience}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-purple-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase text-purple-900">
                  Impact Focus
                </h4>
                <p className="text-xs text-gray-700 mt-0.5">
                  Institutional awareness, youth safety & capacity building
                </p>
              </div>
            </div>
          </div>

          {/* Key Objectives */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-3">
              Key Deliverables & Goals
            </h3>
            <ul className="space-y-2.5">
              {program.keyObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onInquire(program.title);
                onClose();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-800 btn-3d-push shadow-md cursor-pointer"
            >
              <span>Bring This Program To My Institution</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
