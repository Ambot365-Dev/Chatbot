import React from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { useFlow } from '../context/FlowContext';

const PublishModal = ({ isOpen, onClose }) => {
    const { steps } = useFlow();
    const [copied, setCopied] = React.useState(false);

    if (!isOpen) return null;

    const jsonString = JSON.stringify(steps, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chatbot-flow.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Publish Flow</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-hidden flex flex-col">
                    <p className="text-sm text-gray-600 mb-4">
                        Your chatbot data matches the schema required for our widget. Export it below.
                    </p>

                    <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 font-mono text-xs">
                        <div className="absolute top-0 right-0 p-2 flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                title="Copy to Clipboard"
                            >
                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                <span className="text-[10px] uppercase font-bold tracking-wide">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                        <pre className="p-4 h-full overflow-auto text-blue-300">
                            {jsonString}
                        </pre>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                        Close
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                    >
                        <Download size={16} />
                        Download JSON
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishModal;
