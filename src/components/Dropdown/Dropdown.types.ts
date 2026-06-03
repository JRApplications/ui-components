import type { HTMLAttributes } from 'react';

export interface DropdownOption {
  id: string | number;
  value: string | React.ReactNode | number;
}

export interface DropdownBorderStyle {
  width?: string | number;
  color?: string;
  radius?: string | number;
}

export interface DropdownTextStyle {
  color?: string;
  font?: string;
}

export interface DropdownOptionStyle {
  background?: string;
  color?: string;
}

export interface DropdownTriggerStyle {
  background?: string;
  border?: DropdownBorderStyle;
  text?: DropdownTextStyle;
  icon?: { color?: string };
}

export interface DropdownListStyle {
  background?: string;
  border?: DropdownBorderStyle;
  text?: DropdownTextStyle;
  boxShadow?: string;
  hover?: DropdownOptionStyle;
  selected?: DropdownOptionStyle;
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  placeHolder?: string;
  options?: DropdownOption[];
  selectedId?: string | number;
  onSelect?: (option: DropdownOption) => void;
  style?: React.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
  triggerStyle?: DropdownTriggerStyle;
  listStyle?: DropdownListStyle;
}
