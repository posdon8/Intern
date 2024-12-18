
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // Track the active category
  const [newProduct, setNewProduct] = useState({ name: '', price: '', img: '', category: ''});
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm được chọn
  const [cart, setCart] = useState([]); // Giỏ hàng
  const [isCartVisible, setIsCartVisible] = useState(false);
  const[isOrderVisible, setIsOrderVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const toggleLogin = () => {
    setIsLoginVisible(!isLoginVisible);
  };
    useEffect(() => {
      // Kiểm tra cookie khi component được mount
      const token = Cookies.get('token'); // Lấy token từ cookie
      const role = Cookies.get('role'); // Lấy role từ cookie
  
      if (token && role) {
        setUser({ token });
        setIsAdmin(role === 'admin');
      }
    }, []);
  
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      alert("Please fill in both username and password.");
      return;
  }
    try {
      const response = await axios.post('http://localhost:5000/login', loginForm, {
        withCredentials: true // Đảm bảo cookie sẽ được gửi trong yêu cầu
      });
      if (response.data.success) {
        // Lưu trữ token và role trong cookie
        Cookies.set('token', response.data.token, { expires: 7 }); // Lưu cookie cho 7 ngày
        Cookies.set('role', response.data.role, { expires: 7 });

        setUser(response.data); // Lưu thông tin người dùng vào state
        setIsAdmin(response.data.role === 'admin'); // Đánh dấu là admin
        alert(`${response.data.role === 'admin' ? 'Admin' : 'User'} login successful!`);

        setIsLoginVisible(false); // Đóng modal đăng nhập
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error logging in');
    }
  };
  
   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };
/*
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/products/${id}`, {
        headers: { Authorization: user.token },
      });
      alert('Xóa sản phẩm thành công');
      fetchProducts(activeCategory); // Refresh danh sách sản phẩm
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Xóa sản phẩm thất bại');
    }
  };
  const handleDelete = (id) => {
    deleteProduct(id); // Call deleteProduct to remove the product
  };*/
  const [products, setProducts] = useState({});
  
 const fetchProducts = async (category) => {
      try {
        const response = await axios.get(`http://localhost:5000/data/${category}`);
        setProducts((prev) => ({
          ...prev,
          [category]: response.data, // Store products dynamically by category
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    // Updated openOverlay function
 /*const fetchProductDetails = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/product/${id}`);
        setSelectedProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
   */ 
const openOverlay = (category, product = null) => {
  setActiveCategory(category);
  if (product) {
    setSelectedProduct(product); // Set the selected product for detailed view
  } else {
    fetchProducts(category);
    setSelectedProduct(null);
  }
  setIsOverlayVisible(true);
};

    const closeOverlay = () => {
    setIsOverlayVisible(false);
  };
  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };
  const openOrder = () => {
    setIsOrderVisible(true);
  }
  const closeOrder = () => {
    setIsOrderVisible(!isCartVisible);
  }
 /* const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };*/

  const addProduct = async () => {
    if (!isAdmin) {
      alert('Only admin can add products.');
      return;
    }
    const { name, price, img, category } = newProduct;
    if (name && price && img && category) {
      try {
        await axios.post(
          'http://localhost:5000/admin/products',
          { name, price, img, category },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        alert('Product added successfully');
        setNewProduct({ name: '', price: '', img: '', category: '' });
        fetchProducts(category);
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }
   return (
    
    <div className="container">
      <header className="header">     
          <a href='#home'>
        <img src='/images/POSEI.png' alt='POSEI' onClick={closeOverlay}></img></a>
        <input type="text" name="search-prod" placeholder="Search your outfit"></input>
        <nav className="navbar">
          <ul>

            <li><a href="#shirts" onClick={closeOverlay}>
               SHIRTS</a></li>
            <li><a href="#accessories">ACCESORIES</a></li>
            <li><a href="#cart" onClick={toggleCart}>CART</a></li>
            <li><a href="#contact">CONTACT</a></li>
            <li><button onClick={toggleLogin} className="login-btn">LOGIN</button></li>
          </ul>
        </nav>
        
      </header>
      {isLoginVisible && (
        <div className="login-overlay">
          <div className="login-content">
            <h2>Login</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginForm.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleInputChange}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={toggleLogin}>Cancel</button>
          </div>
        </div>
      )}


      <main className="main">
        <section id="home" className="section">
        <img src="/images/homeshop6.jpg" alt="Shirt1" />
        <img src="/images/homeshop5.webp" alt="Shirt1" />
     
      
        </section>
          <section id="shirts" className="Shirthome">
          <h3>Shirts Collection</h3>
          <div className="product-grid">
            <div className="home-item" onClick={() => openOverlay('Streetwear')}>
              <img src="/images/streetwear1.webp" alt="Streetwear" />
              <h4>Streetwear</h4>
            </div>
            <div className="home-item" onClick={() => openOverlay('Officewear')}>
              <img src="/images/office1.webp" alt="Officewear" />
              <h4>Officewear</h4>
            </div>
          </div>
          </section>
        <section id="contact" className="contact-form">
          <h3> Your name</h3>
          <input type="text" name="Your name" placeholder="Enter your name" id="y-name"></input>
          <h3> Your email</h3>
          <input type="text" name="Your email" placeholder="Enter your email" id="y-email"></input>
          <h3> Your comment</h3>
          <input type="text" name="Your comment" placeholder="Enter your comment" id="y-cmt"></input>
        </section>
        {isOrderVisible &&(
        <div id="oder" className="order">
            <button id="close-order" className="close-order" onClick={closeOrder}>X</button>
            <h3> Name</h3>
            <input type="text" name="NamePlace" placeholder="Enter your name" id="p-name"></input>
            <h3> PhoneCall</h3>
            <input type="text" name="PhonePlace" placeholder="Enter your phonecall" id="p-phone"></input>
            <h3> Address</h3>
            <input type="text" name="AddressPlace" placeholder="Enter your address" id="p-address"></input>
            <h3> Note</h3>
            <input type="text" name="NotePlace" placeholder="Enter your note" id="p-note"></input>
            
            <button id="confirm-btn" className="confirm-btn"> CONFIRM </button>
        </div>)}
          {isOverlayVisible && selectedProduct && (
            <div className="overlay">
              <div className="overlay-content ">
                <h3>{activeCategory} Collection</h3>
                <div className="product-item">
                  <img src={selectedProduct.img} alt={selectedProduct.name} />
                  <h4>{selectedProduct.name}</h4>
                  <p>Price: {selectedProduct.price}</p>
                  
      </div>
      <button className="close-overlay" onClick={closeOverlay}>Close</button>
    </div>
  </div>
)}

{isOverlayVisible && !selectedProduct && activeCategory && (
  <div className="overlay">
    <div className="overlay-content">
      <h3>{activeCategory} Collection</h3>
      {products[activeCategory]?.map((product, index) => (
        <div className="product-item" key={index} onClick={() => openOverlay(activeCategory, product)}>
          <img src={product.img} alt={product.name} />
          <h4>{product.name}</h4>
          <p>Price: {product.price}</p>
        </div>
      ))}
      
    </div>
  </div>
)}
{isOverlayVisible && selectedProduct && (
  <div className="overlay">
    <div className="overlay-detail">
      <button id="closeBtn" className="close-overlay" onClick={closeOverlay}>X</button>
      
      <img src={selectedProduct.img} alt={selectedProduct.name} />
      <h4>{selectedProduct.name}</h4>
      <p>Price: {selectedProduct.price}</p>
      <button id="addCartBtn" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
      
    </div>
  </div>
)}
{isCartVisible && (
        <div className="cart-overlay">
          <div className="cart-content">
            <h3>CART</h3>
            {cart.length > 0 ? (
              <div className="cart-items">
                {cart.map((product, index) => (
                  <div className="cart-item" key={index}>
                    <img src={product.img} alt={product.name} />
                    <h4>{product.name}</h4>
                    <p>Price: {product.price}</p>
                    <button onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Your cart is empty!</p>
            )}
            <button onClick={openOrder}>ORDER</button>
          </div>
        </div>
      )}
       
    

      </main>

      <footer className="footer">
        <p>&copy; 2024 POSEI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
