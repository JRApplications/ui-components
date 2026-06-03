import React, { useRef } from 'react';
import type { DropdownProps, DropdownTriggerStyle, DropdownListStyle } from './Dropdown.types';
import { useDropdown } from './useDropdown';
import './Dropdown.css';

function px(v: string | number) { return typeof v === 'number' ? `${v}px` : v; }

function buildDropdownVars(
  triggerStyle?: DropdownTriggerStyle,
  listStyle?: DropdownListStyle,
): React.CSSProperties {
  const vars: Record<string, string> = {};

  // styles
  if (triggerStyle) {
    const { background, border, text, icon } = triggerStyle;
    if (background) vars['--jrapps_dd_trigger_bg'] = background;
    if (text?.color) vars['--jrapps_dd_trigger_color'] = text.color;
    if (text?.font) vars['--jrapps_dd_trigger_font'] = text.font;
    if (border?.color) vars['--jrapps_dd_trigger_border_color'] = border.color;
    if (border?.width !== undefined) vars['--jrapps_dd_trigger_border_width'] = px(border.width);
    if (border?.radius !== undefined) vars['--jrapps_dd_trigger_border_radius'] = px(border.radius);
    if (icon?.color) vars['--jrapps_dd_icon_color'] = icon.color;
  }
  if (listStyle) {
    const { background, border, text, boxShadow, hover, selected } = listStyle;
    if (background) vars['--jrapps_dd_list_bg'] = background;
    if (text?.color) vars['--jrapps_dd_list_color'] = text.color;
    if (text?.font) vars['--jrapps_dd_list_font'] = text.font;
    if (border?.color) vars['--jrapps_dd_list_border_color'] = border.color;
    if (border?.width !== undefined) vars['--jrapps_dd_list_border_width'] = px(border.width);
    if (border?.radius !== undefined) vars['--jrapps_dd_list_border_radius'] = px(border.radius);
    if (boxShadow) vars['--jrapps_dd_list_shadow'] = boxShadow;
    if (hover?.background) vars['--jrapps_dd_option_hover_bg'] = hover.background;
    if (hover?.color) vars['--jrapps_dd_option_hover_color'] = hover.color;
    if (selected?.background) vars['--jrapps_dd_option_selected_bg'] = selected.background;
    if (selected?.color) vars['--jrapps_dd_option_selected_color'] = selected.color;
  }
  return vars as React.CSSProperties;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, options, onSelect, selectedId, placeHolder = 'Select...', width, height, triggerStyle, listStyle, style, ...rest }, ref) => {
    const uidRef = useRef<string | null>(null);
    if (uidRef.current === null) { uidRef.current = `jrapps-${Math.random().toString(36).slice(2, 9)}`; }
    const uid = uidRef.current;
    const listId = `jrapps-dropdown-list-${uid}`;
    const { isOpen, selectedLabel, toggleDropdown, selectOption, closeDropdown, triggerRef, listRef } = useDropdown(onSelect ?? (() => {}), options, placeHolder, selectedId);

    return (
      <div ref={ref} className={`jrapps-dropdown${className ? ` ${className}` : ''}`} style={{ ...(width !== undefined && { '--jrapps_dropdown_width': typeof width === 'number' ? `${width}px` : width }), ...(height !== undefined && { '--jrapps_dropdown_height': typeof height === 'number' ? `${height}px` : height }), ...buildDropdownVars(triggerStyle, listStyle), ...style } as React.CSSProperties} {...rest}>

        {/* Trigger */}
        <div
          ref={triggerRef}
          className={`jrapps-dropdown__trigger${isOpen ? ' open' : ''}`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listId}
          tabIndex={0}
          onClick={toggleDropdown}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(); }
            if (e.key === 'Escape') closeDropdown();
          }}
        >
          <span>{selectedLabel}</span>
          <div className="jrapps-dropdown__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.2828 4.89817" width="10" height="6" fill="currentColor">
              <path d="M4.64116,4.89817a.5001.5001,0,0,1-.34277-.13574L.15727.86448A.50018.50018,0,0,1,.84282.136L4.64116,3.71165,8.44.136a.50018.50018,0,0,1,.68555.72852L4.98393,4.76243A.5001.5001,0,0,1,4.64116,4.89817Z" />
            </svg>
          </div>
        </div>

        {/* List */}
        <div
          ref={listRef}
          id={listId}
          className={`jrapps-dropdown__list${isOpen ? ' open' : ''}`}
          role="listbox"
          aria-label={placeHolder}
          tabIndex={-1}
        >
          <div className="jrapps-dropdown__list-inner">
            {options?.map((option) => (
              <div
                key={option.id}
                id={`${uid}-menuitem-${option.id}`}
                className={`jrapps-dropdown__option${selectedId === option.id ? ' focused' : ''}`}
                role="option"
                aria-selected={selectedId === option.id}
                tabIndex={-1}
                onClick={() => selectOption(option)}
              >
                <div className="jrapps-dropdown__option-text">{option.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
