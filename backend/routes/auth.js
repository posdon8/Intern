const express = require('express');
const bcrypt = require('bcrypt'); // Dùng để mã hóa mật khẩu
const User = require('../models/User'); // Import model User đã định nghĩa
const router = express.Router();

// Route đăng ký tài khoản
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra xem username hoặc password có bị thiếu không
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ username và password!' });
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên tài khoản đã tồn tại!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error) {
    console.error('Lỗi khi đăng ký tài khoản:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau!' });
  }
});

module.exports = router;
