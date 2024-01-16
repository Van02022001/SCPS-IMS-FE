import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react';

// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Dialog,
    DialogTitle,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CloseIcon from '@mui/icons-material/Close';

// sections
import { BrandListHead, BrandToolbar } from '~/sections/@dashboard/manager/brand';
// mock
import USERLIST from '../../../_mock/user';
import { getAllLocation } from '~/data/mutation/location/location-mutation';
import CreateLocationForm from '~/sections/auth/inventory_staff/location/CreateLocationForm';
import LocationDetailForm from '~/sections/auth/inventory_staff/location/LocationDetailForm';
import dayjs from 'dayjs';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'shelfNumber', label: 'Số kệ', alignRight: false },
    { id: 'binNumber', label: 'Số ngăn', alignRight: false },
    { id: 'warehouse', label: 'Tên kho', alignRight: false },
    { id: 'tags', label: 'Nhãn', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const LocationInventoryPage = () => {
    const [selectedLocationId, setSelectedLocationId] = useState(null);

    const [open, setOpen] = useState(null);

    const [openOderForm, setOpenOderForm] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Search data
    const [locationData, setLocationData] = useState([]);
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('');
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    useEffect(() => {
        getAllLocation()
            .then((respone) => {
                const data = respone.data;
                if (Array.isArray(data)) {
                    const sortedData = data.sort((a, b) => {
                        return dayjs(b.createdAt, 'DD/MM/YYYY HH:mm:ss').diff(
                            dayjs(a.createdAt, 'DD/MM/YYYY HH:mm:ss'),
                        );
                    });
                    setLocationData(sortedData);
                } else {
                    console.error('API response is not an array:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useEffect(() => {
        console.log(locationData);
    }, [locationData]);
    //===========================================================================================

    const handleCreateLocationSuccess = (newLocation, successMessage) => {
        console.log(newLocation);

        setOpenOderForm(false);
        setLocationData((prevLocationData) => [...prevLocationData, newLocation]);

        setSnackbarSuccessMessage(
            successMessage === 'Create location successfully' ? 'Tạo vị trí thành công!' : 'Thành công',
        );
        setSnackbarSuccessOpen(true);

        setTimeout(() => {
            setSnackbarSuccessOpen(false);
            setSnackbarSuccessMessage('');
        }, 3000);
    };
    const handleCloseOdersForm = () => {
        setOpenOderForm(false);
    };
    const updateLocationInList = (updatedLocation) => {
        const locationIndex = locationData.findIndex((location) => location.id === updatedLocation.id);

        if (locationIndex !== -1) {
            const UpdatedLocation = [...locationData];
            UpdatedLocation[locationIndex] = updatedLocation;

            setLocationData(UpdatedLocation);
        }
    };
    //===========================================================================================

    // const handleOpenMenu = (event) => {
    //     setOpen(event.currentTarget);
    // };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = locationData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleLocationClick = (location) => {
        if (selectedLocationId === location.id) {
            console.log(selectedLocationId);
            setSelectedLocationId(null);
        } else {
            setSelectedLocationId(location.id);
        }
    };

    const handleCloseLocationDetails = () => {
        setSelectedLocationId(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    // const handleDataSearch = (searchResult) => {
    //     // Cập nhật state của trang chính với dữ liệu từ tìm kiếm
    //     setBrandData(searchResult);
    //     setDisplayedBrandData(searchResult);
    // };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Quản lý vị trí | Minimal UI </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Quản lý vị trí
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => setOpenOderForm(true)}
                >
                    Thêm vị trí
                </Button>
                <Dialog fullWidth maxWidth="sm" open={openOderForm}>
                    <DialogTitle>
                        Tạo vị trí{' '}
                        <IconButton style={{ float: 'right' }} onClick={handleCloseOdersForm}>
                            <CloseIcon color="primary" />
                        </IconButton>{' '}
                    </DialogTitle>
                    <CreateLocationForm onClose={handleCreateLocationSuccess} open={openOderForm} />
                </Dialog>
            </Stack>

            <Container sx={{ minWidth: 1500 }}>
                <Card>
                    <BrandToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                    // onDataSearch={handleDataSearch}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <BrandListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={locationData.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {locationData.slice(startIndex, endIndex).map((location) => {
                                        return (
                                            <React.Fragment key={location.id}>
                                                <TableRow
                                                    hover
                                                    key={location.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={selectedLocationId === location.id}
                                                    onClick={() => handleLocationClick(location)}
                                                    style={{ height: 52 }}
                                                >
                                                    {/* tên  */}
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {location.shelfNumber}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {location.binNumber}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {location?.warehouse?.name || ''}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                {location.tags && Array.isArray(location.tags) ? (
                                                                    location.tags.map((tag, index) => (
                                                                        <Typography
                                                                            key={index}
                                                                            variant="subtitle2"
                                                                            noWrap
                                                                        >
                                                                            {tag.name || ''}
                                                                        </Typography>
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="subtitle2" noWrap>

                                                                    </Typography>
                                                                )}
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                                {selectedLocationId === location.id && (
                                                    <TableRow>
                                                        <TableCell colSpan={8}>
                                                            <LocationDetailForm
                                                                locations={locationData}
                                                                locationsId={selectedLocationId}
                                                                onClose={handleCloseLocationDetails}
                                                                updateLocationInList={updateLocationInList}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={locationData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <SnackbarSuccess
                        open={snackbarSuccessOpen}
                        handleClose={() => {
                            setSnackbarSuccessOpen(false);
                        }}
                        message={snackbarSuccessMessage}
                        style={{ bottom: '16px', right: '16px' }}
                    />
                </Card>
            </Container>
        </>
    );
};
export default LocationInventoryPage;
