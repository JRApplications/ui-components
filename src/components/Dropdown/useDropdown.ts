/**
 * useDropdown
 *
 * Internal hook that encapsulates the logic for Dropdown.
 * Keep this file focused on state and side-effects; keep JSX in Dropdown.tsx.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import type { DropdownOption } from './Dropdown.types';

export function useDropdown(onSelect: (id: string | number) => void, options?: DropdownOption[], placeHolder?: string, selectedId?: string | number) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const selectedOption = options?.find(o => o.id === selectedId);
  const selectedLabel = selectedOption ? selectedOption.value : (placeHolder ?? '');

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);

  const selectOption = useCallback((option: DropdownOption) => {
    setIsOpen(false);
    onSelectRef.current(option.id);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [closeDropdown]);

  return { isOpen, selectedLabel, toggleDropdown, selectOption, closeDropdown, triggerRef, listRef };
}
