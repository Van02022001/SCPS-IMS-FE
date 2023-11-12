import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { ProductListHead, ProductListToolbar } from '../../sections/@dashboard/products';
// mock
import USERLIST from '../../_mock/user';
// api
import { getAllProducts } from '../../data/mutation/product/product-mutation';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Mã sản phẩm', alignRight: false },
  { id: 'name', label: 'Tên sản phẩm', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: 'updatedAt', label: 'Ngày cập nhập', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'warehouses', label: 'Kho', alignRight: false },
  { id: 'categories', label: 'Loại sản phẩm', alignRight: false },
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

const ProductPage = () => {
  const [open, setOpen] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleCloseUserForm = () => {
    setOpenForm(false);
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // Sắp xếp danh sách sản phẩm dựa trên trường và hướng đã chọn
    const sortedProducts = [...products].sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      if (valueA < valueB) {
        return isAsc ? -1 : 1;
      }
      if (valueA > valueB) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    setSortedProducts(sortedProducts);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Nếu người dùng chọn checkbox "Chọn tất cả", lấy danh sách ID của tất cả sản phẩm.
      const newSelectedIds = products.map((product) => product.id);
      setSelectedProductIds(newSelectedIds);
    } else {
      // Nếu người dùng bỏ chọn checkbox "Chọn tất cả", loại bỏ tất cả sản phẩm khỏi danh sách đã chọn.
      setSelectedProductIds([]);
    }
  };


  const handleCheckboxChange = (event, productId) => {
    if (event.target.checked) {
      // Nếu người dùng chọn checkbox, thêm sản phẩm vào danh sách đã chọn.
      setSelectedProductIds([...selectedProductIds, productId]);
    } else {
      // Nếu người dùng bỏ chọn checkbox, loại bỏ sản phẩm khỏi danh sách đã chọn.
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    }
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
    const query = event.target.value;
    setFilterName(query);
    // Lọc danh sách sản phẩm theo tên và trường đang được sắp xếp
    const filteredProducts = applySortFilter(sortedProducts, getComparator(order, sortBy), query);
    setSortedProducts(filteredProducts);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        const data = response.data;
        setProducts(data);
        setSortedProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title> Product | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách sản phẩm
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenForm(true)}
          >
            Thêm sản phẩm
          </Button>

        </Stack>

        <Card>
          <ProductListToolbar numSelected={selectedProductIds.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={products.length}
                  numSelected={selectedProductIds.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {sortedProducts.map((product) => {
                    console.log("Product:", product);
                    return (
                      <TableRow hover key={product.id} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedProductIds.includes(product.id)}
                            onChange={(event) => handleCheckboxChange(event, product.id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>{product.id}</Stack>
                        </TableCell>

                        <TableCell align="left">{product.name}</TableCell>
                        <TableCell align="left">{product.description}</TableCell>
                        <TableCell align="left">{product.createdAt}</TableCell>
                        <TableCell align="left">{product.updatedAt}</TableCell>
                        <TableCell align="left">
                          <Label color={(product.status === 'banned' && 'error') || 'success'}>{sentenceCase(product.status)}</Label>
                        </TableCell>
                        <TableCell align="left">{product.warehouses}</TableCell>
                        <TableCell>
                          {product.categories.map((category, index) => (
                            <span key={index}>{category.name}</span>
                          ))}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
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
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
export default ProductPage
