import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, MenuItem, Checkbox, Menu, FormControl, InputLabel, Select } from '@mui/material';
// component
import Iconify from '../../../../../components/iconify';
import { useEffect, useState } from 'react';

import { getAllWarehouse, getInventoryStaffByWarehouse } from '~/data/mutation/warehouse/warehouse-mutation';

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

CreateGoodReceiptListHead.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function CreateGoodReceiptListHead({ numSelected, onFilterName, onDataSearch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedInventoryStaff, setSelectedInventoryStaff] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [inventoryStaffList, setInventoryStaffList] = useState([]);
  
  const handleSelectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    // Lấy danh sách nhân viên inventory staff của kho hàng được chọn (thay bằng hàm tương ứng của bạn)
    const inventoryStaffList = getInventoryStaffByWarehouse(warehouse);
    // Cập nhật danh sách nhân viên inventory staff
    setInventoryStaffList(inventoryStaffList);
  };
  
  useEffect(() => {
    const fetchWarehouseList = async () => {
      try {
        const warehouses = await getAllWarehouse();
        setWarehouseList(warehouses.data);
        console.log(warehouseList,'Warehouse');
      } catch (error) {
        console.error('Error fetching warehouse list:', error);
      }
    };

    fetchWarehouseList();
  }, []);

  useEffect(() => {
    const fetchInventoryStaff = async () => {
      try {
        if (selectedWarehouse) {
          const inventoryStaffList = await getInventoryStaffByWarehouse(selectedWarehouse.id);
          setInventoryStaffList(inventoryStaffList);
        }
      } catch (error) {
        console.error('Error fetching inventory staff:', error);
      }
    };

    fetchInventoryStaff();
  }, [selectedWarehouse]);

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
  onChange={(e) => setFilterName(e.target.value)}
  onClick={() => {
    console.log("Clicked on search button");
    setAnchorEl(true);
    // Nếu selectedWarehouse chưa được chọn, hãy chọn kho hàng đầu tiên trong danh sách (nếu có)
    if (!selectedWarehouse && warehouseList.length > 0) {
      setSelectedWarehouse(warehouseList[0]);
    }
  }}
  placeholder="Chọn kho hàng..."
  startAdornment={
    <InputAdornment position="start">
      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
    </InputAdornment>
  }
></StyledSearch>
{selectedWarehouse && (
  <FormControl fullWidth>
    <InputLabel id="warehouse-label">{selectedWarehouse.name}</InputLabel>
    <Select
      labelId="warehouse-label"
      id="warehouse"
      value={selectedWarehouse.id}
      onChange={(e) => setSelectedWarehouse(warehouseList.find(warehouse => warehouse.id === e.target.value))}
    >
      {warehouseList.map((warehouse) => (
        <MenuItem key={warehouse.id} value={warehouse.id}>
          {warehouse.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
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
          {staff.name}
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