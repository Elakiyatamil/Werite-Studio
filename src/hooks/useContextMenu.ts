// src/hooks/useContextMenu.ts
import { useState, useEffect, useCallback } from 'react';

export interface ContextMenuState {
  x: number;
  y: number;
  isOpen: boolean;
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    isOpen: false,
  });

  const open = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setState({
      x: e.clientX,
      y: e.clientY,
      isOpen: true,
    });
  }, []);

  const close = useCallback(() => {
    setState(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  }, []);

  useEffect(() => {
    const handleGlobalClick = () => {
      close();
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('contextmenu', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('contextmenu', handleGlobalClick);
    };
  }, [close]);

  return {
    x: state.x,
    y: state.y,
    isOpen: state.isOpen,
    open,
    close,
  };
}
