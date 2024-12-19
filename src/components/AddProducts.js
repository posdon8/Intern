import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddProduct = ({ user, fetchProducts }) => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hàm xử lý khi submit form để thêm sản phẩm
  const handleSubmit = async (e) => { 
    console.log('User token:', user?.token);  // Kiểm tra token của user

    e.preventDefault();

    // Kiểm tra nếu không có user hoặc user.token
    if (!user || !user.token) {
      setError('You must be logged in to add a product.');
      return;
    }

    // Kiểm tra nếu có trường nào bị bỏ trống
    if (!productName || !productCategory || !productPrice || !productImage) {
      setError('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('category', productCategory);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('image', productImage);

    try {
      setLoading(true);
      setError(''); // Clear previous error

      const response = await axios.post('http://localhost:5001/products', formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`, 
          'Content-Type': 'multipart/form-data',
        }
      });


      if (response.status === 200) {
        alert('Product added successfully');
        fetchProducts(productCategory); // 
      } else {
        setError('Error adding product');
      }
    } catch (err) {
      console.error(err);
      setError('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h3>Add New Product</h3>
     
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="product-category">Category</label>
          <input
            id="product-category"
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="product-price">Price</label>
          <input
            id="product-price"
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="product-image">Product Image</label>
          <input
            id="product-image"
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
   </div>
  );
};

export default AddProduct;
