
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AddProduct from './components/AddProducts';
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
  const [error, setError] = useState('');
 
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);

  const [shippingFee, setShippingFee] = useState(50000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoginVisible, setIsLoginVisible] = useState(false);
    useEffect(() => {
      // Kiểm tra cookie khi component được mount
      const token = localStorage.getItem('token'); 
      console.log('Token from cookies:', token); // Lấy token từ cookie
      const role = Cookies.get('role'); // Lấy role từ cookie
      
      if (token && role) {
        setUser({ token });
        setIsAdmin(role === 'admin');
        setIsLoggedIn(true);  // Đánh dấu người dùng đã đăng nhập
         setIsLoginVisible(false); 
      
      
      }
    }, []);
    const { username, setUsername, password, setPassword, handleLogin } = Login({
      setIsLoggedIn,
      setIsAdmin,
      setError,
      closeLogin: () => setIsLoginVisible(false),
    });
    const ProductPage = () => {
      const [isAddProductVisible, setIsAddProductVisible] = useState(false);
      const [user, setUser] = useState(null);  // Lấy user sau khi login
      const [products, setProducts] = useState([]);}
    const deleteProduct = async (id) => {
      if (!isAdmin) {
        alert('Only admin can delete products.');
        return;
      }
      try {
        await axios.delete(`http://localhost:5001/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    };
    
  
  const handleAddProductClick = () => {
      setIsAddProductVisible(!isAddProductVisible);
    };
  const handleLoginClick = () => {
    setIsLoginVisible(true); 
  };
  const closeLogin = () => {
    setIsLoginVisible(false); 
  };
  const [products, setProducts] = useState({});
  
 const fetchProducts = async (category) => {
      try {
        const response = await axios.get(`http://localhost:5001/data/${category}`);
        if (Array.isArray(response.data)) {setProducts((prev) => ({
          ...prev,
          [category]: response.data, // Store products dynamically by category
        }));}else {
          console.error('Products for category not returned as an array:', response.data);
      } } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

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
  const calculateTotalAmount = () => {
    const productTotal = cart.reduce((total, product) => total + parseFloat(product.price), 0);
    const effectiveShippingFee = cart.length === 0 ? 0 : shippingFee;
    return productTotal + effectiveShippingFee;
  };
  const openOrder = () => {
    setIsOrderVisible(true);
  }
  const closeOrder = () => {
    setIsOrderVisible(!isCartVisible);
  }
 
 
   return (
    <>
    <div className="App">
       
     </div><div className="container">
         <header className="header">
           <a href='#home'>
             <img src='/images/POSEI.png' alt='POSEI' onClick={closeOverlay}></img></a>
           
           <nav className="navbar">
             <ul>

               <li><a href="#shirts" onClick={closeOverlay}>
                 SHIRTS</a></li>
               <li><a href="#accessories">ACCESORIES</a></li>
               <li><a href="#cart" onClick={toggleCart}>CART</a></li>
               <li><a href="#contact">CONTACT</a></li>
               
               <li><button onClick={handleLoginClick} className="login-btn">LOGIN</button></li>
              
             </ul>
           </nav>

         </header>
        
         {isLoginVisible && (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setIsAdmin={setIsAdmin}
          setError={setError}
          closeLogin={closeLogin}
        />
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
           <div>
    

    
      <button onClick={handleAddProductClick}>
        {isAddProductVisible ? 'Close Add Product Form' : 'Add Product'}
      </button>

      
      {isAddProductVisible && (
        <AddProduct
          user={user}
          fetchProducts={fetchProducts}
        />
      )}
    </div>
         
{isAdmin && user && (
  <AddProduct
    user={user}
    fetchProducts={fetchProducts}
    closeAddProductForm={() => setIsOverlayVisible(false)}
  />
)}

           
           {isOrderVisible && (
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
                 {isAdmin && (
                <button className="add-product-btn" onClick={() => setIsOverlayVisible(false)}>Add Product</button>
              )}
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
                   <div className="cart-total">
                    <h4> Shipping Fee : {cart.length === 0 ? 0 : shippingFee} VND </h4>
                     <h4>Total: {calculateTotalAmount()} VND</h4>
                   </div>
                   <button onClick={openOrder}>ORDER</button>
               </div>
             </div>
           )}
   

 
         </main>

         <footer className="footer">
           <p>&copy; 2024 POSEI. All rights reserved.</p>
         </footer>
       </div>
       </>
  );
}

export default App;
