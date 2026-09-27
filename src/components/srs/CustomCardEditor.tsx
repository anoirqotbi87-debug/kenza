import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

import { VocabularySRSData } from '../../types/srs';

interface CustomCardEditorProps {
  isOpen: boolean;
  onClose: () => void;
  cardToEdit?: VocabularySRSData | null;
}

export default function CustomCardEditor({ isOpen, onClose, cardToEdit }: CustomCardEditorProps) {
  const { addCustomWordToSRS, updateCustomWord, uiLanguage } = useAppStore();
  const rawLang = uiLanguage || 'fr';
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  const [arabizi, setArabizi] = useState('');
  const [translation, setTranslation] = useState('');
  const [arabic, setArabic] = useState('');
  const [notes, setNotes] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize fields on open
  useEffect(() => {
    if (isOpen) {
      if (cardToEdit) {
        setArabizi(cardToEdit.arabizi || '');
        setArabic(cardToEdit.arabic || '');
        
        // Handle translation which might be an object or string
        let transText = '';
        if (typeof cardToEdit.translation === 'string') {
          transText = cardToEdit.translation;
        } else if (cardToEdit.translation?.fr) {
          transText = cardToEdit.translation.fr;
        }
        setTranslation(transText);
        setNotes((cardToEdit as any).notes || '');
      } else {
        setArabizi('');
        setTranslation('');
        setArabic('');
        setNotes('');
      }
      
      // Auto-focus the first input after a short delay for transition
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, cardToEdit]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFormValid = arabizi.trim().length > 0 && translation.trim().length > 0;
  const isEditMode = !!cardToEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (isEditMode) {
      updateCustomWord(cardToEdit.id, {
        arabizi: arabizi.trim(),
        translation: translation.trim(),
        arabic: arabic.trim(),
        notes: notes.trim(),
      });
    } else {
      const newId = `custom_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
      addCustomWordToSRS({
        id: newId,
        arabizi: arabizi.trim(),
        translation: translation.trim(),
        arabic: arabic.trim(),
        notes: notes.trim(),
        source: 'manual',
      });
    }
    
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode 
              ? (isAr ? 'تعديل الكلمة' : 'Modifier l\'expression') 
              : (isAr ? 'إضافة كلمة جديدة' : 'Ajouter un nouveau mot')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          
          <div className="space-y-5">
            {/* Arabizi Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {isAr ? 'بالدارجة (عربيزي)' : 'En Darija (Arabizi)'} <span className="text-red-500">*</span>
              </label>
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ex. Khasni nemchi"
                value={arabizi}
                onChange={(e) => setArabizi(e.target.value)}
                dir="ltr"
              />
            </div>

            {/* Translation Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {isAr ? 'الترجمة' : 'Traduction'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ex. Je dois partir"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
              />
            </div>

            {/* Arabic Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {isAr ? 'بالحروف العربية (اختياري)' : 'En lettres arabes (optionnel)'}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-arabic text-lg"
                placeholder="ex. خاصني نمشي"
                value={arabic}
                onChange={(e) => setArabic(e.target.value)}
                dir="rtl"
              />
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {isAr ? 'ملاحظات / سياق (اختياري)' : 'Notes / Contexte (optionnel)'}
              </label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none h-20"
                placeholder={isAr ? 'مثال: سمعتها في المقهى...' : 'ex. Entendu au café, utile pour prendre congé.'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              {isAr ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditMode 
                ? (isAr ? 'حفظ التعديلات' : 'Enregistrer') 
                : (isAr ? 'أضف للمراجعة' : 'Ajouter à mes révisions')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
