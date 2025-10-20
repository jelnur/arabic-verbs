import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import React from 'react'

interface MuiSelectOption {
  value: string | number
  label?: string
  hasDividerBefore?: boolean
  isNegative?: boolean
}

interface MuiSelectProps {
  label?: string
  value: string | number
  onChange: (value: string | number) => void
  options: MuiSelectOption[]
  labelId?: string
  className?: string
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
    onChange(e.target.value)
  }

  const generatedLabelId = labelId || `select-${label?.replace(/\s+/g, '-').toLowerCase()}`

  // Find the selected option to get its color
  const selectedOption = options.find((opt) => opt.value === value)
  const selectedColor = selectedOption?.isNegative ? '#dc3545' : '#2c3e50'

  return (
    <FormControl className={className}>
      <InputLabel
        id={generatedLabelId}
        sx={{
          fontSize: '1.5rem',
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
          color: selectedColor,
          fontSize: '1.75rem',
          minWidth: '180px',
          direction: 'rtl',
          textAlign: 'center',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dee2e6',
            borderWidth: '2px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dee2e6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dee2e6',
            boxShadow: 'none',
          },
          borderRadius: '8px',
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'white',
              colorScheme: 'light',
              '& .MuiMenuItem-root': {
                fontSize: '1.75rem',
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
              '& .MuiList-root': {
                backgroundColor: 'white',
              },
              // Force light scrollbar on all browsers
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'white',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c0c0c0',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#a0a0a0',
                },
              },
            },
          },
        }}
      >
        {options.map((option) => {
          const items = []
          if (option.hasDividerBefore) {
            items.push(<Divider key={`divider-${option.value}`} sx={{ margin: '4px 0' }} />)
          }
          items.push(
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                color: option.isNegative ? '#dc3545' : '#2c3e50',
              }}
            >
              {option.label}
            </MenuItem>
          )
          return items
        })}
      </Select>
    </FormControl>
  )
}
