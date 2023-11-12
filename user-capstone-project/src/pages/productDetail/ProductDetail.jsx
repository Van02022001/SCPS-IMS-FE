import React, { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, CardMedia, Stack, Box, Grid } from '@mui/material';
import ProductMeta from './productMeta/ProductMeta';
// components
import Iconify from '~/components/iconify/Iconify';
import InputMultiline from '~/components/multi-line/multi-line';
//icons
import ClearIcon from '@mui/icons-material/Clear';

const ProductDetail = () => {
    const [showProductMeta, setShowProductMeta] = useState(true);
    const product = {
        name: 'Product Name',
        description: 'Product Description Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        price: 99.99,
        imageUrl: '/path/to/product-image.jpg',
        author: 'Author Name',
        category: 'Category Name',
        releaseDate: 'January 1, 2023',
        // Thêm các thông tin sản phẩm khác nếu cần
    };

    return (
        <Container maxWidth="md">
            <Stack spacing={2}>
                <Card>
                    <CardMedia component="img" alt="Product Image" height="400" image={product.imageUrl} />
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                        <Typography variant="h6">Price: ${product.price}</Typography>
                        {showProductMeta && (
                            <ProductMeta
                                author={product.author}
                                category={product.category}
                                releaseDate={product.releaseDate}
                            />
                        )}
                        <Button variant="contained" color="primary">
                            Add to Cart
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => setShowProductMeta(!showProductMeta)}>
                            {showProductMeta ? 'Hide Product Info' : 'Show Product Info'}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Product Meta
                        </Typography>
                        <Grid container spacing={2} columns={16}>
                            <Grid item xs={4}>
                                <Typography variant="h10" component="div">
                                    Mô tả
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Multi-line text
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Box
                                    sx={{
                                        // width: 600,
                                        maxWidth: '100%',
                                        margin: '20px 0',
                                    }}
                                >
                                    <InputMultiline fullWidth label="Description" id="Description" />
                                </Box>
                            </Grid>
                        </Grid>
                        <Stack width={180} direction="row" alignItems="center" justifyContent="space-between" mt={0}>
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Thêm
                            </Button>
                            <Button variant="outlined" startIcon={<ClearIcon icon="eva:plus-fill" />}>
                                Hủy
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default ProductDetail;
