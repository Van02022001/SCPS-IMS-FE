import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, MenuItem, Checkbox, Menu } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import { useState } from 'react';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

ProductsListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function ProductsListToolbar({ numSelected, filterName, onFilterName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ filter1: false, filter2: false, filter3: false, filter4: false, filter5: false,  filter6: false });

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilters({ ...selectedFilters, [filter]: !selectedFilters[filter] });
  };
    return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            placeholder="Tìm kiếm..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />

          {/* <Tooltip title="Filter list">
            <IconButton onClick={handleFilterClick}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip> */}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem>
              <Checkbox
                checked={selectedFilters.filter1}
                onChange={() => handleFilterSelect('filter1')}
              />
              Mã hàng
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={selectedFilters.filter2}
                onChange={() => handleFilterSelect('filter2')}
              />
              Tên hàng
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={selectedFilters.filter3}
                onChange={() => handleFilterSelect('filter3')}
              />
              Tồn kho
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={selectedFilters.filter4}
                onChange={() => handleFilterSelect('filter4')}
              />
              Giá vốn
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={selectedFilters.filter5}
                onChange={() => handleFilterSelect('filter5')}
              />
              Giá nhập cuôi
            </MenuItem>
            <MenuItem>
              <Checkbox
                checked={selectedFilters.filter6}
                onChange={() => handleFilterSelect('filter6')}
              />
              Giá chung
            </MenuItem>
          </Menu>
        </>
      )}
    </StyledRoot>
  );
}