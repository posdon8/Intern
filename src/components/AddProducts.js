import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ user, fetchProducts }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    img: '',
    category: '',
  });
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const tempErrors = {};
    if (!newProduct.name) tempErrors.name = 'Product name is required.';
    if (!newProduct.price || isNaN(newProduct.price)) tempErrors.price = 'Valid price is required.';
    if (!newProduct.img) tempErrors.img = 'Image URL is required.';
    if (!newProduct.category) tempErrors.category = 'Category is required.';
    return tempErrors;
  };

  const handleAddProduct = async () => {
    if (!user) {
      alert('You need to log in to add products.');
      return;
    }

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/add',
        { ...newProduct },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Product added successfully');
      fetchProducts(newProduct.category); // Refresh the product list
      setNewProduct({ name: '', price: '', img: '', category: '' }); // Reset form
      setErrors({});
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the field
  };

  return (
    <div className="add-product">
      <h3>Add New Product</h3>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div>
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        {errors.price && <p className="error">{errors.price}</p>}
      </div>
      <div>
        <input
          type="text"
          name="img"
          placeholder="Image URL"
          value={newProduct.img}
          onChange={handleInputChange}
        />
        {errors.img && <p className="error">{errors.img}</p>}
      </div>
      <div>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
        />
        {errors.category && <p className="error">{errors.category}</p>}
      </div>
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default AddProduct;
