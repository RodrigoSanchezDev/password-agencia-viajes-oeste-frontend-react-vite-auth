import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import './SearchSelect.css';

interface SearchOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchSelectProps {
  label: string;
  options: readonly SearchOption[] | SearchOption[];
  value: string;
  onChange: (value: string, option?: SearchOption) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Buscar...',
  disabled = false,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectId = id || `search-select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;

  // Encuentra la opción seleccionada
  const selectedOption = options.find(opt => opt.value === value);

  // Filtra las opciones basado en el término de búsqueda
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.subLabel && option.subLabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Cierra el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SearchOption) => {
    onChange(option.value, option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-select" ref={containerRef}>
      <label htmlFor={selectId} className="search-select__label">
        {label}
      </label>
      <div 
        className={`search-select__container ${isOpen ? 'search-select__container--open' : ''} ${error ? 'search-select__container--error' : ''} ${disabled ? 'search-select__container--disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <HiOutlineSearch className="search-select__search-icon" />
        {selectedOption && !isOpen ? (
          <div className="search-select__selected">
            <span className="search-select__selected-label">{selectedOption.label}</span>
            {selectedOption.subLabel && (
              <span className="search-select__selected-sublabel">{selectedOption.subLabel}</span>
            )}
          </div>
        ) : (
          <input
            ref={inputRef}
            id={selectId}
            type="text"
            className="search-select__input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
            onFocus={() => setIsOpen(true)}
          />
        )}
        {value && !disabled && (
          <button
            type="button"
            className="search-select__clear"
            onClick={handleClear}
            aria-label="Limpiar selección"
          >
            <HiOutlineX />
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <ul className="search-select__dropdown" role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className={`search-select__option ${option.value === value ? 'search-select__option--selected' : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.value === value}
              >
                <span className="search-select__option-label">{option.label}</span>
                {option.subLabel && (
                  <span className="search-select__option-sublabel">{option.subLabel}</span>
                )}
              </li>
            ))
          ) : (
            <li className="search-select__no-results">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}

      {helperText && !error && (
        <span id={helperId} className="search-select__helper">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} className="search-select__error" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
};
