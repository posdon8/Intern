// routes/productRoutes.js

const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Route để thêm sản phẩm mới
router.post('/add', async (req, res) => {
  try {
    const { name, price, img, category } = req.body;
    if (!name || !price || !img || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newProduct = await Product.create({
      name,
      price,
      img,
      category,
    });

    res.status(201).json(newProduct); // Trả về sản phẩm mới được thêm vào
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product' });
  }
});
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll(); // Fetch all products from the database
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Route to fetch products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findAll({ where: { category } }); // Fetch products by category

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found in category: ${category}` });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Route to delete a product (only for admin users)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy(); // Delete the product
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
    