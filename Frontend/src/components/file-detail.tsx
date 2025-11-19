import React from 'react';
import { ChevronRight, Download, Share2, FileText, Lock, Shield, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface FileDetailProps {
  fileId: string;
  onBack: () => void;
}

export function FileDetail({ fileId, onBack }: FileDetailProps) {
  // Mock data based on fileId
  const file = {
    id: fileId,
    name: 'Q4_Financial_Report.pdf',
    type: 'PDF Document',
    size: '2.4 MB',
    uploadedBy: 'John Doe',
    uploadedAt: 'November 15, 2025 at 2:32 PM',
    description: 'Quarterly financial summary and projections for Q4 2025'
  };

  const encryptedContent = 'U2FsdGVkX1+9xKz8qN7P3mF2Kj4sL9pQ...xR5tY8uN2vB6wC1zD4eF3gH7iJ0kL';
  const decryptedPreview = `FINANCIAL REPORT - Q4 2025
  
Revenue Summary:
- Total Revenue: $4.2M
- YoY Growth: +23%
- Recurring Revenue: $3.1M

Key Metrics:
- Customer Acquisition: 1,240 new clients
- Churn Rate: 2.3%
- Average Contract Value: $48,500

Expense Breakdown:
- Operations: $1.2M
- R&D: $800K
- Marketing: $450K
- Administrative: $320K

Net Profit: $1.43M
EBITDA Margin: 34%

Notes: Strong quarter with exceptional growth in enterprise segment...`;

  return (
    <div className="flex-1 bg-[var(--bg-page)] overflow-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-[var(--text-secondary)]">
          <button onClick={onBack} className="hover:text-[var(--text-primary)] transition-colors">
            Files
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--text-primary)]">{file.name}</span>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2>{file.name}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">{file.type} · {file.size}</p>
              </div>
            </div>
            <Button>
              <Download className="w-4 h-4" />
              Download decrypted file
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left column - Metadata */}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4">File Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Uploaded by</p>
                      <p>{file.uploadedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Upload date</p>
                      <p>{file.uploadedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Status</p>
                      <Badge variant="success" icon={<Lock className="w-3 h-3" />}>
                        Encrypted in database
                      </Badge>
                    </div>
                    {file.description && (
                      <div>
                        <p className="text-xs text-[var(--text-secondary)] mb-1">Description</p>
                        <p className="text-sm">{file.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Database view sample */}
                <div>
                  <h3 className="mb-3">Database storage</h3>
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <code className="text-xs text-green-400 break-all font-mono">
                      {encryptedContent}
                    </code>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">
                    In the database this file is stored as encrypted data
                  </p>
                </div>
              </div>

              {/* Right column - Decrypted preview */}
              <div>
                <h3 className="mb-3">Decrypted preview</h3>
                <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--bg-page)] h-[400px] overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap leading-relaxed">{decryptedPreview}</pre>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  Only authenticated users can view the decrypted content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}