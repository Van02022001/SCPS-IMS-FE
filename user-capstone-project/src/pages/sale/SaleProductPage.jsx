import React, { useState } from 'react';
import {
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const SaleProductPage = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [availableProducts] = useState([
        { id: 1, name: 'Sản phẩm A' },
        { id: 2, name: 'Sản phẩm B' },
        { id: 3, name: 'Sản phẩm C' },
    ]);

    const handleProductClick = (product) => {
        // Thêm sản phẩm đã chọn vào danh sách đặt hàng
        setSelectedProducts([...selectedProducts, product]);
    };

    const handleRemoveProduct = (product) => {
        // Loại bỏ sản phẩm khỏi danh sách đặt hàng
        const updatedProducts = selectedProducts.filter((p) => p.id !== product.id);
        setSelectedProducts(updatedProducts);
    };


    return (
        <>
            <Helmet>
                <title> Ban hang | Minimal UI </title>
            </Helmet>
            <Grid container spacing={2}>
                {/* Danh sách sản phẩm bên trái */}
                <Grid item xs={6}>
                    <Paper>
                        <List>
                            {selectedProducts.map((product) => (
                                <ListItem key={product.id}>
                                    <ListItemText primary={product.name} />
                                    <Button onClick={() => handleRemoveProduct(product)}>Xóa</Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>


                {/* Sản phẩm đã được chọn bên phải */}
                <Grid item xs={6}>
                    <Paper>
                        <List>
                            {availableProducts.map((product) => (
                                <ListItem
                                    key={product.id}
                                    button
                                    onClick={() => handleProductClick(product)}
                                >
                                    <ListItemText primary={product.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default SaleProductPage;
