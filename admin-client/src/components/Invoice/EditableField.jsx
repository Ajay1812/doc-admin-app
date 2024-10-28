import React from "react";
import {
  InputAdornment,
  TextField,
  Box,
} from "@mui/material";

export const EditableField = ({ cellData, onItemizedItemEdit }) => {
  return (
    <Box display="flex" alignItems="center" my={1}>
      <TextField
        variant="outlined"
        fullWidth
        type={cellData.type}
        placeholder={cellData.placeholder}
        inputProps={{
          min: cellData.min,
          step: cellData.step,
          precision: cellData.precision,
          'aria-label': cellData.name,
          style: { textAlign: cellData.textAlign || 'left' }
        }}
        name={cellData.name}
        id={cellData.id}
        value={cellData.value}
        onChange={onItemizedItemEdit}
        required
        InputProps={{
          startAdornment: cellData.leading && (
            <InputAdornment position="start">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  border: '2px solid',
                  borderRadius: '50%',
                  color: 'text.secondary',
                }}
              >
                {cellData.leading}
              </Box>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
