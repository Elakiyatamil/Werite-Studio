// src/components/CharacterDrawer.tsx
import React, { useState } from 'react';
import type { Character } from '../hooks/useDocumentState';

interface CharacterDrawerProps {
  isOpen: boolean;
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  addCharacter: () => void;
  updateCharacter: (id: string, name: string, traits: string[]) => void;
  removeCharacter: (id: string) => void;
}

export const CharacterDrawer: React.FC<CharacterDrawerProps> = ({
  isOpen,
  characters,
  setCharacters,
  addCharacter,
  updateCharacter,
  removeCharacter,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editTraits, setEditTraits] = useState<string>('');

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const nextChars = [...characters];
    const item = nextChars[draggedIndex];
    nextChars.splice(draggedIndex, 1);
    nextChars.splice(index, 0, item);
    
    setDraggedIndex(index);
    setCharacters(nextChars);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const startEdit = (char: Character) => {
    setEditingId(char.id);
    setEditName(char.name);
    setEditTraits(char.traits.join('\n'));
  };

  const saveEdit = (id: string) => {
    const traitsArray = editTraits
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    updateCharacter(id, editName, traitsArray);
    setEditingId(null);
  };

  return (
    <div className={`character-drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3>Character Notes</h3>
        <i className="ti ti-pin-filled pin-header"></i>
      </div>
      <div className="drawer-content">
        {characters.map((char, index) => (
          <div
            key={char.id}
            className="character-card"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            style={{ opacity: draggedIndex === index ? 0.4 : 1 }}
          >
            {editingId === char.id ? (
              <div className="card-editor">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="card-edit-name"
                  placeholder="Character Name"
                  autoFocus
                />
                <textarea
                  value={editTraits}
                  onChange={(e) => setEditTraits(e.target.value)}
                  className="card-edit-traits"
                  placeholder="Traits (one per line)"
                  rows={4}
                />
                <div className="card-editor-actions">
                  <button onClick={() => saveEdit(char.id)} className="save-btn" title="Save changes">
                    <i className="ti ti-check"></i>
                  </button>
                  <button onClick={() => removeCharacter(char.id)} className="delete-btn" title="Delete character">
                    <i className="ti ti-trash"></i>
                  </button>
                  <button onClick={() => setEditingId(null)} className="cancel-btn" title="Cancel">
                    <i className="ti ti-x"></i>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="card-top">
                  <span className="card-name">{char.name}</span>
                  <button className="pin-btn" onClick={() => startEdit(char)} title="Edit character">
                    <i className="ti ti-pin"></i>
                  </button>
                </div>
                <ul className="card-traits">
                  {char.traits.map((trait, tIdx) => (
                    <li key={tIdx}>{trait}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
      <button className="add-character-btn" onClick={addCharacter}>
        <i className="ti ti-plus"></i> Add Character
      </button>
    </div>
  );
};
