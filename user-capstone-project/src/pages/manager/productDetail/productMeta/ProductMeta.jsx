import React from 'react';
import { Typography } from '@mui/material';

const ProductMeta = ({ author, category, releaseDate }) => {
    return (
        <div>
            <Typography variant="body2" color="text.secondary">
                Author: {author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Category: {category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Release Date: {releaseDate}
            </Typography>
            {/* Thêm các thông tin khác nếu cần */}
        </div>
    );
};

export default ProductMeta;