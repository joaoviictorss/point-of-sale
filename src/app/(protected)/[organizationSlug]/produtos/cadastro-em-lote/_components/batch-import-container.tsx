'use client';

import { useState } from 'react';
import type { ImportRowResult } from '@/services/product/import-schemas';
import { ReviewStep } from './review-step';
import { UploadStep } from './upload-step';

export function BatchImportContainer() {
  const [rows, setRows] = useState<ImportRowResult[] | null>(null);
  const [fileName, setFileName] = useState('');

  if (!rows) {
    return (
      <UploadStep
        onValidated={(validatedRows, name) => {
          setRows(validatedRows);
          setFileName(name);
        }}
      />
    );
  }

  return (
    <ReviewStep
      fileName={fileName}
      onReset={() => {
        setRows(null);
        setFileName('');
      }}
      onRowsChange={setRows}
      rows={rows}
    />
  );
}
