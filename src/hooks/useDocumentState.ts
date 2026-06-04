// src/hooks/useDocumentState.ts
import { useState, useCallback } from 'react';
import type { PlacedImage, FloatType, IconName } from '../types';

const INITIAL_TEXT = `## Chapter One: The Gate of Blackthorn

The road had forgotten it was a road. Beneath the canopy of blackthorn and silver ash, it had become a suggestion — a parting of moss, an absence of trees where once there had been cart-ruts and the prints of iron-shod hooves. Elara followed it anyway, because suggestion was enough when you had nowhere else to go.

She carried three things into the wilderness: a letter she had not yet read, a knife she had not yet used, and the name of a man who, according to every map she had consulted, did not exist.

The forest did not care about any of it.

* * *

By the time the gate appeared, the light had gone amber-grey and the blackthorns had grown close enough to brush her shoulders. The gate was iron — or had been iron, once. Now it was something older than iron, something that had eaten the rust and grown fat on it, its scrollwork twisted into shapes that her eyes refused to name.

She stopped three feet from it and read the name carved in the keystone: Kazad-Dul. Est. 741.`;

export interface Character {
  id: string;
  name: string;
  traits: string[];
}

const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char-1',
    name: 'Kaelen',
    traits: [
      'Sworn protector of Elara',
      'Carries the marking of Kazan',
      'Silent and highly observant',
    ],
  },
  {
    id: 'char-2',
    name: 'Elara',
    traits: [
      'Keeper of the Blackthorn key',
      'Determined, seeking her heritage',
      'Wears a silver leaf pendant',
    ],
  },
];

let nextId = 1;

export function useDocumentState() {
  const [text, setText] = useState<string>(INITIAL_TEXT);
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
  const [chapterTitle, setChapterTitle] = useState<string>('Chapter One: The Gate of Blackthorn');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // New States for Color & Panel
  const [activeColor, setActiveColor] = useState<string>('#1a1714'); // Parchment dark ink
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  
  // Drawer open states
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState<boolean>(false);

  const addImage = useCallback((src: string, pageIndex = 0): void => {
    const img: PlacedImage = {
      id: `img-${nextId++}`,
      x: 280,
      y: 120,
      width: 160,
      height: 120,
      src,
      float: 'right',
      isBuiltIn: false,
      pageIndex,
    };
    setPlacedImages(prev => [...prev, img]);
  }, []);

  const addBuiltInIcon = useCallback((iconName: IconName, pageIndex = 0, yOffset = 180): void => {
    const img: PlacedImage = {
      id: `icon-${nextId++}`,
      x: 320,
      y: yOffset,
      width: 100,
      height: 100,
      src: '',
      float: 'right',
      isBuiltIn: true,
      iconName,
      pageIndex,
    };
    setPlacedImages(prev => [...prev, img]);
  }, []);

  const updateImage = useCallback((id: string, changes: Partial<PlacedImage>): void => {
    setPlacedImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...changes } : img))
    );
  }, []);

  const removeImage = useCallback((id: string): void => {
    setPlacedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const setImageFloat = useCallback((id: string, float: FloatType): void => {
    updateImage(id, { float });
  }, [updateImage]);

  const setImageWidth = useCallback((id: string, width: number): void => {
    updateImage(id, { width });
  }, [updateImage]);

  // Character modifications
  const addCharacter = useCallback((): void => {
    const newChar: Character = {
      id: `char-${nextId++}`,
      name: 'New Character',
      traits: ['Bullet trait 1', 'Bullet trait 2'],
    };
    setCharacters(prev => [...prev, newChar]);
  }, []);

  const updateCharacter = useCallback((id: string, name: string, traits: string[]): void => {
    setCharacters(prev =>
      prev.map(c => (c.id === id ? { ...c, name, traits } : c))
    );
  }, []);

  const removeCharacter = useCallback((id: string): void => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    text,
    setText,
    placedImages,
    setPlacedImages,
    chapterTitle,
    setChapterTitle,
    draggingId,
    setDraggingId,
    addImage,
    addBuiltInIcon,
    updateImage,
    removeImage,
    setImageFloat,
    setImageWidth,
    
    // New exports
    activeColor,
    setActiveColor,
    characters,
    setCharacters,
    addCharacter,
    updateCharacter,
    removeCharacter,

    isLeftDrawerOpen,
    setIsLeftDrawerOpen,
    isColorPaletteOpen,
    setIsColorPaletteOpen,
  };
}
