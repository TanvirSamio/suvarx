import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
    const { toastMessage, showToast } = useCart();

    if (!toastMessage) return null;

    const { message, type } = toastMessage;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full">
            <div className={`p-4 rounded-2xl border shadow-float flex items-start gap-3 bg-white ${
                type === 'error' ? 'border-rose-200 text-rose-800' :
                type === 'info' ? 'border-sky-200 text-sky-800' :
                'border-emerald-200 text-emerald-900'
            }`}>
                {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
                {type === 'info' && <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />}
                {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                
                <div className="flex-1 text-sm font-medium text-slate-800">
                    {message}
                </div>
                <button 
                    onClick={() => showToast(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
