'use client';

import { useState, useTransition } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, PlayCircle, Settings2, Loader2 } from 'lucide-react';
import { createSimuladoSession } from '@/actions/sessions';
import styles from './SimuladoSetupTable.module.css';

interface Category {
  id: number;
  name: string;
  question_count: number;
}

interface TableRow {
  id: string; // ID único interno para a linha
  categoryId: number;
  name: string;
  questionCount: number;
  maxQuestions: number;
  weight: number;
  targetDifficulty: number;
}

export function SimuladoSetupTable({ availableCategories }: { availableCategories: Category[] }) {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  
  // Bulk Actions
  const [bulkDifficulty, setBulkDifficulty] = useState<string>('');
  
  const [topicToAdd, setTopicToAdd] = useState<string>('');
  
  const [isPending, startTransition] = useTransition();

  const unusedCategories = availableCategories.filter(
    cat => !rows.some(row => row.categoryId === cat.id)
  );

  const handleAddTopic = () => {
    if (!topicToAdd) return;
    const cat = availableCategories.find(c => c.id.toString() === topicToAdd);
    if (!cat) return;

    setRows([
      ...rows, 
      {
        id: crypto.randomUUID(),
        categoryId: cat.id,
        name: cat.name,
        questionCount: Math.min(10, cat.question_count),
        maxQuestions: cat.question_count,
        weight: 1,
        targetDifficulty: 5
      }
    ]);
    setTopicToAdd('');
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === rows.length - 1) return;

    const newRows = [...rows];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newRows[index];
    newRows[index] = newRows[targetIndex];
    newRows[targetIndex] = temp;
    
    setRows(newRows);
  };

  const updateRow = (index: number, field: keyof TableRow, value: number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(new Set(rows.map(r => r.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRowIds);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedRowIds(newSelected);
  };

  const deleteSelected = () => {
    setRows(rows.filter(r => !selectedRowIds.has(r.id)));
    setSelectedRowIds(new Set());
  };

  const applyBulkDifficulty = () => {
    const val = parseInt(bulkDifficulty);
    if (isNaN(val) || val < 1 || val > 10) return;

    setRows(rows.map(r => 
      selectedRowIds.has(r.id) ? { ...r, targetDifficulty: val } : r
    ));
    setBulkDifficulty('');
  };

  const handleStart = () => {
    if (rows.length === 0) return alert('Adicione pelo menos um tópico.');
    
    startTransition(async () => {
      try {
        await createSimuladoSession(rows);
      } catch (error: any) {
        alert(error.message || 'Erro ao iniciar simulado.');
      }
    });
  };

  return (
    <div className={styles.container}>
      
      {/* Bulk Actions Bar */}
      {selectedRowIds.size > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>{selectedRowIds.size} itens selecionados</span>
          <div className={styles.bulkControls}>
            <input 
              type="number" 
              min="1" max="10" 
              placeholder="Dificuldade (1-10)" 
              value={bulkDifficulty}
              onChange={(e) => setBulkDifficulty(e.target.value)}
              className={styles.inputSmall}
            />
            <button onClick={applyBulkDifficulty} className={styles.btnSecondary}>Aplicar Dificuldade</button>
            <button onClick={deleteSelected} className={styles.btnDanger}>
              <Trash2 size={16} /> Remover
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th width="40">
                <input 
                  type="checkbox" 
                  checked={rows.length > 0 && selectedRowIds.size === rows.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th>Tópico</th>
              <th width="120">Nº Questões</th>
              <th width="100">Peso</th>
              <th width="140">Dificuldade Alvo</th>
              <th width="100">Ordenação</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Nenhum tópico adicionado ao simulado.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedRowIds.has(row.id)}
                      onChange={(e) => toggleSelectRow(row.id, e.target.checked)}
                    />
                  </td>
                  <td className={styles.topicName}>
                    {row.name}
                    <span className={styles.maxQ}> (máx {row.maxQuestions})</span>
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      max={row.maxQuestions}
                      value={row.questionCount}
                      onChange={(e) => updateRow(index, 'questionCount', parseInt(e.target.value) || 1)}
                      className={styles.inputNumber}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value={row.weight}
                      onChange={(e) => updateRow(index, 'weight', parseInt(e.target.value) || 1)}
                      className={styles.inputNumber}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={row.targetDifficulty}
                      onChange={(e) => updateRow(index, 'targetDifficulty', parseInt(e.target.value) || 1)}
                      className={styles.inputNumber}
                    />
                  </td>
                  <td>
                    <div className={styles.orderButtons}>
                      <button 
                        onClick={() => moveRow(index, 'up')} 
                        disabled={index === 0}
                        className={styles.iconBtn}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        onClick={() => moveRow(index, 'down')} 
                        disabled={index === rows.length - 1}
                        className={styles.iconBtn}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Topic Area */}
      <div className={styles.addArea}>
        <select 
          value={topicToAdd} 
          onChange={(e) => setTopicToAdd(e.target.value)}
          className={styles.select}
        >
          <option value="">Selecione um tópico para adicionar...</option>
          {unusedCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name} ({cat.question_count} questões)</option>
          ))}
        </select>
        <button 
          onClick={handleAddTopic} 
          disabled={!topicToAdd}
          className={styles.btnPrimary}
        >
          <Plus size={18} /> Adicionar Tópico
        </button>
      </div>

      {/* Start and Save Actions */}
      <div className={styles.footerActions}>
        <button className={styles.btnSecondary}>
          <Settings2 size={18} /> Salvar como Preset
        </button>
        <button className={styles.btnStart} onClick={handleStart} disabled={rows.length === 0 || isPending}>
          {isPending ? <Loader2 className={styles.spin} size={20} /> : <PlayCircle size={20} />}
          {isPending ? 'Iniciando...' : 'Iniciar Simulado'}
        </button>
      </div>
    </div>
  );
}
