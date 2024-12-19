const express = require('express');
const bcrypt = require('bcrypt'); // Dùng để mã hóa mật khẩu
const User = require('../models/User'); // Import model User đã định nghĩa
const router = express.Router();
const { queryAsync } = require('../utils');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const results = await queryAsync('SELECT * FROM Users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).send('Sai tên đăng nhập');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);  // So sánh mật khẩu băm

    if (!match) {
      return res.status(401).send('Sai mật khẩu');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).send({ success: true, message: 'Login successful', token });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err.message);
    return res.status(500).send('Lỗi server');
  }
});

// Đăng xuất
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Lỗi khi đăng xuất');
    }
    res.status(200).send('Đăng xuất thành công');
  });
});


module.exports = router;
