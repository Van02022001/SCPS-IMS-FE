import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, MenuItem, Checkbox, Menu, FormControl, InputLabel, Select } from '@mui/material';
// component
import Iconify from '../../../../../components/iconify';
import { useEffect, useState } from 'react';

import { getAllWarehouse, getInventoryStaffByWarehouseId } from '~/data/mutation/warehouse/warehouse-mutation';

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

CreateGoodReceiptToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onSearch: PropTypes.func,
  selectedWarehouseId: PropTypes.number,
  selectedInventoryStaffId: PropTypes.number,
};

export default function CreateGoodReceiptToolbar({ numSelected, onFilterName, onSearch}) {
  const [filterName, setFilterName] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [selectedInventoryStaff, setSelectedInventoryStaff] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [inventoryStaffList, setInventoryStaffList] = useState([]);

  const handleSearch = (selectedWarehouseId, selectedInventoryStaffId) => {
    // Chỉ truyền giá trị đầu tiên
    onSearch(selectedWarehouseId[0], selectedInventoryStaffId[0]);
};
  
  // useEffect(() => {
  //   const fetchWarehouseList = async () => {
  //     try {
  //       const warehouses = await getAllWarehouse();
  //       setWarehouseList(warehouses.data);
  //       console.log(warehouseList, 'Warehouse');
  //     } catch (error) {
  //       console.error('Error fetching warehouse list:', error);
  //     }
  //   };

  //   fetchWarehouseList();
  // }, []);

  // useEffect(() => {
  //   const fetchInventoryStaff = async () => {
  //     try {
  //       if (selectedWarehouse) {
  //         const inventoryStaffList = await getInventoryStaffByWarehouseId(selectedWarehouse.id);
  //         setInventoryStaffList(inventoryStaffList.data);

  //         // Call onSearch with selected values
  //         onSearch(selectedWarehouse.id, selectedInventoryStaff);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching inventory staff:', error);
  //     }
  //   };

  //   fetchInventoryStaff();
  // }, [selectedWarehouse, onSearch, selectedInventoryStaff]);


 
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
          <FormControl fullWidth>
            <InputLabel id="warehouse-label">Chọn kho hàng...</InputLabel>
            <Select
              labelId="warehouse-label"
              id="warehouse"
              value={selectedWarehouse ? selectedWarehouse.id : ''}
              onChange={(e) =>
                setSelectedWarehouse(
                  warehouseList.find((warehouse) => warehouse.id === e.target.value)
                )
              }
            >
              {warehouseList.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedWarehouse && (
            <FormControl fullWidth>
              <InputLabel id="inventory-staff-label">Chọn Nhân Viên</InputLabel>
              <Select
                labelId="inventory-staff-label"
                id="inventory-staff"
                value={selectedInventoryStaff}
                onChange={(e) => setSelectedInventoryStaff(e.target.value)}
              >
                {inventoryStaffList.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.lastName} {staff.middleName} {staff.firstName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </>
      )}
    </StyledRoot>
  );
}