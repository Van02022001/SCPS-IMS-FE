import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Dropdown = ({ data }) => {
  return (
    <Autocomplete
      options={data}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Lựa chọn..." variant="outlined" />
      )}
    />
  );
};

export default Dropdown;