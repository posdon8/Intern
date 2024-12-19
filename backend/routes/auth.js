const express = require('express');
const bcrypt = require('bcrypt'); 
const User = require('../models/User');
const router = express.Router();


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const results = await queryAsync('SELECT * FROM Users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).send('Sai tên đăng nhập');
    }

    const user = results[0];
   const passwordMatch = await bcrypt.compare(password, user.password); 
       if (!passwordMatch) {
         return res.status(401).json({ message: 'Sai mật khẩu' });
       }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "process.env.JWT_SECRET",
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).send({ success: true, message: 'Login successful', token });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err.message);
    return res.status(500).send('Lỗi server');
  }
});
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Kiểm tra username đã tồn tại chưa
    const existingUser = await queryAsync('SELECT * FROM Users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm người dùng vào cơ sở dữ liệu
    await queryAsync(
      'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user'] // Mặc định role là 'user'
    );

    res.status(201).json({ message: 'Tạo người dùng thành công' });
  } catch (err) {
    console.error('Lỗi khi tạo người dùng:', err.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});




module.exports = router;
