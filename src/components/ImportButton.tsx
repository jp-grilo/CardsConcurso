'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { importQuestionsFromJson } from '@/actions/questions';
import styles from './ImportButton.module.css';

export function ImportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage('');

    try {
      const text = await file.text();
      const result = await importQuestionsFromJson(text);
      
      if (result.success) {
        setMessage(`Sucesso! ${result.count} questões importadas.`);
      } else {
        setMessage(`Erro: ${result.error}`);
      }
    } catch (err: any) {
      setMessage(`Erro ao ler arquivo: ${err.message}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={styles.container}>
      <input 
        type="file" 
        accept=".json" 
        style={{ display: 'none' }} 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button 
        className={styles.button} 
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 size={18} className={styles.spin} /> : <Upload size={18} />}
        Importar JSON
      </button>

      {message && <span className={styles.message}>{message}</span>}
    </div>
  );
}
