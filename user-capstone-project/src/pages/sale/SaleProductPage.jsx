import React, { useState } from 'react';
import {
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Card,
    Typography,
    MenuItem,
    FormControl,
    Input,
    Select,
    Tabs,
    Tab,
    IconButton,
    Stack,
} from '@mui/material';

import { Search, FilterList, Sort } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { ProductsListToolbar } from '~/sections/@dashboard/products';
import CloseIcon from '@mui/icons-material/Close';
import { Margin } from '@mui/icons-material';

const SaleProductPage = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [availableProducts] = useState([
        { id: 1, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm A', price: 100, },
        { id: 2, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm B', price: 100, },
        { id: 3, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm C', price: 100, },
        { id: 4, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm C', price: 100, },
        { id: 5, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm C', price: 100, },
        { id: 6, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm C', price: 100, },
        { id: 7, avatar: 'https://cdn.icon-icons.com/icons2/2596/PNG/512/ad_product_icon_155850.png', name: 'Sản phẩm C', price: 100, },
    ]);

    const [searchText, setSearchText] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('all'); // Bảng giá chung
    const [tabs, setTabs] = useState([
        { label: 'Hóa đơn 1', products: [] }, // Mảng sản phẩm cho hóa đơn 1
    ]);
    const [selectedTab, setSelectedTab] = useState(0);
    const handleProductClick = (product) => {
        // Thêm sản phẩm đã chọn vào danh sách đặt hàng
        setSelectedProducts([...selectedProducts, product]);
    };

    const calculateTotalPrice = () => {
        let total = 0;
        selectedProducts.forEach((product) => {
            total += product.price;
        });

        return total;
    };
    const handleRemoveProduct = (product) => {
        // Loại bỏ sản phẩm khỏi danh sách đặt hàng
        const updatedProducts = selectedProducts.filter((p) => p.id !== product.id);
        setSelectedProducts(updatedProducts);
    };


    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const handleSearchChange = (event) => {
        // Xử lý sự kiện thay đổi ô tìm kiếm
        setSearchText(event.target.value);
    };

    const handlePriceChange = (event) => {
        // Xử lý sự kiện thay đổi dropdown bảng giá
        setSelectedPrice(event.target.value);
    };

    const handleAddTab = () => {
        const newTabIndex = tabs.length + 1;
        const newTabLabel = `Hóa đơn ${newTabIndex}`;

        setTabs([...tabs, { label: newTabLabel, products: [] }]);
        setSelectedTab(newTabIndex - 1);
    };
    const handleRemoveTab = (index) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
        if (selectedTab >= newTabs.length) {
            setSelectedTab(newTabs.length - 1);
        }
    };


    return (
        <>
            <Helmet>
                <title> Bán hàng | Minimal UI </title>
            </Helmet>

            <Card>
                {/* Tabs hóa đơn */}
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            icon={
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    {tab.label}
                                    <IconButton size="small" onClick={() => handleRemoveTab(index)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            }
                        />
                    ))}
                    <Button onClick={handleAddTab}>+</Button>
                </Tabs>
                {tabs.map((tab, index) => (
                    <div key={index} hidden={index !== selectedTab}>
                        {tab.content}
                    </div>
                ))}

                <Stack spacing={4} margin={2} style={{ minHeight: '70vh', }}>
                    <Grid container spacing={2}>

                        {/* Danh sách sản phẩm đã thêm bên trái */}
                        <Grid item xs={6}>
                            <Paper>
                                <List>
                                    {selectedProducts.map((product) => (
                                        <ListItem key={product.id}>
                                            <img src={product.avatar} alt={product.name} width="48" height="48" />
                                            <ListItemText primary={`ID: ${product.id}`} />
                                            <ListItemText primary={`Tên sản phẩm: ${product.name}`} />
                                            <ListItemText primary={`Giá: ${product.price} VND`} />
                                            <Button onClick={() => handleRemoveProduct(product)}>Xóa</Button>
                                        </ListItem>
                                    ))}
                                </List>
                                {/* Thêm phần hiển thị thông tin khách hàng và tổng tiền */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 35,
                                    left: 25,
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    borderRadius: 5,
                                    minWidth: 750
                                }}>
                                    <FormControl sx={{ margin: 1 }}>
                                        <Typography variant="h6">Thông tin đơn hàng</Typography>
                                        <Typography variant="body1">Tên khách hàng:</Typography>
                                        <Typography variant="body1">Địa chỉ:</Typography>
                                        <Typography variant="h5">Tổng tiền </Typography>
                                        <Typography variant="body1">{calculateTotalPrice()} VND</Typography>
                                    </FormControl>
                                </div>
                            </Paper>
                        </Grid>


                        {/* Danh sách sản phẩm bên phải */}
                        <Grid item xs={6} style={{ padding: '20px' }}>
                            <Paper style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', minHeight: '70vh' }}>

                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}>
                                        <FormControl style={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0', margin: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ padding: '0 8px' }}>
                                                    <Search />
                                                </span>
                                                <Input
                                                    placeholder="Tìm kiếm khách hàng..."
                                                    value={searchText}
                                                    onChange={handleSearchChange}
                                                    disableUnderline
                                                    fullWidth
                                                />
                                            </div>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                                            <Select
                                                value={selectedPrice}
                                                onChange={handlePriceChange}
                                            >
                                                <MenuItem value="all">Tất cả bảng giá</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button> <FilterList /></Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button><Sort /></Button>
                                    </Grid>
                                </Grid>

                                <List>
                                    {availableProducts.map((product, index) => (
                                        <ListItem
                                            key={product.id}
                                            onClick={() => handleProductClick(product)}
                                            style={{
                                                display: 'inline-block',
                                                margin: '8px',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                                                width: '150px',
                                            }}
                                        >
                                            <img src={product.avatar} alt={product.name} width="100%" />
                                            <div style={{ padding: '8px' }}>
                                                <Typography variant="body1">{product.name}</Typography>
                                                <Typography variant="body2">{`${product.price} VND`}</Typography>
                                            </div>
                                        </ListItem>

                                    ))}
                                </List>
                                {/* Nút chuyển trang 1/2 (nếu cần) và nút thanh toán */}
                                <div style={{ position: 'absolute', bottom: 50, right: 35 }}>
                                    <Button>Trang</Button>
                                    <Button color="primary" variant="contained">Thanh toán</Button>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>

                </Stack>
            </Card>
        </>
    );
};

export default SaleProductPage;