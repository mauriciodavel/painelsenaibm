'use client';

import React, { useRef } from 'react';

interface CarregadorCSVProps {
  onCarregar: (arquivo: File) => void;
}

export default function CarregadorCSV({ onCarregar }: CarregadorCSVProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClique = () => {
    inputRef.current?.click();
  };

  const handleMudanca = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      onCarregar(arquivo);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="inline-block">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleMudanca}
        className="hidden"
      />
      <button
        onClick={handleClique}
        className="px-6 py-2 text-white rounded-lg font-semibold transition-colors"
        style={{ backgroundColor: 'var(--senai-support-1)' }}
      >
        📁 Carregar CSV
      </button>
    </div>
  );
}
