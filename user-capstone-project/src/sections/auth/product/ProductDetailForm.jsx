import React, { useEffect, useState } from 'react';
import { Typography, Button, Tab, Tabs, Stack, Grid, TextField, FormControl } from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { editProduct } from '~/data/mutation/product/product-mutation';


const ProductDetailForm = ({ products, productId, onClose, isOpen, mode }) => {
    const [expandedItem, setExpandedItem] = useState(productId);
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    const [editedProduct, setEditedProduct] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedProduct({
                name: '',
                description: '',
                minStockLevel: 0,
                maxStockLevel: 0,
                categories_id: [],
                unit_id: 0,
                length: 0,
                width: 0,
                height: 0,
                diameter: 0,
                unit_mea_id: 0,
            });
        } else {
            const product = products.find((o) => o.id === productId);
            if (product) {
                const categoryIds = product.categories ? product.categories.map(category => category.id) : [];
                const unitId = product.unit ? product.unit.id : 0;
                const unitMeaId = product.size ? (product.size.unitMeasurement ? product.size.unitMeasurement.id : 0) : 0;

                // Create a new object with only the desired fields
                const editedProduct = {
                    name: product.name,
                    description: product.description,
                    categories_id: categoryIds,
                    unit_id: unitId,
                    length: product.size.length ? product.size.length : 0,
                    width: product.size ? product.size.width : 0,
                    height: product.size ? product.size.height : 0,
                    diameter: product.size ? product.size.diameter : 0,
                    unit_mea_id: unitMeaId,
                };

                setEditedProduct(editedProduct);
            }
        }
    }, [productId, products, mode]);


    const product = products.find((o) => o.id === productId);

    if (!product) {
        return null;
    }
    const updateProduct = async () => {
        if (!editedProduct) {
            return;
        }
        try {
            const response = await editProduct(productId, editedProduct);
            console.log(response);
        } catch (error) {
        }
    };

    const handleEdit = (field, value) => {
        console.log(`Field: ${field}, Value: ${value}`);
        if (field === 'categories_id') {
            const categoryIds = value.map(Number).filter(Boolean);
            setEditedProduct((prevProduct) => ({
                ...prevProduct,
                [field]: categoryIds,
            }));
        } else if (field === 'unit_id' || field === 'unit_mea_id') {
            const id = parseInt(value);
            setEditedProduct((prevProduct) => ({
                ...prevProduct,
                [field]: id,
            }));
        } else {
            setEditedProduct((prevProduct) => ({
                ...prevProduct,
                [field]: value,
            }));
        }
    };
    const handleSave = () => {
        // Xử lý lưu
    }

    const handleDelete = () => {
        // Xử lý xóa
    }

    return editedProduct ? (
        <div
            id="productDetailForm"
            className="ProductDetailForm"
            style={{
                backgroundColor: 'white',
                zIndex: 999,
            }}
        >
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                <Tab label="Thông tin" />
                <Tab label="Thẻ kho" />
                <Tab label="Tồn kho" />
            </Tabs>

            {selectedTab === 0 && (
                <div style={{ marginLeft: 50 }}>
                    <Stack spacing={4} margin={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Mã hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mã hàng"
                                        sx={{ width: '70%' }}
                                        value={editedProduct ? editedProduct.id : ''}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Tên sản phẩm:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Tên sản phẩm"
                                        sx={{ width: '70%' }}
                                        value={editedProduct ? editedProduct.name : ''}
                                        onChange={(e) => handleEdit('name', e.target.value)}
                                    />
                                </Grid>


                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Mô tả:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Mô tả"
                                        sx={{ width: '70%' }}
                                        value={editedProduct.description}
                                        onChange={(e) => handleEdit('description', e.target.value)}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Ngày tạo:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Ngày tạo"
                                        sx={{ width: '70%' }}
                                        value={product.createdAt}
                                    />
                                </Grid>

                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Ngày cập nhập:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Ngày cập nhập"
                                        sx={{ width: '70%' }}
                                        value={product.updatedAt}
                                    />
                                </Grid>

                            </Grid>

                            {/* 5 field bên phải*/}
                            <Grid item xs={6} >
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Trạng thái:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Trạng thái"
                                        sx={{ width: '70%' }}
                                        value={(product.status === 'Active') ? 'Đang hoạt động' : 'Đã ngưng'}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Nhóm hàng:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Nhóm hàng"
                                        sx={{ width: '70%' }}
                                        value={editedProduct.categories ? editedProduct.categories.map((category, index) => {
                                            return index === editedProduct.categories.length - 1 ? category.name : `${category.name} `;
                                        }) : ''}
                                        onChange={(e) => handleEdit('categories_id', e.target.value)}
                                    />
                                </Grid>

                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Đơn vị:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Đơn vị"
                                        sx={{ width: '70%' }}
                                        value={product.unit.name}
                                        onChange={(e) => handleEdit('unit_id', e.target.value)}
                                    />
                                </Grid>
                                <Grid container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <Typography variant="body1">Đơn vị đo lường:</Typography>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        label="Đơn vị đo lường"
                                        sx={{ width: '70%' }}
                                        value={editedProduct.unitMeasurement}
                                        onChange={(e) => handleEdit('unit_mea_id', e.target.value)}
                                    />
                                </Grid>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 2 }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                        Kích thước:{' '}
                                    </Typography>
                                    <div style={{ display: 'flex' }}>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                id="demo-customized-textbox"
                                                label="Chiều dài"
                                                value={editedProduct.size ? editedProduct.size.length : 0}
                                                onChange={(e) => handleEdit('length', e.target.value)}

                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                id="demo-customized-textbox"
                                                label="Chiều rộng"
                                                value={editedProduct.size ? editedProduct.size.width : 0}
                                                onChange={(e) => handleEdit('width', e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                id="demo-customized-textbox"
                                                label="Chiều cao"
                                                value={editedProduct.size ? editedProduct.size.height : 0}
                                                onChange={(e) => handleEdit('height', e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 0.2 }} variant="standard">
                                            <TextField
                                                id="demo-customized-textbox"
                                                label="Đường kính"
                                                value={editedProduct.size ? editedProduct.size.diameter : 0}
                                                onChange={(e) => handleEdit('diameter', e.target.value)}
                                            />
                                        </FormControl>
                                    </div>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Button variant="contained" color="primary" onClick={updateProduct}>
                        Cập nhập
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>
                        Xóa
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>
                        Hủy bỏ
                    </Button>
                </div>

            )}
            {selectedTab === 1 && (
                <div style={{ flex: 1 }}>
                    {/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}
                </div>
            )}

        </div>
    ) : null;
}

export default ProductDetailForm;