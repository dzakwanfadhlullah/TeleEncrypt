import React from 'react';
import { X, Download, Trash2, Unlock } from 'lucide-react';
import { Button } from '../design-system/Button';

interface DetailModalProps {
  fileName: string;
  fileSize: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DetailModal({ fileName, fileSize, onClose, onDelete }: DetailModalProps) {
  // Mock decrypted content
  const decryptedContent = `CONFIDENTIAL QUARTERLY REPORT - Q4 2025

Executive Summary:
Revenue grew 127% YoY to $4.2M, with 89% coming from enterprise contracts.
Customer acquisition cost decreased by 34% while LTV increased to $12,400.

Key Metrics:
- Monthly Recurring Revenue: $1.2M (+45% MoM)
- Churn Rate: 2.3% (industry avg: 5.8%)
- Net Promoter Score: 72

Market Opportunity:
The global cybersecurity market is projected to reach $345B by 2026.
Our TAM in the encrypted storage segment alone is estimated at $8.7B.

Next Quarter Priorities:
1. Launch enterprise SSO integration
2. Expand to APAC markets (Singapore, Tokyo)
3. Achieve SOC 2 Type II certification`;

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-8"
        onClick={onClose}
      >
        {/* Modal Sheet */}
        <div
          className="bg-white rounded-[24px] w-full max-w-[640px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(0,0,0,0.08)]">
            <div>
              <h3 
                className="text-[24px] font-[600] text-[#111827] tracking-[-0.02em]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {fileName}
              </h3>
              <p className="text-sm text-[#9CA3AF] mt-1 font-mono">{fileSize}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full w-fit border border-green-100">
              <Unlock className="w-4 h-4 text-[#10B981]" />
              <span className="text-sm font-medium text-green-900">Decrypted Locally</span>
            </div>

            {/* Preview Area */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-3">
                Document Preview
              </label>
              <div className="bg-[#F8FAFC] rounded-2xl p-5 h-[360px] overflow-auto border border-[rgba(0,0,0,0.08)]">
                <pre 
                  className="text-xs leading-relaxed text-[#111827] whitespace-pre-wrap"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {decryptedContent}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-[rgba(0,0,0,0.08)] bg-[#FAFAFA]">
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
              Delete File
            </Button>

            <Button variant="primary">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}