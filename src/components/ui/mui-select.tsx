import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface MuiSelectOption {
  value: string | number;
  label?: string;
}

interface MuiSelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: MuiSelectOption[];
  labelId?: string;
  className?: string;
}

export const MuiSelect: React.FC<MuiSelectProps> = ({
  label,
  value,
  onChange,
  options,
  labelId,
  className,
}) => {
  const handleChange = (e: SelectChangeEvent<string | number>) => {
    onChange(e.target.value);
  };

  const generatedLabelId = labelId || `select-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <FormControl className={className}>
      <InputLabel
        id={generatedLabelId}
        sx={{
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#495057',
          direction: 'rtl',
          textAlign: 'center',
          transformOrigin: 'center',
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={generatedLabelId}
        value={value}
        onChange={handleChange}
        size="small"
        sx={{
          backgroundColor: 'white',
          color: '#2c3e50',
          fontSize: '1.5rem',
          minWidth: '180px',
          direction: 'rtl',
          textAlign: 'center',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dee2e6',
            borderWidth: '2px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a90e2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a90e2',
            boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.1)',
          },
          borderRadius: '8px',
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'white',
              '& .MuiMenuItem-root': {
                fontSize: '1.5rem',
                color: '#2c3e50',
                direction: 'rtl',
                justifyContent: 'center',
                padding: '12px',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                '&.Mui-selected': {
                  backgroundColor: '#e7f3ff',
                  '&:hover': {
                    backgroundColor: '#d0e8ff',
                  },
                },
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
