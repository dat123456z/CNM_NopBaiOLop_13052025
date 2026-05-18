const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['laptop', 'phone', 'tablet', 'accessory'],
        default: 'laptop'
    },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    sales: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
