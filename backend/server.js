const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sequelize = require('./config/database');
const { authenticateJWT } = require('./middleware');
const registerRoute = require('./routes/auth'); 
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only this origin
  credentials: true,  // Allow credentials (cookies, headers, etc.)
};

const app = express();
const port = process.env.PORT || 5001;
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret', // Sử dụng một secret cho session
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true } // Thiết lập secure=true khi triển khai trên HTTPS
}));
app.use(express.json());
app.use('/api', registerRoute);
sequelize.sync()
  .then(() => {
    console.log('Kết nối cơ sở dữ liệu thành công!');
    const PORT = 5001;
    app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
  })
  .catch((error) => {
    console.error('Không thể kết nối cơ sở dữ liệu:', error);
  });
app.use(cors(corsOptions));
// MySQL connectioan
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '100523',
  database: 'poseidont',
  port: 3306
});
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});
connection.connect(err => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.message);
    return;
  }
  console.log('Kết nối thành công tới MySQL!');
});

// Middleware

app.use(bodyParser.json());
async function generateHashedPassword() {
  const hashedPassword = await bcrypt.hash('your_password', 10);
  console.log('Hashed Password:', hashedPassword);
}

generateHashedPassword();

const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Bạn cần phải đăng nhập');
  }
};
// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await queryAsync('SELECT * FROM Users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).send('Sai tên đăng nhập');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Sai mật khẩu');
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.status(200).send({ success: true, message: 'Login successful', token });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err.message);
    return res.status(500).send('Lỗi server');
  }
});

// Đăng xuất
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Lỗi khi đăng xuất');
    }
    res.status(200).send('Đăng xuất thành công');
  });
});

// API chỉ dành cho người đã đăng nhập
app.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).send(`Chào mừng ${req.session.user.username}, bạn đã đăng nhập`);
});

// Lấy danh sách sản phẩm
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM Products';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dữ liệu:', err.message);
      return res.status(500).send({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});


app.get('/test-session', (req, res) => {
  res.send(req.session.user || 'No session found');
});

// Get all products
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM Products';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dữ liệu:', err.message);
      return res.status(500).send({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});

// Get products by category
app.get('/data/:category', (req, res) => {
  const category = req.params.category;
  const query = 'SELECT * FROM Products WHERE category = ?';

  connection.query(query, [category], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dữ liệu:', err.message);
      return res.status(500).send({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});

// Get product details by ID
app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Products WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dữ liệu:', err.message);
      return res.status(500).send({ error: 'Lỗi server' });
    }
    if (results.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json(results[0]);
  });
});


// Close MySQL connection gracefully
process.on('SIGINT', () => {
  connection.end(err => {
    if (err) console.error('Lỗi khi đóng kết nối:', err.message);
    console.log('Kết nối MySQL đã đóng.');
    process.exit();
  });
});

